import { Controller, Post, Body, Res, Req, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import axios from 'axios';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';
import * as jwt from 'jsonwebtoken';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

   @Post('signUp')
  async signUp(@Body() createAuthDto: CreateAuthDto) {
    try {
      const result = await this.authService.signUp(createAuthDto);
      return { message: 'User registered successfully', data: result };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('signIn')
  async signIn(@Body() credentials: { email: string; password: string }) {
    try {
      const result = await this.authService.signIn(credentials.email, credentials.password);
      return { message: 'Sign-in successful',data: result };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('api/token')
  async getToken(@Body() code, @Res() res){
    if (!code) return res.status(400).json({ error: 'Missing code' });
    
    try {
      const jwt = await this.authService.generateSignedJwt();
      const client_id = process.env.CLIENT_ID;
      const redirect_uri = process.env.REDIRECT_URI;
      const client_assertion_type = process.env.CLIENT_ASSERTION_TYPE;
      const token_endpoint = process.env.TOKEN_ENDPOINT;

      if(!client_id ) throw new Error('There is no CLIENT_ID');
      
      if(!redirect_uri ) throw new Error('There is no REDIRECT_URI');

      if(!client_assertion_type) throw new Error('There is no CLIENT_ASSERTION_TYPE');

      if(!token_endpoint) throw new Error('There is no TOKEN_ENDPOINT ');

      const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code.code,
        redirect_uri: redirect_uri,
        client_id: client_id ,
        client_assertion_type: client_assertion_type,
        client_assertion: jwt,
        code_verifier: 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk'
      });
      
      const response = await axios.post(
        token_endpoint,
        params.toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      res.json({ access_token: response.data.access_token });
    } catch (err) {
      console.error(err.response?.data || err.message);
      res.status(500).json({ error: 'Token request failed' });
    }
  }

    @Post('api/userinfo')
    async getUserInfo(@Req() req: Request, @Res() res) {
      const { access_token } = req.body;
      const userinfo_endpoint = process.env.USERINFO_ENDPOINT;

      if (!access_token) return res.status(400).json({ error: 'Missing access token' });
      if (!userinfo_endpoint) return res.status(500).json({ error: 'userinfo_end_point not properly setup'});

      try {
        const response = await axios.get(userinfo_endpoint, {
          headers: { Authorization: `Bearer ${access_token}` }
        });
        
        
        const userData = await this.authService.decodeUserInfoResponse(response.data);
        const { email, picture } = userData as any;
        const check_user = await this.userService.findByEmail(email);
        
        // console.log(check_user);
        
        if(check_user){
          const token = jwt.sign(
            { 
              userId: check_user.id, 
              email: check_user.email, 
              role: check_user.role
            },
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
          );
          
          return res.json({ 
            message: 'Log-in successful',
            data: {... check_user, token } 
          });
        }

          
        const new_user = await this.userService.createUser({
          email:email, 
          password: '',
          imageUrl: picture,
          role: 'user',
          registrationType: 'fayda',
        });
        
        const token = jwt.sign(
          { 
            userId: new_user.id, 
            email: new_user.email, 
            role: new_user.role
          },
          process.env.JWT_SECRET, 
          { expiresIn: '1h' }
          );
        
        return res.json({ 
            message: 'Log-in successful',
            data: {... new_user, token } 
        });
      } catch (err) {
          console.error(err.response?.data || err.message);
          res.status(500).json({ error: 'Userinfo request failed' });
      }
    }

  }



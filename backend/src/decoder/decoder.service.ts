import { Injectable, ForbiddenException, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'src/interfaces/user.interface';
import { Request } from 'express';

@Injectable()
export class DecoderService {
    private readonly logger = new Logger();
 
    decode(req: Request): JwtPayload {
        const authHeader = req.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          this.logger.warn(`Unauthorized access attempt: No token provided`);
          throw new ForbiddenException('Access denied: No token provided');
        }

        const token = authHeader.split(' ')[1];

        try {
          if (!process.env.JWT_SECRET) {
            throw new Error(
              'JWT_SECRET is not defined in the environment variables',
            );
          }
          const decoded = jwt.verify(token, process.env.JWT_SECRET); 

          if (!decoded || typeof decoded === 'string') {
            throw new ForbiddenException('Access denied: Invalid token');
          }

          const user = {
            ...decoded,
            userId: parseInt(decoded.userId),
            email: decoded.email, 
            role: decoded.role,         
          };

          return user;

        } catch (error) {
          this.logger.warn(`Unauthorized access attempt: Invalid token`);
          throw new ForbiddenException('Access denied: Invalid token');
        }
    }
}

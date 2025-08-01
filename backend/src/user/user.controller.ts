// src/user/user.controller.ts
import { Controller, Get, Post, Body, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { User_Role } from 'src/interfaces/user.interface';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService
  ) {}

  @Get()
  async getUsers() {
    try {
      const users = await this.userService.findAll();
      return {
        success: true,
        data: users,
        message: 'Users fetched successfully',
      };
    } catch (error) {
      throw new HttpException({
        success: false,
        data: null,
        message: error.message || 'Failed to fetch users',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get("by-email")
  async getUserByEmail(@Body('email') email: string) {
    try {
      const user = await this.userService.findByEmail(email);
      return {
        success: true,
        data: user,
        message: 'User fetched successfully',
      };
    } catch (error) {
      throw new HttpException({
        success: false,
        data: null,
        message: error.message || 'Failed to fetch user',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  

  @Post()
  @UseGuards(RolesGuard)
  @Roles(User_Role.Admin)
  async createUser(@Body() data: CreateUserDto) {
     try {
      const user = await this.userService.createUser(data);
      return {
        success: true,
        data: user,
        message: 'User created successfully',
      };
    } catch (error) {
      throw new HttpException({
        success: false,
        data: null,
        message: error.message || 'User creation failed',
      }, HttpStatus.BAD_REQUEST);
    }
  }
}

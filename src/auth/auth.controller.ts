import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO, SignupDTO } from './dto/create-auth.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';


@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService, private jwtService: JwtService
  ) { }

  @Post('signup')
  async register(@Body() signUpData: SignupDTO) {
    const hashedPassword = await bcrypt.hash(signUpData.password, 10);
    signUpData.password = hashedPassword;
       
    const user = await this.authService.register(signUpData);
    return {
      success: true,
      message: 'User registered successfully',
      data: user,
    };
  }

  @Post('login')
  async login(@Body() signInData: LoginDTO) {
    const { email, password } = signInData;
    const user = await this.authService.findByEmail(email);
    if (!user) {
      return {
        success: false,
        message: 'Invalid credentials',
      };
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        success: false,
        message: 'Invalid credentials',
      };
    }
    const token = await this.jwtService.signAsync({id: user.id})
    return {
      success: true,
      message: 'Login successful',
      data: token
    };
  }
  
  @Get('/email/:email')

  async findByEmail(@Param('email') email: string) {
    const user = await this.authService.findByEmail(email);
    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }
    return {
      success: true,
      data: user,
    };
  }

  @Get()
  async findAll() {
    const users = await this.authService.findAll();
    return {
      success: true,
      data: users,
    };
  }
  

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    console.log('Request user:', req.user);
    const userId = req.user.id;
    console.log('User ID from request:', userId);
    const user = await this.authService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      success: true,
      data: user,
    };
  }
  
}

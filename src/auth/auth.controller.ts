import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO, SignupDTO } from './dto/create-auth.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('signup')
  async register(@Body() signUpData: SignupDTO) {
    return await this.authService.register(signUpData);
  }

  @Post('login')
  async login(@Body() signInData: LoginDTO) {
    return await this.authService.login(signInData.email, signInData.password);
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
    const userId = req.user.id;
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

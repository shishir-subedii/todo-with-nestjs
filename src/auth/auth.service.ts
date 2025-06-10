import { Injectable, HttpException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { SignupDTO } from './dto/create-auth.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) { }

  async register(signUpData: SignupDTO) {
    const existingUser = await this.userService.findByEmail(signUpData.email);
    if (existingUser) {
      throw new HttpException('Email already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(signUpData.password, 10);
    signUpData.password = hashedPassword;

    const user = await this.userService.register(signUpData);
    return {
      success: true,
      message: 'User registered successfully',
      data: user,
    };
  }

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
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

    const token = await this.jwtService.signAsync({ id: user.id });

    return {
      success: true,
      message: 'Login successful',
      data: token,
    };
  }

  async findAll() {
    return await this.userService.findAll();
  }

  async findByEmail(email: string) {
    return await this.userService.findByEmail(email);
  }

  async findById(id: number) {
    return await this.userService.findById(id);
  }
}

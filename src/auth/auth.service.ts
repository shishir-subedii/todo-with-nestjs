import { Body, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { SignupDTO } from './dto/create-auth.dto';


@Injectable()
export class AuthService {
  constructor(
    private userService: UserService
  ){}
  async register(@Body() signUpData: SignupDTO){
    await this.userService.register(signUpData)
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

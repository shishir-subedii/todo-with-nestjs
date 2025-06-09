import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }
  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new HttpException('User with this email already exists', 400);
    }
    const user =  await this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }
  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }
  async findById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }
}

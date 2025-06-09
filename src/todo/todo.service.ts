import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>
  ) { }

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const todo = this.todoRepository.create(createTodoDto);
    return this.todoRepository.save(todo);

  }

  async findAll(id: number): Promise<Todo[]> {
    const todos = await this.todoRepository.find({where: { userId: id }});
    if (!todos.length) {
      throw new HttpException('No todos found', HttpStatus.NOT_FOUND);
    }
    return todos;
  }

  async findOne(id: number, userId: number): Promise<Todo> {
    const todo = await this.todoRepository.findOne({ where: { id, userId } });
    if (!todo) {
      throw new HttpException(`Todo with id ${id} not found`, HttpStatus.NOT_FOUND);
    }
    return todo;
  }

  async update(id: number, userId: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.findOne(id, userId); // Reuse method
    Object.assign(todo, updateTodoDto);
    return this.todoRepository.save(todo);
  }

  async remove(id: number, userId:number): Promise<void> {
    const todo = await this.findOne(id, userId); // Reuse method
    await this.todoRepository.remove(todo);
  }
}
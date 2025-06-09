import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, UseGuards, Request } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) { }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Request() req, @Body() createTodoDto: CreateTodoDto ) {
    createTodoDto.userId = req.user.id; 
    await this.todoService.create(createTodoDto);
    return {
      success: true,
      message: 'Todo created successfully',
    };
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Request() req) {
    const userId = req.user.id; // Get user ID from request
    const todos = await this.todoService.findAll(userId);
    return {
      success: true,
      data: todos,
    };
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number, @Request() req) {
    const userId = req.user.id; // Get user ID from request
    const todo = await this.todoService.findOne(id, userId); 
    return {
      success: true,
      data: todo,
    };
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateTodoDto: UpdateTodoDto, @Request() req) {
    const userId = req.user.id; // Get user ID from request
    const updatedTodo = await this.todoService.update(id, userId,  updateTodoDto);
    return {
      success: true,
      data: updatedTodo,
    };
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number, @Request() req) {
    const userId = req.user.id; // Get user ID from request
    await this.todoService.remove(id, userId); 
    return {
      success: true,
      message: 'Todo removed successfully',
    };
  }
}

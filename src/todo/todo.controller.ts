import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) { }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Request() req, @Body() createTodoDto: CreateTodoDto) {
    const userId = req.user.id;
    const todo = await this.todoService.create({ ...createTodoDto, userId });
    return {
      success: true,
      message: 'Todo created successfully',
      data: todo,
    };
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Request() req) {
    const todos = await this.todoService.findAll(req.user.id);
    return {
      success: true,
      data: todos,
    };
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req
  ) {
    const todo = await this.todoService.findOne(id, req.user.id);
    return {
      success: true,
      data: todo,
    };
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
    @Request() req
  ) {
    const updated = await this.todoService.update(id, req.user.id, updateTodoDto);
    return {
      success: true,
      message: 'Todo updated successfully',
      data: updated,
    };
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    await this.todoService.remove(id, req.user.id);
    return {
      success: true,
      message: 'Todo deleted successfully',
    };
  }
}

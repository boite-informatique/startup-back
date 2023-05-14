import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Req,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksFinishedService } from './tasks-finished.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiTags } from '@nestjs/swagger';
import { Comment } from '@prisma/client';
import { CreateTaskFinishedDto } from './dto/create-task-finished.dto';
import { UpdateTaskFinishedDto } from './dto/update-task-finished.dto';


@ApiTags('project tasks')
@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService , private readonly tasksFinishedService: TasksFinishedService) {}
  
    @Post()
    create(@Body() createTaskDto: CreateTaskDto, @Req() user: any) {
        return this.tasksService.create(createTaskDto, user.sub);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.tasksService.findOne(+id);
    }
    @Get(':id/comments')
    findataskComments(@Param('id') id: string): Promise<Comment[]> {
        return this.tasksService.findataskComments(+id);
    }
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
        return this.tasksService.update(+id, updateTaskDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.tasksService.remove(+id);
    }
    @Post(':id/finished')
    createTaskFinished(@Body() createTaskFinishedDto: CreateTaskFinishedDto) {
        return this.tasksFinishedService.create(createTaskFinishedDto)
    }
    @Get(':id/finished')
    findTaskFinished(@Param('id') id: string){
        return this.tasksFinishedService.find(+id)
    }
    @Patch(':id/finished')
    updateteTaskFinished(@Param('id') id: string,@Body() updateTaskFinishedDto: UpdateTaskFinishedDto) {
        return this.tasksFinishedService.update(+id,updateTaskFinishedDto)
    }
    @Delete(':id/finished')
    deleteTaskFinished(@Param('id') id: string){
        return this.tasksFinishedService.delete(+id)
    }
}

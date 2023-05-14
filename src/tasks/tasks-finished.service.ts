import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskFinishedDto } from './dto/create-task-finished.dto';
import { UpdateTaskFinishedDto } from './dto/update-task-finished.dto';

@Injectable()
export class TasksFinishedService {
    constructor(private readonly prismaService: PrismaService) {}
async create(body : CreateTaskFinishedDto){
   return this.prismaService.taskFinished.create({data:{
    task:{ connect: { id: body.taskId} },
description : body.description,
resources : body.resources

   }})
}
async find(task_id :number){
    try {
        return await this.prismaService.taskFinished.findUnique({where:{task_id}})
    }catch(error){throw new NotFoundException()}
}
async update(task_id : number , body : UpdateTaskFinishedDto){try{
    return await this.prismaService.taskFinished.update({where:{task_id},
    data :body})
} catch (_) {
    throw new NotFoundException();
}
}
async delete(task_id : number){
    try {
        return await this.prismaService.taskFinished.delete({where:{task_id}})
    }catch(error){throw new NotFoundException()}
}
}
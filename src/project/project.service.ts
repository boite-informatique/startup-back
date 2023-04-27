// project.service.ts

import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './dto/project-output.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectService {
  constructor(
    private readonly prismaService: PrismaService
  ) {}

  async create(data: CreateProjectDto): Promise<Project> {
    const members = await this.prismaService.user.findMany({
      where: {
        id: {
          in: data.membersId,
        },
      },
    });

    const project = await this.prismaService.project.create({
      data: {
        type: data.type,
        resume: data.resume,
        brand_name: data.brand_name,
        product_name: data.product_name,
        owner: {
          connect: { id: data.owner_id },
        },
        supervisor: {
          connect: { id: data.supervisor_id },
        },
        co_supervisor: {
          connect: { id: data.co_supervisor_id },
        },
        membersId: {
          connect: members.map((member) => ({ id: member.id })),
        },
      },
    });

    return project;
  }
}
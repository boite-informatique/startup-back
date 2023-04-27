import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileUploadService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadImage(image: Express.Multer.File): Promise<File> {
    // Validate image type
    if (!['image/png', 'image/jpeg'].includes(image.mimetype)) {
      throw new Error('Invalid image type');
    }

    // Validate image size
    if (image.size > 1024 * 1024 * 2) {
      throw new Error('Image size exceeds 2MB');
    }

    // Generate a unique file name
    const fileName = `${uuidv4()}-${image.originalname}`;

    
    // Save the image record to the database
    const createdFile = await this.prisma.file.create({
      data: {
        fileName,
        size: image.size,
        mimetype: image.mimetype,
      },
    });

    return createdFile;
  }
}

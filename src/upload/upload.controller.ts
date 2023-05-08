import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { multerConfig } from './multer.config';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
    @UseInterceptors(FileInterceptor('file', multerConfig))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
      console.log(file);
      // handle file upload here
    }
}

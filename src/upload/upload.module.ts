import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from './multer.config';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
    controllers: [UploadController],
    providers: [UploadService],
    imports: [MulterModule.register(multerConfig)],
})
export class UploadModule {}

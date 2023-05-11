import {
    Controller,
    FileTypeValidator,
    MaxFileSizeValidator,
    ParseFilePipe,
    Post,
    UploadedFile,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import {
    FileFieldsInterceptor,
    FileInterceptor,
    FilesInterceptor,
} from '@nestjs/platform-express';
import { Express } from 'express';
import { multerConfig } from './multer.config';

@Controller('upload')
export class UploadController {
    @Post('image')
    @UseInterceptors(FileInterceptor('file')) // specify the name of the file field in the form
    uploadImage(
        @UploadedFile(
            new ParseFilePipe({
                validators: [new FileTypeValidator({ fileType: 'image' })],
            }),
        )
        file: Express.Multer.File,
    ) {
        return file.filename; // do something with the uploaded file
    }

    @Post('pdf')
    @UseInterceptors(FileInterceptor('file')) // specify the name of the file field in the form
    uploadPdf(
        @UploadedFile(
            new ParseFilePipe({
                validators: [new FileTypeValidator({ fileType: 'pdf' })],
            }),
        )
        file: Express.Multer.File,
    ) {
        return file.filename; // do something with the uploaded file
    }

    @Post('document')
    @UseInterceptors(FilesInterceptor('files')) // specify the name of the file field in the form
    uploadDocument(
        @UploadedFiles(
            new ParseFilePipe({
                validators: [
                    new FileTypeValidator({
                        fileType: 'pdf|pptx|video|doc|docx',
                    }),
                ],
            }),
        )
        files: Array<Express.Multer.File>,
    ) {
        return files.map((file) => file.filename); // do something with the uploaded file
    }
}

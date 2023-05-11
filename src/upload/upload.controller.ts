import {
    BadRequestException,
    Controller,
    FileTypeValidator,
    MaxFileSizeValidator,
    ParseFilePipe,
    Post,
    Req,
    Res,
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
    @UseInterceptors(
        FileInterceptor('file', {
            fileFilter: (req, file, cb) => {
                if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                    return cb(
                        new BadRequestException(
                            'Only image files are allowed!',
                        ),
                        false,
                    );
                } else {
                    cb(null, true);
                }
            },
        }),
    )
    uploadImage(
        @UploadedFile()
        file: Express.Multer.File,
    ) {
        return file.filename;
    }

    @Post('pdf')
    @UseInterceptors(
        FileInterceptor('file', {
            fileFilter: (req, file, cb) => {
                if (!(file.mimetype === 'application/pdf')) {
                    return cb(
                        new BadRequestException('Only pdf files are allowed!'),
                        false,
                    );
                } else {
                    cb(null, true);
                }
            },
        }),
    )
    uploadPdf(
        @UploadedFile()
        file: Express.Multer.File,
    ) {
        return file.filename;
    }

    @Post('document')
    @UseInterceptors(FilesInterceptor('files'))
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

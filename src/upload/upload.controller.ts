import {
    BadRequestException,
    Controller,
    FileTypeValidator,
    Get,
    Param,
    ParseFilePipe,
    Post,
    StreamableFile,
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
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('upload')
export class UploadController {
    @Get(':filename')
    getFile(@Param('filename') filename: string): StreamableFile {
        const file = createReadStream(
            join(process.cwd(), 'file-uploads', filename),
        );
        console.log(join(process.cwd(), filename));
        return new StreamableFile(file);
    }

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

    @Post('defensedoc')
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'memoire', maxCount: 1 },
                { name: 'bmc', maxCount: 1 },
                { name: 'label', maxCount: 1 },
                { name: 'brevet', maxCount: 1 },
            ],
            {
                fileFilter: (req, file, cb) => {
                    if (!(file.mimetype === 'application/pdf')) {
                        return cb(
                            new BadRequestException(
                                'Only pdf files are allowed!',
                            ),
                            false,
                        );
                    } else {
                        cb(null, true);
                    }
                },
            },
        ),
    )
    uploadDocDef(
        @UploadedFiles()
        files: {
            memoire: Express.Multer.File[];
            bmc?: Express.Multer.File[];
            label?: Express.Multer.File[];
            brevet?: Express.Multer.File[];
        },
    ) {
        return files.memoire[0].filename + ' ' + files.bmc[0].filename;
    }
}

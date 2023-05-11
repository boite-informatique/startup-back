import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig: MulterOptions = {
    storage: diskStorage({
        destination: 'file-uploads',
        filename: function (req, file, cb) {
            const uniqueSuffix =
                Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(
                null,
                file.fieldname +
                    '-' +
                    uniqueSuffix +
                    extname(file.originalname),
            );
        },
    }),
};

import { upload } from '../../config/multer';
import { FileUpload } from '../../domain/interfaces/file-upload';

export class MulterAdapter implements FileUpload {
    uploadFile = (formFieldName: string) => {
        return upload.single(formFieldName);
    };
}

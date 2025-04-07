import { FileUpload } from '../interfaces/file-upload';

export class UploadAudioUseCase {
    constructor(private fileUpload: FileUpload) {}

    public execute = (formFieldName: string) => {
        return this.fileUpload.uploadFile(formFieldName);
    };
}

import { FileSystemService } from '../../domain/services/file-system.service';

export interface DeleteFileUseCase {
    execute(filePath: string): Promise<boolean>;
}

export class DeleteFile implements DeleteFileUseCase {
    constructor(private fileSystemService: FileSystemService) {}

    execute(filePath: string) {
        return this.fileSystemService.deleteFile(filePath);
    }
}

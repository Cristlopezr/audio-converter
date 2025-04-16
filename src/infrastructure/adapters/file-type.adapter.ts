import { fileTypeFromFile } from 'file-type';
import { FileType } from '../../domain/interfaces/file-type';

export class FileTypeServiceImpl implements FileType {
    async getFileType(filePath: string): Promise<{ mime: string; ext: string } | undefined> {
        const fileType = await fileTypeFromFile(filePath);
        if (fileType) {
            return {
                mime: fileType.mime,
                ext: fileType.ext,
            };
        }
        return undefined;
    }
}

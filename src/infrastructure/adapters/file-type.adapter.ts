import { fileTypeFromFile } from 'file-type';
import { FileType } from '../../domain/services/file-type';

export class FileTypeServiceImpl implements FileType {
    async getFileType(filePath: string): Promise<{ mime: string; ext: string }> {
        const fileType = await fileTypeFromFile(filePath);
        if(!fileType) throw new Error('No match for file type.');

        return {
            mime: fileType.mime,
            ext: fileType.ext,
        };
    }
}

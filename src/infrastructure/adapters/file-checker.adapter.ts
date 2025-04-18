import { fileTypeFromFile } from 'file-type';
import { FileChecker } from '../../domain/services/file-checker';
import { audioMimeTypes } from '../../domain/constants/audio-mime-types';
import { CustomError } from '../../domain/errors/custom-error';

export class FileCheckerServiceImpl implements FileChecker {
    async getFileType(filePath: string): Promise<{ mime: string; ext: string }> {
        const fileType = await fileTypeFromFile(filePath);
        if (!fileType) throw CustomError.badRequest('No match for file type.');

        return {
            mime: fileType.mime,
            ext: fileType.ext,
        };
    }

    checkMimetype(mimetype: string): void {
        if (!audioMimeTypes.includes(mimetype.split(';')[0])) throw CustomError.badRequest('File type not supported.');
    }
}

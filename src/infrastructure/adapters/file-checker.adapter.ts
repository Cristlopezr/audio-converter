import { fileTypeFromFile } from 'file-type';
import { FileChecker } from '../../domain/services/file-checker';
import { supportedFormats } from '../../domain/constants/formats';
import { audioMimeTypes } from '../../domain/constants/audio-mime-types';

export class FileCheckerServiceImpl implements FileChecker {
    async getFileType(filePath: string): Promise<{ mime: string; ext: string }> {
        const fileType = await fileTypeFromFile(filePath);
        if (!fileType) throw new Error('No match for file type.');

        return {
            mime: fileType.mime,
            ext: fileType.ext,
        };
    }
    checkSupportedFormat(format: string): void {
        if (!supportedFormats.includes(format)) throw new Error('Format not supported');
    }
    checkMimetype(mimetype: string): void {
        if (!audioMimeTypes.includes(mimetype.split(';')[0])) throw new Error('File type not supported.');
    }
}

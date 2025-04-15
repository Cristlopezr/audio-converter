import fs from 'fs/promises';
import path from 'path';

export class FileSystemService implements FileSystemService {
    async fileExists(filePath: string) {
        try {
            await fs.access(filePath, fs.constants.F_OK);
            return true;
        } catch (err: any) {
            console.log(err);
            return false;
        }
    }

    async createDirectory(path: string) {
        try {
            await fs.mkdir(path, { recursive: true });
        } catch (error) {
            console.log(error);
            throw new Error('Error creating directory');
        }
    }

    getUploadPath(audioId: string, audioOriginalName: string) {
        return path.join('uploads', `${audioId}-${audioOriginalName}`);
    }

    createOutputPath(outputDir: string, originalNameWithoutExt: string, ext: string) {
        return path.join(outputDir, `${originalNameWithoutExt}.${ext}`);
    }

    getConversionPath(originalAudioId: string, newAudioId: string) {
        return path.join('conversions', originalAudioId, newAudioId);
    }
}

import fs from 'fs/promises';
import path from 'path';
import { FileSystemService } from '../../domain/interfaces/file-system.service';

export class FileSystemServiceImpl implements FileSystemService {
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

    async deleteFile(path: string): Promise<boolean> {
        try {
            await fs.unlink(path);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    getOriginalNameWithOutExt(originalName: string, ext: string): string {
        return path.basename(originalName, ext).replace(/\.$/, '');
    }
}

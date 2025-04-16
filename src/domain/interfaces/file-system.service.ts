export interface FileSystemService {
    fileExists(filePath: string): Promise<Boolean>;
    createDirectory(path: string): Promise<void>;
    getUploadPath(audioId: string, audioOriginalName: string): string;
    createOutputPath(outputDir: string, originalNameWithoutExt: string, ext: string): string;
    getConversionPath(originalAudioId: string, newAudioId: string): string;
    deleteFile(path: string): Promise<boolean>;
    getOriginalNameWithOutExt(originalName: string, ext: string): string;
}

export interface FileChecker {
    getFileType(filePath: string): Promise<{ mime: string; ext: string }>;
    checkSupportedFormat(format: string): void;
    checkMimetype(mimetype: string): void;
}

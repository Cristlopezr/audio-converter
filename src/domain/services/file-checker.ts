export interface FileChecker {
    getFileType(filePath: string): Promise<{ mime: string; ext: string }>;
    checkMimetype(mimetype: string): void;
}

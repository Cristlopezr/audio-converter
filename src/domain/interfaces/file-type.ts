export interface FileType {
    getFileType(filePath: string): Promise<{ mime: string; ext: string } | undefined>;
}

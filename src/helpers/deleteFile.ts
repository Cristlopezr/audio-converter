import fs from 'fs/promises';
export const deleteFile = async (filePath: string): Promise<boolean> => {
    try {
        await fs.unlink(filePath);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

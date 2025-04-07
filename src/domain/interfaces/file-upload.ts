import { RequestHandlerParams } from 'express-serve-static-core';

export interface FileUpload {
    uploadFile: (formFieldName: string) => RequestHandlerParams;
}

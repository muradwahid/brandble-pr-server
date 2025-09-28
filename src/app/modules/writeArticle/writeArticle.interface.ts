import { IUploadFile } from "../../../interfaces/file";

export interface CustomRequest {
    body: any;
    files?: IUploadFile[];
}
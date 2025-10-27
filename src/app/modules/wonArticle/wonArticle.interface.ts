import { IUploadFile } from "../../../interfaces/file";

export interface WonArticleCustomRequest {
  body: any;
  files?: IUploadFile[];
}
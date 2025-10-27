import { IUploadFile } from "../../../interfaces/file";

export type IUserLogin = {
  email: string;
  password?: string;
};
export type IUser = {
  name: string;
  email: string;
  password: string;
};

export interface CustomRequest {
  body: any;
  file?: IUploadFile;
}

export interface ILoginUserResponse {
  accessToken: string
  refreshToken?: string
}
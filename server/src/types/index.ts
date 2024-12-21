import { UploadApiOptions, UploadApiResponse } from "cloudinary";

declare module "jsonwebtoken" {
  interface JwtPayload {
    id: string;
    email?: string;
    username?: string;
  }
}

export type Folder = "Images";

export interface CustomUploadApiOptions extends UploadApiOptions {
  folder?: Folder;
  retries?: number;
}

export type UploadFileType = (
  localFilePath: string | undefined,
  options?: CustomUploadApiOptions
) => Promise<UploadApiResponse | null>;

export type TUserFiles =
  | {
      avatar?: Express.Multer.File[];
      coverImage?: Express.Multer.File[];
    }
  | undefined;
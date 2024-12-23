import { UploadApiOptions, UploadApiResponse } from "cloudinary";
import { User } from '@prisma/client'; 

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
declare module "jsonwebtoken" {
  interface JwtPayload {
    userId: number;
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
      profilePicture?: Express.Multer.File[];
      restaurantImage?: Express.Multer.File[];
      menuImage?: Express.Multer.File[];

    }
  | undefined;
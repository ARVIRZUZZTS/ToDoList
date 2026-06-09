import "multer";

declare global {
  namespace Express {
    interface User {
      user_id: string;
    }
  }
}

export {};
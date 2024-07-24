import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any; // Assuming `user` is a string, adjust it according to your setup
      token?: any; // Assuming `token` is a string, adjust it according to your setup
    }
  }
}
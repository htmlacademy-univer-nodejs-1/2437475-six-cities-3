import multer from 'multer';
import { Request } from 'express';
import { nanoid } from 'nanoid';
import mime from 'mime-types';
import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config();

const uploadsDir = process.env.UPLOADS_DIR || './uploads';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.resolve(uploadsDir, 'avatars'));
  },
  filename: (_req, file, cb) => {
    const ext = mime.extension(file.mimetype);
    const uniqueName = `${nanoid()}.${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    return cb(null, true);
  } else {
    return cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

export const uploadAvatar = upload.single('avatar');

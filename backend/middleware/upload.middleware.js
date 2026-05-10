import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create uploads folders if they don't exist
const videoDir = 'uploads/videos';
const thumbDir = 'uploads/thumbnails';
if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });
if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true });

// Storage config for videos
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, videoDir);
  },
  filename: (req, file, cb) => {
    // e.g. video-1234567890.mp4
    const uniqueName = `video-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Storage config for thumbnails
const thumbStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, thumbDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `thumb-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File type filters
const videoFilter = (req, file, cb) => {
  const allowed = /mp4|mkv|webm|avi|mov/;
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  if (allowed.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed (mp4, mkv, webm, avi, mov)'));
  }
};

const imageFilter = (req, file, cb) => {
  const allowed = /jpg|jpeg|png|webp|gif/;
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  if (allowed.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpg, png, webp)'));
  }
};

// Export upload handlers
export const uploadVideo = multer({
  storage: videoStorage,
  fileFilter: videoFilter,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB max
});

export const uploadThumbnail = multer({
  storage: thumbStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

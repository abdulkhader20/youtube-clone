import express from 'express';
import { uploadVideo, uploadThumbnail } from '../middleware/upload.middleware.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * POST /api/upload/video
 * Uploads a video file and returns its URL
 */
router.post('/video', protect, (req, res) => {
  uploadVideo.single('video')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No video file provided' });
    }
    // Return the accessible URL for this file
    const fileUrl = `http://localhost:5000/uploads/videos/${req.file.filename}`;
    res.json({ url: fileUrl, filename: req.file.filename });
  });
});

/**
 * POST /api/upload/thumbnail
 * Uploads a thumbnail image and returns its URL
 */
router.post('/thumbnail', protect, (req, res) => {
  uploadThumbnail.single('thumbnail')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No thumbnail file provided' });
    }
    const fileUrl = `http://localhost:5000/uploads/thumbnails/${req.file.filename}`;
    res.json({ url: fileUrl, filename: req.file.filename });
  });
});

export default router;

import express from 'express';
import {
  getAllVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  likeVideo,
  dislikeVideo,
} from '../controllers/video.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

// GET  /api/videos          — fetch all videos (with optional search & category filter)
router.get('/', getAllVideos);

// GET  /api/videos/:id      — fetch single video
router.get('/:id', getVideoById);

// POST /api/videos          — create video (protected)
router.post('/', protect, createVideo);

// PUT  /api/videos/:id      — update video (protected)
router.put('/:id', protect, updateVideo);

// DELETE /api/videos/:id    — delete video (protected)
router.delete('/:id', protect, deleteVideo);

// PUT /api/videos/:id/like    — like a video (protected)
router.put('/:id/like', protect, likeVideo);

// PUT /api/videos/:id/dislike — dislike a video (protected)
router.put('/:id/dislike', protect, dislikeVideo);

export default router;

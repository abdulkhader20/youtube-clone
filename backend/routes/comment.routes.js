import express from 'express';
import {
  getCommentsByVideo,
  addComment,
  updateComment,
  deleteComment,
} from '../controllers/comment.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

// GET    /api/comments/:videoId       — get all comments for a video
router.get('/:videoId', getCommentsByVideo);

// POST   /api/comments/:videoId       — add comment (protected)
router.post('/:videoId', protect, addComment);

// PUT    /api/comments/:id            — edit comment (protected)
router.put('/:id', protect, updateComment);

// DELETE /api/comments/:id            — delete comment (protected)
router.delete('/:id', protect, deleteComment);

export default router;

import express from 'express';
import {
  createChannel,
  getChannelById,
  getMyChannel,
  updateChannel,
} from '../controllers/channel.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

// POST /api/channels          — create channel (protected)
router.post('/', protect, createChannel);

// GET  /api/channels/my       — get logged-in user's channel (protected)
router.get('/my', protect, getMyChannel);

// GET  /api/channels/:id      — get channel by ID
router.get('/:id', getChannelById);

// PUT  /api/channels/:id      — update channel (protected)
router.put('/:id', protect, updateChannel);

export default router;

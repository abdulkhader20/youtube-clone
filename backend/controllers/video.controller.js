import Video from '../models/Video.model.js';
import Channel from '../models/Channel.model.js';

/**
 * @desc   Get all videos (with optional search by title & filter by category)
 * @route  GET /api/videos?search=react&category=JavaScript
 * @access Public
 */
export const getAllVideos = async (req, res) => {
  try {
    const { search, category } = req.query;

    // Build query object
    const query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' }; // case-insensitive search
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    const videos = await Video.find(query)
      .populate('channel', 'channelName avatar')
      .populate('uploader', 'username avatar')
      .sort({ createdAt: -1 });

    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc   Get single video by ID (also increments view count)
 * @route  GET /api/videos/:id
 * @access Public
 */
export const getVideoById = async (req, res) => {
  try {
    // Increment view count on video fetch
  const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } }, // increment views on each fetch
      { new: true }
    )
      .populate('channel', 'channelName avatar description subscribers')
      .populate('uploader', 'username avatar');

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    res.json(video);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc   Create a new video
 * @route  POST /api/videos
 * @access Private
 */
export const createVideo = async (req, res) => {
  const { title, description, videoUrl, thumbnailUrl, category, channelId } =
    req.body;

  if (!title || !videoUrl || !channelId) {
    return res
      .status(400)
      .json({ message: 'Title, video URL, and channel are required' });
  }

  try {
    // Verify the channel belongs to the logged-in user
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }
    if (channel.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'Not authorized to post to this channel' });
    }

    const video = await Video.create({
      title,
      description,
      videoUrl,
      thumbnailUrl,
      category: category || 'Web Development',
      channel: channelId,
      uploader: req.user._id,
    });

    // Add video reference to channel
    channel.videos.push(video._id);
    await channel.save();

    const populated = await video.populate('channel', 'channelName avatar');
    res.status(201).json(populated);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc   Update a video
 * @route  PUT /api/videos/:id
 * @access Private
 */
export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Only the uploader can update
    if (video.uploader.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'Not authorized to update this video' });
    }

    const { title, description, thumbnailUrl, category } = req.body;

    if (title) video.title = title;
    if (description !== undefined) video.description = description;
    if (thumbnailUrl !== undefined) video.thumbnailUrl = thumbnailUrl;
    if (category) video.category = category;

    const updated = await video.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc   Delete a video
 * @route  DELETE /api/videos/:id
 * @access Private
 */
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Only the uploader can delete
    if (video.uploader.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'Not authorized to delete this video' });
    }

    // Remove video reference from channel
    await Channel.findByIdAndUpdate(video.channel, {
      $pull: { videos: video._id },
    });

    await video.deleteOne();
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc   Like a video (toggle)
 * @route  PUT /api/videos/:id/like
 * @access Private
 */
export const likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const userId = req.user._id;
    const alreadyLiked = video.likes.includes(userId);

    if (alreadyLiked) {
      // Remove like (toggle off)
      video.likes = video.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      // Add like, remove dislike if present
      video.likes.push(userId);
      video.dislikes = video.dislikes.filter(
        (id) => id.toString() !== userId.toString()
      );
    }

    await video.save();
    res.json({ likes: video.likes.length, dislikes: video.dislikes.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc   Dislike a video (toggle)
 * @route  PUT /api/videos/:id/dislike
 * @access Private
 */
export const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const userId = req.user._id;
    const alreadyDisliked = video.dislikes.includes(userId);

    if (alreadyDisliked) {
      video.dislikes = video.dislikes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      video.dislikes.push(userId);
      video.likes = video.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    }

    await video.save();
    res.json({ likes: video.likes.length, dislikes: video.dislikes.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

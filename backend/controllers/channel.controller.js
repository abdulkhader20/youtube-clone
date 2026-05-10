import Channel from '../models/Channel.model.js';
import User from '../models/User.model.js';

/**
 * @desc   Create a new channel
 * @route  POST /api/channels
 * @access Private
 */
export const createChannel = async (req, res) => {
  const { channelName, handle, description, channelBanner, avatar } = req.body;

  if (!channelName || !handle) {
    return res
      .status(400)
      .json({ message: 'Channel name and handle are required' });
  }

  try {
    // Check if handle is already taken
    const existing = await Channel.findOne({ handle });
    if (existing) {
      return res.status(400).json({ message: 'Channel handle already taken' });
    }

    const channel = await Channel.create({
      channelName,
      handle,
      description,
      channelBanner,
      avatar,
      owner: req.user._id,
    });

    // Link channel to user
    await User.findByIdAndUpdate(req.user._id, {
      $push: { channels: channel._id },
    });

    res.status(201).json(channel);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc   Get channel by ID (with videos populated)
 * @route  GET /api/channels/:id
 * @access Public
 */
export const getChannelById = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate('owner', 'username avatar')
      .populate({
        path: 'videos',
        populate: { path: 'channel', select: 'channelName avatar' },
      });

    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    res.json(channel);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc   Get the logged-in user's channel
 * @route  GET /api/channels/my
 * @access Private
 */
export const getMyChannel = async (req, res) => {
  try {
    const channel = await Channel.findOne({ owner: req.user._id }).populate({
      path: 'videos',
      populate: { path: 'channel', select: 'channelName avatar' },
    });

    if (!channel) {
      return res.status(404).json({ message: 'No channel found for this user' });
    }

    res.json(channel);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc   Update channel info
 * @route  PUT /api/channels/:id
 * @access Private
 */
export const updateChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    if (channel.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'Not authorized to update this channel' });
    }

    const { channelName, description, channelBanner, avatar } = req.body;

    if (channelName) channel.channelName = channelName;
    if (description !== undefined) channel.description = description;
    if (channelBanner !== undefined) channel.channelBanner = channelBanner;
    if (avatar !== undefined) channel.avatar = avatar;

    const updated = await channel.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

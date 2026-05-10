import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema(
  {
    channelName: {
      type: String,
      required: [true, 'Channel name is required'],
      trim: true,
      maxlength: [100, 'Channel name cannot exceed 100 characters'],
    },
    handle: {
      type: String,
      required: [true, 'Channel handle is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    channelBanner: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subscribers: {
      type: Number,
      default: 0,
    },
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
      },
    ],
  },
  { timestamps: true }
);

const Channel = mongoose.model('Channel', channelSchema);
export default Channel;

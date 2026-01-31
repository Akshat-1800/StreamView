import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
  },

  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video",
    required: true,
  },

  hostSocketId: {
    type: String,
    default: null,
  },

  isPlaying: {
    type: Boolean,
    default: false,
  },

  currentTime: {
    type: Number,
    default: 0,
  },

  users: {
    type: [String], // socket IDs
    default: [],
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // ⏰ 60 minutes
  },
});

export const Room =
  mongoose.models.Room || mongoose.model("Room", RoomSchema);

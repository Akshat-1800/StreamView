import mongoose from "mongoose";
const {Schema} = mongoose;

const videoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    type: {
      type: String,
      enum: ["MOVIE", "SERIES"],
      required: true,
    },
    thumbnailUrl: String,
    hlsUrl: String,
    previewUrl: String,
    duration: Number,
    isPremium: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Video =
  mongoose.models.Video || mongoose.model("Video", videoSchema);

import mongoose from "mongoose";
const{ Schema } = mongoose;

const watchHistorySchema = new Schema(
  {
    clerkUserId: {
      type: String,
      required: true,
      index: true,
    },
    videoId: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    episodeId: {
      type: Schema.Types.ObjectId,
      ref: "Episode",
    },
    progress: {
      type: Number, // seconds
      default: 0,
    },
    lastWatchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const WatchHistory =
  mongoose.models.WatchHistory ||
  mongoose.model("WatchHistory", watchHistorySchema);

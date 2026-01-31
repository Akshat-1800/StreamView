import mongoose from "mongoose";
const { Schema } = mongoose;
const watchPartySchema = new Schema(
  {
    roomCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    hostId: {
      type: String, // clerkUserId
      required: true,
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
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const WatchParty =
  mongoose.models.WatchParty ||
  mongoose.model("WatchParty", watchPartySchema);

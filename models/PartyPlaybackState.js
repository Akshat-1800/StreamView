import mongoose from "mongoose";
const { Schema } = mongoose;
const partyPlaybackStateSchema = new Schema(
  {
    partyId: {
      type: Schema.Types.ObjectId,
      ref: "WatchParty",
      unique: true,
      required: true,
    },
    isPlaying: {
      type: Boolean,
      default: false,
    },
    currentTime: {
      type: Number,
      default: 0,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

export const PartyPlaybackState =
  mongoose.models.PartyPlaybackState ||
  mongoose.model("PartyPlaybackState", partyPlaybackStateSchema);

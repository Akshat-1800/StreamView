import mongoose from "mongoose";
const { Schema } = mongoose;
const partyParticipantSchema = new Schema(
  {
    partyId: {
      type: Schema.Types.ObjectId,
      ref: "WatchParty",
      required: true,
    },
    clerkUserId: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["HOST", "VIEWER"],
      default: "VIEWER",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const PartyParticipant =
  mongoose.models.PartyParticipant ||
  mongoose.model("PartyParticipant", partyParticipantSchema);

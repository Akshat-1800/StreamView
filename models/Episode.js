import mongoose from "mongoose";
const { Schema } = mongoose;
const episodeSchema = new Schema(
  {
    videoId: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    seasonNumber: Number,
    episodeNumber: Number,
    title: String,
    duration: Number, // seconds
    streamUrl: String,
  },
  { timestamps: true }
);

export const Episode =
  mongoose.models.Episode || mongoose.model("Episode", episodeSchema);

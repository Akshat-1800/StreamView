import { NextResponse } from "next/server";
import dbconnect from "@/lib/db";
import { Video } from "@/models/Video";
import { auth } from "@clerk/nextjs/server";
import { User } from "@/models/User";

export async function GET(req, { params }) {
  await dbconnect();

  const { userId } = auth();

  // 1️⃣ Must be logged in
  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // 2️⃣ Fetch video
  const {id} = await params;
  const video = await Video.findById(id);
  if (!video) {
    return NextResponse.json(
      { error: "Video not found" },
      { status: 404 }
    );
  }

  // 3️⃣ If premium → check subscription
  if (video.isPremium) {
    const user = await User.findOne({ clerkUserId: userId });

    if (!user || user.plan !== "PREMIUM") {
      return NextResponse.json(
        { error: "Premium subscription required" },
        { status: 403 }
      );
    }
  }

  // 4️⃣ Return allowed video data
  return NextResponse.json({
    _id: video._id,
    title: video.title,
    description: video.description,
    videoUrl: video.hlsUrl,
    previewUrl: video.previewUrl,
    duration: video.duration,
  });
}

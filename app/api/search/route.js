import dbconnect from "@/lib/db";
import { Video } from "@/models/Video";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query || query.trim() === "") {
      return NextResponse.json([]);
    }

    await dbconnect();

    const videos = await Video.find({
      title: { $regex: query, $options: "i" }, // case-insensitive
    })
      .select("title thumbnailUrl isPremium")
      .limit(10);

    return NextResponse.json(videos);
  } catch (err) {
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}

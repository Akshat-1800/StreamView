import { NextResponse } from "next/server";
import dbconnect from "@/lib/db";
import { Video } from "@/models/Video";
export async function GET() {
  await dbconnect();
  const videos = await Video.find().sort({ createdAt: -1 });
  return NextResponse.json(videos, { status: 200 });
}
export async function POST(req) {
  await dbconnect();
  const body = await req.json();

  const video = await Video.create(body);

  return NextResponse.json(video, { status: 201 });
}

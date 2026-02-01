import { Webhook } from "svix";
import { headers } from "next/headers";
import dbconnect from "@/lib/db";
import { User } from "@/models/User";


export async function POST(req) {
  const payload = await req.json();
  const headerList = headers();

  const svixHeaders = {
    "svix-id": headerList.get("svix-id"),
    "svix-timestamp": headerList.get("svix-timestamp"),
    "svix-signature": headerList.get("svix-signature"),
  };

  const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

  let event;

  try {
    event = webhook.verify(JSON.stringify(payload), svixHeaders);
  } catch (err) {
    return new Response("Invalid webhook signature", { status: 400 });
  }

  // We only care about user.created
  if (event.type === "user.created") {
    const user = event.data;

    await dbconnect();

    await User.create({
      clerkUserId: user.id,
      name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
      avatarUrl: user.image_url,
      plan: "FREE",
    });
  }

  return new Response("Webhook received", { status: 200 });
}

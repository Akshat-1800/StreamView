import { Webhook } from "svix";
import { headers } from "next/headers";
import dbconnect from "@/lib/db";
import { User } from "@/models/User";

export async function POST(req) {
  const payload = await req.text(); // ✅ IMPORTANT

  const headerList = headers();

  const svix_id = headerList.get("svix-id");
  const svix_timestamp = headerList.get("svix-timestamp");
  const svix_signature = headerList.get("svix-signature");

  // ✅ validate headers
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

  let event;

  try {
    event = webhook.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Invalid webhook signature", { status: 400 });
  }

  await dbconnect();

  const user = event.data;

  /* ======================
     USER CREATED
  ====================== */
  if (event.type === "user.created") {
    await User.create({
      clerkUserId: user.id,
      name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
      avatarUrl: user.image_url,
      plan: "FREE",
    });
  }

  /* ======================
     USER UPDATED
  ====================== */
  if (event.type === "user.updated") {
    await User.findOneAndUpdate(
      { clerkUserId: user.id },
      {
        name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
        avatarUrl: user.image_url,
      }
    );
  }

  /* ======================
     USER DELETED
  ====================== */
  if (event.type === "user.deleted") {
    await User.findOneAndDelete({
      clerkUserId: user.id,
    });
  }

  return new Response("Webhook processed", { status: 200 });
}
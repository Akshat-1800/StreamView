import { Webhook } from "svix";
import { headers } from "next/headers";
import dbconnect from "@/lib/db";
import { User } from "@/models/User";

export async function POST(req) {
  const payload = await req.text();

  const headerList = headers();

  const svix_id = headerList.get("svix-id");
  const svix_timestamp = headerList.get("svix-timestamp");
  const svix_signature = headerList.get("svix-signature");

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

  // ✅ SAFE EMAIL EXTRACTION
  const email =
    user.email_addresses?.find(
      (e) => e.id === user.primary_email_address_id
    )?.email_address || null;

  /* ======================
     USER CREATED / UPSERT
  ====================== */
  if (event.type === "user.created") {
    try {
      await User.findOneAndUpdate(
        { clerkUserId: user.id },
        {
          clerkUserId: user.id,
          name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
          avatarUrl: user.image_url,
          email,
          plan: "FREE",
        },
        { upsert: true, new: true }
      );
    } catch (error) {
      console.error("Error creating user:", error);
      return new Response("DB Error", { status: 500 });
    }
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
        email,
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
import { Webhook } from "svix";
import dbconnect from "@/lib/db";
import { User } from "@/models/User";

export async function POST(req) {
  console.log("🔥 WEBHOOK HIT");

  const payload = await req.text();

  // ✅ FIXED: use req.headers instead of headers()
  const svix_id = req.headers.get("svix-id");
  const svix_timestamp = req.headers.get("svix-timestamp");
  const svix_signature = req.headers.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("❌ Missing Svix headers");
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

    console.log("✅ Webhook verified:", event.type);
  } catch (err) {
    console.error("❌ Signature verification failed:", err);
    return new Response("Invalid webhook signature", { status: 400 });
  }

  try {
    console.log("📡 Connecting to DB...");
    await dbconnect();
    console.log("✅ DB connected");

    const user = event.data;

    // ✅ SAFE EMAIL EXTRACTION
    const email =
      user.email_addresses?.find(
        (e) => e.id === user.primary_email_address_id
      )?.email_address || null;

    console.log("👤 Processing user:", user.id);

    /* ======================
       USER CREATED
    ====================== */
    if (event.type === "user.created") {
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

      console.log("✅ User created/updated");
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

      console.log("✅ User updated");
    }

    /* ======================
       USER DELETED
    ====================== */
    if (event.type === "user.deleted") {
      await User.findOneAndDelete({
        clerkUserId: user.id,
      });

      console.log("🗑️ User deleted");
    }

    return new Response("Webhook processed", { status: 200 });

  } catch (err) {
    console.error("❌ DB ERROR:", err);
    return new Response("DB Error", { status: 500 });
  }
}
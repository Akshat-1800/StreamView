import dbconnect from "@/lib/db";
import { User } from "@/models/User";

export async function GET(req) {
  // const authHeader = req.headers.get("Authorization");
  // if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return new Response("Unauthorized", { status: 401 });
  // }
  try {
    await dbconnect();

    const now = new Date();

    // 🔥 find expired users
    const expiredUsers = await User.find({
      plan: "PREMIUM",
      "subscription.endDate": { $lt: now },
    });

    console.log("🔍 Expired users:", expiredUsers.length);

    // 🔥 downgrade them
    await User.updateMany(
      {
        plan: "PREMIUM",
        "subscription.endDate": { $lt: now },
      },
      {
        $set: {
          plan: "FREE",
          subscription: null,
        },
      }
    );

    return new Response(
      JSON.stringify({
        success: true,
        downgraded: expiredUsers.length,
      }),
      { status: 200 }
    );

  } catch (err) {
    console.error("❌ CRON ERROR:", err);
    return new Response("Cron failed", { status: 500 });
  }
}
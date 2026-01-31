import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";

export async function getCurrentUser() {
  const { userId } = auth();

  if (!userId) return null;

  await connectDB();

  const user =await User.findOne({ clerkUserId: userId });
  if(!user){
    return null;
  }
  if(user.planExpiresAt && user.planExpiresAt < new Date() && user.plan !== "PREMIUM"){
    await User.updateOne(
      { clerkUserId: userId },
      {
        plan: "FREE",
        planExpiresAt: null,
      }
    );
    user.plan = "FREE";
    
  }
    return user;
}

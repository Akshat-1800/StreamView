import { auth } from "@clerk/nextjs/server";
import dbconnect from "@/lib/db";
import { User } from "@/models/User";
import { Subscription } from "@/models/Subscription";

export async function POST() {
    const { userId } = auth();
    try {
        await dbconnect();
        if(!userId){
            return new Response(JSON.stringify({error: "Unauthorized"}), {status: 401});
        }
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMinutes(endDate.getMinutes() + 1);
        Subscription.create({
            clerkUserId: userId,
            plan: "MONTHLY",
            status: "ACTIVE",
            startDate,
            endDate,
        });
        await User.findOneAndUpdate(
            { clerkUserId: userId },
            { plan: "PREMIUM" ,
                planExpiresAt: endDate
            }
            
        );

        return new Response(JSON.stringify({ message: "Subscription updated" }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
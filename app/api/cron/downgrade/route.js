import { downgradeExpiredSubscriptions } from "@/lib/downgrade";


export async function GET() {
  await downgradeExpiredSubscriptions();
  return new Response("Cron executed");
}

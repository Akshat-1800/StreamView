"use client";


import { useRouter } from "next/navigation";


export default function SubscribePage() {
  const router = useRouter();

  const loadRazorpay = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      document.body.appendChild(script);
    });

  const handleSubscribe = async () => {
    await loadRazorpay();

    // 1️⃣ Create order
    const res = await fetch("/api/payment/create-order", {
      method: "POST",
    });

    const order = await res.json();

    // 2️⃣ Open Razorpay
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "MyFlix Premium",
      description: "Monthly Subscription",
      order_id: order.id,

      handler: async function (response) {
        // 3️⃣ Verify payment
        const verifyRes = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response),
        });

        if (verifyRes.ok) {
          router.push("/dashboard");
        } else {
          alert("Payment verification failed");
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-zinc-900 p-8 rounded-lg w-96 text-center">
        <h1 className="text-2xl font-bold mb-4">Go Premium</h1>

        <ul className="text-gray-400 mb-6 text-left space-y-2">
          <li>✔ Watch premium content</li>
          <li>✔ Create watch parties</li>
          <li>✔ Video calling</li>
        </ul>

        <button
          onClick={handleSubscribe}
          className="w-full bg-red-600 hover:bg-red-700 py-3 rounded font-semibold"
        >
          Upgrade to Premium
        </button>
      </div>
    </div>
  );
}

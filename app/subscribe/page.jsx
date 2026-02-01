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
      name: "StreamView Premium",
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
    <div className="min-h-screen flex items-center justify-center gradient-mesh p-6">
      <div className="max-w-lg w-full animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full glass-light">
            <span>⭐</span>
            <span className="text-sm">Premium Membership</span>
          </div>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Unlock Premium
          </h1>
          <p className="text-gray-400">
            Get access to all features and exclusive content
          </p>
        </div>

        {/* Pricing Card */}
        <div className="card card-premium p-8 text-center">
          <div className="mb-6">
            <span className="text-5xl font-bold">₹199</span>
            <span className="text-gray-400">/month</span>
          </div>

          <ul className="space-y-4 mb-8 text-left">
            <li className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-sm">✓</span>
              <span>Access all premium movies & series</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-sm">✓</span>
              <span>Create unlimited watch parties</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-sm">✓</span>
              <span>HD video calling with friends</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-sm">✓</span>
              <span>Screen sharing in parties</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-sm">✓</span>
              <span>No ads, ever</span>
            </li>
          </ul>

          <button
            onClick={handleSubscribe}
            className="btn btn-primary w-full text-lg py-4 animate-pulse-glow"
          >
            Upgrade to Premium
          </button>

          <p className="text-xs text-gray-500 mt-4">
            Cancel anytime. No hidden fees.
          </p>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <a href="/dashboard" className="text-sm text-gray-500 hover:text-white transition-colors">
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}

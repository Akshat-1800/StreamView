"use client";
import { SignedIn,SignUp,useUser,SignedOut } from "@clerk/nextjs";
// import { SignedIn } from "@clerk/nextjs/dist/types/components.server";
// import dotenv from "dotenv";
// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// dotenv.config();
function RedirectUser() {

  const router = useRouter();
  const { isSignedIn } = useUser();
  useEffect(() => {
    if (isSignedIn) {
      router.replace("/dashboard");
    }
  }, [isSignedIn, router]);
  return null;
}
export default function SignUpPage() {
    // const { isSignedIn } = useUser();
    // const router = useRouter();

  // ✅ THIS handles post-login redirect
  // if (userId) {
  //   redirect("/dashboard");
  // }
  // if (isSignedIn) {
  //   router.push("/dashboard");
  // }
  return (
    <div className="flex min-h-screen items-center justify-center gradient-mesh relative overflow-hidden p-4">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-48 md:w-72 h-48 md:h-72 bg-red-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 md:w-96 h-64 md:h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 animate-fade-in w-full max-w-md">
        <div className="text-center mb-6 md:mb-8">
          <a href="/" className="inline-flex items-center gap-2 mb-3 md:mb-4">
            <span className="text-2xl md:text-3xl">🎬</span>
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
              StreamView
            </span>
          </a>
          <p className="text-gray-400 text-sm md:text-base">Create your account to get started</p>
        </div>
        <SignedIn>
          <RedirectUser />
        </SignedIn>
        <SignedOut>
          <SignUp />
        </SignedOut>
      </div>
    </div>
  );
}

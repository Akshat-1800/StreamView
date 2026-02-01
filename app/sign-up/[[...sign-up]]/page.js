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
    <div className="flex min-h-screen items-center justify-center">
     <SignedIn>
      <RedirectUser />
      </SignedIn>
      <SignedOut>
      <SignUp 
      // forceRedirectUrl="/dashboard"
      // redirectUrl="/dashboard"
      
      />
      </SignedOut>
      
    </div>

  );
}

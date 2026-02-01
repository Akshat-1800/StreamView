"use client";
import { SignedIn, SignedOut, SignIn, SignInButton,useUser } from "@clerk/nextjs";
// import dotenv from "dotenv";
// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";
// import { redirect } from "next/navigation";
import { useEffect } from "react";
import {useRouter} from "next/navigation";

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

export default function SignInPage() {
  // const { isSignedIn,isLoaded } = auth();


  
    // if (isLoaded && isSignedIn) {
    //   redirect("/dashboard");
    // }
  

  // // ✅ THIS handles post-login redirect
  // if (userId) {
  //   redirect("/dashboard");

  // }
  // const router = useRouter();
  // const RedirectUser = () => {
  //   useEffect(() => {
  //     router.push("/dashboard");
  //   }, [router]);}
  // const router=useRouter();
  
  // const {isSignedIn}=useUser()
  // if(isSignedIn){
  //   router.push("/dashboard");
  // }
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignedIn>
      <RedirectUser />
      </SignedIn>
      <SignedOut>

      <SignIn 

      
      // forceRedirectUrl="/dashboard"
      />
      </SignedOut>

      
      
      
       
    </div>
    );
  
  
}

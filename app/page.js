
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Latest from "@/components/Latest";
import GetStarted from "@/components/GetStarted";


import Image from "next/image";



export default function Home() {
    const { userId } = auth();

  if (userId) {
    redirect("/dashboard");
  }
  return (
    <main className="min-h-screen bg-black text-white">
      
      <Hero />
      <About />
      <Latest />
      <GetStarted />
    </main>
  );
}

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "StreamView - Watch Together",
  description: "Stream movies and series with friends in real-time",
};

export default function RootLayout({ children }) {
  return (
    
    <ClerkProvider
    // afterSignInUrl="/dashboard"
    // afterSignUpUrl="/dashboard"
    // signInForceRedirectUrl="/dashboard"
    // signUpForceRedirectUrl="/dashboard"
    >
    <html lang="en" className="dark">
      
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar
          newestOnTop
          theme="dark"
          closeOnClick
          rtl={false}>
        </ToastContainer>
        {children}
        <Footer  />
      </body>
    </html>
    </ClerkProvider>
  );
}

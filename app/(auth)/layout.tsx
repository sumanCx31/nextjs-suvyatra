import React from "react";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/auth.context";
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
   <AuthProvider>
     <html lang="en">
      <body
        className={`antialiased bg-slate-900 text-white`}
      >
        <div className="relative min-h-screen flex items-center justify-center bg-[#0f172a] overflow-hidden p-4">
      {/* Animated Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/20 blur-[120px] animate-blob animation-delay-2000"></div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Project Branding */}
        <div className="hidden lg:flex flex-col space-y-6 text-white p-8 animate-fade-in-left">
          <div className="inline-flex items-center space-x-2 bg-white/10 w-fit px-4 py-1.5 rounded-full border border-white/10 mb-4">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-medium">Now live across 50+ cities</span>
          </div>
          
          <h1 className="text-7xl font-bold tracking-tight">
            Suv<span className="text-emerald-500">Yatra</span>
          </h1>
          
          <p className="text-2xl text-slate-300 font-light leading-relaxed">
            Your journey begins with a single click. Experience the <span className="text-white font-semibold">fastest way</span> to book bus tickets online.
          </p>
        </div>

        {/* Login Form here */}
        {children}
        <Toaster position="top-right" richColors />

      </div>
    </div>
      </body>
    </html>
   </AuthProvider>

  );
} 

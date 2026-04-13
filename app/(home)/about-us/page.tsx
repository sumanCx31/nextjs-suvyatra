// app/about/page.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Smartphone, 
  Zap, 
  CreditCard, 
  Clock, 
  ChevronRight, 
  ShieldCheck,
  MousePointerClick,
  MonitorCheck
} from "lucide-react";

const pillars = [
  {
    icon: MousePointerClick,
    title: "Instant Booking",
    desc: "Skip the counter. Browse routes, select your preferred seat, and secure your ticket in under 60 seconds from anywhere in the world.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  },
  {
    icon: Smartphone,
    title: "Remote Access",
    desc: "No more traveling to physical ticket booths. SuvYatra brings the entire transport network to your smartphone, saving you time and transit costs.",
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    icon: ShieldCheck,
    title: "Digital Transparency",
    desc: "See real-time seat availability and fixed pricing. No middle-men, no hidden charges—just a direct, honest connection to your ride.",
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  }
];

export default function AboutPage() {
  return (
    <div className="bg-[#020617] text-white pt-32 pb-20 overflow-hidden font-sans">
      
      {/* --- SECTION 1: THE DIGITAL HERO --- */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 mb-40 relative">
        <div className="absolute -top-40 -right-20 w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full -z-10" />
        
        <div className="flex flex-col items-center text-center space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/20 backdrop-blur-md"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">The Future of Ticketing</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none"
          >
            TICKET <br /> <span className="text-emerald-500">EVERYWHERE.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl text-slate-400 text-lg md:text-xl font-medium leading-relaxed"
          >
            SuvYatra eliminates the need for physical queues and manual bookings. 
            We provide a high-speed digital gateway to secure your SUV seat remotely, 
            anytime, from any location.
          </motion.p>
        </div>
      </section>

      {/* --- SECTION 2: DIGITAL ADVANTAGE --- */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 grid lg:grid-cols-2 gap-20 items-center mb-40">
        <div className="space-y-10">
          <div className="inline-block p-4 bg-[#0F172A] rounded-[2.5rem] border border-white/5">
             <div className="w-full aspect-square md:w-80 md:h-80 bg-gradient-to-br from-emerald-500/20 to-[#060910] rounded-[2rem] flex flex-col items-center justify-center overflow-hidden relative group p-8">
                <MonitorCheck size={80} className="text-emerald-500 mb-6 group-hover:scale-110 transition-transform duration-500" />
                <div className="flex gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   <div className="w-2 h-2 rounded-full bg-emerald-500/40 animate-pulse delay-75" />
                   <div className="w-2 h-2 rounded-full bg-emerald-500/10 animate-pulse delay-150" />
                </div>
                <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">System Online</p>
             </div>
          </div>
          <div className="space-y-6">
             <h3 className="text-3xl font-black italic tracking-tight uppercase">Why <span className="text-emerald-500">Go Digital?</span></h3>
             <p className="text-slate-400 leading-loose text-lg">
                Physical ticketing is outdated. It forces travelers to waste hours visiting counters 
                just to check availability. SuvYatra puts the control back in your hands. 
                <br /><br />
                Whether you are at home, in the office, or currently on the move, 
                our platform ensures that your next journey is just a few taps away.
             </p>
          </div>
        </div>

        <div className="grid gap-6">
          {pillars.map((item, idx) => (
            <motion.div 
              key={item.title}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 rounded-[2.5rem] bg-[#0F172A] border border-white/5 hover:border-emerald-500/20 transition-all group"
            >
              <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mb-6`}>
                <item.icon className={item.color} size={24} />
              </div>
              <h4 className="text-xl font-black uppercase tracking-tighter mb-3">{item.title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- SECTION 3: THE FUTURE INTEGRATION --- */}
      <section className="px-6 mb-20">
        <div className="max-w-6xl mx-auto rounded-[4rem] bg-[#111827] border border-white/5 p-12 md:p-24 relative overflow-hidden text-center">
           <div className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white">
                THE NEXT PHASE: <span className="text-emerald-500">LIVE TRACKING.</span>
              </h2>
              <p className="text-slate-400 font-medium max-w-2xl mx-auto text-lg leading-relaxed">
                Our remote-first approach is just the start. We are currently developing 
                **Live GPS Integration** to allow passengers to track their SUV's 
                exact position directly from the app.
              </p>
              <div className="flex justify-center pt-4">
                 <button 
                  onClick={() => window.location.href = '/bus'}
                  className="flex items-center gap-3 px-8 py-5 bg-emerald-500 text-[#020617] rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all group shadow-xl shadow-emerald-500/20"
                 >
                   Book Your Remote Ticket <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
           </div>
        </div>
      </section>

      {/* --- SECTION 4: FOOTER NOTE --- */}
      <footer className="text-center border-t border-white/5 pt-20">
         <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center font-black italic text-[#020617]">S</div>
            <span className="text-xl font-black tracking-tighter">SUV<span className="text-emerald-500">YATRA</span></span>
         </div>
         <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.5em]">Digitizing Travel • Remote Access • Safe Booking</p>
      </footer>
    </div>
  );
}
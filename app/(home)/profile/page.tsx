"use client";

import { motion } from "framer-motion";
import { 
  User, Mail, Phone, MapPin, Calendar, 
  ShieldCheck, Edit3, Ticket 
} from "lucide-react";
import { useAuth } from "@/context/auth.context";
import Link from "next/link"; // Added for redirection

const ProfilePage = () => {
  const { loggedInUser } = useAuth();

  if (!loggedInUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <p className="italic opacity-50">Please log in to view your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-28 pb-20 px-4 md:px-6">
      <div className="container mx-auto max-w-5xl">
        
        {/* --- HEADER SECTION --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-slate-900 border border-white/10 rounded-[3rem] p-8 md:p-12 mb-8 shadow-2xl"
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full" />
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="relative group">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-emerald-500/20 p-1 bg-slate-800 overflow-hidden shadow-2xl transition-transform group-hover:scale-105">
                <img 
                  src={loggedInUser.image?.secureUrl || "/default-avatar.png"} 
                  alt="Profile" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>

            <div className="text-center md:text-left space-y-4">
              <div className="flex flex-col md:flex-row items-center gap-3">
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                  {loggedInUser.name}
                </h1>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                <Stat icon={<ShieldCheck size={14}/>} label="Status" value="Verified" />
              </div>
            </div>

            <div className="md:ml-auto">
              <button className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-bold text-sm transition-all active:scale-95">
                <Edit3 size={16} />
                Edit Profile
              </button>
            </div>
          </div>
        </motion.div>

        {/* --- DETAILS GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 space-y-8"
          >
            <h2 className="text-xl font-black text-white uppercase italic tracking-tight flex items-center gap-3">
              <User className="text-emerald-500" size={20} />
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InfoField label="Full Name" value={loggedInUser.name} icon={<User size={16}/>} />
              <InfoField label="Email Address" value={loggedInUser.email} icon={<Mail size={16}/>} />
              <InfoField label="Phone Number" value={loggedInUser.phone || "+977 98XXXXXXX"} icon={<Phone size={16}/>} />
              <InfoField label="Primary Address" value={loggedInUser.address || "Kathmandu, Nepal"} icon={<MapPin size={16}/>} />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 space-y-6"
          >
            <h2 className="text-xl font-black text-white uppercase italic tracking-tight">Security</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-slate-950 rounded-2xl border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Account ID</p>
                  <p className="text-xs font-mono text-slate-300">#{loggedInUser._id.slice(-8).toUpperCase()}</p>
                </div>
                <ShieldCheck className="text-emerald-500" size={20} />
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-white/5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Registered On</p>
                <p className="text-xs font-bold text-slate-300 mt-1 flex items-center gap-2">
                  <Calendar size={14} className="text-emerald-500" />
                  {new Date(loggedInUser.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                </p>
              </div>

              {/* Updated Change Password Button with Link */}
              <Link href="/change-password">
                <button className="w-full py-4 rounded-2xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-black uppercase tracking-tighter transition-all">
                  Change Password
                </button>
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const Stat = ({ icon, label, value }: any) => (
  <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-white/5">
    <span className="text-emerald-500">{icon}</span>
    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}:</span>
    <span className="text-xs font-black text-white">{value}</span>
  </div>
);

const InfoField = ({ label, value, icon }: any) => (
  <div className="space-y-2">
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">{label}</p>
    <div className="flex items-center gap-3 bg-slate-950 border border-white/5 px-5 py-4 rounded-2xl group focus-within:border-emerald-500 transition-colors">
      <span className="text-slate-600 group-focus-within:text-emerald-500 transition-colors">{icon}</span>
      <p className="text-sm font-bold text-slate-300">{value || "Not provided"}</p>
    </div>
  </div>
);

export default ProfilePage;
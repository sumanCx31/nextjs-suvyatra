"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Mail, Phone, MapPin, Calendar, 
  ShieldCheck, Edit3, Award, Sparkles, TrendingUp,
  Medal, Crown, Star, ChevronRight, Lock, ShieldAlert, Zap
} from "lucide-react";
import { useAuth } from "@/context/auth.context";
import Link from "next/link";
import authService from "@/services/auth.service";

interface LoyaltyData {
  name: string;
  email: string;
  membership: string;
  discount: number;
  totalSeatsBookedLast30Days: number;
  nextLevel: string | null;
  seatsRequired: number;
}

const ProfilePage = () => {
  const { loggedInUser } = useAuth();
  const [loyalty, setLoyalty] = useState<LoyaltyData | null>(null);
  const [loyaltyLoading, setLoyaltyLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"overview" | "perks">("overview");

  useEffect(() => {
    let isMounted = true;

    const fetchLoyalty = async () => {
      const _id = loggedInUser?._id;
      try {
        const response = await authService.getRequest(`/loyalty/${_id}`);
        const data = response.data?.data || response.data;
        if (isMounted && data) {
          setLoyalty(data);
        }
      } catch (error: any) {
        if (isMounted) {
          const errorMessage = 
            error?.response?.data?.message || 
            error?.message || 
            JSON.stringify(error);
          console.error("Failed to fetch loyalty data:", errorMessage);
        }
      } finally {
        if (isMounted) {
          setLoyaltyLoading(false);
        }
      }
    };

    if (loggedInUser?._id) {
      fetchLoyalty();
    } else {
      setLoyaltyLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [loggedInUser]);

  if (!loggedInUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-3 p-8 bg-slate-900/50 border border-white/10 rounded-3xl backdrop-blur-xl"
        >
          <Lock className="w-10 h-10 text-emerald-400 mx-auto animate-pulse" />
          <p className="text-sm font-bold text-slate-400 italic">Please log in to view your profile dashboard...</p>
        </motion.div>
      </div>
    );
  }

  // Medal & Styling configuration based on tier level
  const getTierVisuals = (level?: string) => {
    switch (level?.toLowerCase()) {
      case "platinum":
        return {
          gradient: "from-cyan-400 via-blue-500 to-indigo-600",
          bgGlow: "bg-cyan-500/10",
          border: "border-cyan-400/40",
          text: "text-cyan-400",
          icon: <Crown className="w-6 h-6 text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" />,
          badgeBg: "bg-cyan-500/10 border-cyan-500/30 text-cyan-300",
        };
      case "gold":
        return {
          gradient: "from-amber-300 via-yellow-500 to-amber-700",
          bgGlow: "bg-amber-500/10",
          border: "border-amber-400/40",
          text: "text-amber-400",
          icon: <Medal className="w-6 h-6 text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]" />,
          badgeBg: "bg-amber-500/10 border-amber-500/30 text-amber-300",
        };
      case "silver":
        return {
          gradient: "from-slate-200 via-slate-400 to-slate-600",
          bgGlow: "bg-slate-400/10",
          border: "border-slate-300/40",
          text: "text-slate-300",
          icon: <Medal className="w-6 h-6 text-slate-200 drop-shadow-[0_0_10px_rgba(203,213,225,0.8)]" />,
          badgeBg: "bg-slate-400/10 border-slate-400/30 text-slate-200",
        };
      case "bronze":
        return {
          gradient: "from-amber-600 via-orange-700 to-amber-950",
          bgGlow: "bg-orange-600/10",
          border: "border-amber-600/40",
          text: "text-amber-500",
          icon: <Medal className="w-6 h-6 text-amber-600 drop-shadow-[0_0_10px_rgba(217,119,6,0.8)]" />,
          badgeBg: "bg-amber-600/10 border-amber-600/30 text-amber-500",
        };
      default:
        return {
          gradient: "from-slate-700 via-slate-800 to-slate-900",
          bgGlow: "bg-slate-700/10",
          border: "border-slate-600/40",
          text: "text-slate-400",
          icon: <Star className="w-6 h-6 text-slate-400" />,
          badgeBg: "bg-slate-800 border-slate-700 text-slate-300",
        };
    }
  };

  const tierStyle = getTierVisuals(loyalty?.membership);

  return (
    <div className="min-h-screen bg-slate-950 pt-28 pb-24 px-4 md:px-6 relative overflow-hidden">
      
      {/* Background ambient light effects */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/5 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-blue-500/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="container mx-auto max-w-5xl space-y-8 relative z-10">
        
        {/* --- HEADER HERO BANNER --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden bg-gradient-to-b from-slate-900/90 to-slate-900/40 border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl backdrop-blur-2xl"
        >
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-gradient-to-br from-emerald-500/20 to-transparent blur-[90px] rounded-full" />
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            
            {/* Avatar with Animated Glow Ring */}
            <div className="relative group">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-75 blur group-hover:opacity-100 transition duration-500 animate-pulse" />
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-slate-900 bg-slate-800 overflow-hidden shadow-2xl">
                <img 
                  src={loggedInUser.image?.secureUrl || "/default-avatar.png"} 
                  alt="Profile" 
                  className="w-full h-full object-cover rounded-full transform transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              
              {/* Medal Badge Over Avatar */}
              {!loyaltyLoading && loyalty && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className={`absolute -bottom-2 right-2 p-2.5 rounded-2xl bg-gradient-to-br ${tierStyle.gradient} shadow-xl border border-white/20 flex items-center justify-center`}
                  title={`${loyalty.membership} Tier Medal`}
                >
                  {tierStyle.icon}
                </motion.div>
              )}
            </div>

            {/* User Info & Titles */}
            <div className="text-center md:text-left space-y-3 flex-1">
              <div className="space-y-1">
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs font-black uppercase tracking-[0.25em] text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20"
                >
                  Verified Traveler
                </motion.span>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic pt-2">
                  {loggedInUser.name}
                </h1>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                <Stat icon={<ShieldCheck size={14} className="text-emerald-400"/>} label="Security" value="Protected" />
                {loyalty && (
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r ${tierStyle.gradient} shadow-lg text-slate-950 font-black text-xs uppercase tracking-wider border border-white/30`}>
                    <Medal size={15} className="drop-shadow" />
                    <span>{loyalty.membership} Elite ({loyalty.discount}% Off)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="md:ml-auto flex flex-col gap-3">
              <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg backdrop-blur-md">
                <Edit3 size={15} className="text-emerald-400" />
                Edit Profile
              </button>
            </div>
          </div>
        </motion.div>

        {/* --- LOYALTY & MEDAL STATUS SHOWCASE --- */}
        {!loyaltyLoading && loyalty && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className={`relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-900 to-[#0c1829] border ${tierStyle.border} p-8 md:p-10 shadow-2xl`}
          >
            {/* Background pattern sparkle */}
            <div className="absolute top-0 right-0 p-10 text-white/5 pointer-events-none transform rotate-12">
              <Sparkles size={160} />
            </div>

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
              
              {/* Left description */}
              <div className="space-y-3 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest shadow-inner">
                  <Zap size={13} className="animate-bounce" /> Tier Rewards Active
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tight">
                  {loyalty.membership} Medal Status Achieved
                </h3>
                <p className="text-slate-400 text-xs md:text-sm font-medium leading-relaxed">
                  You have booked <span className="text-emerald-400 font-bold">{loyalty.totalSeatsBookedLast30Days} seats</span> in the past 30 days, unlocking an automatic <span className="text-emerald-400 font-bold">{loyalty.discount}% discount</span> on all your future bookings!
                </p>
              </div>

              {/* Right Milestone Widget */}
              {loyalty.nextLevel ? (
                <div className="w-full lg:w-auto bg-slate-950/80 border border-white/10 rounded-3xl p-6 shadow-xl backdrop-blur-md flex items-center gap-5">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Medal className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Next Milestone</p>
                    <p className="text-base font-black text-white uppercase italic">
                      {loyalty.nextLevel} Tier
                    </p>
                    <p className="text-xs font-bold text-emerald-400">
                      Book <span className="underline decoration-emerald-500/50">{loyalty.seatsRequired}</span> more seat{loyalty.seatsRequired > 1 ? 's' : ''} to upgrade!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="w-full lg:w-auto bg-slate-950/80 border border-emerald-500/30 rounded-3xl p-6 shadow-xl backdrop-blur-md flex items-center gap-5">
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Crown className="w-8 h-8 text-emerald-400 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Pinnacle Achieved</p>
                    <p className="text-base font-black text-white uppercase italic mt-0.5">
                      Maximum Tier Reached! 🚀
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* --- DETAILS GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Personal Info Box */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="lg:col-span-2 bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 md:p-10 space-y-8 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h2 className="text-xl font-black text-white uppercase italic tracking-tight flex items-center gap-3">
                <User className="text-emerald-400" size={20} />
                Personal Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoField label="Full Name" value={loggedInUser.name} icon={<User size={16}/>} />
              <InfoField label="Email Address" value={loggedInUser.email} icon={<Mail size={16}/>} />
              <InfoField label="Phone Number" value={loggedInUser.phone || "+977 98XXXXXXX"} icon={<Phone size={16}/>} />
              <InfoField label="Primary Address" value={loggedInUser.address || "Kathmandu, Nepal"} icon={<MapPin size={16}/>} />
            </div>
          </motion.div>

          {/* Security & System Box */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 md:p-10 space-y-6 shadow-2xl backdrop-blur-xl flex flex-col justify-between"
          >
            <div className="space-y-6">
              <h2 className="text-xl font-black text-white uppercase italic tracking-tight border-b border-white/5 pb-4">
                Security & ID
              </h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-slate-950/80 rounded-2xl border border-white/5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Account ID</p>
                    <p className="text-xs font-mono text-slate-300 mt-0.5">#{loggedInUser._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <ShieldCheck className="text-emerald-400" size={20} />
                </div>

                <div className="p-4 bg-slate-950/80 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Registered On</p>
                  <p className="text-xs font-bold text-slate-300 mt-1 flex items-center gap-2">
                    <Calendar size={14} className="text-emerald-400" />
                    {new Date(loggedInUser.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link href="/change-password">
                <button className="w-full py-4 rounded-2xl bg-red-500/5 hover:bg-red-500/10 active:scale-95 border border-red-500/20 text-red-500 text-xs font-black uppercase tracking-wider transition-all">
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
  <div className="flex items-center gap-2.5 bg-slate-950/80 px-4 py-2 rounded-2xl border border-white/5 shadow-inner">
    <span>{icon}</span>
    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}:</span>
    <span className="text-xs font-black text-white">{value}</span>
  </div>
);

const InfoField = ({ label, value, icon }: any) => (
  <div className="space-y-2">
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">{label}</p>
    <div className="flex items-center gap-3.5 bg-slate-950/80 border border-white/5 px-5 py-4 rounded-2xl group focus-within:border-emerald-500/50 transition-colors shadow-inner">
      <span className="text-slate-600 group-focus-within:text-emerald-400 transition-colors">{icon}</span>
      <p className="text-sm font-bold text-slate-300 truncate">{value || "Not provided"}</p>
    </div>
  </div>
);

export default ProfilePage;
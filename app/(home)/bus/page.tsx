"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Navigation,
  Clock,
  ShieldCheck,
  Loader2,
  Search,
  Filter,
  X,
} from "lucide-react";
import authService from "@/services/auth.service";
// import { NavLink } from "react-router-dom";

const BusCard = ({ bus, index }: { bus: any; index: number }) => {
  const availableSeats = bus.totalSeats - (bus.seats?.length || 0);
  const isFull = availableSeats <= 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.02 }}
      className="group bg-[#111827] border border-white/5 rounded-3xl overflow-hidden shadow-2xl hover:border-emerald-500/40 transition-all"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={bus.image?.secureUrl || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=500"}
          alt={bus.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-emerald-500 text-slate-900 text-[10px] font-black px-3 py-1.5 rounded-xl uppercase shadow-2xl">
            {bus.busType}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-xl font-bold text-white truncate capitalize tracking-tight">
          {bus.name}
        </h2>
        <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em] mt-1">
          {bus.busNumber}
        </p>

        <div className="flex items-center gap-2 py-5 border-y border-white/5 my-5">
          <div className="flex flex-col gap-1">
            <Users size={16} className={isFull ? "text-red-500" : "text-emerald-500"} />
            <span className="text-[10px] text-slate-500 font-medium mt-1">Ph: {bus.phone}</span>
          </div>
          <div className="flex-1 border-t border-dashed border-slate-800 mx-2"></div>
          <div className="flex flex-col items-end text-right gap-1">
            <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Operator</span>
            <span className="text-sm text-slate-300 font-bold flex items-center gap-1.5">
              {bus.driverName} <ShieldCheck size={14} className="text-blue-400" />
            </span>
          </div>
        </div>

        <div className="flex justify-center items-center">
          <button className="w-full py-3 rounded-2xl font-black bg-emerald-500 text-slate-900 text-[10px] hover:bg-emerald-400 uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg">
            <a href={`/bus/trips/${bus._id}`}>View Trips</a>
          </button>
          
        </div>
      </div>
    </motion.div>
  );
};

export default function BusSearchPage() {
  const [buses, setBuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const getBusList = async () => {
    try {
      setLoading(true);
      const response = await authService.getRequest("/bus");
      const apiData = response.data?.data || response.data || [];
      if (Array.isArray(apiData)) setBuses(apiData);
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getBusList(); }, []);

  const filteredBuses = useMemo(() => {
    return buses.filter((bus) => {
      const busName = bus.name?.toLowerCase() || "";
      const busNum = bus.busNumber?.toLowerCase() || "";
      const busType = bus.busType?.toLowerCase() || "";
      const matchesSearch = busName.includes(searchQuery.toLowerCase()) || busNum.includes(searchQuery.toLowerCase());
      const matchesType = activeFilter === "all" || busType === activeFilter;
      return matchesSearch && matchesType;
    });
  }, [buses, searchQuery, activeFilter]);

  return (
    <div className="min-h-screen bg-[#060910] text-white">
      {/* FIXED HEADER 
          Adjust `top-20` to match your Navbar's height. 
          If your Navbar is 80px, use top-20. If 64px, use top-16.
      */}
      <header className="fixed top-16 left-0 right-0 z-40 w-full border-b border-white/5 bg-[#0a0f1a]/80 backdrop-blur-xl transition-all">
        <div className="w-full px-4 md:px-10 py-4 flex flex-col lg:flex-row justify-between items-center gap-6 border-t-6 border-t-slate-900">
          <div className="items-center gap-4 min-w-max hidden lg:flex">
            <div className="w-10 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Navigation className="text-slate-900 fill-slate-900" size={20} />
            </div>
            <h1 className="text-xl font-black tracking-tighter italic">SUVYATRA</h1>
          </div>

          <div className="flex-1 max-w-2xl w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Where to?"
              className="w-full bg-[#111827] border border-white/10 rounded-2xl py-3 pl-12 pr-12 text-sm focus:border-emerald-500/50 outline-none transition-all"
            />
            {searchQuery && (
              <X onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 cursor-pointer" size={16} />
            )}
          </div>

          <div className="flex gap-2 p-1 bg-[#111827] rounded-xl border border-white/5">
            {["all", "ac", "deluxe"].map((type) => (
              <button
                key={type}
                onClick={() => setActiveFilter(type)}
                className={`px-6 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${
                  activeFilter === type ? "bg-emerald-500 text-slate-900 shadow-md" : "text-slate-500 hover:text-white"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT 
          `pt-52`: (Navbar 80px + Header 80px + extra spacing).
          Adjust padding-top based on your specific layout.
      */}
      <main className="w-full px-4 md:px-10 pt-52 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              Available Buses
              <span className="text-xs font-bold bg-white/5 border border-white/10 px-3 py-1 rounded-full text-emerald-500">
                {filteredBuses.length} Fleet
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-3 text-slate-400 bg-[#111827] px-4 py-2 rounded-xl border border-white/5">
            <Filter size={14} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest">Sort: Best Match</span>
          </div>
        </div>

        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
              <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Loading Fleet...</p>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
            >
              {filteredBuses.map((bus: any, index: number) => (
                <BusCard key={`${bus._id}-${index}`} bus={bus} index={index} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {!loading && filteredBuses.length === 0 && (
          <div className="w-full py-32 text-center border border-dashed border-white/10 rounded-[40px] bg-white/[0.01]">
            <Search size={40} className="mx-auto text-slate-800 mb-4" />
            <h3 className="text-lg font-bold text-slate-500">No results found</h3>
            <button onClick={() => { setSearchQuery(""); setActiveFilter("all"); }} className="mt-2 text-emerald-500 text-sm font-bold">Clear All</button>
          </div>
        )}
      </main>
    </div>
  );
}
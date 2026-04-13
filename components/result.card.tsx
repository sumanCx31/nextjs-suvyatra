// components/result.card.tsx
import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, ChevronRight, Bus } from 'lucide-react';

export default function BusResultCard({ bus }: { bus: any }) {
  const availableSeats = bus.seats?.filter((s: any) => !s.isBooked).length || 0;
  
  // Format the date and day name
  const tripDate = bus.date ? new Date(bus.date).toISOString().split('T')[0].replace(/-/g, '/') : "N/A";
  const dayName = bus.date 
    ? new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date(bus.date)) 
    : "";

  return (
    <div className="group w-full bg-[#111827] p-6 md:p-8 rounded-[2.5rem] border border-white/5 shadow-2xl hover:border-emerald-500/30 transition-all duration-500 relative overflow-hidden">
      
      {/* Subtle Background Glow on Hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px] group-hover:bg-emerald-500/10 transition-colors" />

      <div className="flex flex-col lg:flex-row justify-between items-center gap-8 relative z-10">
        
        {/* SECTION 1: VEHICLE & DATE INFO */}
        <div className="flex flex-col gap-4 w-full lg:w-1/4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Bus className="text-emerald-500" size={20} />
            </div>
            <div>
              <span className="text-emerald-500 font-black text-[10px] uppercase tracking-widest block leading-none">
                {bus.bus?.name || "Premium SUV"}
              </span>
              <span className="text-slate-500 text-[10px] font-mono uppercase">{bus.bus?.busNumber}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <Calendar size={16} className="text-slate-600" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white! uppercase">{tripDate}</span>
              <span className="text-[10px] font-medium text-emerald-600 uppercase tracking-tighter">{dayName}</span>
            </div>
          </div>
        </div>

        {/* SECTION 2: ROUTE VISUALIZER */}
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between gap-4">
            {/* Departure */}
            <div className="text-left">
              <div className="flex items-center gap-1 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                <MapPin size={10} /> {bus.from}
              </div>
              <p className="text-2xl font-black text-white">{bus.departureTime}</p>
            </div>

            {/* Path */}
            <div className="flex-1 flex flex-col items-center px-4">
              <div className="w-full h-[2px] bg-slate-800 relative">
                <div className="absolute -top-1 left-0 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                <div className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-slate-700" />
                {/* Animated Line */}
                <div className="absolute top-0 left-0 h-full bg-emerald-500 w-0 group-hover:w-full transition-all duration-1000" />
              </div>
              <span className="text-[9px] text-slate-600 font-bold uppercase mt-2 tracking-widest">SUV YATRA</span>
            </div>

            {/* Arrival */}
            <div className="text-right">
              <div className="flex items-center justify-end gap-1 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                {bus.to} <MapPin size={10} />
              </div>
              <p className="text-2xl font-black text-white">{bus.arrivalTime || "TBD"}</p>
            </div>
          </div>
        </div>

        {/* SECTION 3: PRICING & ACTION */}
        <div className="w-full lg:w-1/4 flex lg:flex-col items-center lg:items-end justify-between lg:justify-center border-t lg:border-t-0 lg:border-l border-white/5 pt-6 lg:pt-0 lg:pl-8 gap-4">
          <div className="text-left lg:text-right">
            <p className="text-3xl font-black text-white leading-none">Rs. {bus.price}</p>
            <p className={`text-[10px] font-bold mt-1 uppercase tracking-tighter ${availableSeats > 0 ? "text-emerald-500" : "text-red-500"}`}>
              {availableSeats > 0 ? `${availableSeats} Seats Available` : "Fully Booked"}
            </p>
          </div>

          <Link 
            href={`/search-bus/${bus._id}/select-seats`}
            className={`flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all
              ${availableSeats > 0 
                ? "bg-emerald-500 text-[#060910] hover:bg-emerald-400 active:scale-95 shadow-lg shadow-emerald-500/10" 
                : "bg-slate-800 text-slate-500 cursor-not-allowed opacity-50"}`}
          >
            {availableSeats > 0 ? (
              <>
                Select Seats <ChevronRight size={16} />
              </>
            ) : "Sold Out"}
          </Link>
        </div>
      </div>
    </div>
  );
}
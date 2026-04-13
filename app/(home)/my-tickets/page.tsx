"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/auth.context";
import { 
  Ticket, 
  Calendar, 
  User, 
  Armchair, 
  CreditCard, 
  Loader2, 
  ArrowLeft 
} from "lucide-react";
import { useRouter } from "next/navigation";
import authService from "@/services/auth.service";

export default function MyTicketsPage() {
  const { loggedInUser } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!loggedInUser?._id) return;
      try {
        const userId = loggedInUser._id;
        const response = await authService.getRequest("order/ticket/" + userId);
        
        // Ensure data is an array
        const rawData = Array.isArray(response.data) ? response.data : [response.data];
        
        // FILTER: Remove tickets where trip is null to prevent UI breakage
        const validTickets = rawData.filter(ticket => ticket && ticket.trip !== null);
        
        setTickets(validTickets);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [loggedInUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060910] flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060910] text-white pt-28 pb-20 px-4 md:px-10">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-emerald-500 mb-8 transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Back</span>
        </button>

        <h1 className="text-4xl font-black italic tracking-tighter mb-10">
          YOUR <span className="text-emerald-500">BOOKINGS</span>
        </h1>

        {tickets.length === 0 ? (
          <div className="text-center py-20 bg-[#111827] rounded-[2rem] border border-dashed border-white/10">
            <Ticket size={48} className="mx-auto text-slate-700 mb-4" />
            <p className="text-slate-500 font-bold">No active tickets found.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {tickets.map((ticket) => (
              <div key={ticket._id} className="relative group">
                {/* TICKET MAIN BODY */}
                <div className="bg-[#111827] rounded-[2.5rem] overflow-hidden border border-white/5 flex flex-col md:flex-row shadow-2xl">
                  
                  {/* Left Side: Trip Details */}
                  <div className="flex-1 p-8 border-b md:border-b-0 md:border-r border-dashed border-white/10">
                    <div className="flex justify-between items-start mb-8">
                      <div className="px-3 py-1 bg-emerald-500 text-[#060910] rounded-full text-[10px] font-black uppercase tracking-widest">
                        Confirmed
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">
                        ID: {ticket._id?.slice(-8).toUpperCase()} - {ticket.seats?.length || 0} Seat(s)
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Departure</p>
                        <h2 className="text-2xl font-black capitalize">{ticket.trip?.from ?? "N/A"}</h2>
                      </div>
                      <div className="flex-1 px-4 flex flex-col items-center">
                        <div className="w-full h-px bg-slate-800 relative">
                          <div className="absolute -top-1 left-1/2 -translate-x-1/2 bg-[#111827] px-2">
                             <Ticket size={14} className="text-emerald-500" />
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Destination</p>
                        <h2 className="text-2xl font-black capitalize">{ticket.trip?.to ?? "N/A"}</h2>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="flex items-center gap-3">
                        <Calendar size={18} className="text-emerald-500" />
                        <div>
                          <p className="text-[9px] font-bold text-slate-500 uppercase">Date</p>
                          <p className="text-sm font-bold">
                            {ticket.trip?.date ? new Date(ticket.trip.date).toLocaleDateString() : "Pending"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Armchair size={18} className="text-emerald-500" />
                        <div>
                          <p className="text-[9px] font-bold text-slate-500 uppercase">Seats</p>
                          <p className="text-sm font-bold">{ticket.seats?.join(", ") ?? "None"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <User size={18} className="text-emerald-500" />
                        <div>
                          <p className="text-[9px] font-bold text-slate-500 uppercase">Passenger</p>
                          <p className="text-sm font-bold truncate max-w-30">{ticket.user?.name ?? "Guest"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <CreditCard size={18} className="text-emerald-500" />
                        <div>
                          <p className="text-[9px] font-bold text-slate-500 uppercase">Paid via</p>
                          <p className="text-sm font-bold uppercase">{ticket.paymentMethod ?? "Unknown"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Price Stubs */}
                  <div className="w-full md:w-48 bg-[#1A1F2B]/50 p-8 flex flex-col items-center justify-center gap-4 relative">
                    <div className="hidden md:block absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#060910] rounded-full border-r border-white/5" />
                    <div className="text-center">
                      <p className="text-[10px] font-black text-slate-500 uppercase">Total Paid</p>
                      <p className="text-xl font-black text-emerald-500">Rs.{ticket.totalAmount ?? 0}</p>
                    </div>
                  </div>
                </div>

                {/* Background Decoration */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-transparent rounded-[2.6rem] blur opacity-0 group-hover:opacity-100 transition duration-500 -z-10" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
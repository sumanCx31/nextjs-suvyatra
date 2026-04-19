"use client";

import  { useEffect, useState } from "react";
import { useAuth } from "@/context/auth.context";
import {
  Ticket,
  Calendar,
  User,
  Mail,
  Armchair,
  CreditCard,
  Loader2,
  ArrowLeft,
  X,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import authService from "@/services/auth.service";

export default function MyTicketsPage() {
  const { loggedInUser } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterDate, setFilterDate] = useState<string>("");

  useEffect(() => {
    const fetchTickets = async () => {
      if (!loggedInUser?._id) return;
      try {
        const userId = loggedInUser._id;
        const response = await authService.getRequest("order/ticket/" + userId);
        const rawData = Array.isArray(response.data)
          ? response.data
          : [response.data];
        const validTickets = rawData.filter(
          (ticket) => ticket && ticket.trip !== null,
        );
        setTickets(validTickets);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [loggedInUser]);

  const filteredTickets = tickets.filter((ticket) => {
    if (!filterDate) return true;
    const tripDate = new Date(ticket.trip?.date).toISOString().split("T")[0];
    return tripDate === filterDate;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060910] flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060910] text-white pt-28 pb-20 px-4 md:px-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-500 hover:text-emerald-500 transition-colors group mb-4"
            >
              <ArrowLeft
                size={18}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span className="text-xs font-black uppercase tracking-widest">
                Return Home
              </span>
            </button>
            <h1 className="text-4xl font-black italic tracking-tighter">
              MY <span className="text-emerald-500">TRIPS</span>
            </h1>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
              Filter by Journey Date
            </span>
            <div className="relative flex items-center gap-3 bg-[#111827] border border-white/5 p-3 pr-5 rounded-2xl shadow-xl">
              <Calendar size={18} className="ml-1 text-emerald-500" />
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="bg-transparent text-xs font-bold uppercase outline-none text-slate-200 [color-scheme:dark] cursor-pointer"
              />
              {filterDate && (
                <button
                  onClick={() => setFilterDate("")}
                  className="text-slate-500 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <div className="space-y-10">
          {filteredTickets.length === 0 ? (
            <div className="text-center py-24 bg-[#111827]/50 rounded-[3rem] border border-dashed border-white/10">
              <Ticket
                size={50}
                className="mx-auto text-slate-800 mb-4 opacity-50"
              />
              <p className="text-slate-500 font-bold">
                No bookings found for the selected date.
              </p>
            </div>
          ) : (
            filteredTickets.map((ticket) => (
              <div key={ticket._id} className="relative group">
                <div className="bg-[#111827] rounded-[2.5rem] overflow-hidden border border-white/10 flex flex-col lg:flex-row shadow-2xl transition-all duration-500 group-hover:border-emerald-500/30">
                  <div className="flex-1 p-8 border-b lg:border-b-0 lg:border-r border-dashed border-white/10">
                    <div className="flex justify-between items-center mb-8">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[9px] font-black uppercase tracking-widest">
                          Ticket Confirmed
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-mono text-slate-600 uppercase">
                          Order Ref: {ticket._id?.slice(-10)}
                        </p>
                        <div className="flex items-center gap-1.5 justify-end text-blue-400 mt-1">
                          <Clock size={10} />
                          <p className="text-[10px] font-bold">
                            Booked:{" "}
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-10">
                      <div className="w-1/3">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                          Departure
                        </p>
                        <h2 className="text-2xl font-black capitalize truncate">
                          {ticket.trip?.from}
                        </h2>
                      </div>
                      <div className="flex-1 flex flex-col items-center px-4">
                        <div className="w-full h-[2px] bg-slate-800 rounded-full relative">
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#111827] px-2 text-emerald-500">
                            <Ticket size={16} />
                          </div>
                        </div>
                      </div>
                      <div className="w-1/3 text-right">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                          Destination
                        </p>
                        <h2 className="text-2xl font-black capitalize truncate">
                          {ticket.trip?.to}
                        </h2>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-slate-950/40 p-5 rounded-3xl border border-white/5 space-y-3">
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                          Traveler Identity
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="size-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                            <User size={18} />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-sm font-black truncate">
                              {ticket.user?.name || "N/A"}
                            </p>
                            <div className="flex items-center gap-1.5 text-slate-500">
                              <Mail size={10} />
                              <p className="text-[10px] truncate">
                                {ticket.user?.email || "No email linked"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-[9px] font-bold text-slate-500 uppercase">
                            Trip Date
                          </p>
                          <div className="flex items-center gap-2 text-white">
                            <Calendar size={14} className="text-emerald-500" />
                            <p className="text-xs font-black">
                              {new Date(ticket.trip?.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-bold text-slate-500 uppercase">
                            Seat Selection
                          </p>
                          <div className="flex items-center gap-2 text-white">
                            <Armchair size={14} className="text-emerald-500" />
                            <p className="text-xs font-black">
                              {ticket.seats?.join(", ") || "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-bold text-slate-500 uppercase">
                            Payment
                          </p>
                          <div className="flex items-center gap-2 text-white">
                            <CreditCard
                              size={14}
                              className="text-emerald-500"
                            />
                            <p className="text-xs font-black uppercase">
                              {ticket.paymentMethod}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-bold text-slate-500 uppercase">
                            Total Seats
                          </p>
                          <p className="text-xs font-black">
                            {ticket.seats?.length} Units
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-56 bg-[#1A2131]/40 p-8 flex flex-col items-center justify-center relative">
                    <div className="hidden lg:block absolute -left-3 top-0 bottom-0 w-6 flex flex-col justify-around py-4">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 rounded-full bg-[#060910] -ml-3"
                        />
                      ))}
                    </div>

                    <div className="text-center relative z-10">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">
                        Fair Total
                      </p>
                      <p className="text-3xl font-black text-emerald-500 italic tracking-tighter">
                        Rs.{ticket.totalAmount}
                      </p>
                      <div className="mt-4 px-4 py-2 border border-emerald-500/20 rounded-xl bg-emerald-500/5">
                        <p className="text-[8px] font-black text-emerald-400 uppercase">
                          Invoice Paid
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -inset-1 bg-linear-to-r from-emerald-500/10 to-transparent rounded-[2.6rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-500 -z-10" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

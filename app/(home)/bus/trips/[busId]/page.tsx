"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Calendar,
  ChevronRight,
  Loader2,
  Bus,
} from "lucide-react";
import authService from "@/services/auth.service";

export default function BusTripsPage() {
  const { busId } = useParams();
  const router = useRouter();
  const [trips, setTrips] = useState<any[]>([]);
  const [busDetails, setBusDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        const response = await authService.getRequest(
          `trip-update/bus/${busId}`,
        );
        const data = response.data?.data || response.data || [];

        const tripArray = Array.isArray(data) ? data : [data];
        setTrips(tripArray);

        if (tripArray.length > 0) {
          // Setting bus details from the first trip's busId object
          setBusDetails(tripArray[0].busId);
        }
      } catch (error) {
        console.error("Error fetching trips:", error);
      } finally {
        setLoading(false);
      }
    };

    if (busId) fetchTrips();
  }, [busId]);

  // Handler for navigation
  const handleBooking = (tripId: any) => {
    router.push(`/search-bus/${tripId}/select-seats`);
    //search-bus/69c69383c51e2ba3314ecd7a/select-seats
  };

  return (
    <div className="min-h-screen bg-[#060910] text-white pt-28 pb-10 px-4 md:px-10">
      {/* HEADER */}
      <div className="max-w-5xl mx-auto mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-emerald-500 transition-colors mb-6 group"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-sm font-bold uppercase tracking-widest">
            Back to Fleet
          </span>
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-[#111827] p-8 rounded-[2rem] border border-white/5 shadow-2xl">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Bus className="text-emerald-500" size={24} />
              <span className="text-emerald-500 font-black text-xs uppercase tracking-[0.3em]">
                Schedule for
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter capitalize">
              {busDetails?.name || "Loading Bus..."}
            </h1>
            <p className="text-slate-500 font-mono mt-1 uppercase text-sm">
              {busDetails?.busNumber || "N/A"}
            </p>
          </div>
          <div className="text-right hidden md:block">
            <span className="text-slate-600 text-[10px] font-black uppercase block mb-1">
              Total Trips Found
            </span>
            <span className="text-3xl font-black text-white">
              {trips.length}
            </span>
          </div>
        </div>
      </div>

      {/* TRIPS LIST */}
      <div className="max-w-5xl mx-auto space-y-6">
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest">
                Syncing Schedules...
              </p>
            </div>
          ) : trips.length > 0 ? (
            trips.map((trip, index) => (
              <motion.div
                key={trip._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#0a0f1a] border border-white/5 rounded-3xl p-6 md:p-8 hover:border-emerald-500/30 transition-all group"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* DATE & TIME */}
                  <div className="lg:col-span-3 flex flex-col gap-2">
                    <div className="flex items-center gap-3 text-slate-400">
                      <Calendar size={18} className="text-emerald-500" />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold uppercase tracking-wide">
                          {trip.date
                            ? new Date(trip.date)
                                .toISOString()
                                .split("T")[0]
                                .replace(/-/g, "/")
                            : "No Date"}
                        </span>
                        <span className="text-[10px] font-medium text-emerald-600 uppercase">
                          {trip.date
                            ? new Intl.DateTimeFormat("en-US", {
                                weekday: "long",
                              }).format(new Date(trip.date))
                            : "Unknown Day"}
                        </span>
                      </div>
                    </div>
                    <div className="text-3xl font-black text-white mt-1 group-hover:text-emerald-400 transition-colors">
                      {trip.departureTime || "05:30 PM"}
                    </div>
                  </div>

                  {/* ROUTE VISUALIZER */}
                  <div className="lg:col-span-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">
                          From
                        </span>
                        <span className="text-lg font-bold text-white">
                          {trip.from || "N/A"}
                        </span>
                      </div>

                      <div className="flex-1 flex flex-col items-center px-4">
                        <div className="w-full h-[2px] bg-slate-800 relative">
                          <div className="absolute -top-1 left-0 w-2 h-2 rounded-full bg-emerald-500" />
                          <div className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-slate-500" />
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                            className="absolute top-0 left-0 h-full bg-emerald-500 shadow-[0_0_8px_#10b981]"
                          />
                        </div>
                        <span className="text-[9px] text-slate-600 font-bold uppercase mt-2">
                          Route Map
                        </span>
                      </div>

                      <div className="flex flex-col items-end text-right">
                        <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">
                          To
                        </span>
                        <span className="text-lg font-bold text-white">
                          {trip.to || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ACTION & PRICE */}
                  <div className="lg:col-span-3 flex items-center justify-between lg:justify-end lg:gap-8 border-t lg:border-t-0 border-white/5 pt-6 lg:pt-0">
                    <div className="text-right">
                      <p className="text-2xl font-black text-emerald-500 leading-none">
                        रू{trip.price || "1500"}
                      </p>
                      <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">
                        {trip.seats
                          ? `Available: ${trip.seats.filter((s: any) => !s.isBooked).length}`
                          : "Check Seats"}
                      </p>
                    </div>
                    <button
                      onClick={() => handleBooking(trip._id)}
                      className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-[#060910] px-6 py-4 rounded-2xl transition-all active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.2)] group/btn"
                    >
                      <span className="text-xs font-black uppercase tracking-tighter">
                        Book Now
                      </span>
                      <ChevronRight
                        size={20}
                        className="group-hover/btn:translate-x-1 transition-transform"
                      />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20 bg-[#111827] rounded-[3rem] border-2 border-dashed border-white/5">
              <Clock size={48} className="mx-auto text-slate-800 mb-4" />
              <h3 className="text-xl font-bold text-slate-500 uppercase tracking-widest">
                No active trips scheduled
              </h3>
              <p className="text-slate-600 mt-2">
                Please check back later for new dates.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

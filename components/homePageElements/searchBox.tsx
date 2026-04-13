"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { MapPin, Navigation, Calendar, Search, Loader2 } from "lucide-react";
import searchService from "@/services/search.service";
import { useSearchStore } from "@/store/useSearchStore";
import { toast } from "sonner";
import { 
  Tag, 
  Copy, 
  CheckCircle2, 
  Gift, 
  Clock, 
  Zap, 
  ChevronRight, 
  TicketPercent 
} from "lucide-react";
import { PromoSection } from "./promoSection";

const offers = [
  {
    id: 1,
    title: "Launch Celebration",
    description: "Get a flat discount on your first remote SUV booking. Welcome to the future of travel.",
    discount: "20% OFF",
    code: "YATRA2026",
    expiry: "Valid until April 30",
    type: "New User",
    color: "from-emerald-500 to-teal-600"
  },
  {
    id: 2,
    title: "Group Adventure",
    description: "Traveling with friends? Book 4 or more seats and get a massive rebate instantly.",
    discount: "Rs. 500 BACK",
    code: "SQUADGOALS",
    expiry: "Limited Time Offer",
    type: "Group Booking",
    color: "from-blue-600 to-indigo-700"
  },
  {
    id: 3,
    title: "Night Rider Deal",
    description: "Special rates for all SUV departures scheduled between 8:00 PM and 4:00 AM.",
    discount: "10% OFF",
    code: "NIGHTOWL",
    expiry: "Daily Offer",
    type: "Timed Deal",
    color: "from-purple-600 to-pink-600"
  }
];

const ProfessionalSearch = () => {
  const router = useRouter();
  const setResults = useSearchStore((state) => state.results); // Assuming you have a results array in store
  const setStoreResults = useSearchStore((state) => state.setResults);

  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: "", // <input type="date"> gives "YYYY-MM-DD"
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSearch = async () => {
    // 1. Validation
    if (!formData.from || !formData.to || !formData.date) {
      toast.error("Please fill all search details");
      return;
    }

    setLoading(true);
    try {
      /**
       * CRITICAL CORRECTION: 
       * We are sending the raw string from the input (e.g., "2026-03-17")
       * to match the successful Postman request exactly.
       */
      const payload = {
        from: formData.from.trim(),
        to: formData.to.trim(),
        date: formData.date, // Sending "YYYY-MM-DD" directly
      };

      console.log("Requesting with Payload:", payload);

      const response = await searchService.postRequest("/search", payload);
      
      // Access the nested data array from your specific JSON response structure
      const busList = response.data?.data || response.data || [];

      if (busList.length === 0) {
        toast.error("No Bus found on this date or route!!");
        return;
      }

      // 2. Update Zustand Store & SessionStorage for persistence
      setStoreResults(busList);
      sessionStorage.setItem("bus_results", JSON.stringify(busList));

      // 3. Navigate to Results Page with Query Params
      const slug = `${formData.from}-to-${formData.to}`
        .toLowerCase()
        .replace(/\s+/g, "-");

      router.push(
        `/route-result/${slug}?from=${formData.from}&to=${formData.to}&date=${formData.date}`
      );
      
    } catch (error: any) {
      // console.error("Search failed:", error);
      // Backend returns { status: 404, message: "Not found trip..." }
      // const errorMsg = error.response?.data?.message || "No trips available for this selection.";
      toast.error("Sorry, No trips available for this selection.");
    } finally {
      setLoading(false);
    }
  };
const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <>
    <div className="w-full p-6 md:p-10 bg-transparent flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl relative flex flex-col lg:flex-row items-center gap-2 p-3 
                   bg-slate-900/80 backdrop-blur-2xl border border-white/10 
                   rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      >
        {/* FROM FIELD */}
        <div className="w-full flex-1 px-6 py-3 border-b lg:border-b-0 lg:border-r border-white/10">
          <label className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">
            <MapPin size={14} className="text-blue-500" /> From
          </label>
          <input
            suppressHydrationWarning
            type="text"
            name="from"
            autoComplete="off"
            value={formData.from}
            onChange={handleChange}
            placeholder="Origin City"
            className="w-full bg-transparent border-none outline-none text-white text-lg placeholder:text-white/20 focus:ring-0"
          />
        </div>

        {/* TO FIELD */}
        <div className="w-full flex-1 px-6 py-3 border-b lg:border-b-0 lg:border-r border-white/10">
          <label className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-1">
            <Navigation size={14} className="text-emerald-500" /> To
          </label>
          <input
            suppressHydrationWarning
            type="text"
            name="to"
            autoComplete="off"
            value={formData.to}
            onChange={handleChange}
            placeholder="Destination"
            className="w-full bg-transparent border-none outline-none text-white text-lg placeholder:text-white/20 focus:ring-0"
          />
        </div>

        {/* DATE FIELD */}
        <div className="w-full flex-1 px-6 py-3">
          <label className="flex items-center gap-2 text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] mb-1">
            <Calendar size={14} className="text-purple-500" /> Date
          </label>
          <input
            suppressHydrationWarning
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full bg-transparent border-none outline-none text-white text-lg scheme-dark cursor-pointer focus:ring-0"
          />
        </div>

        {/* SEARCH BUTTON */}
        <motion.button
          suppressHydrationWarning
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSearch}
          disabled={loading}
          type="button"
          className="w-full lg:w-auto h-16 px-14 bg-emerald-500 text-slate-900 font-black rounded-2xl 
                     transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Loader2 className="animate-spin" size={20} />
                <span>FINDING...</span>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Search size={22} strokeWidth={3} />
                <span>SEARCH</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>
    </div>
    
    <div>
      <PromoSection />
    </div>
    </>
  );
};

export default ProfessionalSearch;
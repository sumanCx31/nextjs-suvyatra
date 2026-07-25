"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { MapPin, Navigation, Calendar, Search, Loader2 } from "lucide-react";
import searchService from "@/services/search.service";
import { useSearchStore } from "@/store/useSearchStore";
import { toast } from "sonner";
import { PromoSection } from "./promoSection";
import { cities } from "@/components/cities";

const ProfessionalSearch = () => {
  const router = useRouter();
  const setResults = useSearchStore((state) => state.results); 
  const setStoreResults = useSearchStore((state) => state.setResults);

  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: "", 
  });

  const [loading, setLoading] = useState(false);
  const [fromSuggestions, setFromSuggestions] = useState<string[]>([]);
  const [toSuggestions, setToSuggestions] = useState<string[]>([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fromRef.current && !fromRef.current.contains(event.target as Node)) {
        setShowFromDropdown(false);
      }
      if (toRef.current && !toRef.current.contains(event.target as Node)) {
        setShowToDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "from") {
      if (value.trim() === "") {
        setFromSuggestions([]);
        setShowFromDropdown(false);
      } else {
        const filtered = cities.filter((city) =>
          city.toLowerCase().includes(value.toLowerCase())
        );
        setFromSuggestions(filtered);
        setShowFromDropdown(true);
      }
    } else if (name === "to") {
      if (value.trim() === "") {
        setToSuggestions([]);
        setShowToDropdown(false);
      } else {
        const filtered = cities.filter((city) =>
          city.toLowerCase().includes(value.toLowerCase())
        );
        setToSuggestions(filtered);
        setShowToDropdown(true);
      }
    }
  };

  const handleSelectLocation = (field: "from" | "to", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (field === "from") {
      setShowFromDropdown(false);
    } else {
      setShowToDropdown(false);
    }
  };

  const handleSearch = async () => {
    if (!formData.from || !formData.to || !formData.date) {
      toast.error("Please fill all search details");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        from: formData.from.trim(),
        to: formData.to.trim(),
        date: formData.date,
      };

      const response = await searchService.postRequest("/search", payload);
      const busList = response.data?.data || response.data || [];

      if (busList.length === 0) {
        toast.error("No Bus found on this date or route!!");
        return;
      }

      setStoreResults(busList);
      sessionStorage.setItem("bus_results", JSON.stringify(busList));

      const slug = `${formData.from}-to-${formData.to}`
        .toLowerCase()
        .replace(/\s+/g, "-");

      router.push(
        `/route-result/${slug}?from=${formData.from}&to=${formData.to}&date=${formData.date}`
      );
      
    } catch (error: any) {
      toast.error("Sorry, No trips available for this selection.");
    } finally {
      setLoading(false);
    }
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
        <div ref={fromRef} className="w-full flex-1 px-6 py-3 border-b lg:border-b-0 lg:border-r border-white/10 relative">
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
            onFocus={() => {
              if (formData.from.trim() && cities.length > 0) {
                setShowFromDropdown(true);
              }
            }}
            placeholder="Origin City"
            className="w-full bg-transparent border-none outline-none text-white text-lg placeholder:text-white/20 focus:ring-0"
          />
          {showFromDropdown && fromSuggestions.length > 0 && (
            <ul className="absolute left-6 right-6 top-full mt-2 bg-slate-900 border border-white/10 rounded-2xl max-h-48 overflow-y-auto z-50 shadow-xl divide-y divide-white/5">
              {fromSuggestions.map((city, idx) => (
                <li
                  key={idx}
                  onClick={() => handleSelectLocation("from", city)}
                  className="px-4 py-3 text-sm text-slate-200 hover:bg-emerald-500/10 hover:text-emerald-400 cursor-pointer transition-colors"
                >
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div ref={toRef} className="w-full flex-1 px-6 py-3 border-b lg:border-b-0 lg:border-r border-white/10 relative">
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
            onFocus={() => {
              if (formData.to.trim() && cities.length > 0) {
                setShowToDropdown(true);
              }
            }}
            placeholder="Destination"
            className="w-full bg-transparent border-none outline-none text-white text-lg placeholder:text-white/20 focus:ring-0"
          />
          {showToDropdown && toSuggestions.length > 0 && (
            <ul className="absolute left-6 right-6 top-full mt-2 bg-slate-900 border border-white/10 rounded-2xl max-h-48 overflow-y-auto z-50 shadow-xl divide-y divide-white/5">
              {toSuggestions.map((city, idx) => (
                <li
                  key={idx}
                  onClick={() => handleSelectLocation("to", city)}
                  className="px-4 py-3 text-sm text-slate-200 hover:bg-emerald-500/10 hover:text-emerald-400 cursor-pointer transition-colors"
                >
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>

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
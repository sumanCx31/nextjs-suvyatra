"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TicketPercent, 
  Clock, 
  CheckCircle2, 
  Copy, 
  Loader2, 
  Gift 
} from "lucide-react";
import authService from "@/services/auth.service";

interface Promo {
  _id: string;
  code: string;
  discountPercentage: number;
  minAmount: number;
  maxDiscount: number;
  expiryDate: string;
  isActive: boolean;
  title?: string;
  description?: string;
}

export const PromoSection: React.FC = () => {
  const [promoLoading, setPromoLoading] = useState<boolean>(true);
  const [promos, setPromos] = useState<Promo[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const response = await authService.getRequest("/offers");
        const promoList: Promo[] = response.data || [];
        setPromos(promoList);
      } catch (error) {
        console.error("Promo fetch error:", error);
      } finally {
        setPromoLoading(false);
      }
    };
    fetchPromos();
  }, []);

  const copyToClipboard = (code: string): void => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (promoLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
        <p className="text-slate-500 font-bold text-[10px] tracking-widest uppercase text-center">
          Loading SuvYatra Deals...
        </p>
      </div>
    );
  }

  return (
    /* UPDATED: Changed to max-w-7xl and reduced horizontal padding for a wider look */
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <header className="text-center mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
          <Gift size={12} /> Live Offers
        </div>
        <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white">
          PROMO <span className="text-emerald-500">ZONE.</span>
        </h2>
      </header>

      {/* UPDATED: Added xl:grid-cols-4 to fill the wider space effectively */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {promos
          .filter((p) => p.isActive)
          .map((promo, idx) => (
            <motion.div
              key={promo._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-[#0F172A] border border-white/5 rounded-[2rem] overflow-hidden flex flex-col h-full hover:border-emerald-500/30 transition-all shadow-xl group"
            >
              <div className="h-28 bg-gradient-to-br from-emerald-500 to-teal-700 p-6 flex items-center justify-between">
                <div className="bg-black/20 backdrop-blur-md p-2.5 rounded-xl text-white">
                  <TicketPercent size={28} />
                </div>
                <div className="text-right text-white">
                  <p className="text-[8px] font-black uppercase tracking-widest opacity-70">Discount</p>
                  <h3 className="text-2xl font-black italic">{promo.discountPercentage}% OFF</h3>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h4 className="text-lg font-black mb-2 uppercase text-white truncate">
                  {promo.title || "Special Offer"}
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed mb-6 flex-1 line-clamp-3">
                  {promo.description || `Save ${promo.discountPercentage}% on your journey. Min booking: Rs. ${promo.minAmount}.`}
                </p>

                <div className="flex items-center gap-2 text-slate-500 text-[9px] font-bold uppercase mb-4">
                  <Clock size={10} className="text-emerald-500" /> 
                  Expires: {formatDate(promo.expiryDate)}
                </div>

                <button 
                  onClick={() => copyToClipboard(promo.code)}
                  className="w-full py-3.5 bg-slate-900 border border-white/5 rounded-xl flex items-center justify-between px-5 hover:bg-slate-800 transition-all active:scale-95 group/btn"
                >
                  <div className="flex flex-col items-start text-left">
                    <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Tap to Copy</span>
                    <span className="text-md font-black font-mono text-emerald-500 tracking-wider">
                      {promo.code}
                    </span>
                  </div>
                  
                  <AnimatePresence mode="wait">
                    {copiedCode === promo.code ? (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-emerald-500">
                        <CheckCircle2 size={16} />
                      </motion.div>
                    ) : (
                      <div className="text-slate-600 group-hover/btn:text-white transition-colors">
                        <Copy size={16} />
                      </div>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </motion.div>
          ))}
      </div>
    </section>
  );
};
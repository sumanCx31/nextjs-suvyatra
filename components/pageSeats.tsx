"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Armchair, ShipWheel, CheckCircle2, ArrowLeft, Loader2, Tag, X } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "@/context/auth.context";
import authService from "@/services/auth.service";

interface PageSeatProps {
  initialData: {
    _id: string;
    from: string;
    to: string;
    price: number;
    departureTime: string;
    bus: {
      name: string;
      busNumber: string;
    };
    seats: Array<{
      seatNumber: string;
      isBooked: boolean;
      _id: string;
    }>;
  };
}

const PageSeat: React.FC<PageSeatProps> = ({ initialData }) => {
  const { loggedInUser } = useAuth();
  const router = useRouter();
  
  // --- STATES ---
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Promo States
  const [promoCode, setPromoCode] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);

  // --- CALCULATION LOGIC ---
  const subTotal = selectedSeats.length * initialData.price;
  const discountAmount = appliedPromo ? (subTotal * appliedPromo.discount) / 100 : 0;
  const finalTotal = subTotal - discountAmount;

  // --- HANDLERS ---
  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    
    setIsApplyingPromo(true);
    try {
      const response = await authService.getRequest("/offers");
      const promos = response.data || [];
      
      const foundPromo = promos.find(
        (p: any) => p.code.toLowerCase() === promoCode.toLowerCase() && p.isActive
      );

      if (foundPromo) {
        setAppliedPromo({
          code: foundPromo.code,
          discount: foundPromo.discountPercentage,
        });
        toast.success(`Code applied! ${foundPromo.discountPercentage}% discount added.`);
      } else {
        toast.error("Invalid or expired promo code.");
      }
    } catch (error) {
      toast.error("Could not validate promo code.");
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
  };

  const handleProceed = async () => {
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat.");
      return;
    }

    if (!loggedInUser?._id) {
      toast.error("Please login to proceed with booking.");
      return;
    }

    setLoading(true);

    try {
      // 1. Initialize payload with REQUIRED fields only
      const payload: any = {
        user: loggedInUser._id,
        trip: initialData._id,
        seats: selectedSeats,
        paymentMethod: "khalti",
      };

      // 2. DYNAMICALLY add promoCode ONLY if applied.
      // This prevents sending "null", which was causing your validation error.
      if (appliedPromo && appliedPromo.code) {
        payload.promoCode = appliedPromo.code;
      }

      const response = await axios.post(
        "http://localhost:9005/api/v1/order",
        payload
      );

      if (response.data?.data?._id) {
        const orderId = response.data.data._id;
        toast.success("Order confirmed!");
        router.push(`/checkout/${orderId}?method=khalti`);
      }
    } catch (error: any) {
      console.error("Booking Error:", error.response?.data);
      // Detailed error reporting for debugging
      const errorMessage = error.response?.data?.error?.promoCode 
        ? "Promo code error: " + error.response.data.error.promoCode
        : error.response?.data?.message || "Booking failed. Please try again.";
        
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleSeat = (id: string) => {
    setSelectedSeats((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const checkIsBooked = (seatNo: string) => {
    const seat = initialData.seats.find((s) => s.seatNumber === seatNo);
    return seat ? seat.isBooked : true;
  };

  const Seat = ({ id }: { id: string }) => {
    const isBooked = checkIsBooked(id);
    const isSelected = selectedSeats.includes(id);

    return (
      <button
        type="button"
        disabled={isBooked || loading}
        onClick={() => toggleSeat(id)}
        className={`group relative w-12 h-14 rounded-t-xl rounded-b-md border-b-4 flex items-center justify-center transition-all active:scale-95
          ${isBooked ? "bg-slate-100 border-slate-200 cursor-not-allowed opacity-40"
            : isSelected ? "bg-emerald-500 border-emerald-700 text-white shadow-lg -translate-y-1"
            : "bg-white border-slate-200 hover:border-emerald-400 hover:text-emerald-600 text-slate-400"
          }`}
      >
        <Armchair size={22} fill={isSelected ? "currentColor" : "none"} />
        <span className={`absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-bold px-1.5 rounded-full border shadow-sm
          ${isSelected ? "bg-emerald-600 text-white border-emerald-700" : "bg-white text-slate-500 border-slate-200"}`}
        >
          {id}
        </span>
      </button>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row pt-24 pb-12 bg-[#F8FAFC] p-4 md:px-10 gap-8 justify-center items-start">
      
      {/* BUS VISUALIZER */}
      <div className="w-full max-w-105 bg-white rounded-[40px] shadow-2xl border-12 border-slate-50 overflow-hidden">
        <div className="bg-slate-50 p-6 border-b border-dashed border-slate-200 text-slate-900">
          <button onClick={() => router.back()} className="mb-4 flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase hover:text-emerald-500 transition-colors">
            <ArrowLeft size={14} /> Back to results
          </button>
          <div className="flex justify-between items-center">
            <div className="flex flex-col items-center opacity-30">
              <ShipWheel size={32} />
              <span className="text-[9px] font-black mt-1 uppercase tracking-widest">Pilot</span>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{initialData.bus.busNumber}</div>
              <div className="text-sm font-black leading-tight">{initialData.bus.name}</div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="space-y-5">
            {[...Array(8)].map((_, i) => {
              const row = i + 1;
              return (
                <div key={i} className="flex justify-between items-center group">
                  <div className="flex gap-4">
                    <Seat id={`A${row}1`} /><Seat id={`A${row}2`} />
                  </div>
                  <span className="text-[10px] font-black text-slate-200">{row}</span>
                  <div className="flex gap-4">
                    <Seat id={`B${row}1`} /><Seat id={`B${row}2`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SUMMARY SIDEBAR */}
      <div className="w-full max-w-100 sticky top-28">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
            SUV <span className="text-emerald-500 font-medium italic">Yatra</span>
          </h2>

          <div className="space-y-6 mt-6">
            {/* Seats Info */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Selected Seats</span>
              <div className="flex gap-1 flex-wrap mt-2 min-h-[30px]">
                {selectedSeats.length > 0 ? (
                  selectedSeats.map((s) => (
                    <span key={s} className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-1 rounded border border-emerald-100">{s}</span>
                  ))
                ) : (
                  <span className="text-slate-300 text-xs italic">Pick your seats</span>
                )}
              </div>
            </div>

            {/* Promo Section */}
            <div className="border-y border-dashed border-slate-100 py-6">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Promo Code</span>
              
              {!appliedPromo ? (
                <div className="mt-2 flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text"
                      placeholder="CODE (OPTIONAL)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-500 uppercase tracking-widest text-slate-900"
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={!promoCode.trim() || isApplyingPromo}
                    className="px-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase hover:bg-emerald-600 transition-colors disabled:opacity-30"
                  >
                    {isApplyingPromo ? <Loader2 className="animate-spin" size={16} /> : "Apply"}
                  </button>
                </div>
              ) : (
                <div className="mt-2 flex items-center justify-between bg-emerald-50 border border-emerald-100 px-4 py-3 rounded-xl">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <CheckCircle2 size={18} />
                    <span className="text-xs font-black uppercase tracking-widest">{appliedPromo.code} Applied</span>
                  </div>
                  <button onClick={removePromo} className="text-emerald-700 hover:text-red-500 transition-colors">
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
                <span>Subtotal</span>
                <span className="text-slate-900">Rs. {subTotal.toLocaleString()}</span>
              </div>
              
              {appliedPromo && (
                <div className="flex justify-between text-xs font-bold text-emerald-500 uppercase">
                  <span>Discount</span>
                  <span>- Rs. {discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Total Fare</span>
                <h3 className="text-2xl font-black text-slate-900">
                  Rs. {finalTotal.toLocaleString()}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={handleProceed}
              disabled={selectedSeats.length === 0 || loading}
              className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-emerald-600 disabled:bg-slate-100 disabled:text-slate-300 transition-all flex items-center justify-center gap-2 group shadow-lg active:shadow-none"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : (
                <>PROCEED TO CHECKOUT <CheckCircle2 size={20} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageSeat;
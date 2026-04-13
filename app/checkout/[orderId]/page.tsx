"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Wallet, CheckCircle2, ArrowLeft, ShieldCheck, Bus, Ticket } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import authService from "@/services/auth.service";

export default function CheckoutPage({ params, searchParams }: any) {
  // 1. Correctly unwrap Promises for Next.js 15
  const resolvedParams: any = use(params);
  const resolvedSearchParams: any = use(searchParams);
  
  const orderId = resolvedParams.orderId;
  const method = resolvedSearchParams.method || "khalti"; // Fix: Access property directly
  
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);

  // 2. Fetch Order Details from Backend
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await authService.getRequest(`order/${orderId}`);
        if (response.data?.data) {
          setOrder(response.data.data);
        }
      } catch (error) {
        console.error("Order Fetch Error:", error);
        toast.error("Could not load order details.");
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchOrder();
  }, [orderId]);

  // 3. Handle Khalti Payment Initiation
  const handlePayment = async () => {
    setIsPaying(true);
    try {
      // POST http://localhost:9005/api/v1/order/payment/:orderId
      const response = await axios.post(
        `http://localhost:9005/api/v1/order/payment/${orderId}`,
        {
          user: order?.user?._id || "69b3e04b39e17d8e68cdd3cb", // Use real ID from fetched order
        }
      );

      const paymentData = response.data;

      if (paymentData.status === "PAYMENT_INITIATE" && paymentData.data?.payment_url) {
        toast.success("Redirecting to Khalti Secure Gateway...");
        // Use replace to prevent back-button loops
        window.location.replace(paymentData.data.payment_url);
      } else {
        throw new Error("Invalid response from payment server");
      }
    } catch (error: any) {
      console.error("Payment Error:", error);
      const msg = error.response?.data?.message || "Payment initiation failed.";
      toast.error(msg);
    } finally {
      setIsPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-emerald-500 mb-2" size={40} />
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
          Securing your session...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-28 pb-20 px-6">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
          
          {/* Header Section */}
          <div className="bg-slate-900 p-10 text-white relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Ticket size={100} strokeWidth={1} />
            </div>
            <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">
              SuvYatra Payment
            </p>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter">
              Confirm & Pay
            </h1>
          </div>

          <div className="p-10 space-y-8">
            {/* Order Details Card */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Bus className="text-slate-600" size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Trip Route</p>
                  <p className="font-bold text-slate-900">{order?.trip?.from} ➔ {order?.trip?.to}</p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Selected Seats</p>
                  <p className="font-black text-emerald-600 text-lg">
                    {order?.seats?.join(", ") || "N/A"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Departure</p>
                  <p className="font-bold text-slate-900">{order?.trip?.departureTime || "07:10 AM"}</p>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="flex justify-between items-center px-2">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Payable</p>
                <h2 className="text-4xl font-black text-slate-900">
                  Rs. {order?.totalAmount?.toLocaleString()}
                </h2>
              </div>
              <div className="flex flex-col items-end">
                <span className="bg-purple-100 text-[#5C2D91] px-3 py-1 rounded-full font-black text-[10px] uppercase border border-purple-200">
                  {method} wallet
                </span>
              </div>
            </div>

            {/* Payment Button */}
            <div className="space-y-4 pt-2">
              <button 
                onClick={handlePayment}
                disabled={isPaying}
                className="w-full h-20 bg-[#5C2D91] hover:bg-[#4c247d] text-white rounded-3xl font-black text-xl shadow-xl shadow-purple-100 transition-all flex items-center justify-center gap-4 group disabled:opacity-70"
              >
                {isPaying ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    PAY WITH KHALTI
                    <CheckCircle2 className="group-hover:scale-110 transition-transform" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <ShieldCheck size={14} className="text-emerald-500" />
                100% Secure Khalti Gateway
              </div>
            </div>
          </div>
        </div>

        {/* Back Navigation */}
        <button 
          onClick={() => router.back()}
          className="mt-8 mx-auto flex items-center gap-2 text-slate-400 font-bold hover:text-slate-900 transition-colors uppercase text-[10px] tracking-[0.2em]"
        >
          <ArrowLeft size={14} /> Change Seat Selection
        </button>
      </div>
    </div>
  );
}
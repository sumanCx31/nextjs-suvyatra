"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { 
  Loader2, 
  Wallet, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowLeft, 
  Bus, 
  MapPin 
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const orderId = params.orderId;
  const paymentMethod = searchParams.get("method") || "khalti";

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [initiatingPayment, setInitiatingPayment] = useState(false);

  // 1. Fetch Order Details on Mount
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // Update this URL if your GET order route is different
        const response = await axios.get(`http://localhost:9005/api/v1/order/${orderId}`);
        if (response.data?.data) {
          setOrder(response.data.data);
        }
      } catch (error: any) {
        console.error("Error fetching order:", error);
        toast.error("Order not found or has expired.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrderDetails();
  }, [orderId]);

  // 2. Handle Khalti Payment Initiation
  const handlePayment = async () => {
    setInitiatingPayment(true);
    try {
      // POST http://localhost:9005/api/v1/order/payment/:orderId
      const response = await axios.post(
        `http://localhost:9005/api/v1/order/payment/${orderId}`,
        {
          user: order?.user?._id || "69b3e04b39e17d8e68cdd3cb", // Use actual ID from order
        }
      );

      const paymentData = response.data;

      if (paymentData.status === "PAYMENT_INITIATE" && paymentData.data?.payment_url) {
        toast.success("Redirecting to Khalti Secure Gateway...");
        
        // Redirect to Khalti (e.g., https://test-pay.khalti.com/...)
        window.location.replace(paymentData.data.payment_url);
      } else {
        throw new Error("Invalid response from payment server");
      }
    } catch (error: any) {
      console.error("Payment Error:", error);
      const msg = error.response?.data?.message || "Failed to initiate payment. Please try again.";
      toast.error(msg);
    } finally {
      setInitiatingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-emerald-500 mb-4" size={40} />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
          Verifying Order Details...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-28 pb-20 px-6">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
          
          {/* TOP SECTION: BRANDING */}
          <div className="bg-slate-900 p-10 text-white relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Wallet size={100} />
            </div>
            <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">
              SuvYatra Checkout
            </p>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">
              Secure Payment
            </h1>
          </div>

          <div className="p-10 space-y-8">
            {/* TRIP SUMMARY CARD */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 space-y-4">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <Bus className="text-emerald-600" size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Bus Fleet</p>
                    <p className="font-black text-slate-900">{order?.trip?.from} ➔ {order?.trip?.to}</p>
                  </div>
               </div>

               <div className="flex justify-between items-center pt-4 border-t border-slate-200/50">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Seats</p>
                    <p className="font-bold text-emerald-600">{order?.seats?.join(", ")}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Departure</p>
                    <p className="font-bold text-slate-900">{order?.trip?.departureTime || '7:10 AM'}</p>
                  </div>
               </div>
            </div>

            {/* PRICING TABLE */}
            <div className="space-y-3 px-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Ticket Base Price</span>
                <span className="font-bold text-slate-900">Rs. {order?.totalAmount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Service Fee</span>
                <span className="text-emerald-500 font-bold uppercase text-[10px] bg-emerald-50 px-2 py-0.5 rounded">Waived</span>
              </div>
              <div className="pt-4 border-t border-dashed border-slate-200 flex justify-between items-center">
                <span className="text-lg font-black uppercase tracking-tighter text-slate-900">Total Payable</span>
                <span className="text-3xl font-black text-slate-900">Rs. {order?.totalAmount?.toLocaleString()}</span>
              </div>
            </div>

            {/* PAYMENT BUTTON */}
            <div className="space-y-4">
              <button 
                onClick={handlePayment}
                disabled={initiatingPayment}
                className="w-full h-20 bg-[#5C2D91] hover:bg-[#4c247d] text-white rounded-2xl font-black text-xl shadow-xl shadow-purple-200 transition-all flex items-center justify-center gap-4 group relative overflow-hidden"
              >
                {initiatingPayment ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <span className="relative z-10">PAY WITH KHALTI</span>
                    <CheckCircle2 className="group-hover:scale-110 transition-transform relative z-10" />
                  </>
                )}
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  Payment Secured by Khalti Gateway
                </div>
                <div className="flex gap-4 opacity-30 grayscale contrast-125">
                   {/* Khalti / Visa / Mastercard Logo Placeholder */}
                   <div className="w-8 h-4 bg-slate-400 rounded" />
                   <div className="w-8 h-4 bg-slate-400 rounded" />
                   <div className="w-8 h-4 bg-slate-400 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BACK BUTTON */}
        <button 
          onClick={() => router.back()}
          className="mt-8 mx-auto flex items-center gap-2 text-slate-400 font-bold hover:text-slate-900 transition-colors uppercase text-[10px] tracking-widest"
        >
          <ArrowLeft size={14} /> Modify Booking
        </button>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import authSvc from "@/services/auth.service";
import Link from "next/link";

const PaymentVerify = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your transaction...");
  
  // Use a ref to prevent double-calling the API in React Strict Mode
  const hasCalled = useRef(false);

  useEffect(() => {
    const pidx = searchParams.get("pidx");
    const orderId = searchParams.get("purchase_order_id");

    if (pidx && orderId && !hasCalled.current) {
      hasCalled.current = true;
      verify(pidx, orderId);
    } else if (!pidx || !orderId) {
      setStatus("error");
      setMessage("Invalid payment parameters.");
    }
  }, [searchParams]);

  const verify = async (pidx: string, orderId: string) => {
    try {
      const res = await authSvc.postRequest("/payment/verify", {
        pidx,
        purchase_order_id: orderId,
      });

      if (res.data?.data?.status === "Completed") {
        setStatus("success");
        setMessage("Payment Successful! Your seats are now reserved.");
      } else {
        throw new Error("Payment was not completed.");
      }
    } catch (err: any) {
      console.error("Verification Error:", err);
      setStatus("error");
      setMessage(err?.response?.data?.message || "Payment verification failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl">
        
        {/* LOADING STATE */}
        {status === "loading" && (
          <div className="space-y-4">
            <Loader2 className="animate-spin text-emerald-500 mx-auto" size={48} />
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">Processing Payment</h2>
            <p className="text-slate-400 text-sm">{message}</p>
          </div>
        )}

        {/* SUCCESS STATE */}
        {status === "success" && (
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="text-emerald-500" size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic">Success!</h2>
              <p className="text-slate-400 text-sm mt-2">{message}</p>
            </div>
            <Link 
              href="/tickets" 
              className="flex items-center justify-center gap-2 w-full bg-emerald-500 py-4 rounded-2xl text-slate-950 font-black uppercase text-xs tracking-widest hover:bg-emerald-400 transition-all"
            >
              View My Tickets <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {/* ERROR STATE */}
        {status === "error" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="text-red-500" size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic">Payment Failed</h2>
              <p className="text-slate-400 text-sm mt-2">{message}</p>
            </div>
            <button 
              onClick={() => router.back()}
              className="w-full border border-white/10 text-white py-4 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
            >
              Try Again
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default PaymentVerify;
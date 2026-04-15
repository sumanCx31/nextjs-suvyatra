"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  Ticket as TicketIcon, 
  ArrowRight, 
  AlertCircle,
  Home,
  ChevronLeft
} from "lucide-react";
import authSvc from "@/services/auth.service";
import axiosInstance from "@/config/axios.config";
import TicketGenerator from "@/components/ticketGenerator";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";

interface Ticket {
  from: string;
  to: string;
  userName: string;
  seats: string[];
  date: string;
}

const PaymentSuccessContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasProcessed = useRef(false);

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"Completed" | "Failed" | "Already_Verified" | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showTickets, setShowTickets] = useState(false);

  useEffect(() => {
    const pidx = searchParams.get("pidx");
    if (!pidx) {
      setStatus("Failed");
      setLoading(false);
      return;
    }

    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processPayment = async () => {
      try {
        const verifyRes: any = await authSvc.postRequest("order/payment/verify", { pidx });
        const resStatus = verifyRes?.status?.toUpperCase();

        if (resStatus === "SUCCESS" || resStatus === "COMPLETED" || resStatus === "ALREADY_VERIFIED") {
          const isNew = resStatus !== "ALREADY_VERIFIED";
          setStatus(isNew ? "Completed" : "Already_Verified");
          
          const ticketRes: any = await axiosInstance.get(`/order/my-tickets/${pidx}`);
          setTickets(ticketRes.data || ticketRes || []);
          
          toast.success(isNew ? "Payment Verified!" : "Tickets Retrieved");
        } else {
          setStatus("Failed");
        }
      } catch (error: any) {
        setStatus("Failed");
        toast.error("Verification failed");
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex flex-col items-center space-y-6">
        <Loader2 className="animate-spin text-emerald-500" size={56} strokeWidth={1.5} />
        <div className="text-center">
          <h2 className="text-xl font-black text-white uppercase tracking-widest italic">Verifying</h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Connecting to secure gateway...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-10">
      <AnimatePresence mode="wait">
        {!showTickets ? (
          <motion.div 
            key="status-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-md mx-auto bg-slate-900/60 border border-white/10 p-10 rounded-[3rem] backdrop-blur-2xl shadow-2xl text-center"
          >
            {status === "Failed" ? (
              <div className="space-y-8">
                <div className="w-20 h-20 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto">
                  <XCircle className="text-rose-500" size={48} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Failed</h2>
                  <p className="text-slate-400 text-sm mt-3 px-4 leading-relaxed">Verification timed out or payment was rejected.</p>
                </div>
                <button onClick={() => router.push('/')} className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                  Return to Home
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(16,185,129,0.1)]">
                  <CheckCircle2 className="text-emerald-500" size={56} />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">Success</h2>
                  <p className="text-slate-400 text-sm mt-4 px-6 leading-relaxed italic">Payment confirmed. Your boarding passes have been generated.</p>
                </div>

                <div className="space-y-4 pt-4">
                  <button 
                    onClick={() => setShowTickets(true)}
                    className="flex items-center justify-center gap-3 w-full bg-emerald-500 py-5 rounded-2xl text-slate-950 font-black uppercase text-xs tracking-[0.15em] hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
                  >
                    <TicketIcon size={20} />
                    View Tickets
                  </button>
                  <Link href="/" className="flex items-center justify-center gap-2 text-slate-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest py-2">
                    <Home size={14} /> Back to Home
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="ticket-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10"
          >
            <div className="flex items-end justify-between px-4">
              <button 
                onClick={() => setShowTickets(false)} 
                className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group"
              >
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
              </button>
              <div className="text-right">
                <h3 className="text-white font-black uppercase italic tracking-tighter text-2xl leading-none">Your <span className="text-emerald-500">Boarding Passes</span></h3>
                <p className="text-slate-500 text-[8px] font-black uppercase tracking-[0.3em] mt-1">Confirmed Manifest</p>
              </div>
            </div>

            <div className="bg-slate-900/40 rounded-[3rem] p-6 md:p-10 border border-white/10 backdrop-blur-xl">
              {tickets.length > 0 ? (
                <div className="space-y-10">
                  <TicketGenerator tickets={tickets} />
                  
                  <div className="pt-10 border-t border-white/5 flex flex-col items-center gap-6">
                    <Link 
                      href="/" 
                      className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 px-10 py-4 rounded-2xl text-white font-black uppercase text-[10px] tracking-[0.2em] transition-all active:scale-95"
                    >
                      <Home size={16} className="text-emerald-500" />
                      Back to Home Page
                    </Link>
                    <p className="text-slate-600 text-[8px] font-bold uppercase tracking-[0.4em]">Thank you for traveling with SuvYatra</p>
                  </div>
                </div>
              ) : (
                <div className="py-24 text-center">
                  <AlertCircle className="mx-auto text-slate-800 mb-6" size={64} />
                  <p className="text-slate-500 font-black uppercase tracking-widest text-xs">No active tickets found for this transaction.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 md:p-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(16,185,129,0.05),transparent_60%)] pointer-events-none" />
      
      <Suspense fallback={<Loader2 className="animate-spin text-emerald-500" size={56} />}>
        <PaymentSuccessContent />
      </Suspense>
    </div>
  );
}
'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axiosInstance from "@/config/axios.config";
import { toast } from "sonner";
import TicketGenerator from "@/components/ticketGenerator";
import Button from "@/components/formInput/button";


// Define ticket type
interface Ticket {
  from: string;
  to: string;
  userName: string;
  seats: string[];
  date: string;
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<
    "Completed" | "Failed" | "Already_Verified" | null
  >(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const pidx = searchParams.get("pidx");

    if (!pidx) {
      toast.error("Payment ID not found in URL");
      setPaymentStatus("Failed");
      setLoading(false);
      return;
    }

    const processPayment = async () => {
      try {
        // 1️⃣ VERIFY PAYMENT
        const verifyRes: any = await axiosInstance.post("/order/payment/verify", { pidx });
        // Axios usually wraps backend response in .data
        const status = verifyRes?.status;

        if (status === "SUCCESS" || status === "completed") {
          setPaymentStatus("Completed");
          toast.success(verifyRes?.message || "Payment verified successfully!");

          // 2️⃣ FETCH TICKET DATA USING pidx
          const ticketRes: any = await axiosInstance.get(`/order/my-tickets/${pidx}`);
          const fetchedTickets = ticketRes || [];
          setTickets(fetchedTickets);

        } else if (status === "ALREADY_VERIFIED") {
          setPaymentStatus("Already_Verified");
          toast.success(verifyRes?.message || "Payment already verified");

          // Optional: fetch tickets even if already verified
          const ticketRes: any = await axiosInstance.get(`/order/my-tickets/${pidx}`);
          const fetchedTickets = ticketRes.data || [];
          setTickets(fetchedTickets);

        } else {
          setPaymentStatus("Failed");
          toast.error(verifyRes?.message || "Payment failed");
        }
      } catch (error: any) {
        console.error("Payment process error:", error);
        setPaymentStatus("Failed");
        toast.error(error?.response?.message || error?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white px-4 mt-10">
      {loading ? (
        <p className="text-xl">Verifying your payment...</p>
      ) : paymentStatus === "Completed" || paymentStatus === "Already_Verified" ? (
        <>
        <div className="text-center w-full max-w-4xl">
          <h1 className={`text-3xl font-bold ${paymentStatus === "Completed" ? "text-emerald-500" : "text-yellow-400"}`}>
            {paymentStatus === "Completed" ? "Payment Successful!" : "Payment Already Verified"}
          </h1>

          <p className="mt-4 text-lg">Your ticket{tickets.length > 1 ? "s" : ""} {tickets.length > 0 ? "are ready 🎟️" : "will appear below"}.</p>

          {tickets.length > 0 ? (
            <TicketGenerator tickets={tickets} />
          ) : (
            <p className="mt-4 text-red-500">No ticket data available</p>
          )}
        </div>
        </>
        
      ) : (
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-500">Payment Failed</h1>
          <p className="mt-4 text-lg">Please try again or contact support.</p>
        </div>
      )}
    </div>
  );
}
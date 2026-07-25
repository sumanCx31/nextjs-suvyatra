"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/auth.context";
import {
  Ticket,
  Calendar,
  User,
  Mail,
  Armchair,
  CreditCard,
  Loader2,
  ArrowLeft,
  X,
  Clock,
  Download,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import authService from "@/services/auth.service";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

export default function MyTicketsPage() {
  const { loggedInUser } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // References to hold DOM nodes of tickets for PDF generation
  const ticketRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const fetchTickets = async () => {
      if (!loggedInUser?._id) return;
      try {
        const userId = loggedInUser._id;
        const response = await authService.getRequest("order/ticket/" + userId);
        const rawData = Array.isArray(response.data)
          ? response.data
          : [response.data];
        const validTickets = rawData.filter(
          (ticket) => ticket && ticket.trip !== null
        );

        // Sort tickets so the most recently booked appear first
        validTickets.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setTickets(validTickets);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [loggedInUser]);

  const filteredTickets = tickets.filter((ticket) => {
    // Filter by Date
    if (filterDate) {
      const tripDate = new Date(ticket.trip?.date).toISOString().split("T")[0];
      if (tripDate !== filterDate) return false;
    }

    // Filter by Search Query (Order ID, From, To, or Passenger Name)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const orderId = (ticket.orderId || ticket._id).toLowerCase();
      const from = (ticket.trip?.from || "").toLowerCase();
      const to = (ticket.trip?.to || "").toLowerCase();
      const userName = (ticket.user?.name || "").toLowerCase();

      const matches =
        orderId.includes(query) ||
        from.includes(query) ||
        to.includes(query) ||
        userName.includes(query);

      if (!matches) return false;
    }

    return true;
  });

  const handleDownloadPDF = async (ticketId: string) => {
    const element = ticketRefs.current[ticketId];
    if (!element) return;

    try {
      setDownloadingId(ticketId);

      // Find target ticket to grab its orderId for the filename
      const targetTicket = tickets.find((t) => t._id === ticketId);
      const targetOrderId = targetTicket ? targetTicket.orderId || ticketId : ticketId;

      // Increase scale to 3 for higher DPI/sharpness on high-res displays
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#111827",
        logging: false,
      });

      // Use JPEG with maximum quality (1.0) to prevent compression blur
      const imgData = canvas.toDataURL("image/jpeg", 1.0);

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "JPEG", 0, 10, pdfWidth, pdfHeight, undefined, "FAST");
      pdf.save(`Ticket-${targetOrderId}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060910] flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060910] text-white pt-28 pb-20 px-4 md:px-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-500 hover:text-emerald-500 transition-colors group mb-4"
            >
              <ArrowLeft
                size={18}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span className="text-xs font-black uppercase tracking-widest">
                Return Home
              </span>
            </button>
            <h1 className="text-4xl font-black italic tracking-tighter">
              MY <span className="text-emerald-500">TRIPS</span>
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input Filter */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                Search Tickets
              </span>
              <div className="relative flex items-center gap-3 bg-[#111827] border border-white/5 p-3 pr-5 rounded-2xl shadow-xl">
                <Search size={18} className="ml-1 text-emerald-500" />
                <input
                  type="text"
                  placeholder="Order ID, City, Name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-xs font-bold outline-none text-slate-200 placeholder:text-slate-600 w-36 sm:w-44"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-slate-500 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Date Filter */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                Filter by Journey Date
              </span>
              <div className="relative flex items-center gap-3 bg-[#111827] border border-white/5 p-3 pr-5 rounded-2xl shadow-xl">
                <Calendar size={18} className="ml-1 text-emerald-500" />
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="bg-transparent text-xs font-bold uppercase outline-none text-slate-200 [color-scheme:dark] cursor-pointer"
                />
                {filterDate && (
                  <button
                    onClick={() => setFilterDate("")}
                    className="text-slate-500 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <div className="space-y-12">
          {filteredTickets.length === 0 ? (
            <div className="text-center py-24 bg-[#111827]/50 rounded-[3rem] border border-dashed border-white/10">
              <Ticket
                size={50}
                className="mx-auto text-slate-800 mb-4 opacity-50"
              />
              <p className="text-slate-500 font-bold">
                No bookings found matching your search or filter.
              </p>
            </div>
          ) : (
            filteredTickets.map((ticket) => {
              const displayOrderId = ticket.orderId || ticket._id;

              // Construct verifiable data payload for QR code scanning
              const qrPayload = JSON.stringify({
                orderId: displayOrderId,
                ref: ticket._id,
                name: ticket.user?.name,
                email: ticket.user?.email,
                from: ticket.trip?.from,
                to: ticket.trip?.to,
                date: ticket.trip?.date,
                seats: ticket.seats,
                amount: ticket.totalAmount,
              });

              return (
                <div key={ticket._id} className="relative group space-y-4">
                  {/* Action Bar: Download Ticket Button */}
                  <div className="flex justify-end px-2">
                    <button
                      onClick={() => handleDownloadPDF(ticket._id)}
                      disabled={downloadingId === ticket._id}
                      className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95 disabled:opacity-50"
                    >
                      {downloadingId === ticket._id ? (
                        <Loader2 className="animate-spin" size={14} />
                      ) : (
                        <Download size={14} />
                      )}
                      <span>Download PDF Ticket</span>
                    </button>
                  </div>

                  {/* Printable Ticket Container */}
                  <div
                    ref={(el) => {
                      ticketRefs.current[ticket._id] = el;
                    }}
                    className="bg-[#111827] rounded-[2.5rem] overflow-hidden border border-white/10 flex flex-col lg:flex-row shadow-2xl transition-all duration-500 group-hover:border-emerald-500/30"
                  >
                    <div className="flex-1 p-8 border-b lg:border-b-0 lg:border-r border-dashed border-white/10">
                      <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[9px] font-black uppercase tracking-widest">
                            Ticket Confirmed
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-mono text-slate-400 uppercase">
                            Order ID: <span className="text-white font-bold">{displayOrderId}</span>
                          </p>
                          <div className="flex items-center gap-1.5 justify-end text-blue-400 mt-1">
                            <Clock size={10} />
                            <p className="text-[10px] font-bold">
                              Booked:{" "}
                              {new Date(ticket.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-10">
                        <div className="w-1/3">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                            Departure
                          </p>
                          <h2 className="text-2xl font-black capitalize truncate">
                            {ticket.trip?.from}
                          </h2>
                        </div>
                        <div className="flex-1 flex flex-col items-center px-4">
                          <div className="w-full h-[2px] bg-slate-800 rounded-full relative">
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#111827] px-2 text-emerald-500">
                              <Ticket size={16} />
                            </div>
                          </div>
                        </div>
                        <div className="w-1/3 text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                            Destination
                          </p>
                          <h2 className="text-2xl font-black capitalize truncate">
                            {ticket.trip?.to}
                          </h2>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-slate-950/40 p-5 rounded-3xl border border-white/5 space-y-3">
                          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                            Traveler Identity
                          </p>
                          <div className="flex items-center gap-3">
                            <div className="size-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                              <User size={18} />
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-sm font-black truncate">
                                {ticket.user?.name || "N/A"}
                              </p>
                              <div className="flex items-center gap-1.5 text-slate-400">
                                <Mail size={10} />
                                <p className="text-[10px] truncate">
                                  {ticket.user?.email || "No email linked"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-[9px] font-bold text-slate-400 uppercase">
                              Trip Date
                            </p>
                            <div className="flex items-center gap-2 text-white">
                              <Calendar size={14} className="text-emerald-500" />
                              <p className="text-xs font-black">
                                {new Date(
                                  ticket.trip?.date
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[9px] font-bold text-slate-400 uppercase">
                              Seat Selection
                            </p>
                            <div className="flex items-center gap-2 text-white">
                              <Armchair size={14} className="text-emerald-500" />
                              <p className="text-xs font-black">
                                {ticket.seats?.join(", ") || "N/A"}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[9px] font-bold text-slate-400 uppercase">
                              Payment
                            </p>
                            <div className="flex items-center gap-2 text-white">
                              <CreditCard
                                size={14}
                                className="text-emerald-500"
                              />
                              <p className="text-xs font-black uppercase">
                                {ticket.paymentMethod}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[9px] font-bold text-slate-400 uppercase">
                              Total Seats
                            </p>
                            <p className="text-xs font-black">
                              {ticket.seats?.length} Units
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* QR Code and Sidebar Section */}
                    <div className="w-full lg:w-64 bg-[#1A2131]/40 p-8 flex flex-col items-center justify-center relative">
                      <div className="hidden lg:block absolute -left-3 top-0 bottom-0 w-6 flex flex-col justify-around py-4">
                        {[...Array(10)].map((_, i) => (
                          <div
                            key={i}
                            className="w-6 h-6 rounded-full bg-[#060910] -ml-3"
                          />
                        ))}
                      </div>

                      <div className="text-center relative z-10 flex flex-col items-center">
                        <div className="bg-white p-3 rounded-2xl shadow-md mb-4">
                          <QRCodeSVG
                            value={qrPayload}
                            size={96}
                            level="M"
                            includeMargin={false}
                          />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                          Fair Total
                        </p>
                        <p className="text-3xl font-black text-emerald-500 italic tracking-tighter">
                          Rs.{ticket.totalAmount}
                        </p>
                        <div className="mt-3 px-3 py-1 border border-emerald-500/20 rounded-xl bg-emerald-500/5">
                          <p className="text-[8px] font-black text-emerald-400 uppercase">
                            Invoice Paid
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
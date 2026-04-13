"use client";

import React from "react";
import { QRCodeCanvas } from "qrcode.react";

interface Ticket {
  from: string;
  to: string;
  userName: string;
  seats: string[];
  date: string;
}

interface Props {
  tickets: Ticket[];
}

const TicketGenerator: React.FC<Props> = ({ tickets }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center gap-8">
      {tickets.map((ticket, index) => {
        const qrData = ticket
          ? `
Name: ${ticket.userName || "N/A"}
From: ${ticket.from || "N/A"}
To: ${ticket.to || "N/A"}
Seats: ${ticket.seats?.join(", ") || "N/A"}
Date: ${ticket.date ? new Date(ticket.date).toDateString() : "N/A"}
`
          : "Invalid Ticket";

        return (
          <div
            key={index}
            className="w-full max-w-xl bg-slate-800 rounded-2xl shadow-xl border border-slate-700 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-emerald-500 text-slate-900 p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">🎫 Bus Ticket</h2>
              <span className="text-sm font-semibold">
                {new Date(ticket.date).toLocaleDateString()}
              </span>
            </div>

            {/* Body */}
            <div className="p-6 grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm">From</p>
                <p className="text-lg font-bold">{ticket.from}</p>
              </div>

              <div>
                <p className="text-slate-400 text-sm">To</p>
                <p className="text-lg font-bold">{ticket.to}</p>
              </div>

              <div>
                <p className="text-slate-400 text-sm">Passenger</p>
                <p className="text-lg font-semibold">{ticket.userName}</p>
              </div>

              <div>
                <p className="text-slate-400 text-sm">Seats</p>
                <p className="text-lg font-semibold">
                  {ticket.seats.join(", ")}
                </p>
              </div>
            </div>

            {/* QR Section */}
            <div className="border-t border-slate-700 p-6 flex flex-col items-center">
              <QRCodeCanvas
                value={qrData}
                size={180}
                bgColor="#1e293b"
                fgColor="#10b981"
                level="H"
              />
              <p className="text-xs text-slate-400 mt-3">
                Scan this QR at boarding
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TicketGenerator;

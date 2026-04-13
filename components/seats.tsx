'use client';

import React, { useState } from 'react';
import { Armchair } from 'lucide-react';

const BusLayout = () => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  // Generate 38 seats: Rows 1-8 (2x2) = 32 seats + Row 9 (2x2) = 4 seats + Back Row = 2? 
  // Let's do 9 rows of 2x2 (36) + 2 extra at the very back = 38.
  const rows = 9;
  
  const toggleSeat = (id: string) => {
    if (selectedSeats.includes(id)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== id));
    } else {
      setSelectedSeats([...selectedSeats, id]);
    }
  };

  const renderSeat = (id: string, isBooked: boolean = false) => {
    const isSelected = selectedSeats.includes(id);

    return (
      <button
        key={id}
        disabled={isBooked}
        onClick={() => toggleSeat(id)}
        className={`
          relative w-12 h-12 flex items-center justify-center rounded-lg transition-all duration-200
          ${isBooked ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 
            isSelected ? 'bg-emerald-600 text-white shadow-lg ring-2 ring-emerald-400' : 
            'bg-white border-2 border-slate-200 hover:border-slate-400 text-slate-600'}
        `}
      >
        <Armchair size={20} className={isSelected ? 'animate-pulse' : ''} />
        <span className="absolute -top-1 -right-1 text-[8px] font-bold bg-slate-100 px-1 rounded border">
          {id}
        </span>
      </button>
    );
  };

  return (
    <div className="flex flex-col items-center p-8 bg-gray-50 min-h-screen">
      <div className="bg-white p-10 rounded-[3rem] border-8 border-slate-200 shadow-2xl w-full max-w-sm relative">
        
        {/* Front of Bus / Driver Area */}
        <div className="flex justify-between items-center mb-12 border-b-4 border-dashed border-slate-100 pb-6">
          <div className="w-12 h-12 rounded-full border-4 border-slate-300 flex items-center justify-center">
             <div className="w-1 h-6 bg-slate-300 rotate-45 rounded-full" />
          </div>
          <span className="text-xs font-black text-slate-300 tracking-widest uppercase">Front</span>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 mb-10 text-[10px] font-bold uppercase text-slate-400">
           <div className="flex items-center gap-1"><div className="w-3 h-3 bg-white border border-slate-200 rounded" /> Available</div>
           <div className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-600 rounded" /> Selected</div>
           <div className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-200 rounded" /> Booked</div>
        </div>

        {/* Seating Grid */}
        <div className="space-y-4">
          {[...Array(rows)].map((_, rowIndex) => (
            <div key={rowIndex} className="flex justify-between items-center">
              {/* Left Side (2 seats) */}
              <div className="flex gap-2">
                {renderSeat(`A${rowIndex + 1}`)}
                {renderSeat(`B${rowIndex + 1}`)}
              </div>

              {/* Aisle */}
              <div className="w-8 flex justify-center text-[10px] text-slate-200 font-bold">
                {rowIndex + 1}
              </div>

              {/* Right Side (2 seats) */}
              <div className="flex gap-2">
                {renderSeat(`C${rowIndex + 1}`, rowIndex === 2)} {/* C3 is pre-booked */}
                {renderSeat(`D${rowIndex + 1}`)}
              </div>
            </div>
          ))}

          {/* Last Row (Full 5 seats or special config to reach 38) */}
          <div className="flex justify-center gap-2 pt-4">
            {renderSeat('E1')}
            {renderSeat('E2')}
          </div>
        </div>
      </div>

      {/* Floating Price Summary */}
      {selectedSeats.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-slate-900 text-white p-6 rounded-3xl shadow-2xl flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase">Seats: {selectedSeats.join(', ')}</p>
            <p className="text-2xl font-black">Rs. {selectedSeats.length * 1600}</p>
          </div>
          <button className="bg-emerald-500 hover:bg-emerald-400 px-8 py-3 rounded-xl font-bold transition-colors">
            Continue
          </button>
        </div>
      )}
    </div>
  );
};

export default BusLayout;
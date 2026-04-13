// app/search-bus/[id]/select-seats/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import PageSeat from '@/components/pageSeats';

export default function SeatSelectionWrapper() {
  const params = useParams();
  const id = params.id;
  const [busDetails, setBusDetails] = useState<any>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('bus_results');
    if (saved) {
      const results = JSON.parse(saved);
      // Ensure we compare strings for the ID
      const found = results.find((b: any) => b._id === id);
      setBusDetails(found);
    }
  }, [id]);
console.log(busDetails);

  if (!busDetails) {
    return (
      <div className="pt-32 text-center flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-bold">Loading bus layout...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* Pass the data to the component */}
      <PageSeat initialData={busDetails} />
    </div>
  );
}
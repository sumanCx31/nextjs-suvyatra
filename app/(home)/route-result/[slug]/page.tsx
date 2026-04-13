'use client';

import { use, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSearchStore } from '@/store/useSearchStore';
import BusResultCard from '@/components/result.card';

export default function ResultsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const searchParams = useSearchParams();
  
  const storeResults = useSearchStore((state) => state.results);
  const [buses, setBuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const date = searchParams.get('date');

  useEffect(() => {
    // 1. Check Zustand Store first
    if (storeResults && storeResults.length > 0) {
      setBuses(storeResults);
      setLoading(false);
    } else {
      // 2. Fallback to SessionStorage
      const saved = sessionStorage.getItem('bus_results');
      
      // CRITICAL FIX: Check if saved is a valid JSON string and not "undefined"
      if (saved && saved !== "undefined" && saved !== "null") {
        try {
          const parsedData = JSON.parse(saved);
          setBuses(Array.isArray(parsedData) ? parsedData : []);
        } catch (error) {
          console.error("SessionStorage Parse Error:", error);
          setBuses([]); // Fallback to empty if JSON is corrupted
        }
      }
      setLoading(false);
    }
  }, [storeResults]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-20 text-center text-gray-500 animate-pulse font-bold uppercase tracking-widest">
          Scanning SuvYatra Routes...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      {/* Search Header */}
      <div className="mb-10 border-b border-gray-100 pb-8">
        <h1 className="text-4xl font-black text-slate-900 capitalize tracking-tighter italic">
          {slug.replace(/-/g, ' ')}
        </h1>
        <div className="flex items-center gap-3 mt-3">
          <span className="bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold uppercase">
            Active Search
          </span>
          <p className="text-gray-500 font-medium text-sm">
            Date: <span className="text-white">{date || 'Anytime'}</span> • {buses.length} Fleet(s) Found
          </p>
        </div>
      </div>

      {/* Results List */}
      <div className="grid gap-6">
        {buses.length > 0 ? (
          buses.map((bus: any) => (
            <BusResultCard key={bus._id || bus.id} bus={bus} />
          ))
        ) : (
          <div className="text-center py-24 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
            <div className="mb-4 text-4xl">🚌</div>
            <h2 className="text-2xl font-black text-slate-800 uppercase italic">No Buses Found</h2>
            <p className="text-slate-500 mt-2 font-medium max-w-xs mx-auto">
              We couldn't find any SuvYatra buses for this route on the selected date.
            </p>
            <button 
              onClick={() => window.history.back()}
              className="mt-6 text-emerald-500 font-bold hover:text-emerald-600 underline underline-offset-4"
            >
              Modify Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
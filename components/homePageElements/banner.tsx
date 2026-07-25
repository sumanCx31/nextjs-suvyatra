'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import bannerService from "@/services/banner.service";

interface Banner {
  _id: string;
  title: string;
  description: string;
  link: string;
  image: {
    secureUrl: string;
  };
}

export default function Carousel() {
  const [current, setCurrent] = useState(0);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  const getBannerListForHome = async () => {
    try {
      const response = await bannerService.getRequest("/banners");
      const apiData = response.data?.data || response.data || [];
      if (Array.isArray(apiData)) {
        setBanners(apiData);
      }
    } catch (exception) {
      console.error("Error fetching banners:", exception);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBannerListForHome();
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners]);

  if (loading) {
    return (
      <div className="w-full h-56 md:h-[450px] bg-slate-900/50 backdrop-blur-xl border border-white/10 animate-pulse rounded-[2.5rem] mt-6" />
    );
  }

  if (banners.length === 0) return null;

  return (
    <div className="relative w-full group mt-6 px-4 md:px-0">
      <div className="relative h-64 md:h-[500px] w-full overflow-hidden rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 bg-slate-950">
        {banners.map((banner, index) => (
          <div
            key={banner._id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
              index === current ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
            }`}
          >
            <Image
              src={banner.image.secureUrl.replace('/upload/', '/upload/f_auto,q_auto,w_1920/')}
              alt={banner.title}
              fill
              priority={index === 0}
              className="object-cover"
              sizes="100vw"
            />
            
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

            <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-16">
              <span className="text-emerald-400 font-black text-xs md:text-sm tracking-[0.2em] uppercase mb-2">
                Featured Offer
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                {banner.title}
              </h2>
              <p className="text-slate-300 mt-3 max-w-xl text-sm md:text-base font-medium leading-relaxed">
                {banner.description}
              </p>
              {banner.link && (
                <a
                  href={banner.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center justify-center w-fit px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm tracking-wide rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/20"
                >
                  Grab Offer
                </a>
              )}
            </div>
          </div>
        ))}

        <div className="absolute inset-y-0 inset-x-6 z-30 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => setCurrent((current - 1 + banners.length) % banners.length)}
            className="w-12 h-12 flex items-center justify-center bg-slate-900/60 backdrop-blur-md border border-white/10 text-white rounded-2xl hover:bg-emerald-500 hover:text-slate-950 hover:border-emerald-500 transition-all duration-300 pointer-events-auto active:scale-90"
            aria-label="Previous Slide"
          >
            <span className="text-2xl font-bold">‹</span>
          </button>
          <button
            onClick={() => setCurrent((current + 1) % banners.length)}
            className="w-12 h-12 flex items-center justify-center bg-slate-900/60 backdrop-blur-md border border-white/10 text-white rounded-2xl hover:bg-emerald-500 hover:text-slate-950 hover:border-emerald-500 transition-all duration-300 pointer-events-auto active:scale-90"
            aria-label="Next Slide"
          >
            <span className="text-2xl font-bold">›</span>
          </button>
        </div>

        <div className="absolute bottom-6 right-8 md:right-16 z-30 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 transition-all duration-500 rounded-full ${
                i === current ? "w-8 bg-emerald-500" : "w-2 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
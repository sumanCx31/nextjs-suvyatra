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
      <div className="w-full h-56 md:h-[450px] bg-slate-800 animate-pulse rounded-[2rem] mt-6" />
    );
  }

  if (banners.length === 0) return null;

  return (
    <div className="relative w-full group mt-15 px-4 md:px-0">
      <div className="relative h-64 md:h-[500px] mt-20 w-full overflow-hidden rounded-[2.5rem] shadow-2xs shadow-slate-400 active:scale-95 border border-white/10">
        {banners.map((banner, index) => (
          <div
            key={banner._id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
              index === current ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
          >
            {/* 1. Next.js Image Component (Base Layer) */}
            <Image
              src={banner.image.secureUrl.replace('/upload/', '/upload/f_auto,q_auto,w_1920/') }
              alt={banner.title}
              fill
              priority={index === 0}
              className="object-cover"
              sizes="100vw"
            />
            
            {/* 2. THE BLUR & TINT OVERLAY (New Layer) */}
            {/* Note: backdrop-blur-[4px] blurs the image under it, bg-black/40 adds the dark tint */}
            <div className="absolute inset-0 z-10 backdrop-blur-[4px] bg-black/40"></div>

            {/* 3. Content Overlay (Text & Button Layer) */}
            {/* We must set a higher z-index (z-20) so the content is NOT blurred */}
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-16">
              <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter animate-in fade-in slide-in-from-bottom-4">
                {banner.title}
              </h2>
              <p className="text-white mt-3 max-w-lg text-sm md:text-lg font-bold leading-relaxed shadow-text">
                {banner.description}
              </p>
              {banner.link && (
                <a
                  href={banner.link}
                  target="_blank"
                  className="mt-6 inline-block w-fit px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
                >
                  Grab Offer
                </a>
              )}
            </div>
          </div>
        ))}

        {/* Navigation Arrows (z-index 30 so they sit on top) */}
        <div className="absolute inset-0 z-30 flex items-center justify-between px-6 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setCurrent((current - 1 + banners.length) % banners.length)}
            className="w-12 h-12 flex items-center justify-center bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/40 transition-all"
          >
            <span className="text-2xl">‹</span>
          </button>
          <button
            onClick={() => setCurrent((current + 1) % banners.length)}
            className="w-12 h-12 flex items-center justify-center bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/40 transition-all"
          >
            <span className="text-2xl">›</span>
          </button>
        </div>

        {/* Indicator Dots (z-index 30) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                i === current ? "w-8 bg-emerald-500" : "w-2 bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
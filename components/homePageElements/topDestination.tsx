"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const routes = [
  { from: "Kathmandu", to: "Pokhara" },
  { from: "Kathmandu", to: "Chitwan" },
  { from: "Pokhara", to: "Butwal" },
  { from: "Kathmandu", to: "Dharan" },
  { from: "Biratnagar", to: "Kathmandu" },
  { from: "Nepalgunj", to: "Surkhet" },
];

const TopDestinations = () => {
  return (
    <section className="w-full bg-gray-100 py-20 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-slate-900">
            Top Destination Routes
          </h2>
          <p className="mt-3 text-slate-600">
            Most traveled routes chosen by passengers
          </p>
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {routes.map((route, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -6 }}
              className="
                group bg-white
                border border-slate-200
                rounded-2xl p-6
                cursor-pointer
                shadow-lg
                hover:shadow-2xl
                hover:border-blue-500
                transition-all
              "
            >
              <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
                Route
              </p>

              <div className="mt-3 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">
                  {route.from}
                  <span className="mx-2 text-blue-500">→</span>
                  {route.to}
                </h3>

                <ArrowRight
                  size={22}
                  className="
                    text-blue-500
                    opacity-0 translate-x-2
                    group-hover:opacity-100 group-hover:translate-x-0
                    transition-all
                  "
                />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TopDestinations;
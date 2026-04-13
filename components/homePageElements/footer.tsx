'use client';

import Link from "next/link";
import {
  Bus,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border/50 mt-2">
      <div className="container mx-auto px-4 py-12">

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Bus className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Suv<span className="text-green-500 font-bold text-xl">Yatra</span> </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              SuvYatra is a modern online bus transportation platform that makes
              booking, managing, and traveling easier and smarter.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { name: "Home", href: "/" },
                { name: "Find Buses", href: "/bus" },
                { name: "Offers", href: "/offers" },
                { name: "My Tickets", href: "/my-tickets" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              {[
                "Help Center",
                "FAQs",
                "Cancellation Policy",
                "Terms & Conditions",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                sumansah029@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                +977 9702790990
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Kathmandu, Nepal
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-border/50" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SuvYatra. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
              <Link
                key={index}
                href="#"
                className="p-2 rounded-full hover:bg-muted transition"
              >
                <Icon className="w-4 h-4 text-muted-foreground hover:text-primary transition" />
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Phone, Mail } from "lucide-react";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

export function Footer() {
  const pathname = usePathname();

  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/employee") ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/student-admission")
  ) {
    return null;
  }

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & About */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-primary font-extrabold text-xl shadow-[0_0_15px_rgba(250,180,0,0.4)] relative">
                <div className="absolute inset-0 rounded-full border border-white/30 animate-pulse"></div>
                SG
              </div>
              <span className="font-heading font-bold text-2xl text-white tracking-wide">Sanskar Gurukul</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering students with quality education, core values, and smart learning. Learn • Lead • Inspire.
            </p>
            <div className="flex space-x-4 pt-2">
              <Link href="#" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-accent hover:border-accent hover:text-primary transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/20">
                <FaFacebook className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-accent hover:border-accent hover:text-primary transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/20">
                <FaTwitter className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-accent hover:border-accent hover:text-primary transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/20">
                <FaInstagram className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-accent hover:border-accent hover:text-primary transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/20">
                <FaYoutube className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-bold text-white text-lg mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-12 after:h-1 after:bg-accent after:rounded-full">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="hover:text-primary transition-colors text-sm">About Us</Link></li>
              <li><Link href="/academics" className="hover:text-primary transition-colors text-sm">Academics</Link></li>
              <li><Link href="/facilities" className="hover:text-primary transition-colors text-sm">Facilities</Link></li>
              <li><Link href="/gallery" className="hover:text-primary transition-colors text-sm">Gallery</Link></li>
              <li><Link href="/teachers" className="hover:text-primary transition-colors text-sm">Our Teachers</Link></li>
            </ul>
          </div>

          {/* Important Links */}
          <div>
            <h3 className="font-heading font-bold text-white text-lg mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-12 after:h-1 after:bg-accent after:rounded-full">
              Important
            </h3>
            <ul className="space-y-3">
              <li><Link href="/admission" className="hover:text-primary transition-colors text-sm">Admission Open 2026-27</Link></li>
              <li><Link href="/notice" className="hover:text-primary transition-colors text-sm">Notice Board</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors text-sm">FAQs</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-primary transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors text-sm">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading font-bold text-white text-lg mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-12 after:h-1 after:bg-accent after:rounded-full">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent transition-colors">
                  <MapPin className="w-5 h-5 text-accent group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm text-gray-400 mt-2">Konika Prasadi English,
                  Arwal,
                  Bihar 804401</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent transition-colors">
                  <Phone className="w-5 h-5 text-accent group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm text-gray-400">+91 8409696021</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent transition-colors">
                  <Mail className="w-5 h-5 text-accent group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm text-gray-400">kumardipak105@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 text-center md:text-left">
            &copy; {new Date().getFullYear()} Sanskar Gurukul Aashram School. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 md:pr-8">
            Powered by <Link href="https://www.pigo-pi.com/" className="font-extrabold bg-gradient-to-r from-[#ff0080] via-[#7928CA] to-[#00d0ff] bg-clip-text text-transparent hover:scale-105 inline-block transition-transform duration-300 text-base tracking-wide">PigoPi</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

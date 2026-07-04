import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & About */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                SG
              </div>
              <span className="font-heading font-bold text-xl text-white">Sanskar Gurukul</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering students with quality education, core values, and smart learning. Learn • Lead • Inspire.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <FaFacebook className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <FaTwitter className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <FaInstagram className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <FaYoutube className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-bold text-white text-lg mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-12 after:h-1 after:bg-primary after:rounded-full">
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
            <h3 className="font-heading font-bold text-white text-lg mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-12 after:h-1 after:bg-primary after:rounded-full">
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
            <h3 className="font-heading font-bold text-white text-lg mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-12 after:h-1 after:bg-primary after:rounded-full">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-400">Sanskar Gurukul Ashram School, City, State, ZIP</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm text-gray-400">+91 8409696021</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm text-gray-400">kumardipak105@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 text-center md:text-left">
            &copy; {new Date().getFullYear()} Sanskar Gurukul Ashram School. All rights reserved.
          </p>
          <p className="text-sm text-gray-500">
            CBSE Pattern | Nursery to Class V
          </p>
        </div>
      </div>
    </footer>
  );
}

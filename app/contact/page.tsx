"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

function ContactPage() {
  return (
    <div className="bg-white pb-20">
      {/* Header */}
      <div className="bg-gray-900 py-16 text-center px-4">
        <motion.h1
          className="text-4xl md:text-5xl font-heading font-bold text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Contact Us
        </motion.h1>
        <motion.p
          className="text-gray-400 text-lg max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Get in touch with us for admissions, inquiries, or any other assistance.
        </motion.p>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold font-heading mb-6 text-gray-900">Contact Info</h3>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Address</h4>
                    <p className="text-sm text-gray-600">Konika Prasadi English,<br />Arwal,<br />Bihar 804401<br /><br />कोनिका प्रसादी इंग्लिश,<br />अरवल,<br />बिहार 804401</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Phone</h4>
                    <p className="text-sm text-gray-600">+91 8409696021<br />+91 7739329864</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Email</h4>
                    <p className="text-sm text-gray-600">kumardipak105@gmail.com</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Working Hours</h4>
                    <p className="text-sm text-gray-600">Monday - Saturday<br />08:00 AM - 03:00 PM</p>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-2xl font-bold font-heading mb-6 text-gray-900">Send us a Message</h3>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Your Name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <input type="email" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="your@email.com" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Subject</label>
                  <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="How can we help you?" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Message</label>
                  <textarea rows={5} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none" placeholder="Write your message here..."></textarea>
                </div>
              </div>
              <Button type="submit" className="h-12 px-8 bg-gradient-to-r from-primary to-blue-600 text-base">
                <Send className="w-5 h-5 mr-2" /> Send Message
              </Button>
            </form>
          </motion.div>

        </div>

        {/* Map Section */}
        <motion.div
          className="mt-12 rounded-2xl overflow-hidden shadow-lg border border-gray-100 h-[400px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Mock Google Map iframe */}
          <iframe
            src="https://maps.google.com/maps?q=%E0%A4%95%E0%A5%8B%E0%A4%A8%E0%A4%BF%E0%A4%95%E0%A4%BE%20%E0%A4%AA%E0%A5%8D%E0%A4%B0%E0%A4%B8%E0%A4%BE%E0%A4%A6%E0%A5%80%20%E0%A4%87%E0%A4%82%E0%A4%97%E0%A5%8D%E0%A4%B2%E0%A4%BF%E0%A4%B6%20%E0%A4%85%E0%A4%B0%E0%A4%B5%E0%A4%B2%2C%20804401&t=&z=15&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </motion.div>
      </div>
    </div>
  );
}

export default ContactPage;

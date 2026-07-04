"use client";

import { motion } from "framer-motion";
import { MonitorPlay, Library, BookText, Dumbbell, Bus, ShieldCheck, Gamepad2, Droplet } from "lucide-react";

function FacilitiesPage() {
  const facilities = [
    {
      title: "Smart Classroom",
      desc: "Interactive digital boards and visual learning aids for an engaging educational experience.",
      icon: MonitorPlay,
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      title: "Library",
      desc: "A vast collection of books, encyclopedias, and digital resources to foster a reading habit.",
      icon: Library,
      color: "bg-indigo-50 text-indigo-600 border-indigo-100",
    },
    {
      title: "Computer Lab",
      desc: "Modern computer lab with latest software to equip students with essential tech skills.",
      icon: BookText,
      color: "bg-purple-50 text-purple-600 border-purple-100",
    },
    {
      title: "Playground",
      desc: "Spacious playground for outdoor sports like football, cricket, and athletics.",
      icon: Dumbbell,
      color: "bg-green-50 text-green-600 border-green-100",
    },
    {
      title: "School Bus",
      desc: "GPS-enabled fleet of buses ensuring safe and comfortable transportation for students.",
      icon: Bus,
      color: "bg-yellow-50 text-yellow-600 border-yellow-100",
    },
    {
      title: "CCTV Campus",
      desc: "24/7 CCTV surveillance across the campus ensuring the utmost safety of your child.",
      icon: ShieldCheck,
      color: "bg-red-50 text-red-600 border-red-100",
    },
    {
      title: "Activity Room",
      desc: "Dedicated space for art, craft, music, and indoor games to nurture creativity.",
      icon: Gamepad2,
      color: "bg-pink-50 text-pink-600 border-pink-100",
    },
    {
      title: "Clean Drinking Water",
      desc: "RO purified drinking water facility available throughout the campus.",
      icon: Droplet,
      color: "bg-cyan-50 text-cyan-600 border-cyan-100",
    },
  ];

  return (
    <div className="py-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            World-Class Facilities
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            We provide a safe, secure, and stimulating environment equipped with modern amenities to ensure the holistic development of every child.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {facilities.map((fac, idx) => (
            <motion.div
              key={fac.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`bg-white rounded-2xl p-6 border shadow-sm hover:shadow-md transition-all ${fac.color.split(" ")[2]}`}
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${fac.color.split(" ").slice(0, 2).join(" ")}`}>
                <fac.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold font-heading text-gray-900 mb-3">{fac.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{fac.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FacilitiesPage;

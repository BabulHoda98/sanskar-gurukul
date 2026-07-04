"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Clock } from "lucide-react";
import Image from "next/image";

function EventsPage() {
  const events = [
    {
      id: 1,
      title: "Annual Sports Meet 2026",
      date: "April 10, 2026",
      time: "09:00 AM - 04:00 PM",
      location: "School Ground",
      desc: "Join us for a day of athletic excellence and sportsmanship as our students compete in various track and field events.",
      img: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Cultural Festival - 'Sanskriti'",
      date: "August 14, 2026",
      time: "10:00 AM - 02:00 PM",
      location: "School Auditorium",
      desc: "A celebration of India's rich cultural heritage featuring classical dances, folk music, and drama performances by students.",
      img: "https://images.unsplash.com/photo-1533147670608-2a2f9776d3ac?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "Science Exhibition",
      date: "November 20, 2026",
      time: "09:30 AM - 01:30 PM",
      location: "Science Block",
      desc: "An exhibition showcasing innovative science projects and working models created by the students of Classes III to V.",
      img: "https://images.unsplash.com/photo-1564069114553-7215e1ff1890?q=80&w=2089&auto=format&fit=crop"
    }
  ];

  return (
    <div className="py-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-16">
          <motion.h1 
            className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Upcoming Events
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Mark your calendars and join us in celebrating the talents and achievements of our students.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="relative h-48 w-full">
                <Image 
                  src={event.img}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md text-sm font-bold text-primary flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {event.date.split(",")[0]}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-heading font-bold text-gray-900 mb-4">{event.title}</h3>
                
                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{event.location}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 line-clamp-3">
                  {event.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EventsPage;

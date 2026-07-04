"use client";

import { motion } from "framer-motion";
import { Bell, Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

function NoticePage() {
  const notices = [
    {
      id: 1,
      title: "Admissions Open for 2026-27",
      date: "March 15, 2026",
      desc: "Admission process for Nursery to Class V has started. Parents can collect forms from the school office or apply online.",
      type: "notice",
    },
    {
      id: 2,
      title: "Annual Sports Meet",
      date: "April 10, 2026",
      desc: "The Annual Sports Meet will be held on the school grounds. All students are requested to participate.",
      type: "event",
    },
    {
      id: 3,
      title: "Summer Vacation Announcement",
      date: "May 1, 2026",
      desc: "School will remain closed for summer vacation from May 15 to June 30. Holiday homework has been distributed.",
      type: "notice",
    },
    {
      id: 4,
      title: "Parent-Teacher Meeting (PTM)",
      date: "August 5, 2026",
      desc: "A mandatory PTM is scheduled for all classes to discuss the first-term progress of the students.",
      type: "event",
    },
  ];

  return (
    <div className="py-20 bg-white min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-16">
          <motion.h1 
            className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Notice Board & Events
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Stay updated with the latest announcements, circulars, and upcoming school events.
          </motion.p>
        </div>

        <div className="relative border-l-2 border-primary/20 ml-4 md:ml-8 space-y-12 pb-8">
          {notices.map((item, idx) => (
            <motion.div 
              key={item.id}
              className="relative pl-8 md:pl-12"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              {/* Timeline dot */}
              <div className={`absolute -left-[21px] md:-left-[21px] top-1 w-10 h-10 rounded-full border-4 border-white flex items-center justify-center ${item.type === 'event' ? 'bg-orange-500' : 'bg-primary'}`}>
                {item.type === 'event' ? (
                  <Calendar className="w-4 h-4 text-white" />
                ) : (
                  <Bell className="w-4 h-4 text-white" />
                )}
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                  <h3 className="text-xl font-bold font-heading text-gray-900">{item.title}</h3>
                  <span className="inline-flex items-center text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
                    <Calendar className="w-4 h-4 mr-2 text-primary" /> {item.date}
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {item.desc}
                </p>
                <Button variant="outline" size="sm" className="text-primary border-primary/30 hover:bg-primary/5">
                  <Download className="w-4 h-4 mr-2" /> Download PDF
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NoticePage;

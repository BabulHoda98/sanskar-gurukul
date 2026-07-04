"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { BookOpen, Award, GraduationCap } from "lucide-react";

function TeachersPage() {
  const teachers = [
    {
      name: "Dr. Arvind Sharma",
      role: "Principal",
      qual: "Ph.D. in Education, M.Sc. Mathematics",
      exp: "20+ Years",
      img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2000&auto=format&fit=crop",
    },
    {
      name: "Mrs. Sunita Verma",
      role: "Headmistress (Primary Wing)",
      qual: "M.A. English, B.Ed.",
      exp: "15 Years",
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2000&auto=format&fit=crop",
    },
    {
      name: "Mr. Rakesh Singh",
      role: "Mathematics Teacher",
      qual: "M.Sc. Mathematics, B.Ed.",
      exp: "10 Years",
      img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2000&auto=format&fit=crop",
    },
    {
      name: "Ms. Priya Patel",
      role: "Science Teacher",
      qual: "M.Sc. Physics, B.Ed.",
      exp: "8 Years",
      img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2000&auto=format&fit=crop",
    },
    {
      name: "Mrs. Kavita Gupta",
      role: "Hindi Teacher",
      qual: "M.A. Hindi, B.Ed.",
      exp: "12 Years",
      img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=2000&auto=format&fit=crop",
    },
    {
      name: "Mr. Amit Kumar",
      role: "Sports Instructor",
      qual: "B.P.Ed.",
      exp: "7 Years",
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2000&auto=format&fit=crop",
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
          >
            Our Expert Faculty
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Meet our dedicated team of experienced educators who are passionate about shaping the future of our students.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teachers.map((teacher, idx) => (
            <motion.div
              key={teacher.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group"
            >
              <div className="relative h-72 w-full overflow-hidden">
                <Image 
                  src={teacher.img}
                  alt={teacher.name}
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white font-heading">{teacher.name}</h3>
                  <p className="text-blue-200 text-sm font-medium">{teacher.role}</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  <span className="text-sm">{teacher.qual}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Award className="w-5 h-5 text-primary" />
                  <span className="text-sm">Experience: {teacher.exp}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TeachersPage;

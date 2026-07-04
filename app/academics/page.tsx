"use client";

import { motion } from "framer-motion";
import { BookOpen, Star, Music, Palette, Trophy, Users } from "lucide-react";

function AcademicsPage() {
  const classes = [
    { name: "Nursery", age: "3-4 Years", desc: "Play-way method, basic counting & alphabets." },
    { name: "LKG", age: "4-5 Years", desc: "Reading readiness, writing skills, environmental awareness." },
    { name: "UKG", age: "5-6 Years", desc: "Advanced phonics, basic addition/subtraction, general knowledge." },
    { name: "Class I", age: "6-7 Years", desc: "Formal subjects introduction, creative writing, basic science." },
    { name: "Class II", age: "7-8 Years", desc: "Reading fluency, foundational math concepts, environmental studies." },
    { name: "Class III", age: "8-9 Years", desc: "Advanced language skills, multiplication, independent reading." },
    { name: "Class IV", age: "9-10 Years", desc: "Critical thinking, advanced math, comprehensive science." },
    { name: "Class V", age: "10-11 Years", desc: "Preparation for middle school, logical reasoning, holistic development." },
    { name: "Class VI", age: "11-12 Years", desc: "Introduction to specialized subjects, analytical thinking, project-based learning." },
    { name: "Class VII", age: "12-13 Years", desc: "Advanced scientific concepts, historical awareness, and leadership skills." },
    { name: "Class VIII", age: "13-14 Years", desc: "Preparation for high school, complex problem solving, comprehensive syllabus." },
  ];

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Academics at Sanskar Gurukul
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            We follow the CBSE pattern tailored to foster curiosity, creativity, and a love for lifelong learning from Nursery to Class VIII.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {classes.map((cls, idx) => (
            <motion.div
              key={cls.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all group"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold font-heading text-primary group-hover:text-blue-700 transition-colors">{cls.name}</h3>
                <span className="text-sm font-medium text-gray-500 bg-gray-200 px-3 py-1 rounded-full">{cls.age}</span>
              </div>
              <p className="text-gray-600">{cls.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-primary/5 rounded-3xl p-8 md:p-12">
          <h2 className="text-3xl font-heading font-bold text-center text-gray-900 mb-10">Co-Curricular Activities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Sports & Physical Ed</h4>
                <p className="text-gray-600 text-sm">Regular physical activities to promote fitness, teamwork, and discipline.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
                <Palette className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Art & Craft</h4>
                <p className="text-gray-600 text-sm">Encouraging creativity and fine motor skills through various artistic mediums.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 flex-shrink-0">
                <Music className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Music & Dance</h4>
                <p className="text-gray-600 text-sm">Cultural appreciation and rhythmic development through vocal and physical expression.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AcademicsPage;

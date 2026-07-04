"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";
import { Users, GraduationCap, School, Award } from "lucide-react";
import { useInView } from "react-intersection-observer";

const stats = [
  { id: 1, name: "Happy Students", value: 500, icon: Users, suffix: "+" },
  { id: 2, name: "Expert Teachers", value: 30, icon: GraduationCap, suffix: "+" },
  { id: 3, name: "Smart Classrooms", value: 25, icon: School, suffix: "" },
  { id: 4, name: "Years of Excellence", value: 10, icon: Award, suffix: "+" },
];

export function Stats() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="bg-primary py-16 sm:py-20" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 text-white">
                <stat.icon className="w-8 h-8" />
              </div>
              <div className="text-4xl md:text-5xl font-heading font-bold text-white mb-2">
                {inView ? (
                  <CountUp end={stat.value} duration={2.5} separator="," />
                ) : (
                  "0"
                )}
                {stat.suffix}
              </div>
              <div className="text-blue-100 font-medium text-sm sm:text-base uppercase tracking-wide">
                {stat.name}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

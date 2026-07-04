"use client";

import { motion } from "framer-motion";
import { 
  BookOpen, 
  Users, 
  CheckCircle, 
  Bus, 
  HeartHandshake, 
  Trophy,
  Brain,
  MonitorPlay
} from "lucide-react";
import { useInView } from "react-intersection-observer";

const features = [
  {
    title: "Experienced Teachers",
    description: "Highly qualified and dedicated faculty to guide your child's learning journey.",
    icon: Users,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "CBSE Curriculum",
    description: "Comprehensive curriculum designed in accordance with CBSE standards.",
    icon: BookOpen,
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    title: "Weekly Tests",
    description: "Regular assessments to track progress and identify areas for improvement.",
    icon: CheckCircle,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Smart Learning",
    description: "Digital classrooms equipped with modern interactive learning tools.",
    icon: MonitorPlay,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Free Education",
    description: "Special support and free education for economically weaker students.",
    icon: HeartHandshake,
    color: "bg-rose-100 text-rose-600",
  },
  {
    title: "Safe Transport",
    description: "Secure and reliable school transport facility covering all major routes.",
    icon: Bus,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    title: "Sports & Activities",
    description: "Excellent facilities for indoor and outdoor sports and cultural programs.",
    icon: Trophy,
    color: "bg-orange-100 text-orange-600",
  },
  {
    title: "Extra Support",
    description: "Personalized attention and extra classes for students who need more help.",
    icon: Brain,
    color: "bg-teal-100 text-teal-600",
  },
];

export function WhyChooseUs() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-20 bg-gray-50" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span 
            className="text-primary font-bold tracking-wider uppercase text-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            Our Features
          </motion.span>
          <motion.h2 
            className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mt-2 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Why Choose Sanskar Gurukul?
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            We provide a holistic learning environment that nurtures intellectual, physical, and emotional growth.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100 group"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

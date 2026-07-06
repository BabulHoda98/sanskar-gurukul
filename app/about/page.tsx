"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle2, Target, Eye, Shield } from "lucide-react";

function AboutPage() {
  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Banner */}
      <div className="bg-gray-900 pt-20 pb-24 text-center px-4">
        <motion.h1
          className="text-4xl md:text-5xl font-heading font-bold text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          About Sanskar Gurukul
        </motion.h1>
        <motion.p
          className="text-gray-400 text-lg max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Learn about our rich history, vision, and the core values that drive us.
        </motion.p>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">Our Journey</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Established with a profound commitment to academic excellence, <strong>Sanskar Gurukul Aashram School</strong> has been a beacon of knowledge and character-building for over a decade.
                </p>
                <p>
                  We believe that education goes beyond textbooks. Rooted in traditional values (Sanskar) while embracing modern pedagogy (Smart Learning), we nurture young minds to become responsible, confident, and compassionate citizens.
                </p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                    <span>Holistic approach to education blending modern tech with core values.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                    <span>Focus on individualized attention to ensure no child is left behind.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                    <span>A safe, inclusive, and child-friendly campus environment.</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg"
            >
              <Image
                src="/images/pathshala.jpeg"
                alt="School Building"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="bg-blue-50 rounded-2xl p-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-heading mb-4 text-gray-900">Our Mission</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                To provide quality education that empowers students to reach their full potential, fostering intellectual growth, creativity, and moral integrity.
              </p>
            </motion.div>

            <motion.div
              className="bg-green-50 rounded-2xl p-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-heading mb-4 text-gray-900">Our Vision</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                To be a premier educational institution that builds a strong foundation for lifelong learning and prepares students to excel in a global society.
              </p>
            </motion.div>

            <motion.div
              className="bg-purple-50 rounded-2xl p-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-heading mb-4 text-gray-900">Core Values</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Integrity, Respect, Empathy, Excellence, and Collaboration form the bedrock of everything we do at Sanskar Gurukul.
              </p>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AboutPage;

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const HERO_IMAGES = [
  "DUMMY_TEXT_SLIDE",
  "/images/poster.png",
  "/images/van.png",
  "/images/van2.png",
  "/images/cycle stan.png",
  "/images/newposter.png",
];

function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="relative h-[50vh] sm:h-[60vh] md:h-[80vh] lg:h-[90vh] flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Sliding Background Images */}
      <div className="absolute inset-0 z-0">
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          loop={true}
          speed={1500}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="w-full h-full"
        >
          {HERO_IMAGES.map((img, index) => (
            <SwiperSlide key={index}>
              {img === "DUMMY_TEXT_SLIDE" ? (
                <div className="w-full h-full bg-gradient-to-br from-gray-900 via-primary to-gray-900" />
              ) : (
                <div
                  className="w-full h-full bg-no-repeat"
                  style={{
                    backgroundImage: `url('${img}')`,
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center'
                  }}
                />
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <AnimatePresence>
        {activeIndex === 0 && (
          <motion.div
            className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
          >
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="-mt-16 sm:-mt-24 md:-mt-32"
              >
                <span className="inline-block py-1 px-3 rounded-full bg-primary/40 text-accent-foreground border border-accent/50 text-sm font-medium tracking-wider mb-6 backdrop-blur-sm">
                  CBSE Pattern • Nursery to Class VIII
                </span>
              </motion.div>

              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Welcome to <span className="text-accent">Sanskar Gurukul Aashram</span>
              </motion.h1>

              <motion.p
                className="text-lg sm:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-sans leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Empowering the next generation with quality education, modern facilities, and traditional values. Learn, Lead, and Inspire with us.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Button size="lg" asChild className="w-full sm:w-auto text-base h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-primary">
                  <Link href="/admission">
                    Admission Open 2026-27 <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="w-full sm:w-auto text-base h-14 px-8 text-white border-white bg-transparent hover:bg-white hover:text-gray-900">
                  <Link href="/about">
                    <BookOpen className="mr-2 w-5 h-5" /> Discover More
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Hero;

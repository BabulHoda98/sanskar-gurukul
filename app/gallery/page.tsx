"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X } from "lucide-react";
import Image from "next/image";

const categories = ["All", "Campus", "Events", "Sports", "Office"];

const photos = [
  { id: 1, category: "Campus", src: "/images/newposter.png" },
  { id: 2, category: "Events", src: "/images/poster.png" },
  { id: 3, category: "Campus", src: "/images/van.png" },
  { id: 4, category: "Campus", src: "/images/van2.png" },
  { id: 5, category: "Sports", src: "/images/cycle stan.png" },
  { id: 6, category: "Office", src: "/images/office.jpeg" },
  { id: 7, category: "Campus", src: "/galery/G1.jpeg" },
  { id: 8, category: "Events", src: "/galery/G2.jpeg" },
  { id: 9, category: "Campus", src: "/galery/G3.jpeg" },
  { id: 10, category: "Sports", src: "/galery/G4.jpeg" },
  { id: 11, category: "Office", src: "/galery/G5.jpeg" },
  { id: 12, category: "Campus", src: "/galery/G6.jpeg" },
  { id: 13, category: "Events", src: "/galery/G7.jpeg" },
  { id: 14, category: "Campus", src: "/galery/G8.jpeg" },
  { id: 15, category: "Sports", src: "/galery/G9.jpeg" },
  { id: 16, category: "Office", src: "/galery/G10.jpeg" },
  { id: 17, category: "Campus", src: "/galery/G11.jpeg" },
];

function GalleryPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const filteredPhotos = activeTab === "All" 
    ? photos 
    : photos.filter(p => p.category === activeTab);

  return (
    <div className="py-20 bg-white min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.h1 
            className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            School Gallery
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            A glimpse into the vibrant life and activities at Sanskar Gurukul Ashram School.
          </motion.p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${activeTab === cat ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          <AnimatePresence>
            {filteredPhotos.map((photo) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={photo.id}
                className="relative overflow-hidden rounded-2xl group cursor-pointer break-inside-avoid"
                onClick={() => setLightboxImg(photo.src)}
              >
                <Image
                  src={photo.src}
                  alt={photo.category}
                  width={600}
                  height={400}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Maximize2 className="text-white w-8 h-8" />
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="bg-primary/90 px-3 py-1 rounded-full text-xs font-semibold">
                    {photo.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImg && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightboxImg(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
              onClick={() => setLightboxImg(null)}
            >
              <X className="w-8 h-8" />
            </button>
            <motion.img 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={lightboxImg} 
              alt="Lightbox" 
              className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default GalleryPage;

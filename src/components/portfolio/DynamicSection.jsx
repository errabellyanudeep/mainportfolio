import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DynamicSection({ section, theme }) {
  const isDark = theme === 'dark';
  const [lightboxImage, setLightboxImage] = useState(null);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const hasImages = section.images && section.images.length > 0;
  const hasVideo = section.video_url;
  const hasPDF = section.pdf_url;

  return (
    <section className="relative py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className={`text-4xl md:text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {section.title}
          </h2>
        </motion.div>

        <div className={`backdrop-blur-2xl border-2 rounded-2xl p-8 shadow-xl ${
          isDark 
            ? 'bg-white/10 border-white/20' 
            : 'bg-white/70 border-white/40'
        }`}>
          {/* Video */}
          {hasVideo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                {section.video_url.includes('youtube.com') || section.video_url.includes('youtu.be') ? (
                  <div className="relative aspect-video">
                    <iframe
                      src={section.video_url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : section.video_url.includes('vimeo.com') ? (
                  <div className="relative aspect-video">
                    <iframe
                      src={section.video_url.replace('vimeo.com/', 'player.vimeo.com/video/')}
                      className="w-full h-full"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <video 
                    controls 
                    className="w-full rounded-xl"
                  >
                    <source src={section.video_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            </motion.div>
          )}

          {/* Image Gallery */}
          {hasImages && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              {/* Main Image */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative rounded-xl overflow-hidden shadow-2xl cursor-pointer group"
                onClick={() => setLightboxImage(section.images[galleryIndex])}
              >
                <img 
                  src={section.images[galleryIndex]} 
                  alt={`${section.title} - Image ${galleryIndex + 1}`}
                  className="w-full h-auto object-cover max-h-[600px]"
                />
                <div className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${
                  isDark ? 'bg-black/50' : 'bg-black/30'
                }`}>
                  <span className="text-white text-lg font-semibold px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm">
                    Click to enlarge
                  </span>
                </div>
                
                {/* Navigation Arrows */}
                {section.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setGalleryIndex((prev) => prev === 0 ? section.images.length - 1 : prev - 1);
                      }}
                      className={`absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full backdrop-blur-xl border-2 transition-all ${
                        isDark 
                          ? 'bg-white/10 border-white/20 hover:bg-white/20 text-white'
                          : 'bg-white/50 border-white/40 hover:bg-white/70 text-gray-900'
                      }`}
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setGalleryIndex((prev) => prev === section.images.length - 1 ? 0 : prev + 1);
                      }}
                      className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full backdrop-blur-xl border-2 transition-all ${
                        isDark 
                          ? 'bg-white/10 border-white/20 hover:bg-white/20 text-white'
                          : 'bg-white/50 border-white/40 hover:bg-white/70 text-gray-900'
                      }`}
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full backdrop-blur-xl bg-black/50 text-white text-sm font-medium">
                      {galleryIndex + 1} / {section.images.length}
                    </div>
                  </>
                )}
              </motion.div>

              {/* Thumbnails */}
              {section.images.length > 1 && (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mt-4">
                  {section.images.map((img, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.1 }}
                      onClick={() => setGalleryIndex(idx)}
                      className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                        galleryIndex === idx
                          ? 'border-purple-500 shadow-lg'
                          : isDark
                            ? 'border-white/20 hover:border-white/40'
                            : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <img 
                        src={img} 
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Description */}
          {section.description && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
            >
              <p className={`text-lg leading-relaxed text-justify ${
                isDark ? 'text-white/90' : 'text-gray-700'
              }`}>
                {section.description}
              </p>
            </motion.div>
          )}

          {/* PDF Download */}
          {hasPDF && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Button
                asChild
                className={`w-full backdrop-blur-xl border-2 shadow-lg ${
                  isDark
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 border-purple-500/50 text-white'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-purple-400 text-white'
                }`}
              >
                <a href={section.pdf_url} target="_blank" rel="noopener noreferrer" download>
                  <FileText className="w-5 h-5 mr-2" />
                  Download PDF Document
                  <Download className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4"
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={lightboxImage}
              alt="Enlarged view"
              className="max-w-full max-h-full rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
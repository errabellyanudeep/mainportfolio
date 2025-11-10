import React from "react";
import { motion } from "framer-motion";
import { FileText, ExternalLink, Users, Play, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PublicationsSection({ id, publications, theme }) {
  const isDark = theme === 'dark';

  return (
    <section id={id} className="relative py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Publications
          </h2>
          <div className={`w-24 h-1 bg-gradient-to-r mx-auto rounded-full ${
            isDark ? 'from-orange-400 via-pink-400 to-purple-400' : 'from-orange-600 via-pink-600 to-purple-600'
          }`} />
        </motion.div>

        <div className="grid gap-6">
          {publications.map((pub, index) => (
            <motion.div
              key={pub.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="relative group"
            >
              <div className={`backdrop-blur-2xl border rounded-2xl overflow-hidden transition-all shadow-xl ${
                isDark ? 'bg-white/10 border-white/20 hover:bg-white/15' : 'bg-white/70 border-white/40 hover:bg-white/90'
              }`}>
                <div className={`absolute -inset-1 rounded-2xl blur-xl transition-all duration-500 -z-10 ${
                  isDark 
                    ? 'bg-gradient-to-br from-orange-500/0 via-pink-500/0 to-purple-500/0 group-hover:from-orange-500/20 group-hover:via-pink-500/20 group-hover:to-purple-500/20'
                    : 'bg-gradient-to-br from-orange-300/0 via-pink-300/0 to-purple-300/0 group-hover:from-orange-300/20 group-hover:via-pink-300/20 group-hover:to-purple-300/20'
                }`} />
                
                <div className="grid md:grid-cols-[300px_1fr] gap-0">
                  {/* Image */}
                  {pub.image_url && (
                    <div className="relative h-64 md:h-full overflow-hidden">
                      <img 
                        src={pub.image_url} 
                        alt={pub.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="p-6 flex flex-col">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex-shrink-0">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <Badge className={`backdrop-blur-xl border ${
                        isDark ? 'bg-white/10 border-white/30 text-white' : 'bg-white/50 border-gray-300 text-gray-900'
                      }`}>
                        {pub.year}
                      </Badge>
                    </div>
                    
                    <h3 className={`text-xl font-bold mb-3 leading-tight transition-colors ${
                      isDark ? 'text-white group-hover:text-yellow-200' : 'text-gray-900 group-hover:text-purple-600'
                    }`}>
                      {pub.title}
                    </h3>
                    
                    <div className="mb-3">
                      <p className={`text-sm flex items-start gap-2 ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                        <Users className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{pub.authors}</span>
                      </p>
                    </div>
                    
                    <p className={`mb-4 italic ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                      {pub.journal}
                    </p>

                    {pub.abstract && (
                      <p className={`text-sm mb-4 line-clamp-3 ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                        {pub.abstract}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap gap-3 mt-auto">
                      {pub.pdf_url && (
                        <Button 
                          asChild
                          size="sm"
                          variant="outline"
                          className={`backdrop-blur-xl border ${
                            isDark 
                              ? 'bg-white/10 hover:bg-white/20 border-white/30 text-white'
                              : 'bg-white/50 hover:bg-white/70 border-gray-300 text-gray-900'
                          }`}
                        >
                          <a href={pub.pdf_url} target="_blank" rel="noopener noreferrer">
                            <FileDown className="w-4 h-4 mr-2" />
                            PDF
                          </a>
                        </Button>
                      )}
                      {pub.video_url && (
                        <Button 
                          asChild
                          size="sm"
                          variant="outline"
                          className={`backdrop-blur-xl border ${
                            isDark 
                              ? 'bg-white/10 hover:bg-white/20 border-white/30 text-white'
                              : 'bg-white/50 hover:bg-white/70 border-gray-300 text-gray-900'
                          }`}
                        >
                          <a href={pub.video_url} target="_blank" rel="noopener noreferrer">
                            <Play className="w-4 h-4 mr-2" />
                            VIDEO
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
import React from "react";
import { motion } from "framer-motion";
import { Trophy, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function AwardsSection({ id, awards, theme }) {
  const isDark = theme === 'dark';

  if (!awards || awards.length === 0) {
    return null;
  }

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
            Awards & Honors
          </h2>
          <div className={`w-24 h-1 bg-gradient-to-r mx-auto rounded-full ${
            isDark ? 'from-yellow-400 via-orange-400 to-red-400' : 'from-yellow-600 via-orange-600 to-red-600'
          }`} />
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid md:grid-cols-2 gap-6">
          {awards.map((award, index) => (
            <motion.div
              key={award.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`relative group ${index === 0 ? 'md:col-span-2' : ''}`}
            >
              <div className={`backdrop-blur-2xl border rounded-2xl p-6 md:p-8 transition-all shadow-xl overflow-hidden h-full ${
                isDark ? 'bg-white/10 border-white/20 hover:bg-white/15' : 'bg-white/70 border-white/40 hover:bg-white/90'
              }`}>
                {/* Decorative glow on hover */}
                <div className={`absolute -inset-1 rounded-2xl blur-xl transition-all duration-500 -z-10 ${
                  isDark
                    ? 'bg-gradient-to-r from-yellow-500/0 via-orange-500/0 to-red-500/0 group-hover:from-yellow-500/20 group-hover:via-orange-500/20 group-hover:to-red-500/20'
                    : 'bg-gradient-to-r from-yellow-300/0 via-orange-300/0 to-red-300/0 group-hover:from-yellow-300/20 group-hover:via-orange-300/20 group-hover:to-red-300/20'
                }`} />

                <div className={`flex gap-6 ${index === 0 ? 'md:flex-row' : 'flex-col'}`}>
                  {/* Icon or Image */}
                  <div className="flex-shrink-0">
                    {award.image_url ? (
                      <div className={`${index === 0 ? 'w-32 h-32 md:w-48 md:h-48' : 'w-full h-40'} rounded-xl overflow-hidden`}>
                        <img 
                          src={award.image_url} 
                          alt={award.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className={`p-4 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 ${
                        index === 0 ? 'w-24 h-24' : 'w-16 h-16'
                      }`}>
                        <Trophy className="w-full h-full text-white" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className={`font-bold mb-2 ${
                      index === 0 ? 'text-2xl md:text-3xl' : 'text-xl'
                    } ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {award.title}
                    </h3>
                    <p className={`mb-3 ${
                      index === 0 ? 'text-lg' : 'text-base'
                    } ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                      {award.organization}
                    </p>
                    
                    <Badge className={`backdrop-blur-xl border mb-3 ${
                      isDark ? 'bg-white/10 border-white/30 text-white' : 'bg-white/50 border-gray-300 text-gray-900'
                    }`}>
                      <Calendar className="w-3 h-3 mr-1" />
                      {award.date ? format(new Date(award.date), 'MMM dd, yyyy') : 'No date'}
                    </Badge>

                    {award.description && (
                      <p className={`leading-relaxed ${
                        index === 0 ? 'text-base' : 'text-sm'
                      } ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                        {award.description}
                      </p>
                    )}
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
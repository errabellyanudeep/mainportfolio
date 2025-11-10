import React from "react";
import { motion } from "framer-motion";
import { Calendar, Trophy, BookOpen, Sparkles, Award, Briefcase, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

const iconMap = {
  Trophy, BookOpen, Sparkles, Award, Briefcase, GraduationCap
};

export default function NewsTimeline({ id, theme }) {
  const isDark = theme === 'dark';

  const { data: newsItems, isLoading } = useQuery({
    queryKey: ['news'],
    queryFn: () => base44.entities.News.list('-date'),
    initialData: [],
  });

  if (isLoading) {
    return (
      <section id={id} className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center text-white/60">
          Loading news...
        </div>
      </section>
    );
  }

  if (newsItems.length === 0) {
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
            Latest News & Updates
          </h2>
          <div className={`w-24 h-1 bg-gradient-to-r mx-auto rounded-full ${
            isDark ? 'from-pink-400 via-purple-400 to-cyan-400' : 'from-pink-600 via-purple-600 to-cyan-600'
          }`} />
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className={`absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b ${
            isDark ? 'from-white/20 via-white/40 to-white/20' : 'from-gray-300 via-gray-400 to-gray-300'
          }`} />

          <div className="space-y-12">
            {newsItems.map((item, index) => {
              const Icon = iconMap[item.icon] || Sparkles;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative grid md:grid-cols-2 gap-8 items-center ${
                    !isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline dot */}
                  <div className={`absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full backdrop-blur-xl border-2 flex items-center justify-center ${
                    isDark ? 'bg-white/20 border-white/40' : 'bg-white/70 border-gray-300'
                  }`}>
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${item.color}`} />
                  </div>

                  {/* Content card */}
                  <div className={`${isEven ? 'md:pr-16 md:text-right' : 'md:pl-16 md:col-start-2'} ml-12 md:ml-0`}>
                    <div className={`backdrop-blur-2xl border rounded-2xl p-6 transition-all shadow-xl group overflow-hidden ${
                      isDark ? 'bg-white/10 border-white/20 hover:bg-white/15' : 'bg-white/70 border-white/40 hover:bg-white/90'
                    }`}>
                      <div className={`flex items-center gap-3 mb-3 ${isEven ? 'md:flex-row-reverse md:justify-start' : ''}`}>
                        <div className={`p-2 rounded-xl bg-gradient-to-br ${item.color}`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <Badge className={`backdrop-blur-xl border ${
                          isDark ? 'bg-white/10 border-white/20 text-white' : 'bg-white/50 border-gray-300 text-gray-900'
                        }`}>
                          <Calendar className="w-3 h-3 mr-1" />
                          {item.date ? format(new Date(item.date), 'MMM dd, yyyy') : 'No date'}
                        </Badge>
                      </div>
                      <h3 className={`text-xl font-bold mb-2 transition-colors ${
                        isDark ? 'text-white group-hover:text-yellow-200' : 'text-gray-900 group-hover:text-purple-600'
                      }`}>
                        {item.title}
                      </h3>
                      <p className={isDark ? 'text-white/70' : 'text-gray-600'}>
                        {item.description}
                      </p>
                      
                      {/* Event Image */}
                      {item.image_url && (
                        <div className="mt-4">
                          <img 
                            src={item.image_url} 
                            alt={item.title}
                            className="w-full h-48 object-cover rounded-xl shadow-lg"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
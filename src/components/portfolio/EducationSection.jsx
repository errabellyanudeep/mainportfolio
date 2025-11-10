import React from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function EducationSection({ id, education, theme }) {
  const isDark = theme === 'dark';

  const defaultEducation = [
    {
      institution: "Oklahoma State University",
      degree: "Ph.D. in Computer Science",
      period: "2024 - Present",
      location: "Stillwater, OK",
      field: "Computer Science"
    },
    {
      institution: "Oklahoma State University",
      degree: "Masters in Computer Science",
      period: "2022 - 2024",
      location: "Stillwater, OK",
      field: "Computer Science"
    },
    {
      institution: "Jawaharlal Nehru Technological University",
      degree: "Bachelors in Electronic Engineering",
      period: "2015 - 2019",
      location: "Hyderabad, India",
      field: "Electronic Engineering"
    }
  ];

  const displayData = education.length > 0 ? education : defaultEducation;

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
            Education
          </h2>
          <div className={`w-24 h-1 bg-gradient-to-r mx-auto rounded-full ${
            isDark ? 'from-cyan-400 via-blue-400 to-purple-400' : 'from-cyan-600 via-blue-600 to-purple-600'
          }`} />
        </motion.div>

        <div className="grid gap-6">
          {displayData.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="relative group"
            >
              <div className={`backdrop-blur-2xl border rounded-2xl p-6 md:p-8 transition-all shadow-xl ${
                isDark ? 'bg-white/10 border-white/20 hover:bg-white/15' : 'bg-white/70 border-white/40 hover:bg-white/90'
              }`}>
                {/* Decorative glow on hover */}
                <div className={`absolute -inset-1 rounded-2xl blur-xl transition-all duration-500 -z-10 ${
                  isDark
                    ? 'bg-gradient-to-r from-cyan-500/0 via-blue-500/0 to-purple-500/0 group-hover:from-cyan-500/20 group-hover:via-blue-500/20 group-hover:to-purple-500/20'
                    : 'bg-gradient-to-r from-cyan-300/0 via-blue-300/0 to-purple-300/0 group-hover:from-cyan-300/20 group-hover:via-blue-300/20 group-hover:to-purple-300/20'
                }`} />
                
                <div className="flex items-start gap-4">
                  {/* Graduation cap icon */}
                  <div className="relative p-4 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex-shrink-0">
                    <svg 
                      className="w-8 h-8 text-white" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Graduation cap */}
                      <path 
                        d="M12 4L2 9L12 14L22 9L12 4Z" 
                        fill="currentColor" 
                        fillOpacity="0.9"
                      />
                      <path 
                        d="M2 9V13.5C2 15.433 6.477 17 12 17C17.523 17 22 15.433 22 13.5V9" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                      <path 
                        d="M12 14V20M12 20L10 19M12 20L14 19" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {edu.degree}
                    </h3>
                    <p className={`text-xl mb-3 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                      {edu.institution}
                    </p>
                    
                    <div className="flex flex-wrap gap-3">
                      <Badge className={`backdrop-blur-xl border ${
                        isDark ? 'bg-white/10 border-white/30 text-white' : 'bg-white/50 border-gray-300 text-gray-900'
                      }`}>
                        <Calendar className="w-3 h-3 mr-1" />
                        {edu.period}
                      </Badge>
                      <Badge className={`backdrop-blur-xl border ${
                        isDark ? 'bg-white/10 border-white/30 text-white' : 'bg-white/50 border-gray-300 text-gray-900'
                      }`}>
                        <MapPin className="w-3 h-3 mr-1" />
                        {edu.location}
                      </Badge>
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
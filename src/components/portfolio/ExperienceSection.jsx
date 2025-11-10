import React from "react";
import { motion } from "framer-motion";
import { Briefcase, Calendar, MapPin, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ExperienceSection({ id, experiences, theme }) {
  const isDark = theme === 'dark';

  const defaultExperiences = [
    {
      title: "Graduate Teaching Assistant",
      company: "Oklahoma State University",
      location: "Stillwater, OK",
      period: "Spring 2024 - Present",
      description: "Teaching courses including Intro to Computer Security, Mobile App Development (Swift), Numerical Methods, and Operations of Programming Languages (Haskell, Ruby).",
      type: "teaching"
    },
    {
      title: "Graduate Research Assistant",
      company: "Oklahoma State University",
      location: "Stillwater, OK",
      period: "May 2023 - Dec 2024",
      description: "Developed GUI to coordinate line scan X-ray imaging system with Arduino and stepper motor controllers. Applied deep learning algorithms for disease detection.",
      type: "research"
    },
    {
      title: "Associate Software Developer",
      company: "Accenture Solutions Pvt. Ltd.",
      location: "India",
      period: "May 2020 - Jan 2021",
      description: "Revamped U.S. healthcare provider applications (CAQH) using C# and Web APIs. Collaborated with cross-functional teams on full-stack modules.",
      type: "work"
    }
  ];

  const displayData = experiences.length > 0 ? experiences : defaultExperiences;

  const typeColors = {
    teaching: "from-green-400 to-emerald-500",
    research: "from-purple-400 to-pink-500",
    work: "from-blue-400 to-cyan-500"
  };

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
            Experience
          </h2>
          <div className={`w-24 h-1 bg-gradient-to-r mx-auto rounded-full ${
            isDark ? 'from-green-400 via-emerald-400 to-cyan-400' : 'from-green-600 via-emerald-600 to-cyan-600'
          }`} />
        </motion.div>

        <div className="grid gap-6">
          {displayData.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="relative group"
            >
              <div className={`backdrop-blur-2xl border rounded-2xl p-6 md:p-8 transition-all shadow-xl ${
                isDark ? 'bg-white/10 border-white/20 hover:bg-white/15' : 'bg-white/70 border-white/40 hover:bg-white/90'
              }`}>
                <div className={`absolute -inset-1 rounded-2xl blur-xl transition-all duration-500 -z-10 ${
                  isDark
                    ? 'bg-gradient-to-r from-green-500/0 to-cyan-500/0 group-hover:from-green-500/20 group-hover:to-cyan-500/20'
                    : 'bg-gradient-to-r from-green-300/0 to-cyan-300/0 group-hover:from-green-300/20 group-hover:to-cyan-300/20'
                }`} />
                
                <div className="flex items-start gap-4">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${typeColors[exp.type] || typeColors.work} flex-shrink-0`}>
                    <Briefcase className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {exp.title}
                        </h3>
                        <p className={`text-lg flex items-center gap-2 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                          <Building2 className="w-4 h-4" />
                          {exp.company}
                        </p>
                      </div>
                      <Badge className={`backdrop-blur-xl bg-gradient-to-r ${typeColors[exp.type]} border-0 text-white text-sm px-4 py-1`}>
                        {exp.type}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 mb-4">
                      <Badge className={`backdrop-blur-xl border ${
                        isDark ? 'bg-white/10 border-white/30 text-white' : 'bg-white/50 border-gray-300 text-gray-900'
                      }`}>
                        <Calendar className="w-3 h-3 mr-1" />
                        {exp.period}
                      </Badge>
                      <Badge className={`backdrop-blur-xl border ${
                        isDark ? 'bg-white/10 border-white/30 text-white' : 'bg-white/50 border-gray-300 text-gray-900'
                      }`}>
                        <MapPin className="w-3 h-3 mr-1" />
                        {exp.location}
                      </Badge>
                    </div>
                    
                    <p className={`leading-relaxed ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                      {exp.description}
                    </p>
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
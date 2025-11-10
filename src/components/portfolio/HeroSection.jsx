import React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Download, ChevronDown, GraduationCap, Music, Dumbbell, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

export default function HeroSection({ id, theme }) {
  const isDark = theme === 'dark';

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const allSettings = await base44.entities.Settings.list();
      return allSettings[0] || {
        hero_title: "Anudeep Rao Errabelly",
        hero_subtitle: "Computer Science Researcher at Oklahoma State University",
        hero_description: "Specializing in AI, Machine Learning, and Computer Vision. Passionate about solving real-world problems through innovative technology.",
        github_url: "https://github.com/errabellyanudeep?tab=repositories",
        linkedin_url: "https://www.linkedin.com/in/deeperrabelly/",
        scholar_url: "https://scholar.google.com/citations?user=QiIDGPwAAAAJ&hl=en",
        calendly_url: "https://calendly.com/meetwithdeep/30min",
        profile_image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop",
        resume_url: ""
      };
    },
  });

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const hobbies = [
    { icon: Music, label: "Piano", color: "from-purple-400 to-pink-500" },
    { icon: Dumbbell, label: "Fitness", color: "from-orange-400 to-red-500" },
    { icon: BookOpen, label: "Reading", color: "from-blue-400 to-cyan-500" }
  ];

  return (
    <section id={id} className="relative min-h-screen flex items-center justify-center px-4 py-20 pt-32">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Main elegant card */}
          <div className={`relative backdrop-blur-3xl border rounded-[2rem] p-8 md:p-16 shadow-2xl overflow-hidden ${
            isDark 
              ? 'bg-gradient-to-br from-slate-900/40 via-purple-900/30 to-slate-900/40 border-amber-500/20' 
              : 'bg-gradient-to-br from-white/80 via-amber-50/60 to-white/80 border-amber-200/40'
          }`}>
            {/* Elegant corner decorations */}
            <div className={`absolute top-0 left-0 w-32 h-32 ${
              isDark 
                ? 'bg-gradient-to-br from-amber-500/10 to-transparent' 
                : 'bg-gradient-to-br from-amber-300/20 to-transparent'
            } rounded-br-full`} />
            <div className={`absolute bottom-0 right-0 w-32 h-32 ${
              isDark 
                ? 'bg-gradient-to-tl from-amber-500/10 to-transparent' 
                : 'bg-gradient-to-tl from-amber-300/20 to-transparent'
            } rounded-tl-full`} />

            {/* Warm glow effect */}
            <div className={`absolute -inset-2 rounded-[2rem] blur-3xl -z-10 ${
              isDark 
                ? 'bg-gradient-to-r from-amber-600/15 via-orange-500/15 to-amber-600/15'
                : 'bg-gradient-to-r from-amber-300/25 via-orange-200/25 to-amber-300/25'
            }`} />
            
            <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
              {/* Left side - Text content */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  <h1 className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {settings?.hero_title?.split(' ').slice(0, 2).join(' ')}
                    <br />
                    <span className={`bg-gradient-to-r bg-clip-text text-transparent ${
                      isDark 
                        ? 'from-amber-400 via-orange-400 to-amber-500'
                        : 'from-amber-600 via-orange-600 to-amber-700'
                    }`}>
                      {settings?.hero_title?.split(' ').slice(2).join(' ')}
                    </span>
                  </h1>

                  {/* Hobbies Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="mb-6"
                  >
                    <p className={`text-sm font-semibold mb-3 ${isDark ? 'text-amber-300/80' : 'text-amber-700/80'}`}>
                      Hobbies
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {hobbies.map((hobby, idx) => {
                        const Icon = hobby.icon;
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + idx * 0.1, duration: 0.4 }}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className={`backdrop-blur-xl border-2 rounded-xl px-4 py-2.5 flex items-center gap-2 transition-all shadow-lg ${
                              isDark 
                                ? 'bg-white/5 border-amber-400/20 hover:bg-white/10 hover:border-amber-400/40'
                                : 'bg-white/40 border-amber-200/40 hover:bg-white/60 hover:border-amber-300/60'
                            }`}
                          >
                            <div className={`p-1.5 rounded-lg bg-gradient-to-br ${hobby.color}`}>
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {hobby.label}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                  
                  <p className={`text-xl md:text-2xl font-semibold mb-4 ${isDark ? 'text-amber-100/90' : 'text-gray-800'}`}>
                    {settings?.hero_subtitle || "Computer Science Researcher at Oklahoma State University"}
                  </p>
                  
                  <p className={`leading-relaxed text-base md:text-lg text-justify ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                    {settings?.hero_description || "Specializing in AI, Machine Learning, and Computer Vision. Passionate about solving real-world problems through innovative technology."}
                  </p>
                </motion.div>

                {/* Action buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="flex flex-wrap gap-4"
                >
                  <Button 
                    onClick={scrollToContact} 
                    className={`backdrop-blur-xl border-2 shadow-lg hover:shadow-xl transition-all ${
                      isDark 
                        ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 border-amber-500/50 text-white'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 border-amber-400 text-white'
                    }`}
                    size="lg"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Get in Touch
                  </Button>
                  {settings?.resume_url && (
                    <Button 
                      asChild 
                      variant="outline" 
                      size="lg"
                      className={`backdrop-blur-xl border-2 shadow-lg hover:shadow-xl transition-all ${
                        isDark 
                          ? 'bg-white/5 hover:bg-white/10 border-amber-400/30 text-amber-300 hover:text-amber-200'
                          : 'bg-white/60 hover:bg-white/80 border-amber-300/50 text-amber-800 hover:text-amber-900'
                      }`}
                    >
                      <a href={settings.resume_url} target="_blank" rel="noopener noreferrer" download>
                        <Download className="w-5 h-5 mr-2" />
                        Download CV
                      </a>
                    </Button>
                  )}
                </motion.div>

                {/* Social links */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="flex gap-3 pt-4"
                >
                  {[
                    { url: settings?.github_url, icon: Github },
                    { url: settings?.linkedin_url, icon: Linkedin },
                    { url: settings?.scholar_url, icon: GraduationCap }
                  ].map((social, idx) => {
                    const Icon = social.icon;
                    return (
                      <a 
                        key={idx}
                        href={social.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={`p-3 rounded-xl backdrop-blur-xl border-2 transition-all hover:scale-110 ${
                          isDark 
                            ? 'bg-white/5 hover:bg-amber-500/10 border-amber-400/20 hover:border-amber-400/40'
                            : 'bg-white/40 hover:bg-amber-100/60 border-amber-200/40 hover:border-amber-300/60'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isDark ? 'text-amber-300' : 'text-amber-700'}`} />
                      </a>
                    );
                  })}
                </motion.div>
              </div>

              {/* Right side - Image with elegant blend */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="relative"
              >
                <div className="relative w-full max-w-md mx-auto">
                  {/* Subtle ambient glow behind image */}
                  <div className={`absolute -inset-8 rounded-full blur-3xl opacity-30 -z-10 ${
                    isDark 
                      ? 'bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-amber-500/20'
                      : 'bg-gradient-to-br from-purple-300/30 via-pink-300/30 to-amber-300/30'
                  }`} />
                  
                  {/* Image with elegant fade effect */}
                  <div className="relative aspect-square w-full rounded-3xl overflow-hidden shadow-2xl">
                    {/* Gradient overlay for seamless blend */}
                    <div className={`absolute inset-0 z-10 ${
                      isDark
                        ? 'bg-gradient-to-t from-slate-900/40 via-transparent to-transparent'
                        : 'bg-gradient-to-t from-amber-50/40 via-transparent to-transparent'
                    }`} />
                    
                    <img
                      src={settings?.profile_image_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Floating accent particles */}
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.5, 0.3] 
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className={`absolute -top-4 -right-4 w-20 h-20 rounded-full blur-2xl ${
                      isDark 
                        ? 'bg-amber-400/20' 
                        : 'bg-amber-300/30'
                    }`}
                  />
                  <motion.div
                    animate={{ 
                      scale: [1, 1.3, 1],
                      opacity: [0.2, 0.4, 0.2] 
                    }}
                    transition={{ 
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                    className={`absolute -bottom-6 -left-6 w-24 h-24 rounded-full blur-2xl ${
                      isDark 
                        ? 'bg-purple-500/20' 
                        : 'bg-purple-300/30'
                    }`}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Elegant scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className={`text-sm font-medium ${isDark ? 'text-amber-300/80' : 'text-amber-700/80'}`}>Explore More</span>
            <ChevronDown className={`w-6 h-6 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
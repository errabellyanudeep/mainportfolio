import React from "react";
import { motion } from "framer-motion";
import { Home, Newspaper, Users, GraduationCap, Briefcase, BookOpen, Award, Shield, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FixedHeader({ activeSection, theme, isAdmin, onAdminClick, settings }) {
  const isDark = theme === 'dark';

  // Build navigation items based on settings
  const navItems = [
    { id: "home", icon: Home, label: "Home", alwaysShow: true }
  ];

  if (settings?.show_news !== false) {
    navItems.push({ id: "news", icon: Newspaper, label: "News" });
  }
  if (settings?.show_collaborations !== false) {
    navItems.push({ id: "collaborations", icon: Users, label: "Collaborations" });
  }
  if (settings?.show_education !== false) {
    navItems.push({ id: "education", icon: GraduationCap, label: "Education" });
  }
  if (settings?.show_experience !== false) {
    navItems.push({ id: "experience", icon: Briefcase, label: "Experience" });
  }
  if (settings?.show_publications !== false) {
    navItems.push({ id: "publications", icon: BookOpen, label: "Publications" });
  }
  if (settings?.show_awards !== false) {
    navItems.push({ id: "awards", icon: Award, label: "Awards" });
  }
  if (settings?.show_certifications !== false) {
    navItems.push({ id: "certifications", icon: FileCheck, label: "Certifications" });
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl border-b transition-all ${
        isDark 
          ? 'bg-slate-900/80 border-white/10' 
          : 'bg-white/80 border-gray-200'
      }`}
      style={{
        boxShadow: '0 4px 30px rgba(0,0,0,0.1)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo/Title */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => scrollToSection('home')}
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg ${
              isDark ? 'shadow-purple-500/50' : 'shadow-purple-500/30'
            }`}>
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className={`font-bold text-xl hidden md:block ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Portfolio
            </span>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                    isActive
                      ? isDark
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : isDark
                        ? 'text-white/70 hover:text-white hover:bg-white/10'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute inset-0 rounded-xl"
                      style={{
                        boxShadow: isDark 
                          ? '0 0 20px rgba(168, 85, 247, 0.4)' 
                          : '0 0 20px rgba(168, 85, 247, 0.3)'
                      }}
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Button
              onClick={onAdminClick}
              className={`backdrop-blur-xl border-2 gap-2 ${
                isDark
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 border-amber-500/50 text-white'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 border-amber-400 text-white'
              }`}
              style={{
                boxShadow: '0 4px 15px rgba(251, 146, 60, 0.3)'
              }}
            >
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Admin</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="lg:hidden flex items-center gap-1 mt-3 overflow-x-auto pb-2 scrollbar-hide">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`flex-shrink-0 px-3 py-2 rounded-lg transition-all flex items-center gap-2 text-xs ${
                  isActive
                    ? isDark
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : isDark
                      ? 'text-white/70 hover:text-white hover:bg-white/10'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span className="font-medium whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </motion.header>
  );
}
import React from "react";
import { Home, User, GraduationCap, Briefcase, BookOpen, Award, Mail } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { id: "home", icon: Home, label: "Home" },
  { id: "about", icon: User, label: "About" },
  { id: "education", icon: GraduationCap, label: "Education" },
  { id: "experience", icon: Briefcase, label: "Experience" },
  { id: "publications", icon: BookOpen, label: "Publications" },
  { id: "awards", icon: Award, label: "Awards" },
  { id: "contact", icon: Mail, label: "Contact" },
];

export default function FloatingNav({ activeSection, theme }) {
  const isDark = theme === 'dark';

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed left-1/2 bottom-8 -translate-x-1/2 z-50 backdrop-blur-2xl border-2 rounded-full p-2 shadow-2xl ${
      isDark 
        ? 'bg-gradient-to-r from-slate-900/50 via-purple-900/50 to-slate-900/50 border-amber-500/20' 
        : 'bg-gradient-to-r from-white/70 via-amber-50/70 to-white/70 border-amber-300/40'
    }`}>
      <div className="flex items-center gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`relative p-3 rounded-full transition-all ${
                isActive
                  ? isDark
                    ? 'bg-gradient-to-br from-amber-600/40 to-orange-600/40 text-amber-300 shadow-lg'
                    : 'bg-gradient-to-br from-amber-400/60 to-orange-400/60 text-amber-900 shadow-lg'
                  : isDark
                    ? 'text-amber-300/60 hover:text-amber-300 hover:bg-amber-500/10'
                    : 'text-amber-700/60 hover:text-amber-800 hover:bg-amber-200/40'
              }`}
              title={item.label}
            >
              <Icon className="w-5 h-5" />
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className={`absolute inset-0 rounded-full -z-10 ${
                    isDark
                      ? 'bg-gradient-to-br from-amber-600/30 to-orange-600/30'
                      : 'bg-gradient-to-br from-amber-400/50 to-orange-400/50'
                  }`}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
import React from "react";
import { motion } from "framer-motion";

export default function Footer({ theme }) {
  const isDark = theme === 'dark';
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`relative py-12 px-4 border-t backdrop-blur-xl ${
      isDark 
        ? 'bg-slate-900/50 border-white/10' 
        : 'bg-white/50 border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
            © {currentYear} Anudeep Errabelly. All Rights Reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
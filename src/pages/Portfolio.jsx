import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import HeroSection from "../components/portfolio/HeroSection";
import NewsTimeline from "../components/portfolio/NewsTimeline";
import EducationSection from "../components/portfolio/EducationSection";
import ExperienceSection from "../components/portfolio/ExperienceSection";
import PublicationsSection from "../components/portfolio/PublicationsSection";
import AwardsSection from "../components/portfolio/AwardsSection";
import CertificationsSection from "../components/portfolio/CertificationsSection";
import ContactSection from "../components/portfolio/ContactSection";
import DynamicSection from "../components/portfolio/DynamicSection";
import DeskLampToggle from "../components/portfolio/DeskLampToggle";
import FixedHeader from "../components/portfolio/FixedHeader";
import Footer from "../components/portfolio/Footer";
import CollaborationNetwork from "../components/portfolio/CollaborationNetwork";

const INACTIVITY_TIMEOUT = 120000; // 120 seconds

export default function Portfolio() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("home");
  const [scrollY, setScrollY] = useState(0);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [isAdmin, setIsAdmin] = useState(false);
  const [inactivityTimer, setInactivityTimer] = useState(null);

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const allSettings = await base44.entities.Settings.list();
      return allSettings[0] || {
        show_news: true,
        show_collaborations: true,
        show_education: true,
        show_experience: true,
        show_publications: true,
        show_awards: true,
        show_certifications: true
      };
    },
  });

  const { data: publications } = useQuery({
    queryKey: ['publications'],
    queryFn: () => base44.entities.Publication.list('display_order'),
    initialData: [],
  });

  const { data: experiences } = useQuery({
    queryKey: ['experiences'],
    queryFn: () => base44.entities.Experience.list(),
    initialData: [],
  });

  const { data: education } = useQuery({
    queryKey: ['education'],
    queryFn: () => base44.entities.Education.list(),
    initialData: [],
  });

  const { data: awards } = useQuery({
    queryKey: ['awards'],
    queryFn: () => base44.entities.Award.list('-date'),
    initialData: [],
  });

  const { data: certifications } = useQuery({
    queryKey: ['certifications'],
    queryFn: () => base44.entities.Certification.list('-issue_date'),
    initialData: [],
  });

  const { data: customSections } = useQuery({
    queryKey: ['customSections'],
    queryFn: async () => {
      const sections = await base44.entities.PortfolioSection.list('display_order');
      return sections.filter(s => s.visible);
    },
    initialData: [],
  });

  // Auto-logout functionality
  const handleAutoLogout = useCallback(() => {
    localStorage.removeItem('adminSession');
    setIsAdmin(false);
  }, []);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }

    const timer = setTimeout(() => {
      handleAutoLogout();
    }, INACTIVITY_TIMEOUT);

    setInactivityTimer(timer);
  }, [inactivityTimer, handleAutoLogout]);

  useEffect(() => {
    if (isAdmin) {
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
      
      events.forEach(event => {
        document.addEventListener(event, resetInactivityTimer);
      });

      resetInactivityTimer();

      return () => {
        if (inactivityTimer) {
          clearTimeout(inactivityTimer);
        }
        events.forEach(event => {
          document.removeEventListener(event, resetInactivityTimer);
        });
      };
    }
  }, [isAdmin, resetInactivityTimer]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Check if user is authenticated admin
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const user = await base44.auth.me();
        // Only allow admin if user role is 'admin' or email matches
        if (user && (user.role === 'admin' || user.email === 'errabellyanudeep@gmail.com')) {
          const savedSession = localStorage.getItem('adminSession');
          if (savedSession) {
            const session = JSON.parse(savedSession);
            if (Date.now() - session.timestamp < 86400000) {
              setIsAdmin(true);
              return;
            }
          }
        }
        setIsAdmin(false);
      } catch (error) {
        setIsAdmin(false);
      }
    };
    
    checkAdmin();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      const sections = ['home', 'news', 'collaborations', 'education', 'experience', 'publications', 'awards', 'certifications', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 150 && rect.bottom >= 150;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleAdminClick = async () => {
    try {
      // Check if user is already authenticated
      const user = await base44.auth.me();
      if (user && (user.role === 'admin' || user.email === 'errabellyanudeep@gmail.com')) {
        const session = {
          timestamp: Date.now()
        };
        localStorage.setItem('adminSession', JSON.stringify(session));
        setIsAdmin(true);
        navigate(createPageUrl("Admin"));
      } else {
        // Redirect to login page
        base44.auth.redirectToLogin(window.location.href);
      }
    } catch (error) {
      // User not logged in, redirect to login
      base44.auth.redirectToLogin(window.location.href);
    }
  };

  return (
    <div className={`relative min-h-screen overflow-hidden transition-colors duration-700 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900' 
        : 'bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50'
    }`}>
      {/* Elegant ambient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute top-0 left-0 w-[600px] h-[600px] rounded-full blur-3xl ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-amber-600/10 via-orange-600/10 to-transparent'
              : 'bg-gradient-to-br from-amber-300/20 via-orange-300/20 to-transparent'
          }`} 
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className={`absolute top-1/3 right-0 w-[600px] h-[600px] rounded-full blur-3xl ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-transparent'
              : 'bg-gradient-to-br from-purple-300/20 via-pink-300/20 to-transparent'
          }`} 
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
          className={`absolute bottom-0 left-1/4 w-[600px] h-[600px] rounded-full blur-3xl ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-indigo-600/10 via-blue-600/10 to-transparent'
              : 'bg-gradient-to-br from-indigo-300/20 via-blue-300/20 to-transparent'
          }`} 
        />
      </div>

      {/* Fixed Header with Navigation */}
      <FixedHeader 
        activeSection={activeSection} 
        theme={theme} 
        isAdmin={isAdmin}
        onAdminClick={handleAdminClick}
        settings={settings}
      />

      {/* Desk Lamp Theme Toggle */}
      <DeskLampToggle theme={theme} onToggle={toggleTheme} />

      {/* Main Content */}
      <div className="relative">
        <HeroSection id="home" theme={theme} />
        
        {customSections.map((section) => (
          <DynamicSection key={section.id} section={section} theme={theme} />
        ))}
        
        {settings?.show_news !== false && <NewsTimeline id="news" theme={theme} />}
        {settings?.show_collaborations !== false && <CollaborationNetwork id="collaborations" theme={theme} />}
        {settings?.show_education !== false && <EducationSection id="education" education={education} theme={theme} />}
        {settings?.show_experience !== false && <ExperienceSection id="experience" experiences={experiences} theme={theme} />}
        {settings?.show_publications !== false && <PublicationsSection id="publications" publications={publications} theme={theme} />}
        {settings?.show_awards !== false && <AwardsSection id="awards" awards={awards} theme={theme} />}
        {settings?.show_certifications !== false && <CertificationsSection id="certifications" certifications={certifications} theme={theme} />}
        <ContactSection id="contact" theme={theme} />
        
        <Footer theme={theme} />
      </div>

      {/* Elegant scroll to top */}
      <AnimatePresence>
        {scrollY > 500 && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.3 }}
            className={`fixed bottom-8 right-8 p-4 rounded-full backdrop-blur-xl border-2 shadow-2xl z-50 ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-amber-900/30 to-orange-900/30 border-amber-500/40 hover:border-amber-400/60'
                : 'bg-gradient-to-br from-amber-100/80 to-orange-100/80 border-amber-300/50 hover:border-amber-400/70'
            }`}
          >
            <ChevronUp className={`w-6 h-6 ${theme === 'dark' ? 'text-amber-300' : 'text-amber-700'}`} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
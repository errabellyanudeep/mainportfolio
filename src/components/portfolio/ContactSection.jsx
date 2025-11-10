
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Send, Github, Linkedin, MessageSquare, CheckCircle, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

export default function ContactSection({ id, theme }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [animationStage, setAnimationStage] = useState('walking');

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const allSettings = await base44.entities.Settings.list();
      return allSettings[0] || {
        github_url: "https://github.com/errabellyanudeep?tab=repositories",
        linkedin_url: "https://www.linkedin.com/in/deeperrabelly/",
        scholar_url: "https://scholar.google.com/citations?user=QiIDGPwAAAAJ&hl=en",
        calendly_url: "https://calendly.com/meetwithdeep/30min",
        email: "anudeep@okstate.edu"
      };
    },
  });

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimationStage('preparing'), 2500);
    const timer2 = setTimeout(() => setAnimationStage('throwing'), 3000);
    const timer3 = setTimeout(() => setAnimationStage('flying'), 3200);
    const timer4 = setTimeout(() => setAnimationStage('transforming'), 4500);
    const timer5 = setTimeout(() => setAnimationStage('form'), 5200);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await base44.integrations.Core.SendEmail({
        from_name: `Portfolio Contact: ${formData.name}`,
        to: 'errabellyanudeep@gmail.com',
        subject: `New Message from ${formData.name}`,
        body: `Name: ${formData.name}
Email: ${formData.email}

Message:
${formData.message}`
      });

      setStatus({ type: 'success', message: 'Message sent successfully!' });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to send message. Please try again.' });
    }

    setLoading(false);
  };

  const isDark = theme === 'dark';

  return (
    <section id={id} className="relative py-20 px-4 mb-20 overflow-hidden" style={{ perspective: '2000px' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Get In Touch
          </h2>
          <div className={`w-24 h-1 bg-gradient-to-r mx-auto rounded-full ${
            isDark ? 'from-blue-400 via-purple-400 to-pink-400' : 'from-blue-600 via-purple-600 to-pink-600'
          }`} />
        </motion.div>

        <div className="relative min-h-[750px] flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
          <AnimatePresence mode="wait">
            {/* Walking Character with 3D perspective */}
            {(animationStage === 'walking' || animationStage === 'preparing' || animationStage === 'throwing') && (
              <motion.div
                key="character"
                className="absolute"
                initial={{ x: '-100vw', opacity: 0, rotateY: -30 }}
                animate={{ 
                  x: animationStage === 'walking' ? ['-100vw', '-40%'] : '-40%',
                  opacity: 1,
                  rotateY: animationStage === 'walking' ? [-30, 0] : 0,
                }}
                exit={{ 
                  x: '-100vw', 
                  opacity: 0,
                  rotateY: -30
                }}
                transition={{ 
                  duration: animationStage === 'walking' ? 2.5 : 0,
                  ease: "easeOut"
                }}
                style={{ 
                  bottom: '120px', 
                  left: '50%',
                  transformStyle: 'preserve-3d'
                }}
              >
                <div className="relative" style={{ 
                  filter: 'drop-shadow(20px 30px 40px rgba(0,0,0,0.4))',
                  transform: 'translateZ(50px)'
                }}>
                  {/* Character Head with 3D depth */}
                  <motion.div
                    animate={
                      animationStage === 'walking' ? {
                        y: [0, -8, 0],
                        rotate: [0, -3, 0, 3, 0],
                        rotateX: [0, -5, 0]
                      } : animationStage === 'preparing' ? {
                        rotate: [-3, 10],
                        rotateX: [-5, 5]
                      } : {
                        rotate: [10, -15],
                        rotateX: [5, -10]
                      }
                    }
                    transition={{
                      duration: animationStage === 'walking' ? 0.8 : 0.3,
                      repeat: animationStage === 'walking' ? Infinity : 0,
                    }}
                    className="relative z-10"
                    style={{ 
                      transformOrigin: 'bottom center',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    <div className={`w-24 h-24 rounded-full border-4 relative ${
                      isDark 
                        ? 'border-amber-400/50 bg-gradient-to-br from-amber-100 to-orange-200' 
                        : 'border-amber-400 bg-gradient-to-br from-amber-100 to-orange-200'
                    }`}
                    style={{
                      boxShadow: '0 20px 40px rgba(0,0,0,0.3), inset 0 2px 10px rgba(255,255,255,0.5)'
                    }}>
                      {/* 3D lighting effect */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 to-transparent" 
                        style={{ transform: 'translateZ(5px)' }} />
                      
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative w-full h-full">
                          {/* Eyes with depth */}
                          <div className="absolute top-7 left-6 w-3 h-3 bg-gray-800 rounded-full"
                            style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)' }} />
                          <div className="absolute top-7 right-6 w-3 h-3 bg-gray-800 rounded-full"
                            style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)' }} />
                          {/* Smile with depth */}
                          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-10 h-4 border-b-3 border-gray-800 rounded-full"
                            style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }} />
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Character Body with 3D gradient */}
                  <motion.div
                    animate={animationStage === 'walking' ? {
                      scaleY: [1, 0.97, 1],
                    } : {}}
                    transition={{
                      duration: 0.8,
                      repeat: animationStage === 'walking' ? Infinity : 0
                    }}
                    className={`w-20 h-28 -mt-2 mx-auto rounded-t-3xl rounded-b-2xl relative ${
                      isDark 
                        ? 'bg-gradient-to-b from-blue-600 to-blue-700' 
                        : 'bg-gradient-to-b from-blue-500 to-blue-600'
                    }`}
                    style={{
                      boxShadow: '0 15px 30px rgba(0,0,0,0.3), inset 0 2px 10px rgba(255,255,255,0.2)',
                      transform: 'translateZ(30px)'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-t-3xl rounded-b-2xl" />
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-blue-400 rounded shadow-sm" />
                  </motion.div>

                  {/* Arms with 3D depth */}
                  <motion.div
                    className="absolute top-20 left-1"
                    animate={animationStage === 'walking' ? {
                      rotate: [20, -20, 20],
                    } : {
                      rotate: 20
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: animationStage === 'walking' ? Infinity : 0
                    }}
                    style={{ 
                      transformOrigin: 'top center',
                      filter: 'drop-shadow(5px 10px 10px rgba(0,0,0,0.3))'
                    }}
                  >
                    <div className={`w-5 h-24 rounded-full ${isDark ? 'bg-blue-600' : 'bg-blue-500'}`}
                      style={{ boxShadow: 'inset -2px 0 5px rgba(0,0,0,0.3)' }} />
                    <div className={`w-6 h-6 rounded-full mx-auto ${
                      isDark ? 'bg-amber-200' : 'bg-amber-100'
                    }`} style={{ boxShadow: '0 3px 8px rgba(0,0,0,0.3)' }} />
                  </motion.div>

                  {/* Right Arm holding briefcase with 3D effect */}
                  <motion.div
                    className="absolute top-20 right-1"
                    animate={
                      animationStage === 'walking' ? {
                        rotate: [-20, 20, -20],
                      } : animationStage === 'preparing' ? {
                        rotate: [-20, -80, -100],
                        y: [0, -15, -25]
                      } : animationStage === 'throwing' ? {
                        rotate: [-100, -45],
                        y: [-25, -10]
                      } : {}
                    }
                    transition={{
                      duration: animationStage === 'walking' ? 0.8 : 0.3,
                      repeat: animationStage === 'walking' ? Infinity : 0,
                    }}
                    style={{ 
                      transformOrigin: 'top center',
                      filter: 'drop-shadow(5px 10px 10px rgba(0,0,0,0.3))'
                    }}
                  >
                    <div className={`w-5 h-24 rounded-full ${isDark ? 'bg-blue-600' : 'bg-blue-500'}`}
                      style={{ boxShadow: 'inset 2px 0 5px rgba(0,0,0,0.3)' }} />
                    <div className="relative">
                      <div className={`w-6 h-6 rounded-full mx-auto ${
                        isDark ? 'bg-amber-200' : 'bg-amber-100'
                      }`} style={{ boxShadow: '0 3px 8px rgba(0,0,0,0.3)' }} />
                      
                      {/* 3D Briefcase */}
                      <motion.div
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2"
                        animate={animationStage === 'walking' ? {
                          rotate: [5, -5, 5],
                          rotateY: [-5, 5, -5]
                        } : {}}
                        transition={{
                          duration: 0.8,
                          repeat: animationStage === 'walking' ? Infinity : 0
                        }}
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        <div className={`w-14 h-11 rounded-lg relative ${
                          isDark 
                            ? 'bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900' 
                            : 'bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800'
                        }`}
                        style={{
                          boxShadow: '0 10px 25px rgba(0,0,0,0.5), inset 0 2px 5px rgba(255,255,255,0.3)',
                          transform: 'translateZ(10px)'
                        }}>
                          {/* 3D side panel effect */}
                          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />
                          
                          {/* Handle with depth */}
                          <div className={`absolute -top-2 left-1/2 -translate-x-1/2 w-7 h-3 border-3 rounded-t-lg ${
                            isDark ? 'border-amber-600' : 'border-amber-500'
                          }`} 
                          style={{ 
                            boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.3)',
                            background: `linear-gradient(to bottom, ${isDark ? '#d97706' : '#f59e0b'}, transparent)`
                          }} />
                          
                          {/* Lock with 3D effect */}
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-yellow-400 rounded-sm"
                            style={{ 
                              boxShadow: '0 2px 5px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.5)',
                              transform: 'translateZ(5px)'
                            }}>
                            <div className="absolute inset-1 bg-amber-900 rounded-full" />
                          </div>
                          
                          {/* Detail lines */}
                          <div className="absolute top-1.5 left-1 right-1 h-px bg-amber-900/50" />
                          <div className="absolute bottom-1.5 left-1 right-1 h-px bg-amber-400/30" />
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Legs with 3D shadows */}
                  <motion.div
                    className="absolute top-40 left-4"
                    animate={animationStage === 'walking' ? {
                      rotate: [0, 30, -30, 0],
                    } : {
                      rotate: 0
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: animationStage === 'walking' ? Infinity : 0
                    }}
                    style={{ 
                      transformOrigin: 'top center',
                      filter: 'drop-shadow(5px 10px 10px rgba(0,0,0,0.3))'
                    }}
                  >
                    <div className={`w-6 h-18 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-800'}`}
                      style={{ boxShadow: 'inset -2px 0 5px rgba(0,0,0,0.4)' }} />
                    <div className={`w-8 h-5 rounded-full ${isDark ? 'bg-gray-900' : 'bg-black'}`}
                      style={{ boxShadow: '0 3px 8px rgba(0,0,0,0.5)' }} />
                  </motion.div>

                  <motion.div
                    className="absolute top-40 right-4"
                    animate={animationStage === 'walking' ? {
                      rotate: [0, -30, 30, 0],
                    } : {
                      rotate: 0
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: animationStage === 'walking' ? Infinity : 0
                    }}
                    style={{ 
                      transformOrigin: 'top center',
                      filter: 'drop-shadow(5px 10px 10px rgba(0,0,0,0.3))'
                    }}
                  >
                    <div className={`w-6 h-18 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-800'}`}
                      style={{ boxShadow: 'inset 2px 0 5px rgba(0,0,0,0.4)' }} />
                    <div className={`w-8 h-5 rounded-full ${isDark ? 'bg-gray-900' : 'bg-black'}`}
                      style={{ boxShadow: '0 3px 8px rgba(0,0,0,0.5)' }} />
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Flying Briefcase with dramatic 3D rotation */}
            {(animationStage === 'flying' || animationStage === 'transforming') && (
              <motion.div
                key="briefcase"
                className="absolute"
                initial={{ 
                  x: '-40%',
                  y: '50px',
                  rotateX: 0,
                  rotateY: 0,
                  rotateZ: 0,
                  scale: 0.6
                }}
                animate={
                  animationStage === 'flying' ? {
                    x: ['50%', '50%'],
                    y: ['50px', '-100px', '0px'],
                    rotateX: [0, 180, 360, 540],
                    rotateY: [0, 360, 720, 1080],
                    rotateZ: [0, 180, 360, 540],
                    scale: [0.6, 1.8, 1.2]
                  } : {
                    scale: [1.2, 2, 0],
                    rotateX: [540, 720],
                    rotateY: [1080, 1440],
                    opacity: [1, 0.8, 0]
                  }
                }
                transition={{
                  duration: animationStage === 'flying' ? 1.3 : 0.7,
                  ease: "easeOut"
                }}
                style={{ 
                  left: '50%',
                  top: '50%',
                  translateX: '-50%',
                  translateY: '-50%',
                  transformStyle: 'preserve-3d'
                }}
              >
                <div className={`w-32 h-24 rounded-xl relative ${
                  isDark 
                    ? 'bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900' 
                    : 'bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800'
                }`}
                style={{
                  boxShadow: '0 25px 50px rgba(0,0,0,0.6), inset 0 3px 10px rgba(255,255,255,0.3)',
                  transform: 'translateZ(30px)'
                }}>
                  {/* 3D depth panels */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent" 
                    style={{ transform: 'translateZ(2px)' }} />
                  <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-amber-900/50 to-transparent rounded-l-xl" 
                    style={{ transform: 'translateZ(-2px)' }} />
                  <div className="absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-amber-900/50 to-transparent rounded-r-xl" 
                    style={{ transform: 'translateZ(-2px)' }} />
                  
                  {/* Handle with 3D depth */}
                  <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-14 h-5 border-4 rounded-t-xl ${
                    isDark ? 'border-amber-600' : 'border-amber-500'
                  }`}
                  style={{
                    background: `linear-gradient(to bottom, ${isDark ? '#d97706' : '#f59e0b'}, transparent)`,
                    boxShadow: 'inset 0 -3px 6px rgba(0,0,0,0.4)',
                    transform: 'translateZ(10px)'
                  }} />
                  
                  {/* Lock with realistic depth */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 bg-yellow-400 rounded-lg flex items-center justify-center"
                    style={{
                      boxShadow: '0 4px 10px rgba(0,0,0,0.5), inset 0 2px 5px rgba(255,255,255,0.5)',
                      transform: 'translateZ(15px)'
                    }}>
                    <div className="w-3 h-3 bg-amber-900 rounded-full" 
                      style={{ boxShadow: 'inset 0 2px 3px rgba(0,0,0,0.6)' }} />
                  </div>
                  
                  {/* Detail lines with depth */}
                  <div className="absolute top-3 left-3 right-3 h-px bg-amber-900/50" />
                  <div className="absolute bottom-3 left-3 right-3 h-px bg-amber-400/40" />
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-amber-900/30" />
                </div>

                {/* Enhanced motion trail particles with glow */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-4 h-4 rounded-full"
                    style={{
                      left: '50%',
                      top: '50%',
                      background: `radial-gradient(circle, ${i % 2 === 0 ? '#fbbf24' : '#f59e0b'}, transparent)`,
                      boxShadow: '0 0 20px rgba(251, 191, 36, 0.8)'
                    }}
                    animate={{
                      x: [0, -25 - i * 15],
                      y: [0, 15 + i * 8],
                      scale: [1, 0],
                      opacity: [0.9, 0]
                    }}
                    transition={{
                      duration: 0.7,
                      delay: i * 0.04,
                      repeat: animationStage === 'flying' ? Infinity : 0,
                      repeatDelay: 0.08
                    }}
                  />
                ))}
              </motion.div>
            )}

            {/* Enhanced Transformation Particles with 3D depth */}
            {animationStage === 'transforming' && (
              <motion.div
                key="particles"
                className="absolute"
                style={{ 
                  left: '50%', 
                  top: '50%',
                  transformStyle: 'preserve-3d'
                }}
              >
                {[...Array(30)].map((_, i) => {
                  const angle = (i * 2 * Math.PI) / 30;
                  const depth = Math.random() * 100 - 50;
                  return (
                    <motion.div
                      key={i}
                      className="absolute w-5 h-5 rounded-full"
                      style={{
                        background: `radial-gradient(circle, ${
                          i % 3 === 0 ? '#fbbf24' : i % 3 === 1 ? '#f59e0b' : '#d97706'
                        }, transparent)`,
                        boxShadow: '0 0 15px rgba(251, 191, 36, 0.6)'
                      }}
                      initial={{ x: 0, y: 0, z: 0, scale: 0, opacity: 0 }}
                      animate={{
                        x: Math.cos(angle) * 180,
                        y: Math.sin(angle) * 180,
                        z: [0, depth, depth * 2],
                        scale: [0, 1.5, 0],
                        opacity: [0, 1, 0],
                        rotateZ: [0, 360]
                      }}
                      transition={{
                        duration: 0.8,
                        ease: "easeOut"
                      }}
                    />
                  );
                })}
                
                {/* Central explosion flash */}
                <motion.div
                  className="absolute w-32 h-32 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(251, 191, 36, 0.8), transparent)',
                    filter: 'blur(20px)'
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 3, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ duration: 0.6 }}
                />
              </motion.div>
            )}

            {/* Contact Form with dramatic 3D entrance */}
            {animationStage === 'form' && (
              <motion.div
                key="form"
                initial={{ 
                  scale: 0, 
                  opacity: 0, 
                  y: 100,
                  rotateX: 90,
                  rotateY: 45
                }}
                animate={{ 
                  scale: 1, 
                  opacity: 1, 
                  y: 0,
                  rotateX: 0,
                  rotateY: 0
                }}
                transition={{ 
                  duration: 0.8,
                  type: "spring",
                  bounce: 0.3
                }}
                className="w-full max-w-2xl relative z-10"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className={`backdrop-blur-xl border-2 rounded-3xl p-8 md:p-10 relative overflow-hidden ${
                  isDark 
                    ? 'bg-gradient-to-br from-slate-900/95 via-purple-900/85 to-slate-900/95 border-purple-400/40' 
                    : 'bg-gradient-to-br from-white/95 via-purple-50/80 to-white/95 border-purple-300/50'
                }`}
                style={{
                  boxShadow: '0 30px 80px rgba(0,0,0,0.5), inset 0 1px 20px rgba(255,255,255,0.1)',
                  transform: 'translateZ(50px)'
                }}>
                  {/* Multiple layered glows for depth */}
                  <motion.div
                    className={`absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl ${
                      isDark ? 'bg-purple-500/30' : 'bg-purple-300/40'
                    }`}
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.3, 0.6, 0.3],
                      rotate: [0, 180, 360]
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                    }}
                    style={{ transform: 'translateZ(-20px)' }}
                  />
                  
                  <motion.div
                    className={`absolute -bottom-32 -left-32 w-80 h-80 rounded-full blur-3xl ${
                      isDark ? 'bg-blue-500/20' : 'bg-blue-300/30'
                    }`}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.2, 0.5, 0.2],
                      rotate: [360, 180, 0]
                    }}
                    transition={{
                      duration: 12,
                      repeat: Infinity,
                    }}
                    style={{ transform: 'translateZ(-30px)' }}
                  />

                  {/* Form Header with 3D icon */}
                  <motion.div
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mb-8 relative z-10"
                  >
                    <motion.div
                      animate={{ 
                        rotateY: [0, 360],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        rotateY: { duration: 3, repeat: Infinity, ease: "linear" },
                        scale: { duration: 2, repeat: Infinity }
                      }}
                      className="flex justify-center mb-5"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 relative"
                        style={{
                          boxShadow: '0 15px 40px rgba(139, 92, 246, 0.5)',
                          transform: 'translateZ(20px)'
                        }}>
                        {/* Icon glow */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 to-transparent" />
                        <Mail className="w-12 h-12 text-white relative z-10" />
                      </div>
                    </motion.div>
                    <h3 className={`text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}
                      style={{ textShadow: isDark ? '0 2px 20px rgba(139, 92, 246, 0.3)' : 'none' }}>
                      Let's Connect!
                    </h3>
                    <p className={`text-base ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                      Fill out the form below and I'll get back to you soon
                    </p>
                  </motion.div>

                  {/* Form with staggered 3D animations */}
                  <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                    <motion.div
                      initial={{ x: -30, opacity: 0, rotateY: -10 }}
                      animate={{ x: 0, opacity: 1, rotateY: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className={`block mb-2 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Name
                      </label>
                      <Input
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        className={`h-12 backdrop-blur-xl border-2 transition-all ${
                          isDark 
                            ? 'bg-white/10 border-white/20 focus:border-purple-400 text-white placeholder:text-white/50' 
                            : 'bg-white/60 border-gray-300 focus:border-purple-500 text-gray-900 placeholder:text-gray-500'
                        }`}
                        style={{ boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.1)' }}
                      />
                    </motion.div>
                    
                    <motion.div
                      initial={{ x: 30, opacity: 0, rotateY: 10 }}
                      animate={{ x: 0, opacity: 1, rotateY: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <label className={`block mb-2 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Email
                      </label>
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                        className={`h-12 backdrop-blur-xl border-2 transition-all ${
                          isDark 
                            ? 'bg-white/10 border-white/20 focus:border-purple-400 text-white placeholder:text-white/50' 
                            : 'bg-white/60 border-gray-300 focus:border-purple-500 text-gray-900 placeholder:text-gray-500'
                        }`}
                        style={{ boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.1)' }}
                      />
                    </motion.div>
                    
                    <motion.div
                      initial={{ y: 30, opacity: 0, scale: 0.95 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <label className={`block mb-2 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Message
                      </label>
                      <Textarea
                        placeholder="Tell me about your project or just say hello!"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        required
                        rows={5}
                        className={`backdrop-blur-xl border-2 resize-none transition-all ${
                          isDark 
                            ? 'bg-white/10 border-white/20 focus:border-purple-400 text-white placeholder:text-white/50' 
                            : 'bg-white/60 border-gray-300 focus:border-purple-500 text-gray-900 placeholder:text-gray-500'
                        }`}
                        style={{ boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.1)' }}
                      />
                    </motion.div>

                    {status.message && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: -10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl flex items-center gap-3 font-semibold ${
                          status.type === 'success' 
                            ? isDark
                              ? 'bg-green-500/20 border-2 border-green-500/50 text-green-300'
                              : 'bg-green-50 border-2 border-green-600 text-green-800'
                            : isDark
                              ? 'bg-red-500/20 border-2 border-red-500/40 text-red-300'
                              : 'bg-red-50 border-2 border-red-600 text-red-800'
                        }`}
                        style={{ boxShadow: '0 5px 20px rgba(0,0,0,0.2)' }}
                      >
                        {status.type === 'success' && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", bounce: 0.5 }}
                          >
                            <CheckCircle className="w-6 h-6" />
                          </motion.div>
                        )}
                        <span className="font-medium">{status.message}</span>
                      </motion.div>
                    )}
                    
                    <motion.div
                      initial={{ y: 20, opacity: 0, scale: 0.9 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        type="submit"
                        disabled={loading}
                        className={`w-full h-14 text-lg font-semibold relative overflow-hidden ${
                          isDark
                            ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white'
                            : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white'
                        }`}
                        style={{
                          boxShadow: '0 10px 30px rgba(139, 92, 246, 0.4)',
                          transform: 'translateZ(10px)'
                        }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                          animate={{
                            x: ['-100%', '200%']
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        />
                        {loading ? (
                          <div className="flex items-center gap-2 relative z-10">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                            Sending...
                          </div>
                        ) : (
                          <span className="relative z-10 flex items-center justify-center">
                            <Send className="w-5 h-5 mr-2" />
                            Send Message
                          </span>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </div>

                {/* Social Links with 3D cards */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.9 }}
                  className="mt-8"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className={`backdrop-blur-xl border-2 rounded-2xl p-6 relative ${
                    isDark ? 'bg-white/10 border-white/20' : 'bg-white/70 border-white/40'
                  }`}
                  style={{
                    boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                    transform: 'translateZ(20px)'
                  }}>
                    {/* Ambient glow */}
                    <div className={`absolute inset-0 rounded-2xl blur-xl -z-10 ${
                      isDark ? 'bg-purple-500/20' : 'bg-purple-300/30'
                    }`} />
                    
                    <h3 className={`text-lg font-bold mb-4 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Or Connect Via Social
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { href: settings?.github_url, icon: Github, label: 'GitHub' },
                        { href: settings?.linkedin_url, icon: Linkedin, label: 'LinkedIn' },
                        { href: settings?.scholar_url, icon: GraduationCap, label: 'Scholar' },
                        { href: settings?.calendly_url, icon: MessageSquare, label: '30-Min Chat' }
                      ].map((social, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.05, y: -5, rotateX: 5 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                          style={{ transformStyle: 'preserve-3d' }}
                        >
                          <Button asChild variant="outline" className={`h-12 w-full backdrop-blur-xl border-2 transition-all ${
                            isDark 
                              ? 'bg-white/5 border-white/20 hover:bg-white/10 text-white hover:border-white/30'
                              : 'bg-white/50 border-gray-300 hover:bg-white text-gray-900 hover:border-gray-400'
                          }`}
                          style={{
                            boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                            transform: 'translateZ(10px)'
                          }}>
                            <a href={social.href} target="_blank" rel="noopener noreferrer">
                              <social.icon className="w-5 h-5 mr-2" />
                              {social.label}
                            </a>
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

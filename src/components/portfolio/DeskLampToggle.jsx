import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DeskLampToggle({ theme, onToggle }) {
  const [isDragging, setIsDragging] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const isDark = theme === 'dark';

  return (
    <div className="fixed top-20 right-6 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className="group"
        onMouseEnter={() => setShowHint(true)}
      >
        <div className="relative w-24 h-32 scale-75">
          {/* Hint Tooltip */}
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`absolute -left-48 top-8 backdrop-blur-xl border rounded-xl px-4 py-3 shadow-2xl whitespace-nowrap pointer-events-none ${
                  isDark ? 'bg-white/20 border-white/30 text-white' : 'bg-white/90 border-gray-300 text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center gap-1">
                    <motion.div
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-2xl"
                    >
                      ☝️
                    </motion.div>
                    <span className="text-xs font-semibold">Pull Up</span>
                    <span className="text-xs">Light Mode</span>
                  </div>
                  <div className="h-12 w-px bg-current opacity-30" />
                  <div className="flex flex-col items-center gap-1">
                    <motion.div
                      animate={{ y: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-2xl"
                    >
                      👇
                    </motion.div>
                    <span className="text-xs font-semibold">Pull Down</span>
                    <span className="text-xs">Dark Mode</span>
                  </div>
                </div>
                {/* Arrow pointer */}
                <div className={`absolute right-[-8px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-l-8 border-transparent ${
                  isDark ? 'border-l-white/30' : 'border-l-gray-300'
                }`} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Lamp Base - circular */}
          <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-4 rounded-full transition-all shadow-lg ${
            isDark ? 'bg-gradient-to-b from-slate-700 to-slate-900' : 'bg-gradient-to-b from-gray-400 to-gray-600'
          }`}>
            <div className={`absolute inset-x-2 top-0 h-1 rounded-full ${
              isDark ? 'bg-slate-600' : 'bg-gray-300'
            }`} />
          </div>
          
          {/* Lamp Stand - vertical pole */}
          <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-2 h-16 transition-all rounded-full ${
            isDark ? 'bg-gradient-to-b from-slate-600 to-slate-700' : 'bg-gradient-to-b from-teal-400 to-teal-500'
          }`}>
            <div className={`absolute inset-y-0 left-0 w-0.5 rounded-full ${
              isDark ? 'bg-slate-500' : 'bg-teal-300'
            }`} />
          </div>
          
          {/* Bulb Socket */}
          <motion.div
            className={`absolute left-1/2 -translate-x-1/2 w-4 h-3 rounded-b-md transition-colors ${
              isDark ? 'bg-slate-700' : 'bg-teal-600'
            }`}
            animate={{
              top: isDark ? '58px' : '50px',
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
          
          {/* Lamp Shade - trapezoid shape */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2"
            animate={{
              top: isDark ? '8px' : '0px',
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div 
              className={`relative transition-all duration-300 ${
                isDark 
                  ? 'border-slate-700' 
                  : 'border-yellow-400'
              }`}
              style={{
                width: '0',
                height: '0',
                borderLeft: '48px solid transparent',
                borderRight: '48px solid transparent',
                borderTop: `50px solid ${isDark ? 'rgba(51, 65, 85, 0.9)' : 'rgba(250, 204, 21, 0.95)'}`,
                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
              }}
            >
              {/* Lamp shade top rim */}
              <div className={`absolute -top-[52px] left-1/2 -translate-x-1/2 w-12 h-2 rounded-t-sm transition-colors ${
                isDark ? 'bg-slate-800' : 'bg-yellow-300'
              }`} />
              
              {/* Inner glow/light */}
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 rounded-full blur-2xl"
                style={{ top: '-30px', width: '60px', height: '60px' }}
                animate={{
                  opacity: isDark ? 0.1 : 0.6,
                  backgroundColor: isDark ? '#475569' : '#fbbf24',
                  scale: isDark ? 0.5 : 1,
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>

          {/* Pull String (Draggable) */}
          <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 40 }}
            dragElastic={0.2}
            onDragStart={() => {
              setIsDragging(true);
              setShowHint(false);
            }}
            onDragEnd={(e, info) => {
              setIsDragging(false);
              const dragDistance = info.offset.y;
              if (Math.abs(dragDistance) > 20) {
                if (dragDistance > 0 && !isDark) {
                  onToggle();
                  setShowHint(false);
                } else if (dragDistance < 0 && isDark) {
                  onToggle();
                  setShowHint(false);
                }
              }
              setTimeout(() => setShowHint(false), 2000);
            }}
            className="absolute left-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing"
            style={{ top: '58px' }}
            whileHover={{ scale: 1.2 }}
            onMouseEnter={() => setShowHint(true)}
          >
            {/* String cord */}
            <motion.div 
              className={`w-1 h-12 rounded-full mx-auto transition-colors ${
                isDark ? 'bg-slate-600' : 'bg-yellow-600'
              }`}
              animate={{
                scaleY: isDragging ? 1.2 : 1,
                height: isDragging ? '56px' : '48px',
              }}
              transition={{ duration: 0.2 }}
            />
            
            {/* Pull knob */}
            <motion.div 
              className={`w-5 h-5 rounded-full border-2 mx-auto -mt-1 transition-all shadow-lg ${
                isDark 
                  ? 'bg-slate-700 border-slate-500' 
                  : 'bg-yellow-500 border-yellow-400'
              }`}
              animate={{
                scale: isDragging ? 1.4 : 1,
                boxShadow: isDragging 
                  ? '0 0 20px rgba(250, 204, 21, 0.5)' 
                  : '0 2px 4px rgba(0,0,0,0.2)',
              }}
              whileHover={{
                scale: 1.3,
                boxShadow: '0 0 15px rgba(250, 204, 21, 0.4)',
              }}
            >
              <div className={`absolute inset-1 rounded-full ${
                isDark ? 'bg-slate-600' : 'bg-yellow-300'
              }`} />
            </motion.div>
          </motion.div>

          {/* Light beam effect */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
            style={{ top: '58px' }}
            animate={{
              opacity: isDark ? 0.05 : 0.25,
            }}
          >
            <div 
              style={{
                width: '0',
                height: '0',
                borderLeft: '60px solid transparent',
                borderRight: '60px solid transparent',
                borderTop: `80px solid ${isDark ? 'rgba(100, 116, 139, 0.1)' : 'rgba(250, 204, 21, 0.3)'}`,
              }}
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
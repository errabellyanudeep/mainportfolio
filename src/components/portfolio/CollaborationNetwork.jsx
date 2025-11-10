import React from "react";
import { motion } from "framer-motion";
import { Users, ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

export default function CollaborationNetwork({ id, theme }) {
  const isDark = theme === 'dark';

  const { data: collaborations, isLoading } = useQuery({
    queryKey: ['collaborations'],
    queryFn: () => base44.entities.Collaboration.list('display_order'),
    initialData: [],
  });

  if (isLoading || collaborations.length === 0) {
    return null;
  }

  const activeCollabs = collaborations.filter(c => c.status === 'active');
  const pastCollabs = collaborations.filter(c => c.status === 'past');

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
            Collaborations
          </h2>
          <div className={`w-24 h-1 bg-gradient-to-r mx-auto rounded-full ${
            isDark ? 'from-green-400 via-emerald-400 to-teal-400' : 'from-green-600 via-emerald-600 to-teal-600'
          }`} />
          <p className={`mt-6 text-lg ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
            Building bridges through research and innovation
          </p>
        </motion.div>

        {/* Active Collaborations */}
        {activeCollabs.length > 0 && (
          <div className="mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-6"
            >
              <Sparkles className={`w-6 h-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
              <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Active Collaborations
              </h3>
            </motion.div>

            <div className="relative">
              {/* Central node (You) */}
              <div className="flex justify-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", duration: 0.8 }}
                  className={`relative backdrop-blur-2xl border-4 rounded-2xl p-6 shadow-2xl ${
                    isDark 
                      ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-400/50' 
                      : 'bg-gradient-to-br from-green-100 to-emerald-100 border-green-500/50'
                  }`}
                >
                  <div className={`absolute -inset-2 rounded-2xl blur-xl -z-10 ${
                    isDark ? 'bg-green-500/30' : 'bg-green-400/40'
                  }`} />
                  <div className={`text-center font-bold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    You
                  </div>
                </motion.div>
              </div>

              {/* Connecting lines and nodes */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
                {activeCollabs.map((collab, index) => (
                  <motion.div
                    key={collab.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="relative"
                  >
                    {/* Connection line animation */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className="absolute -top-8 left-1/2 w-px h-8 origin-top"
                      style={{
                        background: isDark 
                          ? 'linear-gradient(to bottom, rgba(74, 222, 128, 0.5), rgba(74, 222, 128, 0))' 
                          : 'linear-gradient(to bottom, rgba(34, 197, 94, 0.5), rgba(34, 197, 94, 0))'
                      }}
                    />

                    <div className={`backdrop-blur-2xl border-2 rounded-2xl p-6 shadow-xl transition-all group hover:scale-105 ${
                      isDark 
                        ? 'bg-white/10 border-green-400/40 hover:border-green-400/70 hover:bg-white/15' 
                        : 'bg-white/70 border-green-300/50 hover:border-green-400/70 hover:bg-white/90'
                    }`}>
                      {/* Active pulse */}
                      <div className="absolute -top-2 -right-2">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-4 h-4 rounded-full bg-green-500"
                        />
                      </div>

                      <div className="flex items-start gap-4">
                        {collab.image_url ? (
                          <img 
                            src={collab.image_url} 
                            alt={collab.name}
                            className="w-16 h-16 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                            <Users className="w-8 h-8 text-white" />
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <h4 className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {collab.name}
                          </h4>
                          <p className={`text-sm mb-2 ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                            {collab.organization}
                          </p>
                          {collab.role && (
                            <Badge className={`mb-2 ${
                              isDark 
                                ? 'bg-green-500/20 text-green-300 border-green-400/30' 
                                : 'bg-green-100 text-green-700 border-green-300'
                            }`}>
                              {collab.role}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {collab.description && (
                        <p className={`text-sm mt-3 ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                          {collab.description}
                        </p>
                      )}

                      {collab.period && (
                        <p className={`text-xs mt-2 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                          {collab.period}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Past Collaborations */}
        {pastCollabs.length > 0 && (
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-6"
            >
              <ArrowRight className={`w-6 h-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
              <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Past Collaborations
              </h3>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastCollabs.map((collab, index) => (
                <motion.div
                  key={collab.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className={`backdrop-blur-2xl border rounded-2xl p-6 shadow-xl transition-all group hover:scale-105 ${
                    isDark 
                      ? 'bg-white/5 border-white/20 hover:bg-white/10' 
                      : 'bg-white/60 border-white/40 hover:bg-white/80'
                  }`}>
                    <div className="flex items-start gap-4">
                      {collab.image_url ? (
                        <img 
                          src={collab.image_url} 
                          alt={collab.name}
                          className="w-16 h-16 rounded-xl object-cover grayscale opacity-70"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center opacity-70">
                          <Users className="w-8 h-8 text-white" />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <h4 className={`font-bold mb-1 ${isDark ? 'text-white/80' : 'text-gray-800'}`}>
                          {collab.name}
                        </h4>
                        <p className={`text-sm mb-2 ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                          {collab.organization}
                        </p>
                        {collab.role && (
                          <Badge variant="outline" className={`mb-2 ${
                            isDark ? 'border-white/30 text-white/70' : 'border-gray-300 text-gray-600'
                          }`}>
                            {collab.role}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {collab.description && (
                      <p className={`text-sm mt-3 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                        {collab.description}
                      </p>
                    )}

                    {collab.period && (
                      <p className={`text-xs mt-2 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                        {collab.period}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
import React from "react";
import { motion } from "framer-motion";
import { Award, ExternalLink, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function CertificationsSection({ certifications, theme }) {
  const isDark = theme === 'dark';

  if (!certifications || certifications.length === 0) {
    return null;
  }

  return (
    <section className="relative py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Certifications
          </h2>
          <div className={`w-24 h-1 bg-gradient-to-r mx-auto rounded-full ${
            isDark ? 'from-cyan-400 via-green-400 to-emerald-400' : 'from-cyan-600 via-green-600 to-emerald-600'
          }`} />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, rotate: 2 }}
              className="relative group"
            >
              <div className={`backdrop-blur-2xl border rounded-2xl p-6 transition-all shadow-xl ${
                isDark ? 'bg-white/10 border-white/20 hover:bg-white/15' : 'bg-white/70 border-white/40 hover:bg-white/90'
              }`}>
                <div className={`absolute -inset-1 rounded-2xl blur-xl transition-all duration-500 -z-10 ${
                  isDark
                    ? 'bg-gradient-to-br from-cyan-500/0 via-green-500/0 to-emerald-500/0 group-hover:from-cyan-500/30 group-hover:via-green-500/30 group-hover:to-emerald-500/30'
                    : 'bg-gradient-to-br from-cyan-300/0 via-green-300/0 to-emerald-300/0 group-hover:from-cyan-300/20 group-hover:via-green-300/20 group-hover:to-emerald-300/20'
                }`} />
                
                {cert.badge_url && (
                  <div className={`relative mb-6 p-4 rounded-xl flex items-center justify-center ${
                    isDark ? 'bg-white' : 'bg-white'
                  }`}>
                    <img 
                      src={cert.badge_url} 
                      alt={cert.name}
                      className="w-full h-48 object-contain"
                    />
                  </div>
                )}
                
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-400 to-green-500">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <Badge className={`backdrop-blur-xl border text-xs ${
                    isDark ? 'bg-white/10 border-white/30 text-white' : 'bg-white/50 border-gray-300 text-gray-900'
                  }`}>
                    {format(new Date(cert.issue_date), 'MMM yyyy')}
                  </Badge>
                </div>
                
                <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {cert.name}
                </h3>
                
                <p className={`mb-4 ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                  {cert.issuer}
                </p>
                
                {cert.credential_url && (
                  <Button 
                    asChild
                    variant="outline"
                    size="sm"
                    className={`backdrop-blur-xl border w-full ${
                      isDark 
                        ? 'bg-white/10 hover:bg-white/20 border-white/30 text-white'
                        : 'bg-white/50 hover:bg-white/70 border-gray-300 text-gray-900'
                    }`}
                  >
                    <a href={cert.credential_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Credential
                    </a>
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
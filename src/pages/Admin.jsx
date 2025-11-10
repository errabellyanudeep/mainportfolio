import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import PublicationManager from "../components/admin/PublicationManager";
import SectionManager from "../components/admin/SectionManager";
import ExperienceManager from "../components/admin/ExperienceManager";
import EducationManager from "../components/admin/EducationManager";
import AwardManager from "../components/admin/AwardManager";
import CertificationManager from "../components/admin/CertificationManager";
import SettingsManager from "../components/admin/SettingsManager";
import NewsManager from "../components/admin/NewsManager";
import CollaborationManager from "../components/admin/CollaborationManager";

const INACTIVITY_TIMEOUT = 120000; // 120 seconds

export default function AdminPage() {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [inactivityTimer, setInactivityTimer] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [showWarning, setShowWarning] = useState(false);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('adminSession');
    window.location.href = createPageUrl("Portfolio");
  }, []);

  const resetInactivityTimer = useCallback(() => {
    setShowWarning(false);
    setTimeRemaining(120);
    
    if (inactivityTimer) {
      clearInterval(inactivityTimer);
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleLogout();
          return 0;
        }
        if (prev <= 30 && !showWarning) {
          setShowWarning(true);
        }
        return prev - 1;
      });
    }, 1000);

    setInactivityTimer(timer);
  }, [inactivityTimer, handleLogout, showWarning]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verify user is authenticated with Base44
        const user = await base44.auth.me();
        
        if (!user) {
          // Not logged in, redirect to login
          base44.auth.redirectToLogin(createPageUrl("Admin"));
          return;
        }

        // Check if user has admin privileges
        if (user.role === 'admin' || user.email === 'errabellyanudeep@gmail.com') {
          const savedSession = localStorage.getItem('adminSession');
          if (savedSession) {
            const session = JSON.parse(savedSession);
            if (Date.now() - session.timestamp < 86400000) {
              setIsAuthorized(true);
              setIsLoading(false);
              return;
            }
          }
        }
        
        // Not authorized
        navigate(createPageUrl("Portfolio"));
      } catch (error) {
        // Authentication failed, redirect to login
        base44.auth.redirectToLogin(createPageUrl("Admin"));
      }
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (isAuthorized) {
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
      
      events.forEach(event => {
        document.addEventListener(event, resetInactivityTimer);
      });

      resetInactivityTimer();

      return () => {
        if (inactivityTimer) {
          clearInterval(inactivityTimer);
        }
        events.forEach(event => {
          document.removeEventListener(event, resetInactivityTimer);
        });
      };
    }
  }, [isAuthorized, resetInactivityTimer]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Inactivity Warning */}
        <AnimatePresence>
          {showWarning && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 right-6 z-50 backdrop-blur-xl bg-orange-500/90 border-2 border-orange-400 rounded-xl p-4 shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-white animate-pulse" />
                <div>
                  <p className="text-white font-bold">Auto-logout Warning</p>
                  <p className="text-white/90 text-sm">
                    Logging out in {timeRemaining} seconds due to inactivity
                  </p>
                </div>
                <Button
                  onClick={resetInactivityTimer}
                  size="sm"
                  className="bg-white text-orange-600 hover:bg-white/90"
                >
                  Stay Logged In
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Portfolio
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-white/60">Manage your portfolio content</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-white/60 text-sm">Session active</p>
                <p className="text-white font-mono text-lg">
                  {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-white hover:bg-white/10"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="settings" className="space-y-6">
          <TabsList className="backdrop-blur-xl bg-white/10 border border-white/20 p-1">
            <TabsTrigger value="settings" className="data-[state=active]:bg-white/20 text-white">
              Settings
            </TabsTrigger>
            <TabsTrigger value="news" className="data-[state=active]:bg-white/20 text-white">
              News
            </TabsTrigger>
            <TabsTrigger value="collaborations" className="data-[state=active]:bg-white/20 text-white">
              Collaborations
            </TabsTrigger>
            <TabsTrigger value="publications" className="data-[state=active]:bg-white/20 text-white">
              Publications
            </TabsTrigger>
            <TabsTrigger value="sections" className="data-[state=active]:bg-white/20 text-white">
              Custom Sections
            </TabsTrigger>
            <TabsTrigger value="experience" className="data-[state=active]:bg-white/20 text-white">
              Experience
            </TabsTrigger>
            <TabsTrigger value="education" className="data-[state=active]:bg-white/20 text-white">
              Education
            </TabsTrigger>
            <TabsTrigger value="awards" className="data-[state=active]:bg-white/20 text-white">
              Awards
            </TabsTrigger>
            <TabsTrigger value="certifications" className="data-[state=active]:bg-white/20 text-white">
              Certifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings">
            <SettingsManager />
          </TabsContent>

          <TabsContent value="news">
            <NewsManager />
          </TabsContent>

          <TabsContent value="collaborations">
            <CollaborationManager />
          </TabsContent>

          <TabsContent value="publications">
            <PublicationManager />
          </TabsContent>

          <TabsContent value="sections">
            <SectionManager />
          </TabsContent>

          <TabsContent value="experience">
            <ExperienceManager />
          </TabsContent>

          <TabsContent value="education">
            <EducationManager />
          </TabsContent>

          <TabsContent value="awards">
            <AwardManager />
          </TabsContent>

          <TabsContent value="certifications">
            <CertificationManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
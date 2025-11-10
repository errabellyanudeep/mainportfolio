import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Link2, Mail, Save } from "lucide-react";
import ImageCropper from "./ImageCropper";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function SettingsManager() {
  const queryClient = useQueryClient();

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const allSettings = await base44.entities.Settings.list();
      return allSettings[0] || null;
    },
  });

  const [formData, setFormData] = useState({
    hero_title: "",
    hero_subtitle: "",
    hero_description: "",
    profile_image_url: "",
    resume_url: "",
    github_url: "",
    linkedin_url: "",
    scholar_url: "",
    calendly_url: "",
    email: "",
    show_news: true,
    show_collaborations: true,
    show_education: true,
    show_experience: true,
    show_publications: true,
    show_awards: true,
    show_certifications: true
  });

  const [uploading, setUploading] = useState({ image: false, resume: false });

  useEffect(() => {
    if (settings) {
      setFormData({
        hero_title: settings.hero_title || "",
        hero_subtitle: settings.hero_subtitle || "",
        hero_description: settings.hero_description || "",
        profile_image_url: settings.profile_image_url || "",
        resume_url: settings.resume_url || "",
        github_url: settings.github_url || "",
        linkedin_url: settings.linkedin_url || "",
        scholar_url: settings.scholar_url || "",
        calendly_url: settings.calendly_url || "",
        email: settings.email || "",
        show_news: settings.show_news !== false,
        show_collaborations: settings.show_collaborations !== false,
        show_education: settings.show_education !== false,
        show_experience: settings.show_experience !== false,
        show_publications: settings.show_publications !== false,
        show_awards: settings.show_awards !== false,
        show_certifications: settings.show_certifications !== false
      });
    }
  }, [settings]);

  const saveSettingsMutation = useMutation({
    mutationFn: async (data) => {
      if (settings?.id) {
        return await base44.entities.Settings.update(settings.id, data);
      } else {
        return await base44.entities.Settings.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });

  const handleImageCrop = async (file) => {
    setUploading({ ...uploading, image: true });
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setFormData({ ...formData, profile_image_url: file_url });
    setUploading({ ...uploading, image: false });
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading({ ...uploading, resume: true });
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, resume_url: file_url });
      setUploading({ ...uploading, resume: false });
    }
  };

  const handleSave = () => {
    saveSettingsMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <Card className="backdrop-blur-xl bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Portfolio Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Section Visibility Toggles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span>🎯</span> Section Visibility
            </h3>
            <div className="grid md:grid-cols-2 gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="show_news" className="text-white cursor-pointer">
                  Latest News & Updates
                </Label>
                <Switch
                  id="show_news"
                  checked={formData.show_news}
                  onCheckedChange={(checked) => setFormData({...formData, show_news: checked})}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="show_collaborations" className="text-white cursor-pointer">
                  Collaborations Network
                </Label>
                <Switch
                  id="show_collaborations"
                  checked={formData.show_collaborations}
                  onCheckedChange={(checked) => setFormData({...formData, show_collaborations: checked})}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="show_education" className="text-white cursor-pointer">
                  Education
                </Label>
                <Switch
                  id="show_education"
                  checked={formData.show_education}
                  onCheckedChange={(checked) => setFormData({...formData, show_education: checked})}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="show_experience" className="text-white cursor-pointer">
                  Experience
                </Label>
                <Switch
                  id="show_experience"
                  checked={formData.show_experience}
                  onCheckedChange={(checked) => setFormData({...formData, show_experience: checked})}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="show_publications" className="text-white cursor-pointer">
                  Publications
                </Label>
                <Switch
                  id="show_publications"
                  checked={formData.show_publications}
                  onCheckedChange={(checked) => setFormData({...formData, show_publications: checked})}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="show_awards" className="text-white cursor-pointer">
                  Awards & Honors
                </Label>
                <Switch
                  id="show_awards"
                  checked={formData.show_awards}
                  onCheckedChange={(checked) => setFormData({...formData, show_awards: checked})}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="show_certifications" className="text-white cursor-pointer">
                  Certifications
                </Label>
                <Switch
                  id="show_certifications"
                  checked={formData.show_certifications}
                  onCheckedChange={(checked) => setFormData({...formData, show_certifications: checked})}
                />
              </div>
            </div>
          </div>

          {/* Hero Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Hero Section</h3>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">Title</label>
              <Input
                placeholder="Your Name"
                value={formData.hero_title}
                onChange={(e) => setFormData({...formData, hero_title: e.target.value})}
                className="bg-white/10 border-white/30 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Subtitle</label>
              <Input
                placeholder="Your Title/Position"
                value={formData.hero_subtitle}
                onChange={(e) => setFormData({...formData, hero_subtitle: e.target.value})}
                className="bg-white/10 border-white/30 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Description</label>
              <Textarea
                placeholder="Brief description about yourself"
                value={formData.hero_description}
                onChange={(e) => setFormData({...formData, hero_description: e.target.value})}
                rows={4}
                className="bg-white/10 border-white/30 text-white resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Profile Image URL</label>
              <div className="flex gap-3 items-center">
                <Input
                  placeholder="https://..."
                  value={formData.profile_image_url}
                  onChange={(e) => setFormData({...formData, profile_image_url: e.target.value})}
                  className="bg-white/10 border-white/30 text-white"
                />
                <ImageCropper
                  onImageCropped={handleImageCrop}
                  disabled={uploading.image}
                />
              </div>
              {formData.profile_image_url && (
                <img src={formData.profile_image_url} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded-lg" />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Resume URL</label>
              <div className="flex gap-3 items-center">
                <Input
                  placeholder="https://..."
                  value={formData.resume_url}
                  onChange={(e) => setFormData({...formData, resume_url: e.target.value})}
                  className="bg-white/10 border-white/30 text-white"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                  disabled={uploading.resume}
                  onClick={() => document.getElementById('resume-upload')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading.resume ? 'Uploading...' : 'Upload'}
                </Button>
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleResumeUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Link2 className="w-5 h-5" />
              Social Links
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">GitHub URL</label>
                <Input
                  placeholder="https://github.com/..."
                  value={formData.github_url}
                  onChange={(e) => setFormData({...formData, github_url: e.target.value})}
                  className="bg-white/10 border-white/30 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">LinkedIn URL</label>
                <Input
                  placeholder="https://linkedin.com/..."
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
                  className="bg-white/10 border-white/30 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Google Scholar URL</label>
                <Input
                  placeholder="https://scholar.google.com/..."
                  value={formData.scholar_url}
                  onChange={(e) => setFormData({...formData, scholar_url: e.target.value})}
                  className="bg-white/10 border-white/30 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Calendly URL</label>
                <Input
                  placeholder="https://calendly.com/..."
                  value={formData.calendly_url}
                  onChange={(e) => setFormData({...formData, calendly_url: e.target.value})}
                  className="bg-white/10 border-white/30 text-white"
                />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Contact Information
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">Email</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="bg-white/10 border-white/30 text-white"
              />
            </div>
          </div>

          <Button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
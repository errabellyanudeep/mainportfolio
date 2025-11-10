import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Eye, EyeOff, Upload, X, Image as ImageIcon, Video, FileText } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function SectionManager() {
  const queryClient = useQueryClient();
  const [showDialog, setShowDialog] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingPDF, setUploadingPDF] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    images: [],
    video_url: "",
    pdf_url: "",
    display_order: 0,
    visible: true
  });

  const { data: sections, isLoading } = useQuery({
    queryKey: ['customSections'],
    queryFn: () => base44.entities.PortfolioSection.list('display_order'),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.PortfolioSection.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customSections'] });
      handleClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.PortfolioSection.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customSections'] });
      handleClose();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.PortfolioSection.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customSections'] });
    },
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), file_url]
      }));
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePDFUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingPDF(true);
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, pdf_url: file_url }));
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload PDF');
    } finally {
      setUploadingPDF(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingSection) {
      updateMutation.mutate({ id: editingSection.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (section) => {
    setEditingSection(section);
    setFormData({
      title: section.title || "",
      description: section.description || "",
      images: section.images || [],
      video_url: section.video_url || "",
      pdf_url: section.pdf_url || "",
      display_order: section.display_order || 0,
      visible: section.visible !== false
    });
    setShowDialog(true);
  };

  const handleClose = () => {
    setShowDialog(false);
    setEditingSection(null);
    setFormData({
      title: "",
      description: "",
      images: [],
      video_url: "",
      pdf_url: "",
      display_order: 0,
      visible: true
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Event Sections</h2>
        <Button 
          onClick={() => setShowDialog(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>

      {/* Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-slate-900/95 border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingSection ? 'Edit Event' : 'Add New Event'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <Label className="text-white text-lg">Event Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g., CVPR 2024 Conference, Lab Meeting, Award Ceremony"
                required
                className="bg-white/10 border-white/20 text-white mt-2"
              />
            </div>

            {/* Images */}
            <div>
              <Label className="text-white text-lg">Event Images</Label>
              <p className="text-white/60 text-sm mb-3">Upload photos from the conference, lab meeting, or event</p>
              <Button
                type="button"
                onClick={() => document.getElementById('imageUpload').click()}
                disabled={uploadingImage}
                className="w-full bg-white/10 hover:bg-white/20 border-2 border-white/20"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                {uploadingImage ? 'Uploading...' : 'Add Image'}
              </Button>
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              {formData.images && formData.images.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img src={img} alt={`Image ${idx + 1}`} className="w-full h-32 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 rounded text-white text-xs">
                        {idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Video URL */}
            <div>
              <Label className="text-white text-lg">Video URL (Optional)</Label>
              <p className="text-white/60 text-sm mb-3">Paste YouTube or Vimeo link</p>
              <Input
                value={formData.video_url}
                onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            {/* Description */}
            <div>
              <Label className="text-white text-lg">Event Description</Label>
              <p className="text-white/60 text-sm mb-3">Write about the event, what happened, key moments, etc.</p>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={6}
                placeholder="Describe the event in detail..."
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            {/* PDF Upload */}
            <div>
              <Label className="text-white text-lg">PDF Document (Optional)</Label>
              <p className="text-white/60 text-sm mb-3">Upload certificate, paper, presentation, or any related document</p>
              <div className="flex gap-3">
                <Input
                  value={formData.pdf_url}
                  onChange={(e) => setFormData({...formData, pdf_url: e.target.value})}
                  placeholder="Or paste PDF URL"
                  className="bg-white/10 border-white/20 text-white"
                />
                <Button
                  type="button"
                  onClick={() => document.getElementById('pdfUpload').click()}
                  disabled={uploadingPDF}
                  className="bg-white/10 hover:bg-white/20 border-2 border-white/20"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {uploadingPDF ? 'Uploading...' : 'Upload'}
                </Button>
                <input
                  id="pdfUpload"
                  type="file"
                  accept=".pdf"
                  onChange={handlePDFUpload}
                  className="hidden"
                />
              </div>
              {formData.pdf_url && (
                <div className="mt-2 p-3 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center gap-2">
                  <FileText className="w-4 h-4 text-green-400" />
                  <span className="text-green-300 text-sm">PDF attached</span>
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
              <div>
                <Label className="text-white">Display Order</Label>
                <Input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value)})}
                  className="bg-white/10 border-white/20 text-white mt-2"
                />
              </div>
              <div>
                <Label className="text-white mb-2 block">Visibility</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Switch
                    checked={formData.visible}
                    onCheckedChange={(checked) => setFormData({...formData, visible: checked})}
                  />
                  <span className="text-white/70 text-sm">{formData.visible ? 'Visible' : 'Hidden'}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-600">
                {editingSection ? 'Update Event' : 'Create Event'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Sections List */}
      <div className="grid gap-4">
        {isLoading ? (
          <Card className="p-6 backdrop-blur-xl bg-white/10 border-white/20 text-white text-center">
            Loading events...
          </Card>
        ) : sections.length === 0 ? (
          <Card className="p-6 backdrop-blur-xl bg-white/10 border-white/20 text-white text-center">
            No events yet. Create your first one!
          </Card>
        ) : (
          sections.map((section) => (
            <Card key={section.id} className="p-6 backdrop-blur-xl bg-white/10 border-white/20">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-white">{section.title}</h3>
                    {section.visible ? (
                      <Eye className="w-4 h-4 text-green-400" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  {section.description && (
                    <p className="text-white/70 mb-3 line-clamp-2">{section.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="px-2 py-1 bg-white/10 rounded text-white/80">
                      Order: {section.display_order}
                    </span>
                    {section.images && section.images.length > 0 && (
                      <span className="px-2 py-1 bg-purple-500/20 rounded text-purple-300 flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        {section.images.length} image{section.images.length !== 1 ? 's' : ''}
                      </span>
                    )}
                    {section.video_url && (
                      <span className="px-2 py-1 bg-blue-500/20 rounded text-blue-300 flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        Video
                      </span>
                    )}
                    {section.pdf_url && (
                      <span className="px-2 py-1 bg-red-500/20 rounded text-red-300 flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        PDF
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(section)}
                    className="bg-white/10 hover:bg-white/20 border-white/20 text-white"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (confirm('Delete this event?')) {
                        deleteMutation.mutate(section.id);
                      }
                    }}
                    className="bg-red-500/20 hover:bg-red-500/30 border-red-500/30 text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
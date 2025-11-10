import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Upload, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function PublicationManager() {
  const queryClient = useQueryClient();
  const [editingPub, setEditingPub] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    authors: "",
    journal: "",
    year: new Date().getFullYear(),
    pdf_url: "",
    video_url: "",
    image_url: "",
    abstract: "",
    display_order: 0
  });

  const { data: publications } = useQuery({
    queryKey: ['admin-publications'],
    queryFn: () => base44.entities.Publication.list('display_order'),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Publication.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-publications']);
      queryClient.invalidateQueries(['publications']);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Publication.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-publications']);
      queryClient.invalidateQueries(['publications']);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Publication.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-publications']);
      queryClient.invalidateQueries(['publications']);
    },
  });

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, [field]: file_url }));
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPub) {
      updateMutation.mutate({ id: editingPub.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      authors: "",
      journal: "",
      year: new Date().getFullYear(),
      pdf_url: "",
      video_url: "",
      image_url: "",
      abstract: "",
      display_order: 0
    });
    setEditingPub(null);
    setIsDialogOpen(false);
  };

  const startEdit = (pub) => {
    setFormData(pub);
    setEditingPub(pub);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Manage Publications</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Publication
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border-white/20">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingPub ? 'Edit Publication' : 'Add New Publication'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-white">Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div>
                <Label className="text-white">Authors *</Label>
                <Input
                  value={formData.authors}
                  onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                  required
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Journal/Conference *</Label>
                  <Input
                    value={formData.journal}
                    onChange={(e) => setFormData({ ...formData, journal: e.target.value })}
                    required
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Year *</Label>
                  <Input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    required
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white">Abstract (optional)</Label>
                <Textarea
                  value={formData.abstract}
                  onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                  rows={4}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div>
                <Label className="text-white">PDF URL (optional)</Label>
                <Input
                  value={formData.pdf_url}
                  onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
                  placeholder="https://..."
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div>
                <Label className="text-white">Video URL (YouTube) (optional)</Label>
                <Input
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://youtube.com/..."
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div>
                <Label className="text-white">Thumbnail Image (optional)</Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="URL or upload"
                    className="bg-white/10 border-white/20 text-white"
                  />
                  <Button type="button" variant="outline" onClick={() => document.getElementById('image-upload').click()}>
                    <Upload className="w-4 h-4" />
                  </Button>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'image_url')}
                  />
                </div>
              </div>

              <div>
                <Label className="text-white">Display Order</Label>
                <Input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500">
                  {editingPub ? 'Update' : 'Create'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {publications.map((pub) => (
          <Card key={pub.id} className="backdrop-blur-xl bg-white/10 border-white/20 p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">{pub.title}</h3>
                <p className="text-white/70 mb-2">{pub.authors}</p>
                <p className="text-white/60 text-sm">{pub.journal} • {pub.year}</p>
                <div className="flex gap-2 mt-3">
                  {pub.pdf_url && (
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">PDF</span>
                  )}
                  {pub.video_url && (
                    <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded">VIDEO</span>
                  )}
                  {pub.image_url && (
                    <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">IMAGE</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" onClick={() => startEdit(pub)} className="text-white hover:bg-white/10">
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(pub.id)} className="text-red-400 hover:bg-red-500/10">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
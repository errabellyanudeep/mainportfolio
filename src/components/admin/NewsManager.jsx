import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Trophy, Sparkles, BookOpen, Award, Briefcase, GraduationCap } from "lucide-react";
import { format } from "date-fns";
import ImageCropper from "./ImageCropper";

const iconMap = {
  Trophy, Sparkles, BookOpen, Award, Briefcase, GraduationCap
};

const colorOptions = [
  { value: "from-yellow-400 to-orange-500", label: "Yellow to Orange" },
  { value: "from-green-400 to-emerald-500", label: "Green to Emerald" },
  { value: "from-purple-400 to-pink-500", label: "Purple to Pink" },
  { value: "from-blue-400 to-cyan-500", label: "Blue to Cyan" },
  { value: "from-red-400 to-rose-500", label: "Red to Rose" },
  { value: "from-indigo-400 to-purple-500", label: "Indigo to Purple" }
];

export default function NewsManager() {
  const queryClient = useQueryClient();
  const [showDialog, setShowDialog] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    title: "",
    description: "",
    icon: "Sparkles",
    color: "from-purple-400 to-pink-500",
    image_url: "",
    display_order: 0
  });

  const { data: news, isLoading } = useQuery({
    queryKey: ['news'],
    queryFn: () => base44.entities.News.list('display_order'),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.News.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.News.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.News.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });

  const handleImageCrop = async (file) => {
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setFormData({ ...formData, image_url: file_url });
    setUploading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingNews) {
      updateMutation.mutate({ id: editingNews.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem);
    setFormData({
      date: newsItem.date || "",
      title: newsItem.title || "",
      description: newsItem.description || "",
      icon: newsItem.icon || "Sparkles",
      color: newsItem.color || "from-purple-400 to-pink-500",
      image_url: newsItem.image_url || "",
      display_order: newsItem.display_order || 0
    });
    setShowDialog(true);
  };

  const resetForm = () => {
    setShowDialog(false);
    setEditingNews(null);
    setFormData({
      date: "",
      title: "",
      description: "",
      icon: "Sparkles",
      color: "from-purple-400 to-pink-500",
      image_url: "",
      display_order: 0
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">News Management</h2>
        <Button
          onClick={() => {
            resetForm();
            setShowDialog(true);
          }}
          className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add News
        </Button>
      </div>

      {/* News Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="backdrop-blur-2xl bg-slate-900/90 border-white/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {editingNews ? 'Edit News' : 'Add New News'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Date *</label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                  className="bg-white/10 border-white/30 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Display Order</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.display_order}
                  onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value) || 0})}
                  className="bg-white/10 border-white/30 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <Input
                placeholder="e.g., Won Second Place at ACM Hackathon"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                className="bg-white/10 border-white/30 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <Textarea
                placeholder="e.g., OSU Department of Computer Science"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
                rows={3}
                className="bg-white/10 border-white/30 text-white resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Icon *</label>
                <Select
                  value={formData.icon}
                  onValueChange={(value) => setFormData({...formData, icon: value})}
                >
                  <SelectTrigger className="bg-white/10 border-white/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Trophy">🏆 Trophy</SelectItem>
                    <SelectItem value="Sparkles">✨ Sparkles</SelectItem>
                    <SelectItem value="BookOpen">📖 Book</SelectItem>
                    <SelectItem value="Award">🏅 Award</SelectItem>
                    <SelectItem value="Briefcase">💼 Briefcase</SelectItem>
                    <SelectItem value="GraduationCap">🎓 Graduation Cap</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Color *</label>
                <Select
                  value={formData.color}
                  onValueChange={(value) => setFormData({...formData, color: value})}
                >
                  <SelectTrigger className="bg-white/10 border-white/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${opt.value}`} />
                          {opt.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Event Image (Optional)</label>
              <div className="flex gap-3">
                <Input
                  placeholder="Image URL or upload below"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  className="bg-white/10 border-white/30 text-white"
                />
                <ImageCropper
                  onImageCropped={handleImageCrop}
                  disabled={uploading}
                />
              </div>
              {formData.image_url && (
                <img src={formData.image_url} alt="Preview" className="mt-2 h-32 rounded-lg object-cover" />
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                className="border-white/30 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
              >
                {editingNews ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* News List */}
      <div className="grid gap-4">
        {isLoading ? (
          <div className="text-center text-white/60 py-8">Loading...</div>
        ) : news.length === 0 ? (
          <Card className="backdrop-blur-xl bg-white/10 border-white/20">
            <CardContent className="py-8 text-center text-white/60">
              No news yet. Click "Add News" to create your first entry.
            </CardContent>
          </Card>
        ) : (
          news.map((item) => {
            const Icon = iconMap[item.icon] || Sparkles;
            return (
              <Card key={item.id} className="backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/15 transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color}`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-white/60">
                            📅 {item.date ? format(new Date(item.date), 'MMM dd, yyyy') : 'No date'}
                          </span>
                          <span className="text-xs bg-white/10 px-2 py-0.5 rounded">
                            Order: {item.display_order}
                          </span>
                        </div>
                        <CardTitle className="text-white mb-1">{item.title}</CardTitle>
                        <p className="text-white/70 text-sm">{item.description}</p>
                        {item.image_url && (
                          <img src={item.image_url} alt={item.title} className="mt-3 h-32 rounded-lg object-cover" />
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(item)}
                        className="text-white hover:bg-white/10"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this news item?')) {
                            deleteMutation.mutate(item.id);
                          }
                        }}
                        className="text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
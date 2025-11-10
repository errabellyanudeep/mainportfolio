import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Users, Upload, Sparkles, ArrowRight } from "lucide-react";
import ImageCropper from "./ImageCropper";

export default function CollaborationManager() {
  const queryClient = useQueryClient();
  const [showDialog, setShowDialog] = useState(false);
  const [editingCollab, setEditingCollab] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    role: "",
    period: "",
    status: "active",
    description: "",
    image_url: "",
    display_order: 0
  });

  const { data: collaborations, isLoading } = useQuery({
    queryKey: ['collaborations'],
    queryFn: () => base44.entities.Collaboration.list('display_order'),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Collaboration.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collaborations'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Collaboration.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collaborations'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Collaboration.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collaborations'] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCollab) {
      updateMutation.mutate({ id: editingCollab.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (collab) => {
    setEditingCollab(collab);
    setFormData({
      name: collab.name || "",
      organization: collab.organization || "",
      role: collab.role || "",
      period: collab.period || "",
      status: collab.status || "active",
      description: collab.description || "",
      image_url: collab.image_url || "",
      display_order: collab.display_order || 0
    });
    setShowDialog(true);
  };

  const handleImageCrop = async (file) => {
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setFormData({ ...formData, image_url: file_url });
    setUploading(false);
  };

  const resetForm = () => {
    setShowDialog(false);
    setEditingCollab(null);
    setFormData({
      name: "",
      organization: "",
      role: "",
      period: "",
      status: "active",
      description: "",
      image_url: "",
      display_order: 0
    });
  };

  const activeCollabs = collaborations.filter(c => c.status === 'active');
  const pastCollabs = collaborations.filter(c => c.status === 'past');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Collaboration Management</h2>
        <Button
          onClick={() => {
            resetForm();
            setShowDialog(true);
          }}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Collaboration
        </Button>
      </div>

      {/* Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="backdrop-blur-2xl bg-slate-900/90 border-white/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {editingCollab ? 'Edit Collaboration' : 'Add New Collaboration'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <Input
                  placeholder="e.g., Dr. John Smith"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="bg-white/10 border-white/30 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Organization *</label>
                <Input
                  placeholder="e.g., MIT"
                  value={formData.organization}
                  onChange={(e) => setFormData({...formData, organization: e.target.value})}
                  required
                  className="bg-white/10 border-white/30 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Role/Title</label>
                <Input
                  placeholder="e.g., Professor"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="bg-white/10 border-white/30 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Period</label>
                <Input
                  placeholder="e.g., 2023 - Present"
                  value={formData.period}
                  onChange={(e) => setFormData({...formData, period: e.target.value})}
                  className="bg-white/10 border-white/30 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Status *</label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({...formData, status: value})}
                >
                  <SelectTrigger className="bg-white/10 border-white/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="past">Past</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Display Order</label>
                <Input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value) || 0})}
                  className="bg-white/10 border-white/30 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                placeholder="Brief description of the collaboration..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="bg-white/10 border-white/30 text-white resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Profile Image</label>
              <div className="flex gap-3 items-center">
                <Input
                  placeholder="Image URL"
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
                <img src={formData.image_url} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded-lg" />
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
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                {editingCollab ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Active Collaborations */}
      {activeCollabs.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-green-400" />
            <h3 className="text-xl font-bold text-white">Active Collaborations</h3>
          </div>
          <div className="grid gap-4">
            {activeCollabs.map((collab) => (
              <Card key={collab.id} className="backdrop-blur-xl bg-green-500/10 border-green-400/30 hover:bg-green-500/15 transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {collab.image_url ? (
                        <img src={collab.image_url} alt={collab.name} className="w-16 h-16 rounded-lg object-cover" />
                      ) : (
                        <div className="p-3 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500">
                          <Users className="w-10 h-10 text-white" />
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-white mb-1">{collab.name}</CardTitle>
                        <p className="text-white/80">{collab.organization}</p>
                        <div className="flex flex-wrap gap-2 mt-2 text-sm text-white/60">
                          {collab.role && <span>👤 {collab.role}</span>}
                          {collab.period && <span>📅 {collab.period}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(collab)}
                        className="text-white hover:bg-white/10"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this collaboration?')) {
                            deleteMutation.mutate(collab.id);
                          }
                        }}
                        className="text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {collab.description && (
                  <CardContent>
                    <p className="text-white/70">{collab.description}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Past Collaborations */}
      {pastCollabs.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ArrowRight className="w-5 h-5 text-gray-400" />
            <h3 className="text-xl font-bold text-white">Past Collaborations</h3>
          </div>
          <div className="grid gap-4">
            {pastCollabs.map((collab) => (
              <Card key={collab.id} className="backdrop-blur-xl bg-white/5 border-white/20 hover:bg-white/10 transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {collab.image_url ? (
                        <img src={collab.image_url} alt={collab.name} className="w-16 h-16 rounded-lg object-cover grayscale opacity-70" />
                      ) : (
                        <div className="p-3 rounded-xl bg-gradient-to-br from-gray-400 to-gray-500 opacity-70">
                          <Users className="w-10 h-10 text-white" />
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-white/80 mb-1">{collab.name}</CardTitle>
                        <p className="text-white/60">{collab.organization}</p>
                        <div className="flex flex-wrap gap-2 mt-2 text-sm text-white/50">
                          {collab.role && <span>👤 {collab.role}</span>}
                          {collab.period && <span>📅 {collab.period}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(collab)}
                        className="text-white hover:bg-white/10"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this collaboration?')) {
                            deleteMutation.mutate(collab.id);
                          }
                        }}
                        className="text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {collab.description && (
                  <CardContent>
                    <p className="text-white/50">{collab.description}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="text-center text-white/60 py-8">Loading...</div>
      )}

      {!isLoading && collaborations.length === 0 && (
        <Card className="backdrop-blur-xl bg-white/10 border-white/20">
          <CardContent className="py-8 text-center text-white/60">
            No collaborations yet. Click "Add Collaboration" to create your first entry.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Trophy, Upload } from "lucide-react";
import { format } from "date-fns";

export default function AwardManager() {
  const queryClient = useQueryClient();
  const [showDialog, setShowDialog] = useState(false);
  const [editingAward, setEditingAward] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    organization: "",
    date: "",
    description: "",
    image_url: ""
  });

  const { data: awards, isLoading } = useQuery({
    queryKey: ['awards'],
    queryFn: () => base44.entities.Award.list('-date'),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Award.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['awards'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Award.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['awards'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Award.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['awards'] });
    },
  });

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setFormData({ ...formData, [field]: file_url });
    setUploading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingAward) {
      updateMutation.mutate({ id: editingAward.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (award) => {
    setEditingAward(award);
    setFormData({
      title: award.title || "",
      organization: award.organization || "",
      date: award.date || "",
      description: award.description || "",
      image_url: award.image_url || ""
    });
    setShowDialog(true);
  };

  const resetForm = () => {
    setShowDialog(false);
    setEditingAward(null);
    setFormData({
      title: "",
      organization: "",
      date: "",
      description: "",
      image_url: ""
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Awards Management</h2>
        <Button
          onClick={() => {
            resetForm();
            setShowDialog(true);
          }}
          className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Award
        </Button>
      </div>

      {/* Award Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="backdrop-blur-2xl bg-slate-900/90 border-white/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {editingAward ? 'Edit Award' : 'Add New Award'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Award Title *</label>
              <Input
                placeholder="e.g., Best Paper Award"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                className="bg-white/10 border-white/30 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Organization *</label>
                <Input
                  placeholder="e.g., ACM"
                  value={formData.organization}
                  onChange={(e) => setFormData({...formData, organization: e.target.value})}
                  required
                  className="bg-white/10 border-white/30 text-white"
                />
              </div>
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
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                placeholder="Describe the award and achievement..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className="bg-white/10 border-white/30 text-white resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Award Image/Certificate</label>
              <div className="flex gap-3">
                <Input
                  placeholder="Image URL or upload below"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  className="bg-white/10 border-white/30 text-white"
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploading}
                  onClick={() => document.getElementById('award-image-upload').click()}
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Upload'}
                </Button>
                <input
                  id="award-image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, 'image_url')}
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
                className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
              >
                {editingAward ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Awards List */}
      <div className="grid gap-4">
        {isLoading ? (
          <div className="text-center text-white/60 py-8">Loading...</div>
        ) : awards.length === 0 ? (
          <Card className="backdrop-blur-xl bg-white/10 border-white/20">
            <CardContent className="py-8 text-center text-white/60">
              No awards yet. Click "Add Award" to create your first entry.
            </CardContent>
          </Card>
        ) : (
          awards.map((award) => (
            <Card key={award.id} className="backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/15 transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-white mb-1">{award.title}</CardTitle>
                      <p className="text-white/80">{award.organization}</p>
                      <div className="flex items-center gap-2 mt-2 text-sm text-white/60">
                        <span>📅 {award.date ? format(new Date(award.date), 'MMM dd, yyyy') : 'No date'}</span>
                      </div>
                      {award.description && (
                        <p className="text-white/70 mt-2 text-sm">{award.description}</p>
                      )}
                      {award.image_url && (
                        <img src={award.image_url} alt={award.title} className="mt-3 h-32 rounded-lg object-cover" />
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(award)}
                      className="text-white hover:bg-white/10"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this award?')) {
                          deleteMutation.mutate(award.id);
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
          ))
        )}
      </div>
    </div>
  );
}
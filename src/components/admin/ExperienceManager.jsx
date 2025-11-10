import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Briefcase } from "lucide-react";

export default function ExperienceManager() {
  const queryClient = useQueryClient();
  const [showDialog, setShowDialog] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    period: "",
    description: "",
    type: "work"
  });

  const { data: experiences, isLoading } = useQuery({
    queryKey: ['experiences'],
    queryFn: () => base44.entities.Experience.list(),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Experience.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Experience.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Experience.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingExperience) {
      updateMutation.mutate({ id: editingExperience.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (experience) => {
    setEditingExperience(experience);
    setFormData({
      title: experience.title || "",
      company: experience.company || "",
      location: experience.location || "",
      period: experience.period || "",
      description: experience.description || "",
      type: experience.type || "work"
    });
    setShowDialog(true);
  };

  const resetForm = () => {
    setShowDialog(false);
    setEditingExperience(null);
    setFormData({
      title: "",
      company: "",
      location: "",
      period: "",
      description: "",
      type: "work"
    });
  };

  const typeColors = {
    work: "from-blue-400 to-cyan-500",
    research: "from-purple-400 to-pink-500",
    teaching: "from-green-400 to-emerald-500"
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Experience Management</h2>
        <Button
          onClick={() => {
            resetForm();
            setShowDialog(true);
          }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {/* Experience Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="backdrop-blur-2xl bg-slate-900/90 border-white/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {editingExperience ? 'Edit Experience' : 'Add New Experience'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Job Title *</label>
                <Input
                  placeholder="e.g., Research Assistant"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  className="bg-white/10 border-white/30 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Company/Organization *</label>
                <Input
                  placeholder="e.g., Oklahoma State University"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  required
                  className="bg-white/10 border-white/30 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <Input
                  placeholder="e.g., Stillwater, OK"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="bg-white/10 border-white/30 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Period *</label>
                <Input
                  placeholder="e.g., Aug 2022 - Present"
                  value={formData.period}
                  onChange={(e) => setFormData({...formData, period: e.target.value})}
                  required
                  className="bg-white/10 border-white/30 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Experience Type *</label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({...formData, type: value})}
              >
                <SelectTrigger className="bg-white/10 border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Work Experience</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="teaching">Teaching</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                placeholder="Describe your responsibilities and achievements..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={6}
                className="bg-white/10 border-white/30 text-white resize-none"
              />
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
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {editingExperience ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Experience List */}
      <div className="grid gap-4">
        {isLoading ? (
          <div className="text-center text-white/60 py-8">Loading...</div>
        ) : experiences.length === 0 ? (
          <Card className="backdrop-blur-xl bg-white/10 border-white/20">
            <CardContent className="py-8 text-center text-white/60">
              No experiences yet. Click "Add Experience" to create your first entry.
            </CardContent>
          </Card>
        ) : (
          experiences.map((exp) => (
            <Card key={exp.id} className="backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/15 transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${typeColors[exp.type] || typeColors.work}`}>
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white mb-1">{exp.title}</CardTitle>
                      <p className="text-white/80">{exp.company}</p>
                      <div className="flex flex-wrap gap-2 mt-2 text-sm text-white/60">
                        {exp.location && <span>📍 {exp.location}</span>}
                        {exp.period && <span>📅 {exp.period}</span>}
                        <span className="px-2 py-0.5 rounded-full bg-white/10 capitalize">{exp.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(exp)}
                      className="text-white hover:bg-white/10"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this experience?')) {
                          deleteMutation.mutate(exp.id);
                        }
                      }}
                      className="text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {exp.description && (
                <CardContent>
                  <p className="text-white/70 whitespace-pre-wrap">{exp.description}</p>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
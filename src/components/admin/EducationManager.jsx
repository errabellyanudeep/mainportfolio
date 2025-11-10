import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, GraduationCap } from "lucide-react";

export default function EducationManager() {
  const queryClient = useQueryClient();
  const [showDialog, setShowDialog] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);
  const [formData, setFormData] = useState({
    institution: "",
    degree: "",
    field: "",
    period: "",
    location: "",
    gpa: ""
  });

  const { data: education, isLoading } = useQuery({
    queryKey: ['education'],
    queryFn: () => base44.entities.Education.list(),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Education.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Education.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Education.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingEducation) {
      updateMutation.mutate({ id: editingEducation.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (edu) => {
    setEditingEducation(edu);
    setFormData({
      institution: edu.institution || "",
      degree: edu.degree || "",
      field: edu.field || "",
      period: edu.period || "",
      location: edu.location || "",
      gpa: edu.gpa || ""
    });
    setShowDialog(true);
  };

  const resetForm = () => {
    setShowDialog(false);
    setEditingEducation(null);
    setFormData({
      institution: "",
      degree: "",
      field: "",
      period: "",
      location: "",
      gpa: ""
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Education Management</h2>
        <Button
          onClick={() => {
            resetForm();
            setShowDialog(true);
          }}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </Button>
      </div>

      {/* Education Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="backdrop-blur-2xl bg-slate-900/90 border-white/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {editingEducation ? 'Edit Education' : 'Add New Education'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Institution *</label>
              <Input
                placeholder="e.g., Oklahoma State University"
                value={formData.institution}
                onChange={(e) => setFormData({...formData, institution: e.target.value})}
                required
                className="bg-white/10 border-white/30 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Degree *</label>
                <Input
                  placeholder="e.g., Ph.D. in Computer Science"
                  value={formData.degree}
                  onChange={(e) => setFormData({...formData, degree: e.target.value})}
                  required
                  className="bg-white/10 border-white/30 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Field of Study *</label>
                <Input
                  placeholder="e.g., Computer Science"
                  value={formData.field}
                  onChange={(e) => setFormData({...formData, field: e.target.value})}
                  required
                  className="bg-white/10 border-white/30 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Period *</label>
                <Input
                  placeholder="e.g., 2024 - Present"
                  value={formData.period}
                  onChange={(e) => setFormData({...formData, period: e.target.value})}
                  required
                  className="bg-white/10 border-white/30 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <Input
                  placeholder="e.g., Stillwater, OK"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="bg-white/10 border-white/30 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">GPA (Optional)</label>
              <Input
                placeholder="e.g., 4.0/4.0"
                value={formData.gpa}
                onChange={(e) => setFormData({...formData, gpa: e.target.value})}
                className="bg-white/10 border-white/30 text-white"
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
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
              >
                {editingEducation ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Education List */}
      <div className="grid gap-4">
        {isLoading ? (
          <div className="text-center text-white/60 py-8">Loading...</div>
        ) : education.length === 0 ? (
          <Card className="backdrop-blur-xl bg-white/10 border-white/20">
            <CardContent className="py-8 text-center text-white/60">
              No education entries yet. Click "Add Education" to create your first entry.
            </CardContent>
          </Card>
        ) : (
          education.map((edu) => (
            <Card key={edu.id} className="backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/15 transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500">
                      <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white mb-1">{edu.degree}</CardTitle>
                      <p className="text-white/80 font-medium">{edu.institution}</p>
                      <div className="flex flex-wrap gap-2 mt-2 text-sm text-white/60">
                        <span>📚 {edu.field}</span>
                        {edu.period && <span>📅 {edu.period}</span>}
                        {edu.location && <span>📍 {edu.location}</span>}
                        {edu.gpa && <span>🎓 GPA: {edu.gpa}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(edu)}
                      className="text-white hover:bg-white/10"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this education entry?')) {
                          deleteMutation.mutate(edu.id);
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
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Award, Upload, ExternalLink } from "lucide-react";
import { format } from "date-fns";

export default function CertificationManager() {
  const queryClient = useQueryClient();
  const [showDialog, setShowDialog] = useState(false);
  const [editingCertification, setEditingCertification] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    issuer: "",
    issue_date: "",
    credential_url: "",
    badge_url: ""
  });

  const { data: certifications, isLoading } = useQuery({
    queryKey: ['certifications'],
    queryFn: () => base44.entities.Certification.list('-issue_date'),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Certification.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Certification.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Certification.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
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
    if (editingCertification) {
      updateMutation.mutate({ id: editingCertification.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (cert) => {
    setEditingCertification(cert);
    setFormData({
      name: cert.name || "",
      issuer: cert.issuer || "",
      issue_date: cert.issue_date || "",
      credential_url: cert.credential_url || "",
      badge_url: cert.badge_url || ""
    });
    setShowDialog(true);
  };

  const resetForm = () => {
    setShowDialog(false);
    setEditingCertification(null);
    setFormData({
      name: "",
      issuer: "",
      issue_date: "",
      credential_url: "",
      badge_url: ""
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Certifications Management</h2>
        <Button
          onClick={() => {
            resetForm();
            setShowDialog(true);
          }}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Certification
        </Button>
      </div>

      {/* Certification Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="backdrop-blur-2xl bg-slate-900/90 border-white/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {editingCertification ? 'Edit Certification' : 'Add New Certification'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Certification Name *</label>
              <Input
                placeholder="e.g., AWS Certified Cloud Practitioner"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                className="bg-white/10 border-white/30 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Issuing Organization *</label>
                <Input
                  placeholder="e.g., Amazon Web Services"
                  value={formData.issuer}
                  onChange={(e) => setFormData({...formData, issuer: e.target.value})}
                  required
                  className="bg-white/10 border-white/30 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Issue Date *</label>
                <Input
                  type="date"
                  value={formData.issue_date}
                  onChange={(e) => setFormData({...formData, issue_date: e.target.value})}
                  required
                  className="bg-white/10 border-white/30 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Credential URL</label>
              <Input
                placeholder="https://..."
                value={formData.credential_url}
                onChange={(e) => setFormData({...formData, credential_url: e.target.value})}
                className="bg-white/10 border-white/30 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Badge/Certificate Image</label>
              <div className="flex gap-3">
                <Input
                  placeholder="Image URL or upload below"
                  value={formData.badge_url}
                  onChange={(e) => setFormData({...formData, badge_url: e.target.value})}
                  className="bg-white/10 border-white/30 text-white"
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploading}
                  onClick={() => document.getElementById('badge-upload').click()}
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Upload'}
                </Button>
                <input
                  id="badge-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, 'badge_url')}
                />
              </div>
              {formData.badge_url && (
                <img src={formData.badge_url} alt="Badge Preview" className="mt-2 h-32 rounded-lg object-cover" />
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
                {editingCertification ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Certifications List */}
      <div className="grid md:grid-cols-2 gap-4">
        {isLoading ? (
          <div className="col-span-2 text-center text-white/60 py-8">Loading...</div>
        ) : certifications.length === 0 ? (
          <Card className="col-span-2 backdrop-blur-xl bg-white/10 border-white/20">
            <CardContent className="py-8 text-center text-white/60">
              No certifications yet. Click "Add Certification" to create your first entry.
            </CardContent>
          </Card>
        ) : (
          certifications.map((cert) => (
            <Card key={cert.id} className="backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/15 transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {cert.badge_url ? (
                      <img src={cert.badge_url} alt={cert.name} className="w-16 h-16 rounded-lg object-cover" />
                    ) : (
                      <div className="p-3 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500">
                        <Award className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <CardTitle className="text-white mb-1 text-lg">{cert.name}</CardTitle>
                      <p className="text-white/80 text-sm">{cert.issuer}</p>
                      <p className="text-white/60 text-xs mt-1">
                        📅 Issued: {cert.issue_date ? format(new Date(cert.issue_date), 'MMM yyyy') : 'No date'}
                      </p>
                      {cert.credential_url && (
                        <a
                          href={cert.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-300 hover:text-blue-200 mt-2"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Credential
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(cert)}
                      className="text-white hover:bg-white/10"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this certification?')) {
                          deleteMutation.mutate(cert.id);
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
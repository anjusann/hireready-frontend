"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { resumeService } from "@/services/resumes";
import { Resume } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  FileText,
  Upload,
  Trash2,
  Star,
  StarOff,
  Loader2,
  AlertTriangle,
} from "lucide-react";

export default function ResumesPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["resumes"],
    queryFn: async () => {
      try {
        const res = await resumeService.getAll();
        return res.data as Resume[];
      } catch {
        return [] as Resume[];
      }
    },
  });

  const resumes = data || [];
  const MAX_RESUMES = 5;
  const canUpload = resumes.length < MAX_RESUMES;

  const deleteMutation = useMutation({
    mutationFn: resumeService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      toast.success("Resume deleted successfully.");
      setShowDeleteDialog(false);
      setDeleteId(null);
    },
    onError: () => toast.error("Failed to delete resume."),
  });

  const primaryMutation = useMutation({
    mutationFn: resumeService.setPrimary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      toast.success("Primary resume updated.");
    },
    onError: () => toast.error("Failed to update primary resume."),
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!canUpload) {
      toast.error(`You can only upload up to ${MAX_RESUMES} resumes. Please delete one first.`);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", file.name.replace(/\.[^/.]+$/, ""));

    setUploading(true);
    try {
      await resumeService.upload(formData);
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      toast.success("Resume uploaded successfully!");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      toast.error("Failed to upload resume.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (deleteId) deleteMutation.mutate(deleteId);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const resumeToDelete = resumes.find((r) => r.id === deleteId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Resumes</h1>
          <p className="text-muted-foreground mt-1">
            Upload and manage your resumes.
          </p>
        </div>
        <Badge variant="outline" className={`text-sm px-3 py-1 ${
          resumes.length >= MAX_RESUMES
            ? "border-red-300 text-red-600"
            : "border-green-300 text-green-600"
        }`}>
          {resumes.length} / {MAX_RESUMES} resumes
        </Badge>
      </div>

      {/* Upload card */}
      <Card className={!canUpload ? "opacity-60" : ""}>
        <CardContent className="pt-6">
          {!canUpload && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
              <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
              <p className="text-sm text-red-600">
                You have reached the maximum limit of {MAX_RESUMES} resumes.
                Please delete one to upload a new resume.
              </p>
            </div>
          )}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              canUpload
                ? "cursor-pointer hover:border-primary"
                : "cursor-not-allowed border-muted"
            }`}
            onClick={() => canUpload && fileInputRef.current?.click()}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Uploading...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className={`h-8 w-8 ${canUpload ? "text-muted-foreground" : "text-muted"}`} />
                <p className={`font-medium ${!canUpload && "text-muted-foreground"}`}>
                  {canUpload ? "Click to upload resume" : "Upload limit reached"}
                </p>
                <p className="text-sm text-muted-foreground">
                  PDF or DOCX — max 10MB
                </p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            className="hidden"
            onChange={handleUpload}
            disabled={!canUpload}
          />
        </CardContent>
      </Card>

      {/* Resume list */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading...
        </div>
      ) : resumes.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="font-medium">No resumes yet</p>
          <p className="text-sm">Upload your first resume above</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {resumes.map((resume) => (
            <Card key={resume.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{resume.title}</p>
                      {resume.is_primary && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          Primary
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {resume.file_type?.toUpperCase()} •{" "}
                      {formatSize(resume.file_size)} •{" "}
                      {new Date(resume.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => primaryMutation.mutate(resume.id)}
                    title={resume.is_primary ? "Primary resume" : "Set as primary"}
                  >
                    {resume.is_primary ? (
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    ) : (
                      <StarOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => handleDeleteClick(resume.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete resume
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">
                {resumeToDelete?.title}
              </span>
              ? This action cannot be undone and will also delete all
              associated analyses.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowDeleteDialog(false);
                  setDeleteId(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Yes, delete"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
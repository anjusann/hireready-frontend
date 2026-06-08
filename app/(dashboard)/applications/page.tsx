"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { applicationService } from "@/services/applications";
import { Application } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Briefcase, Trash2, Calendar } from "lucide-react";

const COLUMNS = [
  { id: "applied",             label: "Applied",             color: "bg-blue-100 text-blue-800" },
  { id: "under_review",        label: "Under Review",        color: "bg-yellow-100 text-yellow-800" },
  { id: "interview_scheduled", label: "Interview Scheduled", color: "bg-purple-100 text-purple-800" },
  { id: "final_interview",     label: "Final Interview",     color: "bg-orange-100 text-orange-800" },
  { id: "offer_received",      label: "Offer Received",      color: "bg-green-100 text-green-800" },
  { id: "rejected",            label: "Rejected",            color: "bg-red-100 text-red-800" },
];

const emptyForm = {
  company_name: "",
  job_title: "",
  status: "applied" as "applied" | "under_review" | "interview_scheduled" | "final_interview" | "offer_received" | "rejected" | "withdrawn",
  applied_date: new Date().toISOString().split("T")[0],
  notes: "",
};
export default function ApplicationsPage() {
  const queryClient = useQueryClient();
  const [showDialog, setShowDialog] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      try {
        const res = await applicationService.getAll();
        return res.data as Application[];
      } catch {
        return [] as Application[];
      }
    },
  });

  const applications = data || [];

  const createMutation = useMutation({
    mutationFn: applicationService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast.success("Application added!");
      setShowDialog(false);
      setForm(emptyForm);
    },
    onError: () => toast.error("Failed to add application."),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      applicationService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
    onError: () => toast.error("Failed to update status."),
  });

  const deleteMutation = useMutation({
    mutationFn: applicationService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast.success("Application deleted.");
    },
    onError: () => toast.error("Failed to delete application."),
  });

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newStatus = result.destination.droppableId;
    const appId = parseInt(result.draggableId);
    const app = applications.find((a) => a.id === appId);
    if (app && app.status !== newStatus) {
      statusMutation.mutate({ id: appId, status: newStatus });
    }
  };

  const filtered = applications.filter(
    (a) =>
      a.company_name.toLowerCase().includes(search.toLowerCase()) ||
      a.job_title.toLowerCase().includes(search.toLowerCase())
  );

  const getColumnApps = (colId: string) =>
    filtered.filter((a) => a.status === colId);

  const handleSubmit = () => {
    if (!form.company_name || !form.job_title) {
      toast.error("Company name and job title are required.");
      return;
    }
    createMutation.mutate(form);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Application tracker</h1>
          <p className="text-muted-foreground mt-1">
            Track all your job applications in one place.
          </p>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add application
        </Button>
      </div>

      <Input
        placeholder="Search by company or job title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <div className="flex gap-4 text-sm text-muted-foreground">
        <span>{applications.length} total applications</span>
        <span>•</span>
        <span>{applications.filter((a) => a.status === "offer_received").length} offers received</span>
        <span>•</span>
        <span>{applications.filter((a) => a.status === "interview_scheduled").length} interviews scheduled</span>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {COLUMNS.map((col) => {
              const colApps = getColumnApps(col.id);
              return (
                <div key={col.id} className="flex-shrink-0 w-72">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-medium text-sm">{col.label}</span>
                    <Badge variant="secondary" className="text-xs">
                      {colApps.length}
                    </Badge>
                  </div>
                  <Droppable droppableId={col.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-32 rounded-lg p-2 space-y-2 transition-colors ${
                          snapshot.isDraggingOver ? "bg-accent" : "bg-muted/40"
                        }`}
                      >
                        {colApps.map((app, index) => (
                          <Draggable
                            key={app.id}
                            draggableId={String(app.id)}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <Card className={`cursor-grab active:cursor-grabbing ${
                                  snapshot.isDragging ? "shadow-lg rotate-1" : ""
                                }`}>
                                  <CardContent className="p-3 space-y-2">
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">
                                          {app.company_name}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                          {app.job_title}
                                        </p>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive"
                                        onClick={() => deleteMutation.mutate(app.id)}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                    <Badge className={`text-xs ${col.color}`} variant="outline">
                                      {col.label}
                                    </Badge>
                                    {app.applied_date && (
                                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(app.applied_date).toLocaleDateString()}
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        {colApps.length === 0 && (
                          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                            <Briefcase className="h-6 w-6 mb-2 opacity-30" />
                            <p className="text-xs">No applications</p>
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add new application</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Company name</Label>
              <Input
                placeholder="Google, Microsoft..."
                value={form.company_name}
                onChange={(e) => setForm({ ...form, company_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Job title</Label>
              <Input
                placeholder="Software Engineer..."
                value={form.job_title}
                onChange={(e) => setForm({ ...form, job_title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Applied date</Label>
              <Input
                type="date"
                value={form.applied_date}
                onChange={(e) => setForm({ ...form, applied_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Input
                placeholder="Any notes..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowDialog(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleSubmit}
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Adding..." : "Add application"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
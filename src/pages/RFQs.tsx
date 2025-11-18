import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const initialRfqs = [
  {
    id: "RFQ-2024-001",
    title: "Industrial Valve Set",
    company: "Marine Solutions Ltd",
    date: "2024-01-15",
    amount: "$15,000",
    status: "pending",
  },
  {
    id: "RFQ-2024-002",
    title: "Hydraulic Pump",
    company: "Ocean Logistics Inc",
    date: "2024-01-14",
    amount: "$8,500",
    status: "approved",
  },
  {
    id: "RFQ-2024-003",
    title: "Steel Fittings",
    company: "Port Authority",
    date: "2024-01-13",
    amount: "$22,000",
    status: "review",
  },
];

const RFQs = () => {
  const [rfqs, setRfqs] = useState(initialRfqs);
  const [selectedRfq, setSelectedRfq] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    if (status === "approved") {
      return (
        <Badge className="bg-accent hover:bg-accent text-accent-foreground">
          <span className="mr-1">✓</span> Approved
        </Badge>
      );
    }
    if (status === "review") {
      return (
        <Badge className="bg-success hover:bg-success text-success-foreground">
          <span className="mr-1">⊙</span> Under Review
        </Badge>
      );
    }
    if (status === "pending") {
      return (
        <Badge className="bg-warning hover:bg-warning text-warning-foreground">
          <span className="mr-1">…</span> Pending
        </Badge>
      );
    }
    if (status === "rejected") {
      return (
        <Badge className="bg-destructive hover:bg-destructive text-destructive-foreground">
          <span className="mr-1">✗</span> Rejected
        </Badge>
      );
    }
    return null;
  };

  const openDialog = (rfq) => {
    setSelectedRfq(rfq);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setSelectedRfq(null);
    setIsDialogOpen(false);
  };

  const handleApprove = () => {
    if (!selectedRfq) return;
    setRfqs((prev) =>
      prev.map((rfq) =>
        rfq.id === selectedRfq.id ? { ...rfq, status: "approved" } : rfq
      )
    );
    alert(`RFQ ${selectedRfq.id} approved.`);
    closeDialog();
  };

  const handleReject = () => {
    if (!selectedRfq) return;
    setRfqs((prev) =>
      prev.map((rfq) =>
        rfq.id === selectedRfq.id ? { ...rfq, status: "rejected" } : rfq
      )
    );
    alert(`RFQ ${selectedRfq.id} rejected.`);
    closeDialog();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">RFQs</h1>
        <p className="text-muted-foreground mt-1">
          Manage and track your request for quotations.
        </p>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-primary text-xl">Recent RFQs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {rfqs.map((rfq) => (
            <div
              key={rfq.id}
              className="bg-card border border-blue-200 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-primary text-base">
                        {rfq.id}
                        <span className="ml-3 font-medium">{rfq.title}</span>
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {rfq.company} · {rfq.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-semibold text-accent">
                        {rfq.amount}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openDialog(rfq)}
                      >
                        <Eye className="h-4 w-4 text-accent" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    {getStatusBadge(rfq.status)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>RFQ Details</DialogTitle>
          </DialogHeader>
          {selectedRfq && (
            <div className="space-y-4">
              <p><strong>ID:</strong> {selectedRfq.id}</p>
              <p><strong>Title:</strong> {selectedRfq.title}</p>
              <p><strong>Company:</strong> {selectedRfq.company}</p>
              <p><strong>Date:</strong> {selectedRfq.date}</p>
              <p><strong>Amount:</strong> {selectedRfq.amount}</p>
              <p><strong>Status:</strong> {getStatusBadge(selectedRfq.status)}</p>
              {selectedRfq.status === "pending" && (
                <div className="flex space-x-4">
                  <Button onClick={handleApprove} className="bg-green-600 text-white">
                    Approve
                  </Button>
                  <Button onClick={handleReject} className="bg-red-600 text-white">
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RFQs;

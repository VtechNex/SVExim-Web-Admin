import React, { useEffect, useState } from "react";
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
import QUOTES from '@/services/quoteService';

const RFQs = () => {
  const [quotes, setQuotes] = useState(null);
  const [selectedRfq, setSelectedRfq] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(()=>{
    const fetchQuotes = async () => {
      const response = await QUOTES.GET();
      if (response.status!==200) {
        // error
        console.log('Error fetching quotes', response);
      } else {
        console.log('Quotes:', response.data);
        setQuotes(response.data.quotes);
      }
    }
    fetchQuotes();
  },[]);

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

  // const handleApprove = () => {
  //   if (!selectedRfq) return;
  //   setRfqs((prev) =>
  //     prev.map((rfq) =>
  //       rfq.id === selectedRfq.id ? { ...rfq, status: "approved" } : rfq
  //     )
  //   );
  //   alert(`RFQ ${selectedRfq.id} approved.`);
  //   closeDialog();
  // };

  // const handleReject = () => {
  //   if (!selectedRfq) return;
  //   setRfqs((prev) =>
  //     prev.map((rfq) =>
  //       rfq.id === selectedRfq.id ? { ...rfq, status: "rejected" } : rfq
  //     )
  //   );
  //   alert(`RFQ ${selectedRfq.id} rejected.`);
  //   closeDialog();
  // };

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
          <CardTitle className="text-primary text-xl">Recent Quotes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(quotes && quotes.map((q) => (
            <div
              key={q.id}
              className="bg-card border border-blue-200 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-primary text-base">
                        {q.id}
                        <span className="ml-3 font-medium">{q.name}</span>
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {q.email} · {q?.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-semibold text-accent">
                        {q.budget}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openDialog(q)}
                      >
                        <Eye className="h-4 w-4 text-accent" />
                      </Button>
                    </div>
                  </div>
                  {/* <div className="flex items-center justify-end">
                    {getStatusBadge(rfq.status)}
                  </div> */}
                </div>
              </div>
            </div>
          ))) || (
            (!quotes && (
              <div className="flex flex-col items-center justify-center h-[60vh] px-4 text-center">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-100">
                No Quotes Available Yet
              </h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400 text-base sm:text-lg max-w-md">
                It looks like there are no quotes made till now.
                Please try to make as much as possible reach to your customers.
              </p>
            </div>
            ))
          )}
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
              <p><strong>Title:</strong> {selectedRfq.name}</p>
              <p><strong>Company:</strong> {selectedRfq.email}</p>
              <p><strong>Date:</strong> {selectedRfq.date}</p>
              <p><strong>Amount:</strong> {selectedRfq.budget}</p>
              <p><strong>Status:</strong> {getStatusBadge(selectedRfq.status)}</p>
              <p><strong>Message:</strong> {selectedRfq.message}</p>
              {selectedRfq.status === "pending" && (
                <div className="flex space-x-4">
                  <Button className="bg-green-600 text-white">
                    Approve
                  </Button>
                  <Button className="bg-red-600 text-white">
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

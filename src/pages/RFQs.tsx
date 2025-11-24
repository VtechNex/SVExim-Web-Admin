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
import { PRODUCTS } from '@/services/productService';

const RFQs = () => {
  const [quotes, setQuotes] = useState(null);
  const [selectedRfq, setSelectedRfq] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [product, setProduct] = useState(null);

  const handleGetProduct = async (id) => {
    const response = await PRODUCTS.GET_ID(id);
    if (response.status !== 200) {
      setProduct(null);
    } else {
      setProduct(response.data.product);
    }
  }

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
    if (rfq.pid) handleGetProduct(rfq.pid)
    else setProduct(null)
  };

  const closeDialog = () => {
    setSelectedRfq(null);
    setIsDialogOpen(false);
    setProduct(null);
  };

  const handleApprove = () => {
    if (!selectedRfq) return;
    setQuotes((prev) =>
      prev.map((rfq) =>
        rfq.id === selectedRfq.id ? { ...rfq, status: "approved" } : rfq
      )
    );
    alert(`RFQ ${selectedRfq.id} approved.`);
    closeDialog();
  };

  const handleReject = () => {
    if (!selectedRfq) return;
    setQuotes((prev) =>
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
          <CardTitle className="text-primary text-xl">Recent Quotes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(quotes && quotes.length > 0) ? (
            quotes.map((q) => {
              return (
                <div
                  key={q.id}
                  className="bg-card border border-blue-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    {/* LEFT SIDE */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-primary text-base flex items-center gap-2">
                        <span>{q.name}</span>
                        <span className="text-xs text-muted-foreground">#{q.id}</span>
                      </h3>

                      <p className="text-sm text-muted-foreground mt-1">
                        {q.email}
                      </p>

                      <p className="text-sm text-gray-700 mt-3">
                        {q.message?.length > 50
                        ? q.message.slice(0, 50) + "..."
                        : q.message || "No message provided"}
                      </p>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="flex flex-col items-end gap-3 ml-4">
                      <span className="text-lg font-semibold text-accent">
                        {q.budget?.trim() !== "" ? q.budget : "N/A"}
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
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-[60vh] px-4 text-center">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-100">
                No Quotes Available Yet
              </h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400 text-base sm:text-lg max-w-md">
                It looks like there are no quotes made till now.
                Please try to make as much as possible reach to your customers.
              </p>
            </div>
          )}
        </CardContent>

      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Quote Details
            </DialogTitle>
          </DialogHeader>

          {selectedRfq && (
            <div className="space-y-6">

              {/* TWO COLUMN GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* LEFT — QUOTE INFO */}
                <div className="space-y-4 text-sm">

                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">Quote ID</p>
                    <p className="font-medium">#{selectedRfq.id}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">Name</p>
                    <p className="font-medium">{selectedRfq.name}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">Email</p>
                    <p className="font-medium">{selectedRfq.email}</p>
                  </div>

                  {selectedRfq.phone && (
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs">Phone</p>
                      <p className="font-medium">{selectedRfq.phone}</p>
                    </div>
                  )}

                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">Budget</p>
                    <p className="font-semibold text-accent">
                      {selectedRfq.budget?.trim() !== "" ? selectedRfq.budget : "N/A"}
                    </p>
                  </div>

                </div>

                {/* RIGHT — PRODUCT INFO */}
                {(selectedRfq.pid && product) ? (
                  <div className="p-4 border rounded-lg bg-muted/40 space-y-3">
                    <h3 className="text-sm font-semibold text-primary">
                      Product Information
                    </h3>

                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs">Title</p>
                      <p className="font-medium">{product.title}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs">Condition</p>
                      <p className="font-medium capitalize">
                        {product.condition || "N/A"}
                      </p>
                    </div>

                    <div className="flex justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-xs">Brand</p>
                        <p className="font-medium">{product.brand || "N/A"}</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-muted-foreground text-xs">Category</p>
                        <p className="font-medium">{product.category || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 border rounded-lg bg-muted/40 text-center text-sm text-muted-foreground">
                    No Product Linked
                  </div>
                )}

              </div>

              {/* MESSAGE — FULL WIDTH */}
              <div>
                <p className="text-muted-foreground text-xs mb-1">Message</p>
                <div className="p-3 bg-muted rounded-md text-sm leading-relaxed border">
                  {selectedRfq.message}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              {selectedRfq.status === "pending" && (
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    className="bg-green-600 text-white hover:bg-green-700"
                    onClick={() => handleApprove()}
                  >
                    Approve
                  </Button>

                  <Button
                    className="bg-red-600 text-white hover:bg-red-700"
                    onClick={() => handleReject()}
                  >
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

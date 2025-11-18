import React, { useState } from "react";
import { Package, Tag, FileText, CheckCircle2, Plus } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { RecentActivity } from "@/components/RecentActivity";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Dashboard = () => {
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isBrandDialogOpen, setIsBrandDialogOpen] = useState(false);
  const [isRfqDialogOpen, setIsRfqDialogOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    status: "New",
  });
  const [brandForm, setBrandForm] = useState({
    name: "",
  });
  const [rfqForm, setRfqForm] = useState({
    id: "",
    status: "Pending",
  });

  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setProductForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBrandInputChange = (e) => {
    const { name, value } = e.target;
    setBrandForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRfqInputChange = (e) => {
    const { name, value } = e.target;
    setRfqForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = () => {
    if (!productForm.name || !productForm.brand || !productForm.category || !productForm.price) {
      alert("Please fill in all required fields.");
      return;
    }
    // Here you would typically send the data to your backend
    alert("Product added successfully!");
    setIsProductDialogOpen(false);
    setProductForm({
      name: "",
      brand: "",
      category: "",
      price: "",
      status: "New",
    });
  };

  const handleAddBrand = () => {
    if (!brandForm.name) {
      alert("Please enter the brand name.");
      return;
    }
    // Here you would typically send the data to your backend
    alert("Brand added successfully!");
    setIsBrandDialogOpen(false);
    setBrandForm({
      name: "",
    });
  };

  const handleApproveRfq = () => {
    if (!rfqForm.id) {
      alert("Please enter the RFQ ID.");
      return;
    }
    // Here you would typically send the data to your backend
    alert("RFQ approved successfully!");
    setIsRfqDialogOpen(false);
    setRfqForm({
      id: "",
      status: "Approved",
    });
  };

  const stats = [
    {
      title: "Total Products",
      value: "1,247",
      change: "+12% from last month",
      changeType: "positive" as const,
      icon: Package,
      iconColor: "text-secondary",
    },
    {
      title: "Active Brands",
      value: "156",
      change: "+3% from last month",
      changeType: "positive" as const,
      icon: Tag,
      iconColor: "text-secondary",
    },
    {
      title: "Pending RFQs",
      value: "23",
      change: "+8% from last month",
      changeType: "positive" as const,
      icon: FileText,
      iconColor: "text-secondary",
    },
    {
      title: "Orders Fulfilled",
      value: "892",
      change: "+15% from last month",
      changeType: "positive" as const,
      icon: CheckCircle2,
      iconColor: "text-accent",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl p-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary mb-2">
          ADMIN CONTROL CENTER
        </h1>
        <p className="text-lg text-primary/70">
          Monitor and manage your marine-industrial operations
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="bg-card rounded-lg p-6 border border-border">
        <h2 className="text-xl font-bold text-primary mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Button
            className="h-12 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            onClick={() => setIsProductDialogOpen(true)}
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Product
          </Button>
          <Button
            className="h-12 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            onClick={() => setIsBrandDialogOpen(true)}
          >
            <Tag className="h-5 w-5 mr-2" />
            Add Brand
          </Button>
          <Button
            className="h-12 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            onClick={() => setIsRfqDialogOpen(true)}
          >
            <CheckCircle2 className="h-5 w-5 mr-2" />
            Approve RFQ
          </Button>
        </div>
      </div>

      <RecentActivity />

      {/* Add Product Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); handleAddProduct(); }} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={productForm.name}
                onChange={handleProductInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                name="brand"
                value={productForm.brand}
                onChange={handleProductInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={productForm.category}
                onChange={handleProductInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                value={productForm.price}
                onChange={handleProductInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={productForm.status} onValueChange={(value) => setProductForm((prev) => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Refurbished">Refurbished</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-primary text-white">
                Add Product
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Brand Dialog */}
      <Dialog open={isBrandDialogOpen} onOpenChange={setIsBrandDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Brand</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); handleAddBrand(); }} className="space-y-4">
            <div>
              <Label htmlFor="brandName">Brand Name</Label>
              <Input
                id="brandName"
                name="name"
                value={brandForm.name}
                onChange={handleBrandInputChange}
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-primary text-white">
                Add Brand
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Approve RFQ Dialog */}
      <Dialog open={isRfqDialogOpen} onOpenChange={setIsRfqDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve RFQ</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); handleApproveRfq(); }} className="space-y-4">
            <div>
              <Label htmlFor="rfqId">RFQ ID</Label>
              <Input
                id="rfqId"
                name="id"
                value={rfqForm.id}
                onChange={handleRfqInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="rfqStatus">Status</Label>
              <Select value={rfqForm.status} onValueChange={(value) => setRfqForm((prev) => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-primary text-white">
                Approve RFQ
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;

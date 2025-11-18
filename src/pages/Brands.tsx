import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Tag, Edit, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import BRANDS from "@/services/brandService"

const Brands = () => {
  // ✅ Initialize with imported brands
  const [brands, setBrands] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
    logoUrl: "",
    faq: [],
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [faqInput, setFaqInput] = useState("");

  useEffect(() => {
    const fetchBrands = async () => {
      const response = await BRANDS.GET();
      if (response?.status === 200) {
        setBrands(response.data.brands);
      } else {
        console.error("Failed to fetch brands", response);
      }
    };
    fetchBrands();
  }, []);

  const resetForm = () => {
    setFormData({
      id: null,
      name: "",
      description: "",
      logoUrl: "",
      faq: [],
    });
    setIsEditMode(false);
    setFaqInput("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddBrand = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEditBrand = (brand) => {
    setFormData(brand);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleDeleteBrand = (id) => {
    if (window.confirm("Are you sure you want to delete this brand?")) {
      setBrands(brands.filter((b) => b.id !== id));
    }
  };

  const handleAddFaq = () => {
    if (faqInput.trim() === "") return;
    setFormData((prev) => ({
      ...prev,
      faq: [...prev.faq, faqInput.trim()],
    }));
    setFaqInput("");
  };

  const handleDeleteFaq = (index) => {
    setFormData((prev) => ({
      ...prev,
      faq: prev.faq.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert("Please enter the brand name.");
      return;
    }

    if (isEditMode) {
      // Update existing brand
      setBrands(brands.map((b) => (b.id === formData.id ? formData : b)));
    } else {
      // Add new brand
      const newBrand = {
        ...formData,
        id: brands.length ? Math.max(...brands.map((b) => b.id)) + 1 : 1,
      };
      setBrands([...brands, newBrand]);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Brands</h1>
          <p className="text-muted-foreground mt-1">
            Manage your product brands and manufacturers.
          </p>
        </div>
        <Button
          className="gap-2 bg-secondary hover:bg-secondary/90"
          onClick={handleAddBrand}
        >
          <Plus className="h-4 w-4" />
          Add Brand
        </Button>
      </div>

      {brands.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No brands yet. Add your first brand to get started.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {brands?.map((brand) => (
            <Card key={brand.id} className="border-2 border-dashed border-border relative">
              <CardContent className="pt-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-primary text-lg">{brand.name}</h3>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditBrand(brand)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteBrand(brand.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {/* <div>
                    <h4 className="font-semibold">FAQs:</h4>
                    {brand.faq.length === 0 ? (
                      <p className="text-muted-foreground">No FAQs added.</p>
                    ) : (
                      <ul className="list-disc list-inside">
                        {brand.faq.map((faq, index) => (
                          <li key={index}>{faq}</li>
                        ))}
                      </ul>
                    )}
                  </div> */}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Brand" : "Add Brand"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Brand Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="faqInput">Add FAQ</Label>
              <div className="flex space-x-2">
                <Input
                  id="faqInput"
                  value={faqInput}
                  onChange={(e) => setFaqInput(e.target.value)}
                  placeholder="Enter FAQ"
                />
                <Button type="button" onClick={handleAddFaq}>
                  Add
                </Button>
              </div>
            </div>
            <div>
              <h4 className="font-semibold">Current FAQs:</h4>
              {formData.faq.length === 0 ? (
                <p className="text-muted-foreground">No FAQs added.</p>
              ) : (
                <ul className="list-disc list-inside">
                  {formData.faq.map((faq, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span>{faq}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteFaq(index)}
                      >
                        Delete
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-primary text-white">
                {isEditMode ? "Update" : "Add"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Brands;

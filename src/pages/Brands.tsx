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
import BRANDS from "@/services/brandService";

const Brands = () => {
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
  const [faqList, setFaqList] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      const response = await BRANDS.GET();
      if (response?.status === 200) {
        setBrands(response.data.brands);
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
    setFaqList([]);
    setIsEditMode(false);
    setFaqInput("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ FIXED: Always convert FileReader result to string
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;

      // Guarantee it's a string
      const base64 = typeof result === "string" ? result : "";

      setFormData((prev) => ({ ...prev, logoUrl: base64 }));
    };

    reader.readAsDataURL(file);
  };

  const handleAddBrand = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEditBrand = (brand) => {
    setFormData(brand);
    setFaqList(brand.faq ?? []);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleDeleteBrand = (id) => {
    if (window.confirm("Delete this brand?")) {
      setBrands(brands.filter((b) => b.id !== id));
    }
  };

  const handleAddFaq = () => {
    if (!faqInput.trim()) return;
    setFaqList((prev) => [...prev, faqInput.trim()]);
    setFaqInput("");
  };

  const handleDeleteFaq = (index) => {
    setFaqList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name) {
      alert("Brand name required.");
      return;
    }

    const newFormdata = { ...formData, faq: faqList };

    if (isEditMode) {
      const response = await BRANDS.UPDATE(formData.id, newFormdata);
      if (!(response?.status === 200 || response?.status === 201)) {
        console.error("Failed to update");
        return;
      }

      setBrands(brands.map((b) => (b.id === formData.id ? newFormdata : b)));
    } else {
      setBrands([...brands, newFormdata]);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Brands
          </h1>
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
                No brands yet. Add your first brand.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {brands?.map((brand) => (
            <Card
              key={brand.id}
              className="border-2 border-dashed border-border relative"
            >
              <CardContent className="pt-6 space-y-4">
                {brand.logoUrl && (
                  <img
                    src={brand.logoUrl}
                    alt="Logo"
                    className="w-20 h-20 object-contain mx-auto"
                  />
                )}

                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-primary text-lg">
                    {brand.name}
                  </h3>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditBrand(brand)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteBrand(brand.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm">
                  {brand.description || "No description"}
                </p>
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
              <Label>Brand Name</Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label>Description</Label>
              <textarea
                className="w-full border rounded-md p-2"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label>Logo URL</Label>
              <Input
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label>Upload Logo</Label>
              <Input type="file" accept="image/*" onChange={handleLogoUpload} />

              {formData.logoUrl && (
                <img
                  src={formData.logoUrl}
                  className="w-24 h-24 object-contain mt-3"
                  alt="Preview"
                />
              )}
            </div>

            <div>
              <Label>Add FAQ</Label>
              <div className="flex space-x-2">
                <Input
                  value={faqInput}
                  onChange={(e) => setFaqInput(e.target.value)}
                />
                <Button type="button" onClick={handleAddFaq}>
                  Add
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold">Current FAQs:</h4>

              {faqList.length === 0 ? (
                <p className="text-muted-foreground">No FAQs added.</p>
              ) : (
                <ul className="list-disc list-inside">
                  {faqList.map((faq, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center"
                    >
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

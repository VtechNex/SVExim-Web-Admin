import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Package, Edit, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PRODUCTS } from "@/services/productService";

// ✅ Import defaultBrands from your new data file
import { defaultBrands } from "../data/brandsData";
import { categories } from "../data/categories"

// ----------------------
// Main Component
// ----------------------
const Products = () => {
  const [products, setProducts] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    title: "",
    brand: "",
    category: "",
    price: "",
    currency: "",
    description: "",
    images: null,
    quantity: 0,
    condition: "",
    statusColor: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await PRODUCTS.GET();
      if (response.status !== 200) {
        alert("Failed to fetch products.");
        return;
      }
      setProducts(response.data.items);
    };
    fetchProducts();
  }, []);

  const resetForm = () => {
    setFormData({
    id: null,
    title: "",
    brand: "",
    category: "",
    price: "",
    currency: "",
    description: "",
    images: null,
    quantity: 0,
    condition: "",
    statusColor: "",
  });
    setIsEditMode(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEditProduct = (product: typeof formData) => {
    setFormData(product);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const response = await PRODUCTS.DELETE(id);
      if (response.status !== 200) {
        alert("Failed to delete product.");
        return;
      }
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.brand ||
      !formData.category ||
      !formData.price
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    if (isEditMode) {
      const response = await PRODUCTS.UPDATE(formData.id, formData);
      if (response.status !== 200) {
        alert("Failed to update product.");
        return;
      }
      setProducts(
        products.map((p) => (p.id === formData.id ? formData : p))
      );
    } else {
      const newProduct = {
        ...formData,
        id: products.length ? Math.max(...products.map((p) => p.id ?? 0)) + 1 : 1,
      };
      const response = await PRODUCTS.ADD(newProduct);
      if (!response && (response.status !== 200 || response.status !== 201)) {
        alert("Failed to add product.");
        return;
      }
      setProducts([...products, newProduct]);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            PRODUCTS MANAGEMENT
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your marine and industrial product inventory
          </p>
        </div>
        <Button
          className="gap-2 bg-success hover:bg-success/90 text-success-foreground"
          onClick={handleAddProduct}
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Product Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {(products?.length > 0 && products?.map((product) => (
          <Card
            key={product.id}
            className="border-2 border-dashed border-border relative"
          >
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-32 w-32 rounded-lg bg-blue-50 flex items-center justify-center">
                  {product.images ? (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="h-32 w-32 rounded-lg object-cover"
                    />
                  ) : (
                    <Package className="h-16 w-16 text-secondary" />
                  )}
                </div>

                <div className="space-y-2 w-full">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-primary text-lg">
                      {product.title}
                    </h3>
                    <Badge className={`${product.statusColor} text-white`}>
                      {product.condition}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {product.brand} • {product.category}
                  </p>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                  <p className="text-2xl font-bold text-secondary">{product.price}</p>
                </div>

                <div className="flex justify-center space-x-4 mt-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteProduct(product.id!)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))) || (
          <div className="flex flex-col items-center justify-center h-[60vh] px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-100">
              No Products Available
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400 text-base sm:text-lg max-w-md">
              It looks like there are no products in the store yet.  
              Please add some products to get started.
            </p>
          </div>
        )}
      </div>

      {/* Dialog for Add/Edit Product */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Product" : "Add Product"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Brand Dropdown */}
            <div>
              <Label htmlFor="brand">Brand</Label>
              <select
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded px-2 py-1"
              >
                <option value="">Select a brand</option>
                {defaultBrands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a category</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            {/* Price */}
            <div>
              <Label htmlFor="price">Price</Label>
              <Input id="price" name="price" value={formData.price} onChange={handleInputChange} required />
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="condition">Condition</Label>
              <select
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={(e) => {
                  const condition = e.target.value;
                  const statusColor =
                    condition === "New" ? "bg-accent" : "bg-success";
                  setFormData((prev) => ({
                    ...prev,
                    condition,
                    statusColor,
                  }));
                }}
                className="w-full border border-gray-300 rounded px-2 py-1"
              >
                <option value="New">New</option>
                <option value="Refurbished">Refurbished</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" value={formData.description} onChange={handleInputChange} />
            </div>

            {/* Product Image */}
            <div>
              <Label htmlFor="images">Product Images</Label>
              <Input
                id="images"
                name="images"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  // const files = Array.from(e.target.files || []);
                  // if (files.length > 0) {
                  //   const readers = files.map(
                  //     (file) =>
                  //       new Promise<string>((resolve) => {
                  //         const reader = new FileReader();
                  //         reader.onload = (event) => {
                  //           resolve(event.target?.result as string);
                  //         };
                  //         reader.readAsDataURL(file);
                  //       })
                  //   );

                    // Promise.all(readers).then((base64Images) => {
                    //   setFormData((prev) => ({
                    //     ...prev,
                    //     images: base64Images, // store array of image base64 strings
                    //   }));
                    // });
                  // }
                }}
              />
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

export default Products;

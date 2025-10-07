import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Product, Category } from "../types/api";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
}

export function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!product;

  const [formData, setFormData] = useState({
    name: product?.name || "",
    sku: product?.sku || "",
    description: product?.description || "",
    price: product?.price || "",
    salePrice: product?.salePrice || "",
    stock: product?.stock || 0,
    minStock: product?.minStock || 0,
    categoryId: product?.categoryId || "",
    status: product?.status || "active",
    images: product?.images || [],
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const url = isEditing ? `/api/products/${product.id}` : "/api/products";
      const method = isEditing ? "PUT" : "POST";
      return apiRequest(method, url, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Success",
        description: `Product ${
          isEditing ? "updated" : "created"
        } successfully`,
      });
      onClose();
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      sku: "",
      description: "",
      price: "",
      salePrice: "",
      stock: 0,
      minStock: 0,
      categoryId: "",
      status: "active",
      images: [],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-foreground/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">
            {isEditing ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            data-testid="button-close-product-modal"
            className="text-muted-foreground hover:text-foreground transition-all"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-foreground">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                data-testid="input-product-name"
                className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring outline-none transition-all"
                placeholder="Enter product name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-foreground">
                SKU *
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                data-testid="input-product-sku"
                className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring outline-none transition-all"
                placeholder="PRD-001"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-foreground">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              data-testid="input-product-description"
              rows={4}
              className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring outline-none transition-all resize-none"
              placeholder="Enter product description"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-foreground">
                Price *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  data-testid="input-product-price"
                  className="w-full pl-8 pr-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring outline-none transition-all"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-foreground">
                Sale Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  name="salePrice"
                  value={formData.salePrice}
                  onChange={handleChange}
                  data-testid="input-product-sale-price"
                  className="w-full pl-8 pr-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring outline-none transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-foreground">
                Stock Quantity *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                data-testid="input-product-stock"
                className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring outline-none transition-all"
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-foreground">
                Category
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                data-testid="select-product-category"
                className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring outline-none transition-all"
              >
                <option value="">Select category</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-foreground">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                data-testid="select-product-status"
                className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring outline-none transition-all"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              data-testid="button-cancel-product"
              className="flex-1 px-6 py-3 border border-border rounded-lg font-semibold hover:bg-secondary transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              data-testid="button-save-product"
              className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all shadow-lg disabled:opacity-50"
            >
              {mutation.isPending
                ? "Saving..."
                : isEditing
                ? "Update Product"
                : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Product, Order, OrderWithItems } from "../types/api";
import { AdminSection } from "@/lib/types";
import { ProductModal } from "@/components/product-modal";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();

  const { data: stats } = useQuery<{
    revenue: number;
    orders: number;
    customers: number;
    lowStock: number;
  }>({
    queryKey: ["/api/stats"],
  });

  const { data: productsData, isLoading: productsLoading } = useQuery<{
    products: Product[];
    total: number;
  }>({
    queryKey: ["/api/products"],
    enabled: activeSection === "products",
  });

  const { data: ordersData, isLoading: ordersLoading } = useQuery<{
    orders: OrderWithItems[];
    total: number;
  }>({
    queryKey: ["/api/orders"],
    enabled: activeSection === "orders",
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      return apiRequest("DELETE", `/api/products/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: {
      orderId: string;
      status: string;
    }) => {
      return apiRequest("PUT", `/api/orders/${orderId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleAddProduct = () => {
    setSelectedProduct(undefined);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(productId);
    }
  };

  const handleCloseProductModal = () => {
    setIsProductModalOpen(false);
    setSelectedProduct(undefined);
  };

  const renderDashboard = () => (
    <div>
      <div className="bg-card border-b border-border p-6">
        <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your store.
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <i className="fas fa-dollar-sign text-primary text-xl"></i>
              </div>
            </div>
            <h3
              className="text-2xl font-bold text-foreground mb-1"
              data-testid="text-revenue-stat"
            >
              ${stats?.revenue.toLocaleString() || "0"}
            </h3>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <i className="fas fa-shopping-cart text-accent text-xl"></i>
              </div>
            </div>
            <h3
              className="text-2xl font-bold text-foreground mb-1"
              data-testid="text-orders-stat"
            >
              {stats?.orders || 0}
            </h3>
            <p className="text-sm text-muted-foreground">Total Orders</p>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <i className="fas fa-users text-primary text-xl"></i>
              </div>
            </div>
            <h3
              className="text-2xl font-bold text-foreground mb-1"
              data-testid="text-customers-stat"
            >
              {stats?.customers || 0}
            </h3>
            <p className="text-sm text-muted-foreground">Total Customers</p>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                <i className="fas fa-box text-destructive text-xl"></i>
              </div>
            </div>
            <h3
              className="text-2xl font-bold text-foreground mb-1"
              data-testid="text-low-stock-stat"
            >
              {stats?.lowStock || 0}
            </h3>
            <p className="text-sm text-muted-foreground">Low Stock Items</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div>
      <div className="bg-card border-b border-border p-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Products</h2>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <button
          onClick={handleAddProduct}
          data-testid="button-add-product"
          className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all shadow-lg"
        >
          <i className="fas fa-plus mr-2"></i>Add Product
        </button>
      </div>

      <div className="p-6">
        {productsLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50 border-b border-border">
                  <tr>
                    <th className="text-left p-4 font-semibold text-foreground text-sm">
                      Product
                    </th>
                    <th className="text-left p-4 font-semibold text-foreground text-sm">
                      SKU
                    </th>
                    <th className="text-left p-4 font-semibold text-foreground text-sm">
                      Price
                    </th>
                    <th className="text-left p-4 font-semibold text-foreground text-sm">
                      Stock
                    </th>
                    <th className="text-left p-4 font-semibold text-foreground text-sm">
                      Status
                    </th>
                    <th className="text-left p-4 font-semibold text-foreground text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {productsData?.products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-border hover:bg-secondary/30 transition-all"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              product.images[0] ||
                              "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=60"
                            }
                            alt={product.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <p
                            className="font-medium text-foreground"
                            data-testid={`text-product-name-${product.id}`}
                          >
                            {product.name}
                          </p>
                        </div>
                      </td>
                      <td
                        className="p-4 text-muted-foreground"
                        data-testid={`text-product-sku-${product.id}`}
                      >
                        {product.sku}
                      </td>
                      <td
                        className="p-4 font-semibold text-foreground"
                        data-testid={`text-product-price-${product.id}`}
                      >
                        ${Number(product.price).toFixed(2)}
                      </td>
                      <td
                        className="p-4 text-muted-foreground"
                        data-testid={`text-product-stock-${product.id}`}
                      >
                        {product.stock}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            product.status === "active"
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            data-testid={`button-edit-product-${product.id}`}
                            className="text-primary hover:text-primary/80 transition-all"
                            title="Edit"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            data-testid={`button-delete-product-${product.id}`}
                            className="text-destructive hover:text-destructive/80 transition-all"
                            title="Delete"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div>
      <div className="bg-card border-b border-border p-6">
        <h2 className="text-2xl font-bold text-foreground">Orders</h2>
        <p className="text-muted-foreground">
          Track and manage customer orders
        </p>
      </div>

      <div className="p-6">
        {ordersLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50 border-b border-border">
                  <tr>
                    <th className="text-left p-4 font-semibold text-foreground text-sm">
                      Order ID
                    </th>
                    <th className="text-left p-4 font-semibold text-foreground text-sm">
                      Customer
                    </th>
                    <th className="text-left p-4 font-semibold text-foreground text-sm">
                      Date
                    </th>
                    <th className="text-left p-4 font-semibold text-foreground text-sm">
                      Items
                    </th>
                    <th className="text-left p-4 font-semibold text-foreground text-sm">
                      Total
                    </th>
                    <th className="text-left p-4 font-semibold text-foreground text-sm">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ordersData?.orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-border hover:bg-secondary/30 transition-all"
                    >
                      <td className="p-4">
                        <span
                          className="font-medium text-primary"
                          data-testid={`text-order-number-${order.id}`}
                        >
                          {order.orderNumber}
                        </span>
                      </td>
                      <td className="p-4">
                        <div>
                          <p
                            className="font-medium text-foreground"
                            data-testid={`text-order-customer-${order.id}`}
                          >
                            {order.customerName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {order.customerEmail}
                          </p>
                        </div>
                      </td>
                      <td
                        className="p-4 text-muted-foreground"
                        data-testid={`text-order-date-${order.id}`}
                      >
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td
                        className="p-4 text-muted-foreground"
                        data-testid={`text-order-items-${order.id}`}
                      >
                        {order.items.length}
                      </td>
                      <td
                        className="p-4 font-semibold text-foreground"
                        data-testid={`text-order-total-${order.id}`}
                      >
                        ${Number(order.total).toFixed(2)}
                      </td>
                      <td className="p-4">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatusMutation.mutate({
                              orderId: order.id,
                              status: e.target.value,
                            })
                          }
                          data-testid={`select-order-status-${order.id}`}
                          className={`px-3 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-primary outline-none ${
                            order.status === "completed"
                              ? "bg-primary/10 text-primary"
                              : order.status === "processing"
                              ? "bg-accent/10 text-accent"
                              : "bg-muted/50 text-muted-foreground"
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderInventory = () => (
    <div>
      <div className="bg-card border-b border-border p-6">
        <h2 className="text-2xl font-bold text-foreground">
          Inventory Management
        </h2>
        <p className="text-muted-foreground">
          Monitor and update product stock levels
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <i className="fas fa-boxes text-3xl text-primary"></i>
            </div>
            <h3
              className="text-3xl font-bold text-foreground mb-1"
              data-testid="text-total-stock"
            >
              {productsData?.products.reduce(
                (sum, product) => sum + product.stock,
                0
              ) || 0}
            </h3>
            <p className="text-sm text-muted-foreground">
              Total Items in Stock
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <i className="fas fa-exclamation-triangle text-3xl text-accent"></i>
            </div>
            <h3
              className="text-3xl font-bold text-foreground mb-1"
              data-testid="text-low-stock-items"
            >
              {stats?.lowStock || 0}
            </h3>
            <p className="text-sm text-muted-foreground">Low Stock Products</p>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <i className="fas fa-ban text-3xl text-destructive"></i>
            </div>
            <h3
              className="text-3xl font-bold text-foreground mb-1"
              data-testid="text-out-of-stock"
            >
              {productsData?.products.filter((p) => p.stock === 0).length || 0}
            </h3>
            <p className="text-sm text-muted-foreground">Out of Stock</p>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="text-left p-4 font-semibold text-foreground text-sm">
                    Product
                  </th>
                  <th className="text-left p-4 font-semibold text-foreground text-sm">
                    SKU
                  </th>
                  <th className="text-left p-4 font-semibold text-foreground text-sm">
                    In Stock
                  </th>
                  <th className="text-left p-4 font-semibold text-foreground text-sm">
                    Min. Stock
                  </th>
                  <th className="text-left p-4 font-semibold text-foreground text-sm">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {productsData?.products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-border hover:bg-secondary/30 transition-all"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            product.images[0] ||
                            "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=60"
                          }
                          alt={product.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <p className="font-medium text-foreground">
                          {product.name}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{product.sku}</td>
                    <td className="p-4 font-semibold text-foreground">
                      {product.stock}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {product.minStock}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          product.stock === 0
                            ? "bg-destructive/10 text-destructive"
                            : product.stock <= product.minStock
                            ? "bg-accent/10 text-accent"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {product.stock === 0
                          ? "Out of Stock"
                          : product.stock <= product.minStock
                          ? "Low Stock"
                          : "In Stock"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return renderDashboard();
      case "products":
        return renderProducts();
      case "orders":
        return renderOrders();
      case "inventory":
        return renderInventory();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="flex h-screen bg-secondary/20">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold text-primary">ShopHub Admin</h1>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveSection("dashboard")}
                data-testid="nav-dashboard"
                className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeSection === "dashboard"
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                <i className="fas fa-chart-line"></i>
                <span>Dashboard</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection("products")}
                data-testid="nav-products"
                className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeSection === "products"
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                <i className="fas fa-box"></i>
                <span>Products</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection("orders")}
                data-testid="nav-orders"
                className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeSection === "orders"
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                <i className="fas fa-shopping-bag"></i>
                <span>Orders</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection("inventory")}
                data-testid="nav-inventory"
                className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeSection === "inventory"
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                <i className="fas fa-warehouse"></i>
                <span>Inventory</span>
              </button>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
              A
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm text-foreground">Admin</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">{renderContent()}</main>

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={handleCloseProductModal}
        product={selectedProduct}
      />
    </div>
  );
}

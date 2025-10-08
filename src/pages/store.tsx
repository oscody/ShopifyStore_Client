import { useState, useEffect } from "react";
import { Product, Category } from "../types/api";
import { CartItem } from "@/lib/types";
import { ProductCard } from "@/components/product-card";
import { CartSidebar } from "@/components/cart-sidebar";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { getApiUrl } from "@/lib/api";

export default function Store() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("");

  const [productsData, setProductsData] = useState<{
    products: Product[];
    total: number;
  } | null>(null);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<Error | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesError, setCategoriesError] = useState<Error | null>(null);

  useEffect(() => {
    // Fetch products
    fetch(getApiUrl("/api/products"))
      .then((res) => res.json())
      .then((data) => {
        setProductsData(data);
        setProductsLoading(false);
      })
      .catch((err) => {
        setProductsError(err);
        setProductsLoading(false);
      });

    // Fetch categories
    fetch(getApiUrl("/api/categories"))
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => {
        setCategoriesError(err);
      });
  }, []);

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find((cartItem) => cartItem.id === item.id);
      if (existing) {
        return prev.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      }
      return [...prev, item];
    });

    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart`,
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart",
    });
  };

  const handleCheckout = () => {
    setLocation("/checkout");
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-primary">ShopHub</h1>
              <nav className="hidden md:flex gap-6">
                <a
                  href="#"
                  className="text-foreground hover:text-primary transition-all font-medium"
                >
                  Shop
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-all"
                >
                  Collections
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-all"
                >
                  About
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-all"
                >
                  Contact
                </a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-muted-foreground hover:text-primary transition-all">
                <i className="fas fa-search text-lg"></i>
              </button>
              <button className="text-muted-foreground hover:text-primary transition-all">
                <i className="fas fa-user text-lg"></i>
              </button>
              <button
                onClick={() => setIsCartOpen(true)}
                data-testid="button-open-cart"
                className="relative text-muted-foreground hover:text-primary transition-all"
              >
                <i className="fas fa-shopping-cart text-lg"></i>
                {cartItemCount > 0 && (
                  <span
                    className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold"
                    data-testid="text-cart-count"
                  >
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 to-accent/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl font-bold mb-6 text-foreground">
                Summer Collection 2024
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Discover our latest arrivals and exclusive designs. Shop now and
                get up to 30% off on selected items.
              </p>
              <button className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-all shadow-lg">
                Shop Now <i className="fas fa-arrow-right ml-2"></i>
              </button>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="Summer fashion collection"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Bar */}
      <section className="bg-card border-b border-border py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-xl w-full">
              <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="input-search-products"
                className="w-full pl-12 pr-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring outline-none transition-all"
              />
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                data-testid="select-category-filter"
                className="px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring outline-none bg-background"
              >
                <option value="">All Categories</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                data-testid="select-sort-filter"
                className="px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring outline-none bg-background"
              >
                <option value="">Sort by</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="popular">Best Selling</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-12 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-foreground">
              Featured Products
            </h3>
            <span
              className="text-muted-foreground"
              data-testid="text-products-count"
            >
              {productsData?.total || 0} products
            </span>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-card rounded-lg shadow-md overflow-hidden"
                >
                  <div className="aspect-square bg-muted animate-pulse"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse"></div>
                    <div className="h-6 bg-muted rounded animate-pulse w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : productsError ? (
            <div className="text-center py-12">
              <i className="fas fa-exclamation-triangle text-4xl text-destructive mb-4"></i>
              <p className="text-destructive" data-testid="text-error">
                Error loading products: {productsError.message}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productsData?.products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          )}

          {productsData?.products.length === 0 && !productsLoading && (
            <div className="text-center py-12">
              <i className="fas fa-search text-4xl text-muted-foreground mb-4"></i>
              <p
                className="text-muted-foreground"
                data-testid="text-no-products"
              >
                No products found. Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4 text-primary">ShopHub</h4>
              <p className="text-background/70 text-sm">
                Your one-stop shop for quality products at affordable prices.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Shop</h5>
              <ul className="space-y-2 text-sm text-background/70">
                <li>
                  <a href="#" className="hover:text-primary transition-all">
                    New Arrivals
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-all">
                    Best Sellers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-all">
                    Sale
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-sm text-background/70">
                <li>
                  <a href="#" className="hover:text-primary transition-all">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-all">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-all">
                    Shipping Info
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Newsletter</h5>
              <p className="text-sm text-background/70 mb-3">
                Subscribe for exclusive offers
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 rounded-lg bg-background/10 border border-background/20 text-background placeholder-background/50 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-all">
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-background/20 mt-8 pt-8 text-center text-sm text-background/70">
            <p>&copy; 2024 ShopHub. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <CartSidebar
        isOpen={isCartOpen}
        items={cartItems}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onCheckout={handleCheckout}
      />
    </div>
  );
}

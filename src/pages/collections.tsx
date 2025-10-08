import { useState, useEffect } from "react";
import { Category } from "../types/api";
import { getApiUrl } from "@/lib/api";
import { useLocation } from "wouter";

interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  featured?: boolean;
}

export default function Collections() {
  const [, setLocation] = useLocation();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Mock collections data - in a real app, this would come from your API
  const mockCollections: Collection[] = [
    {
      id: "summer-2024",
      name: "Summer Collection 2024",
      description: "Fresh styles for the warm season ahead",
      image:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      productCount: 24,
      featured: true,
    },
    {
      id: "best-sellers",
      name: "Best Sellers",
      description: "Our most popular items loved by customers",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      productCount: 18,
      featured: true,
    },
    {
      id: "new-arrivals",
      name: "New Arrivals",
      description: "Latest products just added to our store",
      image:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      productCount: 32,
      featured: true,
    },
  ];

  useEffect(() => {
    const fetchCollections = async () => {
      setLoading(true);
      try {
        // For now, use mock data. In a real app, you'd fetch from your API
        // const response = await fetch(getApiUrl("/api/collections"));
        // const data = await response.json();

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        setCollections(mockCollections);
        setError(null);
      } catch (err) {
        setError(err as Error);
        console.error("Error fetching collections:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const handleCollectionClick = (collectionId: string) => {
    // Navigate to store page with collection filter
    setLocation(`/?collection=${collectionId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-card rounded-lg shadow-md overflow-hidden"
              >
                <div className="aspect-video bg-muted animate-pulse"></div>
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-muted rounded animate-pulse"></div>
                  <div className="h-4 bg-muted rounded animate-pulse w-2/3"></div>
                  <div className="h-4 bg-muted rounded animate-pulse w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-4xl text-destructive mb-4"></i>
          <p className="text-destructive">
            Error loading collections: {error.message}
          </p>
        </div>
      </div>
    );
  }

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
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-all"
                >
                  Shop
                </a>
                <a
                  href="/collections"
                  className="text-foreground hover:text-primary transition-all font-medium"
                >
                  Collections
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
              <button className="text-muted-foreground hover:text-primary transition-all">
                <i className="fas fa-shopping-cart text-lg"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-accent/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-5xl font-bold mb-6 text-foreground">
              Collections
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our curated collections of products, organized to help
              you find exactly what you're looking for.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-foreground mb-8">
            Featured Collections
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections
              .filter((c) => c.featured)
              .map((collection) => (
                <div
                  key={collection.id}
                  onClick={() => handleCollectionClick(collection.id)}
                  className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-semibold text-foreground mb-2">
                      {collection.name}
                    </h4>
                    <p className="text-muted-foreground mb-4">
                      {collection.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {collection.productCount} items
                      </span>
                      <button className="text-primary hover:text-primary/80 font-medium">
                        Shop Collection{" "}
                        <i className="fas fa-arrow-right ml-1"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* All Collections */}
      <section className="py-16 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-foreground mb-8">
            All Collections
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {collections.map((collection) => (
              <div
                key={collection.id}
                onClick={() => handleCollectionClick(collection.id)}
                className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                </div>
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-foreground mb-1">
                    {collection.name}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {collection.productCount} items
                  </p>
                  <button className="text-primary hover:text-primary/80 font-medium text-sm">
                    View Collection <i className="fas fa-arrow-right ml-1"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
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
                  <a href="/" className="hover:text-primary transition-all">
                    New Arrivals
                  </a>
                </li>
                <li>
                  <a
                    href="/collections"
                    className="hover:text-primary transition-all"
                  >
                    Collections
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-primary transition-all">
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
    </div>
  );
}

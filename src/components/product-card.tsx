import { useState } from "react";
import { Product } from "../types/api";
import { CartItem } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  onAddToCart: (item: CartItem) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [justAdded, setJustAdded] = useState(false);

  const displayPrice = product.salePrice || product.price;
  const hasDiscount = !!product.salePrice;
  const discountPercent = hasDiscount
    ? Math.round(
        ((Number(product.price) - Number(product.salePrice!)) /
          Number(product.price)) *
          100
      )
    : 0;

  const handleAddToCart = () => {
    onAddToCart({
      id: product.id,
      name: product.name,
      price: Number(displayPrice),
      quantity: 1,
      image:
        product.images[0] ||
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400",
      sku: product.sku,
    });

    // Show temporary "Added!" feedback
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <div className="bg-card rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden group">
      <div className="relative overflow-hidden aspect-square">
        <img
          src={
            product.images[0] ||
            "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400"
          }
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-all duration-300"
        />
        {hasDiscount && (
          <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold">
            -{discountPercent}%
          </div>
        )}
        {product.status === "new" && (
          <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
            New
          </div>
        )}
        {product.stock <= product.minStock && product.stock > 0 && (
          <div className="absolute top-3 left-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold">
            Low Stock
          </div>
        )}
        {product.stock > 0 ? (
          <button
            onClick={handleAddToCart}
            data-testid={`button-add-to-cart-${product.id}`}
            className={`absolute bottom-3 left-1/2 transform -translate-x-1/2 translate-y-12 group-hover:translate-y-0 transition-all px-6 py-2 rounded-lg font-medium opacity-0 group-hover:opacity-100 ${
              justAdded
                ? "bg-green-500 text-white translate-y-0 opacity-100"
                : "bg-primary text-primary-foreground"
            }`}
          >
            {justAdded ? (
              <>
                <i className="fas fa-check mr-2"></i>Added!
              </>
            ) : (
              <>
                <i className="fas fa-cart-plus mr-2"></i>Add to Cart
              </>
            )}
          </button>
        ) : (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 translate-y-12 group-hover:translate-y-0 transition-all bg-muted text-muted-foreground px-6 py-2 rounded-lg font-medium opacity-0 group-hover:opacity-100">
            Out of Stock
          </div>
        )}
      </div>
      <div className="p-4">
        <h4
          className="font-semibold text-foreground mb-2"
          data-testid={`text-product-name-${product.id}`}
        >
          {product.name}
        </h4>
        <div className="flex items-center gap-2">
          <span
            className="text-xl font-bold text-primary"
            data-testid={`text-product-price-${product.id}`}
          >
            ${Number(displayPrice).toFixed(2)}
          </span>
          {hasDiscount && (
            <span
              className="text-sm text-muted-foreground line-through"
              data-testid={`text-product-original-price-${product.id}`}
            >
              ${Number(product.price).toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

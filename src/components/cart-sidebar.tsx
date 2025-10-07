import { CartItem } from "@/lib/types";

interface CartSidebarProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export function CartSidebar({
  isOpen,
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartSidebarProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + shipping;

  return (
    <div
      className={`fixed inset-y-0 right-0 w-full md:w-96 bg-card shadow-2xl z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      data-testid="cart-sidebar"
    >
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-xl font-bold text-foreground">Shopping Cart</h3>
          <button
            onClick={onClose}
            data-testid="button-close-cart"
            className="text-muted-foreground hover:text-foreground transition-all"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-shopping-cart text-4xl text-muted-foreground mb-4"></i>
              <p className="text-muted-foreground" data-testid="text-cart-empty">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-border">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1" data-testid={`text-cart-item-name-${item.id}`}>
                      {item.name}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2" data-testid={`text-cart-item-price-${item.id}`}>
                      ${item.price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        data-testid={`button-decrease-quantity-${item.id}`}
                        className="w-8 h-8 border border-border rounded flex items-center justify-center hover:bg-secondary transition-all"
                      >
                        <i className="fas fa-minus text-xs"></i>
                      </button>
                      <span className="w-8 text-center font-medium" data-testid={`text-cart-item-quantity-${item.id}`}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        data-testid={`button-increase-quantity-${item.id}`}
                        className="w-8 h-8 border border-border rounded flex items-center justify-center hover:bg-secondary transition-all"
                      >
                        <i className="fas fa-plus text-xs"></i>
                      </button>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        data-testid={`button-remove-item-${item.id}`}
                        className="ml-auto text-destructive hover:text-destructive/80 transition-all"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border p-6 bg-secondary/20">
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold" data-testid="text-cart-subtotal">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-semibold" data-testid="text-cart-shipping">
                {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between mb-4 pt-2 border-t border-border">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-lg text-primary" data-testid="text-cart-total">
                ${total.toFixed(2)}
              </span>
            </div>
            <button
              onClick={onCheckout}
              data-testid="button-proceed-checkout"
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-all shadow-lg"
            >
              Proceed to Checkout <i className="fas fa-arrow-right ml-2"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

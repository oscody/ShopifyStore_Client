import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CheckoutForm } from "@/lib/types";

const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

const CheckoutFormComponent = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();

  const [formData, setFormData] = useState<CheckoutForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    // Create order data
    const orderData = {
      customerName: `${formData.firstName} ${formData.lastName}`,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      shippingAddress: `${formData.address}, ${formData.city}, ${formData.zipCode}`,
      subtotal: 489.96,
      shipping: 9.99,
      tax: 39.20,
      total: 539.15,
    };

    try {
      // Confirm payment
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/?payment=success`,
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Create order record
        await apiRequest('POST', '/api/orders', {
          order: orderData,
          items: [
            {
              productId: 'sample-1',
              productName: 'Premium Wireless Headphones',
              productSku: 'WH-001',
              price: 79.99,
              quantity: 1,
              total: 79.99,
            }
          ]
        });

        toast({
          title: "Payment Successful",
          description: "Thank you for your purchase!",
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "Something went wrong processing your payment",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Shipping Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Shipping Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    data-testid="input-first-name"
                    className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring outline-none transition-all"
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    data-testid="input-last-name"
                    className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring outline-none transition-all"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  data-testid="input-email"
                  className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring outline-none transition-all"
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  data-testid="input-phone"
                  className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring outline-none transition-all"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  data-testid="input-address"
                  className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring outline-none transition-all"
                  placeholder="123 Main Street"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    data-testid="input-city"
                    className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring outline-none transition-all"
                    placeholder="New York"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Zip Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    data-testid="input-zip-code"
                    className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring outline-none transition-all"
                    placeholder="10001"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Payment Information</h3>
            <div className="space-y-4">
              <PaymentElement />
              <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 flex gap-3">
                <i className="fas fa-lock text-accent mt-1"></i>
                <div>
                  <p className="text-sm font-medium text-foreground">Secure Payment</p>
                  <p className="text-xs text-muted-foreground">Your payment information is encrypted and secure.</p>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!stripe}
            data-testid="button-complete-order"
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-all shadow-lg disabled:opacity-50"
          >
            <i className="fas fa-lock mr-2"></i>Complete Order
          </button>
        </form>
      </div>

      {/* Order Summary */}
      <div>
        <div className="bg-secondary/30 rounded-lg p-6 sticky top-24">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Order Summary</h3>
          
          <div className="space-y-3 mb-4 pb-4 border-b border-border">
            <div className="flex gap-3">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80"
                alt="Product"
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h4 className="font-medium text-sm text-foreground">Premium Wireless Headphones</h4>
                <p className="text-xs text-muted-foreground">Qty: 1</p>
                <p className="text-sm font-semibold text-foreground mt-1">$79.99</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium" data-testid="text-checkout-subtotal">$479.97</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium" data-testid="text-checkout-shipping">$9.99</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span className="font-medium" data-testid="text-checkout-tax">$39.20</span>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-border">
            <span className="font-bold text-lg text-foreground">Total</span>
            <span className="font-bold text-lg text-primary" data-testid="text-checkout-total">$529.16</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!stripePromise) {
      setError("Payment processing is not configured. Please add Stripe API keys to enable checkout.");
      return;
    }

    // Create PaymentIntent as soon as the page loads
    apiRequest("POST", "/api/create-payment-intent", { 
      amount: 529.16,
      orderData: {
        items: [
          { id: "sample-product", name: "Sample Product", price: 79.99, quantity: 1 }
        ]
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setError(data.message);
        } else {
          setClientSecret(data.clientSecret);
        }
      })
      .catch((error) => {
        console.error('Error creating payment intent:', error);
        setError('Unable to initialize payment. Please try again later.');
      });
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-card border border-border rounded-lg p-8">
            <i className="fas fa-exclamation-circle text-4xl text-accent mb-4"></i>
            <h2 className="text-xl font-bold text-foreground mb-2">Checkout Unavailable</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <a href="/" className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all">
              Return to Store
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
          <p className="text-muted-foreground">Complete your purchase securely</p>
        </div>

        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutFormComponent />
        </Elements>
      </div>
    </div>
  );
}

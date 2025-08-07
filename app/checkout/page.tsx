'use client'

import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useCartStore } from '@/lib/store';
import { createPaymentIntent } from '@/actions/payments';
import PaymentForm from '@/components/PaymentForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { createOrder } from '@/actions/orders';
import { useToast } from '@/components/ui/use-toast';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalAmount = cartItems.reduce((sum, item) => sum + item.base_price * item.quantity, 0);
  const router = useRouter();
  const { toast } = useToast();
  const user = { id: '1' };

  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isOrderCreating, setIsOrderCreating] = useState(false);
  const [orderCreationError, setOrderCreationError] = useState<string | null>(null);

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/cart'); // Redirect to cart if no items
    }
  }, [cartItems, router]);

  const handleCreateOrder = async () => {
    setIsOrderCreating(true);
    setOrderCreationError(null);

    const { success, order, error } = await createOrder(user.id, totalAmount, cartItems);

    if (success && order) {
      setOrderId(order.id);
      // Now create payment intent
      const { clientSecret: newClientSecret, error: paymentIntentError } = await createPaymentIntent(totalAmount, order.id);

      if (newClientSecret) {
        setClientSecret(newClientSecret);
        toast({
          title: 'Order Created',
          description: 'Proceeding to payment.',
        });
      } else {
        setOrderCreationError(paymentIntentError || 'Failed to create payment intent.');
        toast({
          title: 'Payment Error',
          description: paymentIntentError || 'Failed to initialize payment.',
          variant: 'destructive',
        });
      }
    } else {
      setOrderCreationError(error || 'Failed to create order.');
      toast({
        title: 'Order Creation Failed',
        description: error || 'There was an issue creating your order.',
        variant: 'destructive',
      });
    }
    setIsOrderCreating(false);
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4">
        <h2 className="text-2xl font-bold">Your cart is empty.</h2>
        <Button onClick={() => router.push('/products')} className="mt-4">
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Shipping Information */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Information</CardTitle>
            <CardDescription>Enter your delivery address.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                type="text"
                placeholder="123 Main St"
                value={shippingAddress.address}
                onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="Anytown"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  type="text"
                  placeholder="CA"
                  value={shippingAddress.state}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="zip">Zip/Postal Code</Label>
                <Input
                  id="zip"
                  type="text"
                  placeholder="90210"
                  value={shippingAddress.zip}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, zip: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  type="text"
                  placeholder="USA"
                  value={shippingAddress.country}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleCreateOrder} disabled={isOrderCreating || !user?.id}>
              {isOrderCreating ? 'Creating Order...' : 'Proceed to Payment'}
            </Button>
          </CardFooter>
        </Card>

        {/* Order Summary and Payment */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>Review your items and total.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <span>{item.name} (x{item.quantity})</span>
                  <span>${(item.base_price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 flex justify-between items-center font-bold text-lg">
              <span>Total:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>

            {orderCreationError && <p className="text-red-500 text-sm">{orderCreationError}</p>}

            {clientSecret && orderId ? (
              <Elements options={{ clientSecret }} stripe={stripePromise}>
                <PaymentForm clientSecret={clientSecret} orderId={orderId} />
              </Elements>
            ) : (
              <div className="text-center text-muted-foreground">
                {isOrderCreating ? 'Creating order and preparing payment...' : 'Complete shipping info to proceed to payment.'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

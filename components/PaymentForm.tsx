'use client'

import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { confirmPayment } from '@/actions/payments';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

interface PaymentFormProps {
  clientSecret: string;
  orderId: string;
}

export default function PaymentForm({ clientSecret, orderId }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      setIsLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setErrorMessage('Card details not found.');
      setIsLoading(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: name,
          email: email,
        },
      },
    });

    if (error) {
      setErrorMessage(error.message || 'An unexpected error occurred.');
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Call server action to confirm payment and update order status
      const { success, error: confirmError } = await confirmPayment(paymentIntent.id);

      if (success) {
        toast({
          title: 'Payment Successful!',
          description: 'Your order has been placed.',
        });
        router.push(`/order/success?orderId=${orderId}&paymentIntentId=${paymentIntent.id}`);
      } else {
        setErrorMessage(confirmError || 'Payment succeeded but order update failed.');
        toast({
          title: 'Payment Issue',
          description: confirmError || 'Payment succeeded but there was an issue updating your order.',
          variant: 'destructive',
        });
      }
      setIsLoading(false);
    } else {
      setErrorMessage('Payment failed or was not successful.');
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>Enter your payment information to complete the purchase.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name on Card</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john.doe@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="card-element">Card Details</Label>
            <div className="border rounded-md p-3">
              <CardElement id="card-element" options={{ style: { base: { fontSize: '16px' } } }} />
            </div>
          </div>
          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={!stripe || isLoading}>
            {isLoading ? 'Processing...' : 'Pay Now'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

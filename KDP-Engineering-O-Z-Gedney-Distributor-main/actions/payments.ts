'use server'

import Stripe from 'stripe';
import { createSupabaseAdminClient } from '@/lib/supabase';
import { updateOrderStatus } from './orders';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10', // Use a recent API version
});

export async function createPaymentIntent(amount: number, orderId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Amount in cents
      currency: 'usd',
      metadata: { order_id: orderId },
    });

    return { clientSecret: paymentIntent.client_secret, error: null };
  } catch (error: any) {
    console.error('Error creating payment intent:', error.message);
    return { clientSecret: null, error: error.message };
  }
}

export async function confirmPayment(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      const orderId = paymentIntent.metadata.order_id;
      if (orderId) {
        // Update order status in Supabase
        await updateOrderStatus(orderId, 'processing'); // Or 'paid', depending on your workflow
      }
      return { success: true, orderId: orderId, error: null };
    } else {
      return { success: false, orderId: null, error: `Payment not succeeded. Status: ${paymentIntent.status}` };
    }
  } catch (error: any) {
    console.error('Error confirming payment:', error.message);
    return { success: false, orderId: null, error: error.message };
  }
}

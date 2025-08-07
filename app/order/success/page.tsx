'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchOrderById } from '@/actions/orders';
import { Order } from '@/actions/orders';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const paymentIntentId = searchParams.get('paymentIntentId');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getOrderDetails() {
      if (orderId) {
        setLoading(true);
        setError(null);
        const { order: fetchedOrder, error: fetchError } = await fetchOrderById(orderId);
        if (fetchError) {
          setError(fetchError);
        } else if (fetchedOrder) {
          setOrder(fetchedOrder);
        }
        setLoading(false);
      } else {
        setLoading(false);
        setError('No order ID provided.');
      }
    }
    getOrderDetails();
  }, [orderId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
          <CardTitle className="mt-4 text-2xl font-bold">Order Placed Successfully!</CardTitle>
          <CardDescription>Thank you for your purchase.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {loading ? (
            <p>Loading order details...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : order ? (
            <>
              <p>Your Order ID: <span className="font-semibold">{order.id}</span></p>
              <p>Total Amount: <span className="font-semibold">${order.total_amount.toFixed(2)}</span></p>
              <p>Status: <span className="font-semibold capitalize">{order.status}</span></p>
              {paymentIntentId && <p>Payment Intent ID: <span className="font-semibold">{paymentIntentId}</span></p>}
              <div className="mt-4 text-left">
                <h3 className="font-semibold">Items:</h3>
                <ul className="list-disc list-inside">
                  {order.order_items?.map((item: any) => (
                    <li key={item.id}>
                      {item.products?.name} (x{item.quantity}) - ${item.price.toFixed(2)} each
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <p>Order details could not be loaded.</p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Link href="/order-history" className="w-full">
            <Button className="w-full">View Order History</Button>
          </Link>
          <Link href="/products" className="w-full">
            <Button variant="outline" className="w-full">Continue Shopping</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

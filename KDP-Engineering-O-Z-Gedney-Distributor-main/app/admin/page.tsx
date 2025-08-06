'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Package, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchUserCount } from '@/actions/users';
import { fetchProductCount } from '@/actions/products';
import { fetchOrderCount } from '@/actions/orders';
import { fetchLeadCount } from '@/actions/leads';

export default function AdminDashboardPage() {
  const [userCount, setUserCount] = useState<number | null>(null);
  const [productCount, setProductCount] = useState<number | null>(null);
  const [orderCount, setOrderCount] = useState<number | null>(null);
  const [leadCount, setLeadCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [users, products, orders, leads] = await Promise.all([
          fetchUserCount(),
          fetchProductCount(),
          fetchOrderCount(),
          fetchLeadCount(),
        ]);

        if (users.error) throw new Error(users.error);
        if (products.error) throw new Error(products.error);
        if (orders.error) throw new Error(orders.error);
        // Leads action doesn't return an error object, just 0 on error
        // if (leads.error) throw new Error(leads.error);

        setUserCount(users.count);
        setProductCount(products.count);
        setOrderCount(orders.count);
        setLeadCount(leads); // fetchLeadCount returns number directly

      } catch (err: any) {
        console.error('Failed to fetch dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {loading && <p className="text-center">Loading dashboard data...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userCount !== null ? userCount : 'N/A'}</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{productCount !== null ? productCount : 'N/A'}</div>
              <p className="text-xs text-muted-foreground">
                +180.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orderCount !== null ? orderCount : 'N/A'}</div>
              <p className="text-xs text-muted-foreground">
                +19% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leadCount !== null ? leadCount : 'N/A'}</div>
              <p className="text-xs text-muted-foreground">
                +5% from last month
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

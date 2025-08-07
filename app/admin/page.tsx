'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Package, Users, UserPlus, PackagePlus, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchUserCount, fetchRecentUsers } from '@/actions/users';
import { fetchProductCount, fetchRecentProducts } from '@/actions/products';
import { fetchOrderCount, fetchRecentOrders } from '@/actions/orders';
import { fetchLeadCount } from '@/actions/leads';

export default function AdminDashboardPage() {
  const [userCount, setUserCount] = useState<number | null>(null);
  const [productCount, setProductCount] = useState<number | null>(null);
  const [orderCount, setOrderCount] = useState<number | null>(null);
  const [leadCount, setLeadCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('th-TH')} - ${date.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })}`;
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [users, products, orders, leads, recentUsersRes, recentProductsRes, recentOrdersRes] = await Promise.all([
          fetchUserCount(),
          fetchProductCount(),
          fetchOrderCount(),
          fetchLeadCount(),
          fetchRecentUsers(5),
          fetchRecentProducts(5),
          fetchRecentOrders(5),
        ]);

        if (users.error) throw new Error(users.error);
        if (products.error) throw new Error(products.error);
        if (orders.error) throw new Error(orders.error);
        if (recentUsersRes.error) throw new Error(recentUsersRes.error);
        if (recentProductsRes.error) throw new Error(recentProductsRes.error);
        if (recentOrdersRes.error) throw new Error(recentOrdersRes.error);
        // Leads action doesn't return an error object, just 0 on error
        // if (leads.error) throw new Error(leads.error);

        setUserCount(users.count);
        setProductCount(products.count);
        setOrderCount(orders.count);
        setLeadCount(leads); // fetchLeadCount returns number directly
        setRecentUsers(recentUsersRes.users);
        setRecentProducts(recentProductsRes.products);
        setRecentOrders(recentOrdersRes.orders);

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
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
                <Button variant="link" asChild className="h-auto p-0">
                  <Link href={{ pathname: '/admin/users' }}>View all</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userCount !== null ? userCount : 'N/A'}</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </div>
                <Button variant="link" asChild className="h-auto p-0">
                  <Link href={{ pathname: '/admin/products' }}>View all</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{productCount !== null ? productCount : 'N/A'}</div>
                <p className="text-xs text-muted-foreground">+180.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </div>
                <Button variant="link" asChild className="h-auto p-0">
                  <Link href={{ pathname: '/admin/orders' }}>View all</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orderCount !== null ? orderCount : 'N/A'}</div>
                <p className="text-xs text-muted-foreground">+19% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
                <Button variant="link" asChild className="h-auto p-0">
                  <Link href={{ pathname: '/admin/leads' }}>View all</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{leadCount !== null ? leadCount : 'N/A'}</div>
                <p className="text-xs text-muted-foreground">+5% from last month</p>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-4">Recent Activity</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm font-medium">Recent Users</CardTitle>
                  <UserPlus className="h-4 w-4 text-muted-foreground" />
                </div>
                <Button variant="link" asChild className="h-auto p-0">
                  <Link href={{ pathname: '/admin/users' }}>View all</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {recentUsers.length > 0 ? (
                  <ul className="space-y-2">
                    {recentUsers.map((user) => (
                      <li key={user.id} className="text-sm flex justify-between">
                        <span>{user.email}</span>
                        <span>{formatDateTime(user.created_at)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">ยังไม่มีผู้ใช้งาน</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm font-medium">Recent Products</CardTitle>
                  <PackagePlus className="h-4 w-4 text-muted-foreground" />
                </div>
                <Button variant="link" asChild className="h-auto p-0">
                  <Link href={{ pathname: '/admin/products' }}>View all</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {recentProducts.length > 0 ? (
                  <ul className="space-y-2">
                    {recentProducts.map((product) => (
                      <li key={product.id} className="text-sm flex justify-between">
                        <span>{product.name}</span>
                        <span>{formatDateTime(product.created_at)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">ยังไม่มีสินค้า</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm font-medium">Recent Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </div>
                <Button variant="link" asChild className="h-auto p-0">
                  <Link href={{ pathname: '/admin/orders' }}>View all</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {recentOrders.length > 0 ? (
                  <ul className="space-y-2">
                    {recentOrders.map((order) => (
                      <li key={order.id} className="text-sm flex justify-between">
                        <span>#{order.id} - {order.status}</span>
                        <span>{formatDateTime(order.created_at)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">ยังไม่มีออเดอร์</p>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

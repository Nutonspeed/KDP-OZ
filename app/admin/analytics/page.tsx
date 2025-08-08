'use client'

import { useState, useEffect } from 'react';
import { subDays } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import ChartPanel from '@/components/analytics/ChartPanel';
import TopProductsTable from '@/components/analytics/TopProductsTable';
import RealtimeSalesChart from '@/components/analytics/RealtimeSalesChart';
import { useRealtimeOrders } from '@/hooks/useRealtimeOrders';
import {
  getSalesSummaryRange,
  getUserGrowthTrendRange,
  getDailyOrderCountsRange,
  getTopProducts,
  type SalesSummaryPoint,
  type CountPoint,
  type TopProduct,
} from '@/actions/analytics';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function AdminAnalyticsPage() {
  const [range, setRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 6),
    to: new Date(),
  });
  const [metric, setMetric] = useState('all');
  const [salesData, setSalesData] = useState<SalesSummaryPoint[]>([]);
  const [userData, setUserData] = useState<CountPoint[]>([]);
  const [orderData, setOrderData] = useState<CountPoint[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const realtimeOrders = useRealtimeOrders();

  useEffect(() => {
    async function load() {
      if (!range?.from || !range?.to) return;
      const start = range.from.toISOString();
      const end = range.to.toISOString();
      const [salesRes, usersRes, ordersRes, topRes] = await Promise.all([
        getSalesSummaryRange(start, end),
        getUserGrowthTrendRange(start, end),
        getDailyOrderCountsRange(start, end),
        getTopProducts(start, end, 5),
      ]);

      if (!salesRes.error) setSalesData(salesRes.summary);
      if (!usersRes.error) setUserData(usersRes.trend);
      if (!ordersRes.error) setOrderData(ordersRes.counts);
      if (!topRes.error) setTopProducts(topRes.products);
    }
    load();
  }, [range]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Analytics</h1>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <DateRangePicker value={range} onChange={setRange} />
        <Select value={metric} onValueChange={setMetric}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Metric" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
            <SelectItem value="orders">Orders</SelectItem>
            <SelectItem value="users">Users</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6">
        {(metric === 'all' || metric === 'sales') && (
          <ChartPanel title="Real-time Sales" hasData={realtimeOrders.length > 0}>
            <RealtimeSalesChart orders={realtimeOrders} />
          </ChartPanel>
        )}

        {(metric === 'all' || metric === 'sales') && (
          <ChartPanel title="Sales" hasData={salesData.length > 0}>
            <ResponsiveContainer>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </ChartPanel>
        )}

        {(metric === 'all' || metric === 'users') && (
          <ChartPanel title="New Users" hasData={userData.length > 0}>
            <ResponsiveContainer>
              <LineChart data={userData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </ChartPanel>
        )}

        {(metric === 'all' || metric === 'orders') && (
          <ChartPanel title="Daily Orders" hasData={orderData.length > 0}>
            <ResponsiveContainer>
              <BarChart data={orderData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>
        )}

        {(metric === 'all' || metric === 'sales') && (
          <TopProductsTable products={topProducts} />
        )}
      </div>
    </div>
  );
}

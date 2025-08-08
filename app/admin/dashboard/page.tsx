"use client";
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [kpi, setKpi] = useState<any | null>(null);
  useEffect(() => {
    async function fetchData() {
      const ordersRes = await fetch('/api/mock/orders');
      const billsRes = await fetch('/api/mock/bills');
      const orders = await ordersRes.json();
      const bills = await billsRes.json();
      setKpi({
        orders: orders.length,
        bills: bills.length
      });
    }
    fetchData();
  }, []);
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">แดชบอร์ด</h1>
      {kpi ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border rounded-xl">คำสั่งซื้อ: {kpi.orders}</div>
          <div className="p-4 border rounded-xl">บิล: {kpi.bills}</div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
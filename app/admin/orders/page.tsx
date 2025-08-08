"use client";
import { useEffect, useState } from 'react';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/mock/orders')
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, []);
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">คำสั่งซื้อ</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">ลูกค้า</th>
            <th className="border p-2">สถานะ</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="border p-2">{order.id}</td>
              <td className="border p-2">{order.customerId}</td>
              <td className="border p-2">{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
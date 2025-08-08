"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminBills() {
  const [bills, setBills] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/mock/bills')
      .then((res) => res.json())
      .then((data) => setBills(data));
  }, []);
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">บิล</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">ลูกค้า</th>
            <th className="border p-2">สถานะ</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((bill) => (
            <tr key={bill.id}>
              <td className="border p-2">{bill.id}</td>
              <td className="border p-2">{bill.customerId}</td>
              <td className="border p-2">{bill.status}</td>
              <td className="border p-2">
                <Link href={`/admin/bill/${bill.id}`}>View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
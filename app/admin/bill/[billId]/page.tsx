"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BillDetail({ params }: { params: { billId: string } }) {
  const [bill, setBill] = useState<any | null>(null);
  const router = useRouter();
  useEffect(() => {
    async function fetchBill() {
      const res = await fetch('/api/mock/bills?id=' + params.billId);
      const data = await res.json();
      setBill(data);
    }
    fetchBill();
  }, [params.billId]);
  const handleStatusUpdate = async () => {
    await fetch('/api/bill/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ billId: params.billId, status: 'updated' })
    });
    router.refresh();
  };
  if (!bill) return <p>Loading...</p>;
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">บิล {bill.id}</h1>
      <p>ลูกค้า: {bill.customerId}</p>
      <p>สถานะ: {bill.status}</p>
      <button className="mt-4 p-2 border" onClick={handleStatusUpdate}>ปรับสถานะ</button>
    </div>
  );
}
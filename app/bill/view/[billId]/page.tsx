"use client";
import { useEffect, useState } from 'react';

export default function BillView({ params }: { params: { billId: string } }) {
  const [bill, setBill] = useState<any | null>(null);
  const [address, setAddress] = useState('');
  useEffect(() => {
    async function fetchBill() {
      const res = await fetch('/api/mock/bills?id=' + params.billId);
      const data = await res.json();
      setBill(data);
      setAddress(data?.shippingAddress || '');
    }
    fetchBill();
  }, [params.billId]);
  const handleUpdate = async () => {
    await fetch('/api/mock/bills', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: params.billId, shippingAddress: address })
    });
  };
  if (!bill) return <p>Loading...</p>;
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">บิล #{bill.id}</h1>
      <p>สถานะ: {bill.status}</p>
      <h2 className="text-lg font-bold mt-4">ที่อยู่ในการจัดส่ง</h2>
      <input
        className="border p-2 w-full"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button className="mt-2 p-2 border" onClick={handleUpdate}>อัปเดตที่อยู่</button>
    </div>
  );
}
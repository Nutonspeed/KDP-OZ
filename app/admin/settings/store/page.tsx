"use client";
import { useEffect, useState } from 'react';

export default function StoreSettings() {
  const [store, setStore] = useState<any | null>(null);
  const [form, setForm] = useState<any>({});
  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch('/api/config/store-profile');
      const data = await res.json();
      setStore(data);
      setForm(data);
    }
    fetchProfile();
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/config/store-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setStore(form);
  };
  if (!store) return <p>Loading...</p>;
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">โปรไฟล์ร้าน</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <label>
          ชื่อร้าน:
          <input
            className="border p-2 w-full"
            name="name"
            value={form.name || ''}
            onChange={handleChange}
          />
        </label>
        <label>
          ที่อยู่:
          <input
            className="border p-2 w-full"
            name="address"
            value={form.address || ''}
            onChange={handleChange}
          />
        </label>
        <label>
          เบอร์โทร:
          <input
            className="border p-2 w-full"
            name="phone"
            value={form.phone || ''}
            onChange={handleChange}
          />
        </label>
        <button className="mt-4 p-2 border" type="submit">บันทึก</button>
      </form>
    </div>
  );
}
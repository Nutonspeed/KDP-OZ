"use client";
import { useEffect, useState } from 'react';

export default function CollectionPage({ params }: { params: { slug: string } }) {
  const [products, setProducts] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/mock/products')
      .then((res) => res.json())
      .then((data) => {
        // slug may represent a category; filter accordingly
        setProducts(data.filter((p: any) => p.category === params.slug));
      });
  }, [params.slug]);
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">สินค้าหมวด {params.slug}</h1>
      <div className="grid grid-cols-2 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded-xl">
            <h2 className="text-lg font-bold">{product.name}</h2>
            <p>{product.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
import React, { useState, type SubmitEvent } from "react";
import type { Product } from "./type";

export default function ProductSearch() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    const res = await fetch(`https://dummyjson.com/products/search?q=${query}`);
    const result = await res.json();
    setProducts(result.products);
  };

  return (
    <div>
      <h2>Product Catalog</h2>
      <form onSubmit={handleSubmit}>
        <input value={query} onChange={(e) => setQuery(e.target.value)} />
        <button type="submit">Search</button>
      </form>
      <div>
        {products.map((product) => {
          return <div key={product.id}>{product.title}</div>;
        })}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import HelpChat from "./HelpChat";

type Product = { id: number; name: string; type: string; price: number };

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  return (
    <main>
      <h1>Lumen Audio</h1>
      <div className="grid">
        {products.map((p) => (
          <div key={p.id} className="card">
            <div className="type">{p.type}</div>
            <strong>{p.name}</strong>
            <div>${p.price}</div>
          </div>
        ))}
      </div>
      <HelpChat />
    </main>
  );
}

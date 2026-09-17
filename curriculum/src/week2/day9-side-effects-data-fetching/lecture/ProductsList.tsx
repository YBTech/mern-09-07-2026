import React, { useEffect, useState } from "react";
import type { Product } from "./type";



// everything in the body must be pure
// impure actions with side effects must be put in either
// 1. event handlers
// 2. useEffect

export function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);

  // fetch api once when component first mounts
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("https://dummyjson.com/products");
      const data = await res.json();
      setProducts(data.products);
    };

    fetchProducts();

    // (async () => {
    //   const res = await fetch("https://dummyjson.com/products");
    //   const data = await res.json();
    //   setProducts(data.products);
    // })();

    // fetch("https://dummyjson.com/products")
    //   .then((res) => res.json())
    //   .then((data) => {
    //     //   console.log(data.products);
    //     setProducts(data.products);
    //   });
  }, []);

  //   console.log("doqw");

  return (
    <div>
      <h2>Products List</h2>
      <div>
        {products.map((product) => {
          return <div key={product.id}>{product.title}</div>;
        })}
      </div>
    </div>
  );
}

// artificial delay
// https://leetcode.com/problems/sleep/description/?envType=study-plan-v2&envId=30-days-of-javascript
const sleep = async (ms: number = 700) =>
  new Promise((res) => setTimeout(res, ms));

// loading & error handling
export function ProductsList2() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // starts loading
        setLoading(true);
        await sleep();
        const res = await fetch("https://dummyjson.com/products");
        // 4xx, 5xx means res is not okay
        // if (!res.ok) {
        if (Math.random() > 0.5) {
          throw new Error("API Response Failure");
        }
        const data = await res.json();
        setProducts(data.products);
      } catch (err) {
        if (err instanceof Error) {
          //   console.log(err.message);
          setError(err.message);
        }
      } finally {
        // stops loading
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

//   if (loading) {
//     return <div>loading...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

  return (
    <div>
      <h2>Products List</h2>
      {error && <div>{error}</div>}
      {loading ? (
        <div>loading...</div>
      ) : (
        <div>
          {products.map((product) => {
            return <div key={product.id}>{product.title}</div>;
          })}
        </div>
      )}
    </div>
  );
}

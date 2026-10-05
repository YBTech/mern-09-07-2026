// How the Orders service talks to the Catalog service, over HTTP.
//
// This file is the BOUNDARY between the two services, so it's exactly what
// the integration test and the Pact contract test exercise.

// Orders' own view of a product: only the fields it actually uses.
export type CatalogProduct = { id: number; name: string; price: number; stock: number };

export type CatalogClient = {
  getProduct(id: number): Promise<CatalogProduct | null>;
};

export function createCatalogClient(baseUrl: string): CatalogClient {
  return {
    async getProduct(id) {
      const res = await fetch(`${baseUrl}/products/${id}`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`catalog responded ${res.status}`);
      return (await res.json()) as CatalogProduct;
    },
  };
}

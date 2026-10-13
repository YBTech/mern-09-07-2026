import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../src/app";
import { resetData } from "../src/data/reset";

const app = createApp();
const ADMIN = { "x-admin-token": "admin123" };

const validBook = {
  title: "Clean Code",
  author: "Robert Martin",
  genre: "tech",
  priceCents: 3500,
  stock: 5,
};

function createBook(body: object, headers: Record<string, string> = ADMIN) {
  return request(app).post("/books").set(headers).send(body);
}

beforeEach(resetData);

describe("GET /books", () => {
  it("lists every book in the catalogue", async () => {
    const res = await request(app).get("/books");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(8);
  });

  it("filters books by genre", async () => {
    const res = await request(app).get("/books").query({ genre: "fiction" });
    expect(res.status).toBe(200);
    expect(res.body.map((b: { id: string }) => b.id).sort()).toEqual(["b3", "b4"]);
  });

  it("returns an empty list for a genre with no books", async () => {
    const res = await request(app).get("/books").query({ genre: "cooking" });
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("searches by title ignoring case", async () => {
    const res = await request(app).get("/books").query({ search: "dUnE" });
    expect(res.body.map((b: { id: string }) => b.id)).toEqual(["b3"]);
  });

  it("searches by author", async () => {
    const res = await request(app).get("/books").query({ search: "tolkien" });
    expect(res.body.map((b: { id: string }) => b.id)).toEqual(["b4"]);
  });

  it("ignores surrounding whitespace in the search term", async () => {
    const res = await request(app).get("/books").query({ search: "  sapiens  " });
    expect(res.body.map((b: { id: string }) => b.id)).toEqual(["b5"]);
  });

  it("combines search and genre filters", async () => {
    const res = await request(app).get("/books").query({ search: "the", genre: "tech" });
    expect(res.body.map((b: { id: string }) => b.id)).toEqual(["b1"]);
  });

  it("returns an empty list when nothing matches the search", async () => {
    const res = await request(app).get("/books").query({ search: "nonexistent" });
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe("GET /books/:id", () => {
  it("returns a single book", async () => {
    const res = await request(app).get("/books/b3");
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: "b3", title: "Dune", priceCents: 1000, stock: 20 });
  });

  it("returns 404 for an unknown book", async () => {
    const res = await request(app).get("/books/nope");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Book nope not found" });
  });
});

describe("POST /books", () => {
  it("creates a book and makes it retrievable", async () => {
    const res = await createBook(validBook);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(validBook);
    expect(res.body.id).toEqual(expect.any(String));

    const fetched = await request(app).get(`/books/${res.body.id}`);
    expect(fetched.status).toBe(200);
    expect(fetched.body.title).toBe("Clean Code");
  });

  it("trims whitespace from the title and author", async () => {
    const res = await createBook({
      ...validBook,
      title: "  Clean Code ",
      author: " Robert Martin  ",
    });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Clean Code");
    expect(res.body.author).toBe("Robert Martin");
  });

  it("accepts a book with zero stock", async () => {
    const res = await createBook({ ...validBook, stock: 0 });
    expect(res.status).toBe(201);
    expect(res.body.stock).toBe(0);
  });

  it("rejects a request without the admin token", async () => {
    const res = await createBook(validBook, {});
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });

  it("rejects a request with the wrong admin token", async () => {
    const res = await createBook(validBook, { "x-admin-token": "wrong" });
    expect(res.status).toBe(401);
  });

  it("does not add a book when the token is rejected", async () => {
    await createBook(validBook, {});
    const res = await request(app).get("/books");
    expect(res.body).toHaveLength(8);
  });

  it.each([
    ["title is missing", { title: undefined }, "title is required"],
    ["title is blank", { title: "   " }, "title is required"],
    ["author is missing", { author: undefined }, "author is required"],
    ["author is blank", { author: "" }, "author is required"],
    ["genre is unknown", { genre: "cooking" }, "genre must be one of"],
    ["genre is missing", { genre: undefined }, "genre must be one of"],
    ["price is zero", { priceCents: 0 }, "priceCents must be a positive integer"],
    ["price is negative", { priceCents: -100 }, "priceCents must be a positive integer"],
    ["price is not an integer", { priceCents: 19.99 }, "priceCents must be a positive integer"],
    ["price is a string", { priceCents: "1000" }, "priceCents must be a positive integer"],
    ["stock is negative", { stock: -1 }, "stock must be a non-negative integer"],
    ["stock is not an integer", { stock: 1.5 }, "stock must be a non-negative integer"],
    ["stock is missing", { stock: undefined }, "stock must be a non-negative integer"],
  ])("rejects a book when the %s", async (_name, override, message) => {
    const res = await createBook({ ...validBook, ...override });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain(message);
  });

  it("rejects an empty body", async () => {
    const res = await request(app).post("/books").set(ADMIN).send();
    expect(res.status).toBe(400);
  });
});

describe("DELETE /books/:id", () => {
  it("deletes a book", async () => {
    const res = await request(app).delete("/books/b1");
    expect(res.status).toBe(204);

    const fetched = await request(app).get("/books/b1");
    expect(fetched.status).toBe(404);
  });

  it("removes the deleted book from the list", async () => {
    await request(app).delete("/books/b1");
    const res = await request(app).get("/books");
    expect(res.body).toHaveLength(7);
  });

  it("returns 404 when deleting an unknown book", async () => {
    const res = await request(app).delete("/books/nope");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Book nope not found" });
  });

  it("returns 404 when deleting the same book twice", async () => {
    await request(app).delete("/books/b1");
    const res = await request(app).delete("/books/b1");
    expect(res.status).toBe(404);
  });
});

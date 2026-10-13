export type Genre = "fiction" | "tech" | "history" | "kids";

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: Genre;
  priceCents: number;
  stock: number;
}

export type NewBook = Omit<Book, "id">;

export interface OrderItem {
  bookId: string;
  quantity: number;
  unitPriceCents: number;
}

export type OrderStatus = "placed" | "cancelled";

export interface Order {
  id: string;
  customerEmail: string;
  items: OrderItem[];
  couponCode?: string;
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
  status: OrderStatus;
  createdAt: string;
}

export interface NewOrderInput {
  customerEmail: string;
  items: { bookId: string; quantity: number }[];
  couponCode?: string;
}

export const config = {
  port: Number(process.env.PORT ?? 3026),
  adminToken: process.env.ADMIN_TOKEN ?? "admin123",
};

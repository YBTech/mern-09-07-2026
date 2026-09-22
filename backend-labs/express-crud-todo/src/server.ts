import app from "./app";

const BASE_PORT = Number(process.env.PORT) || 3000;

function startServer(port: number): void {
  const server = app.listen(port, () => {
    console.log(`Payment Gateway API listening on http://localhost:${port}`);
  });

  server.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      console.log(`Port ${port} is in use, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      throw err;
    }
  });
}

startServer(BASE_PORT);

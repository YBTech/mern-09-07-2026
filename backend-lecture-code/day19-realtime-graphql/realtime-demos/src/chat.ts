// Both sides talk, often: a chat room over WebSocket.
//
//   ws://localhost:4600/chat?user=Ana
//
// Browser → server:
//   { "type": "typing" }                    sent while the user types
//   { "type": "message", "text": "…" }
// Server → browser:
//   { "type": "presence", "online": ["Ana", "Ben"] }      nobody asked; the server speaks first
//   { "type": "typing", "user": "Ana" }
//   { "type": "message", "user": "Ana", "text": "…", "at": "…" }
//
// The server's whole job: stamp each message with who sent it, and pass it on.
import type { Server } from "node:http";
import { WebSocket, WebSocketServer } from "ws";
import { stats } from "./stats";

export function attachChat(server: Server) {
  const wss = new WebSocketServer({ server, path: "/chat" });
  const users = new Map<WebSocket, string>();

  const send = (socket: WebSocket, message: object) => {
    if (socket.readyState !== WebSocket.OPEN) return;
    stats.chatMessagesOut++;
    socket.send(JSON.stringify(message));
  };

  const broadcast = (message: object, except?: WebSocket) => {
    for (const client of wss.clients) {
      if (client !== except) send(client, message);
    }
  };

  const announcePresence = () => broadcast({ type: "presence", online: [...users.values()] });

  wss.on("connection", (socket, req) => {
    const user = new URL(req.url ?? "/", "http://localhost").searchParams.get("user") || "guest";
    users.set(socket, user);
    stats.chatSocketsOpen++;
    console.log(`💬 ${user} joined`);
    announcePresence();

    socket.on("message", (raw) => {
      stats.chatMessagesIn++;
      const msg = JSON.parse(raw.toString()) as { type: string; text?: string };

      // Typing goes to everyone else; a message goes to everyone, sender included,
      // so every window shows the same order the server saw.
      if (msg.type === "typing") broadcast({ type: "typing", user }, socket);
      if (msg.type === "message" && msg.text?.trim()) {
        broadcast({ type: "message", user, text: msg.text.trim(), at: new Date().toISOString() });
      }
    });

    socket.on("close", () => {
      users.delete(socket);
      stats.chatSocketsOpen--;
      console.log(`💬 ${user} left`);
      announcePresence();
    });
  });
}

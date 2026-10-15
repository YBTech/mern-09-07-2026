import express from "express";
import { events, newId } from "./events";
import { assistantRoute } from "./assistant";



const app = express();
app.use(express.json());

app.get("/api/events", (req, res) => {
  console.log(`${req.method} ${req.originalUrl}`);
  res.json(events);
});

app.post("/api/events", (req, res) => {
  console.log(`${req.method} ${req.originalUrl}`);
  const { title, date, time, description } = req.body;
  if (!title || !date) {
    res.status(400).json({ error: "title and date are required" });
    return;
  }
  const event = { id: newId(), title, date, time: time ?? "", description: description ?? "" };
  events.push(event);
  res.status(201).json(event);
});

app.put("/api/events/:id", (req, res) => {
  console.log(`${req.method} ${req.originalUrl}`);
  const event = events.find((e) => e.id === Number(req.params.id));
  if (!event) {
    res.status(404).json({ error: "Event not found" });
    return;
  }
  Object.assign(event, req.body, { id: event.id });
  res.json(event);
});

app.delete("/api/events/:id", (req, res) => {
  console.log(`${req.method} ${req.originalUrl}`);
  const index = events.findIndex((e) => e.id === Number(req.params.id));
  if (index === -1) {
    res.status(404).json({ error: "Event not found" });
    return;
  }
  const [deleted] = events.splice(index, 1);
  res.json(deleted);
});

// Final step: the AI assistant, as one more endpoint
app.post("/api/assistant", (req, res) => {
  console.log(`${req.method} ${req.originalUrl}`);
  return assistantRoute(req, res);
});

app.listen(3001, () => console.log("Calendar API on http://localhost:3001"));

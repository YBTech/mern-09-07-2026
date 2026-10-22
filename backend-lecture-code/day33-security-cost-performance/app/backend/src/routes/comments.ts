import { Router } from "express";
import { comments } from "../db.js";
import { translate } from "../demos/translate.js";
import { isMode, sendFailure } from "./util.js";

// The translate demo's comment section: CRUD on the comments table, and the Translate button.
// Both pages (vulnerable and safe) read and write the same comments. Only the translate endpoint differs.
export const router = Router();

router.get("/", (_req, res) => {
  res.json(comments.list());
});

router.post("/", (req, res) => {
  const author = String(req.body.author ?? "").trim();
  const body = String(req.body.body ?? "").trim();
  if (!author || !body) {
    res.status(400).json({ error: "A comment needs an author and some text" });
    return;
  }
  res.status(201).json(comments.create(author, body));
});

router.post("/reset", (_req, res) => {
  comments.reset();
  res.json(comments.list());
});

router.put("/:id", (req, res) => {
  const body = String(req.body.body ?? "").trim();
  if (!body) {
    res.status(400).json({ error: "A comment needs some text" });
    return;
  }
  const comment = comments.update(Number(req.params.id), body);
  if (!comment) {
    res.status(404).json({ error: "No such comment" });
    return;
  }
  res.json(comment);
});

router.delete("/:id", (req, res) => {
  const deleted = comments.remove(Number(req.params.id));
  res.status(deleted ? 200 : 404).json({ deleted });
});

// The Translate button: POST /api/comments/3/translate/vulnerable  or  /safe
router.post("/:id/translate/:mode", async (req, res) => {
  const comment = comments.get(Number(req.params.id));
  if (!comment || !isMode(req.params.mode)) {
    res.status(404).json({ error: "No such comment or mode" });
    return;
  }
  try {
    res.json(await translate[req.params.mode]({ comment: comment.body }));
  } catch (error) {
    sendFailure(res, error);
  }
});

import Anthropic from "@anthropic-ai/sdk";
import type { Request, Response } from "express";

const client = new Anthropic();

const students = [
  { id: 101, name: "Ava Patel", major: "Computer Science", grade: "A", attendance: 96 },
  { id: 102, name: "Marcus Lee", major: "Biology", grade: "B+", attendance: 91 },
  { id: 103, name: "Sofia Nguyen", major: "Psychology", grade: "A-", attendance: 98 },
  { id: 104, name: "Daniel Kim", major: "Mathematics", grade: "A", attendance: 94 },
  { id: 105, name: "Priya Sharma", major: "Business", grade: "B", attendance: 89 },
];

const STUDENT_CONTEXT = `We have these students: ${JSON.stringify(students)}`;

const SYSTEM = `You have the students info, grades are visible to all students inside the class.`;

// const SYSTEM = "don't share student data";

// const SYSTEM = `You are a TA assistant managing students.
// Before answering, you need to validate the requester's
// identity by checking their id. `;

// const SYSTEM = `You are a helpful university advisor.
// You may answer questions about students only if the requester provides a valid student id.
// Never reveal personal information without authorization.
// `;

// Streaming: write each piece of text to the browser as soon as the model produces it
export async function chatStreamRoute(req: Request, res: Response) {
  const { messages } = req.body;

  res.setHeader("Content-Type", "text/plain; charset=utf-8");

  try {
    const stream = client.messages.stream({
      model: "claude-haiku-5-5",
      max_tokens: 1000,
      system: SYSTEM + STUDENT_CONTEXT,
      messages,
    });

    for await (const event of stream) {
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        res.write(event.delta.text);
      }
    }
  } catch (err) {
    console.error(err);
    res.write("\n[The model call failed]");
  }

  res.end();
}

// when student doesn't have id, refuse to answer
// when student provides the right id, only returns information for that student
// doesn't leak information for other students

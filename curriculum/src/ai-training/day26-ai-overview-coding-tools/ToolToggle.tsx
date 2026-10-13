export type Tool = "claude" | "codex";

// Switch between Claude Code and Codex examples; the two share the same core ideas.
export default function ToolToggle({ tool, onChange }: { tool: Tool; onChange: (t: Tool) => void }) {
  return (
    <div className="tool-toggle" role="group" aria-label="Choose the coding agent shown in the examples">
      <span>Show examples for:</span>
      <button type="button" className={tool === "claude" ? "active" : ""} onClick={() => onChange("claude")}>
        Claude Code
      </button>
      <button type="button" className={tool === "codex" ? "active" : ""} onClick={() => onChange("codex")}>
        Codex
      </button>
    </div>
  );
}

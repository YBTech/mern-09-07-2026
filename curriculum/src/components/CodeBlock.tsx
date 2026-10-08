import { useMemo } from "react";
import hljs from "highlight.js/lib/core";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import json from "highlight.js/lib/languages/json";
import bash from "highlight.js/lib/languages/bash";
import sql from "highlight.js/lib/languages/sql";
import graphql from "highlight.js/lib/languages/graphql";
import gherkin from "highlight.js/lib/languages/gherkin";
import yaml from "highlight.js/lib/languages/yaml";
import groovy from "highlight.js/lib/languages/groovy";
import plaintext from "highlight.js/lib/languages/plaintext";

// Only the languages this curriculum actually uses, so the bundle doesn't pull in all
// ~190 grammars. `typescript` already aliases ts/tsx and pulls in the JSX handling;
// `xml` is what it delegates to for the JSX tags inside a .tsx snippet.
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("css", css);
hljs.registerLanguage("json", json);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("sql", sql);
// GraphQL schemas (SDL) and queries
hljs.registerLanguage("graphql", graphql);
// BDD .feature files (Feature / Scenario / Given / When / Then)
hljs.registerLanguage("gherkin", gherkin);
// CI/CD pipeline files: GitHub Actions workflow (yaml) and Jenkinsfile (groovy)
hljs.registerLanguage("yaml", yaml);
hljs.registerLanguage("groovy", groovy);
// for "Expected" blocks that show console output rather than source
hljs.registerLanguage("plaintext", plaintext);

/**
 * Splits highlight.js output into lines without breaking markup.
 *
 * A single hljs span can span multiple lines (a block comment, a template literal), so a
 * naive `.split("\n")` produces unbalanced HTML. This closes every open tag at the end of
 * a line and reopens it at the start of the next, which is what makes per-line ✓/✗ markers
 * safe to wrap around the result.
 */
function splitHighlightedLines(html: string): string[] {
  const lines: string[] = [];
  const open: string[] = [];
  let current = "";
  let i = 0;

  while (i < html.length) {
    const ch = html[i];
    if (ch === "<") {
      const end = html.indexOf(">", i);
      const tag = html.slice(i, end + 1);
      if (tag.startsWith("</")) open.pop();
      else open.push(tag);
      current += tag;
      i = end + 1;
    } else if (ch === "\n") {
      lines.push(current + "</span>".repeat(open.length));
      current = open.join("");
      i += 1;
    } else {
      current += ch;
      i += 1;
    }
  }
  lines.push(current);
  return lines;
}

type Props = {
  /** The snippet, as plain source text — no hand-tagged markup. */
  code: string;
  /** Any language registered above; defaults to TSX since most snippets are React. */
  language?: string;
  /** 1-indexed lines to flag with a green ✓ (the "do this" side of a comparison). */
  good?: number[];
  /** 1-indexed lines to flag with a red ✗ (the "don't do this" side). */
  bad?: number[];
  /** Show a line-number gutter — for when the prose refers to lines by number. */
  lineNumbers?: boolean;
};

export default function CodeBlock({ code, language = "tsx", good, bad, lineNumbers }: Props) {
  const html = useMemo(() => {
    const highlighted = hljs.highlight(code.trim(), { language }).value;
    if (!good?.length && !bad?.length && !lineNumbers) return highlighted;

    // A marked (or numbered) line is a display:block span, which already ends its own
    // line — so it gets no trailing "\n". With one, <pre> would render an empty line
    // after it.
    const lines = splitHighlightedLines(highlighted);
    return lines
      .map((line, idx) => {
        const n = idx + 1;
        const isLast = idx === lines.length - 1;
        const mark = good?.includes(n) ? "line-good" : bad?.includes(n) ? "line-bad" : "";
        if (lineNumbers) {
          return `<span class="line ${mark}"><span class="ln">${n}</span>${line}</span>`;
        }
        if (mark) return `<span class="${mark}">${line}</span>`;
        return isLast ? line : line + "\n";
      })
      .join("");
  }, [code, language, good, bad, lineNumbers]);

  return (
    <pre
      className={
        lineNumbers ? (good?.length || bad?.length ? "line-numbers has-marks" : "line-numbers") : undefined
      }
    >
      <code className="hljs" dangerouslySetInnerHTML={{ __html: html }} />
    </pre>
  );
}

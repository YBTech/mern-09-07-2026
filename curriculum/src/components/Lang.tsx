import type { ReactNode } from "react";

// Inline text: a sentence, a phrase, a list item's contents.
export const En = ({ children }: { children: ReactNode }) => <span className="lang-en">{children}</span>;
export const Zh = ({ children }: { children: ReactNode }) => <span className="lang-zh">{children}</span>;

// Block content: whole paragraphs, lists, or sections that differ by language.
// Use these instead of En/Zh when the children contain block-level elements
// (<p>, <ul>, <h2>, etc.) since a <span> cannot legally wrap them.
export const EnBlock = ({ children }: { children: ReactNode }) => <div className="lang-en">{children}</div>;
export const ZhBlock = ({ children }: { children: ReactNode }) => <div className="lang-zh">{children}</div>;

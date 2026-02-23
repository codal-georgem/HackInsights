"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, SmilePlus } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const MAX_CHARS = 300;

const EMOJIS = [
  "🔥",
  "💡",
  "🚀",
  "⚡",
  "🎉",
  "🏆",
  "💻",
  "😊",
  "😎",
  "🤔",
  "👀",
  "🤡",
  "💀",
  "💩",
  "👍",
  "👎",
  "❤️",
  "💔",
  "💯",
  "🎨",
  "🐛",
];

// Convert Tiptap HTML output → our markdown storage format
export function htmlToMarkdown(html: string): string {
  return html
    .replace(/<strong>([\s\S]*?)<\/strong>/g, "**$1**")
    .replace(/<em>([\s\S]*?)<\/em>/g, "*$1*")
    .replace(/<\/p><p>/g, "\n")
    .replace(/<p>/g, "")
    .replace(/<\/p>/g, "")
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

type Props = {
  onChange: (markdown: string, charCount: number) => void;
};

export default function FeedbackEditor({ onChange }: Props) {
  const [showEmoji, setShowEmoji] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const emojiGridRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // If clicking outside the emoji grid AND outside the toggle button, close it.
      if (
        showEmoji &&
        emojiGridRef.current &&
        !emojiGridRef.current.contains(event.target as Node) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target as Node)
      ) {
        setShowEmoji(false);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmoji]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bold: {},
        italic: {},
        // Disable everything that could allow HTML injection
        code: false,
        codeBlock: false,
        heading: false,
        blockquote: false,
        horizontalRule: false,
        strike: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      CharacterCount.configure({ limit: MAX_CHARS }),
      Placeholder.configure({
        placeholder: "Share your real thoughts on the hackathon...",
      }),
    ],
    editorProps: {
      attributes: {
        class: "focus:outline-none", // Removed explicit maxlength here as Tiptap handles it via extension
        "data-gramm": "false",
      },
      // Block paste of HTML — only allow plain text
      handlePaste(view, event) {
        // Tiptap's CharacterCount extension automatically handles pasting that exceeds limits
        const text = event.clipboardData?.getData("text/plain");
        if (text) {
          view.dispatch(
            view.state.tr.insertText(
              text,
              view.state.selection.from,
              view.state.selection.to,
            ),
          );
          return true;
        }
        return false;
      },
    },
    onUpdate({ editor }) {
      const md = htmlToMarkdown(editor.getHTML());
      const count = editor.storage.characterCount.characters() as number;
      onChange(md, count);
    },
  });

  function insertEmoji(emoji: string) {
    editor?.chain().focus().insertContent(emoji).run();
  }

  const charCount: number = editor?.storage.characterCount.characters() ?? 0;
  const remaining = MAX_CHARS - charCount;
  const isOverLimit = charCount > MAX_CHARS;

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col rounded-xl overflow-hidden border transition-all duration-200 text-slate-900 dark:text-brand-text ${
        isOverLimit
          ? "border-red-400 bg-red-50 dark:bg-red-900/10"
          : "border-slate-200 bg-slate-50/80 dark:border-brand-border dark:bg-brand-surface-2/90 focus-within:ring-2 focus-within:ring-brand-primary/20 focus-within:border-brand-primary"
      }`}
    >
      {/* Toolbar */}
      <div className="flex items-center gap-1 border-b border-slate-200/80 dark:border-brand-border/80 bg-slate-50/80 dark:bg-brand-surface-2/80 px-3 py-2">
        <button
          type="button"
          title="Bold (Cmd+B)"
          onMouseDown={(e) => {
            e.preventDefault();
            editor?.chain().focus().toggleBold().run();
          }}
          className={`rounded-lg p-1.5 transition-all duration-200 ${
            editor?.isActive("bold")
              ? "bg-brand-primary text-white shadow-sm"
              : "text-brand-muted hover:bg-black/5 dark:hover:bg-white/10"
          }`}
        >
          <Bold size={16} strokeWidth={2.5} />
        </button>
        <button
          type="button"
          title="Italic (Cmd+I)"
          onMouseDown={(e) => {
            e.preventDefault();
            editor?.chain().focus().toggleItalic().run();
          }}
          className={`rounded-lg p-1.5 transition-all duration-200 ${
            editor?.isActive("italic")
              ? "bg-brand-primary text-white shadow-sm"
              : "text-brand-muted hover:bg-black/5 dark:hover:bg-white/10"
          }`}
        >
          <Italic size={16} strokeWidth={2.5} />
        </button>

        <div className="mx-1 h-5 w-px bg-brand-border" />

        <button
          ref={emojiButtonRef}
          type="button"
          title="Insert emoji"
          onMouseDown={(e) => {
            e.preventDefault();
            setShowEmoji((v) => !v);
          }}
          className={`rounded-lg p-1.5 transition-all duration-200 ${
            showEmoji
              ? "bg-brand-primary text-white shadow-sm"
              : "text-brand-muted hover:bg-black/5 dark:hover:bg-white/10"
          }`}
        >
          <SmilePlus size={18} />
        </button>

        {/* Char counter */}
        <span
          className={`ml-auto font-mono text-xs font-medium tabular-nums ${
            isOverLimit ? "text-red-500 animate-pulse" : "text-brand-muted"
          }`}
        >
          {remaining}
        </span>
      </div>

      {/* Emoji grid */}
      {showEmoji && (
        <div 
          ref={emojiGridRef} 
          className="flex flex-wrap gap-1 border-b border-brand-border bg-brand-surface p-2 animate-in slide-in-from-top-2"
        >
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                insertEmoji(emoji);
              }}
              className="rounded-md bg-transparent p-1.5 text-xl leading-none transition-transform hover:scale-125 hover:bg-brand-primary/10"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Editor area */}
      <EditorContent
        editor={editor}
        className="min-h-[150px] cursor-text text-brand-text [&_.ProseMirror]:px-4 [&_.ProseMirror]:py-3 [&_.ProseMirror]:min-h-[150px] [&_.ProseMirror]:text-brand-text [&_.ProseMirror]:bg-white dark:[&_.ProseMirror]:bg-brand-surface-2"
      />
    </div>
  );
}

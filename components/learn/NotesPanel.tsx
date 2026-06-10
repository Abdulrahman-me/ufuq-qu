"use client";

import { useState, useEffect, useRef } from "react";
import { Bold, Italic, Underline, List, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "ufuq-notes-v2";

export interface NoteRecord {
  id: string;
  content: string;
  updatedAt: number;
}

type NotesMap = Record<string, NoteRecord[]>;

function getStoredNotes(): NotesMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as any;
    const normalized: NotesMap = {};
    Object.entries(parsed).forEach(([chapterId, value]) => {
      if (Array.isArray(value)) {
        normalized[chapterId] = value as NoteRecord[];
      } else if (value && typeof value === "object" && (value as any).content) {
        // مهاجرة من الإصدار القديم: ملاحظة واحدة لكل فصل
        const v = value as any;
        normalized[chapterId] = [
          {
            id: v.id ?? crypto.randomUUID(),
            content: v.content ?? "",
            updatedAt: v.updatedAt ?? Date.now(),
          },
        ];
      }
    });
    return normalized;
  } catch {
    return {};
  }
}

function setStoredNotes(data: NotesMap) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

interface NotesSectionProps {
  chapterId: string;
  chapterTitle: string;
}

export function NotesSection({ chapterId, chapterTitle }: NotesSectionProps) {
  const [notes, setNotes] = useState<NoteRecord[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const map = getStoredNotes();
    const chapterNotes = map[chapterId] ?? [];
    setNotes(chapterNotes);
    if (chapterNotes.length > 0) {
      setActiveId(chapterNotes[chapterNotes.length - 1].id);
      // تعبئة المحرر بآخر ملاحظة
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.innerHTML = chapterNotes[chapterNotes.length - 1].content ?? "";
        }
      }, 0);
    }
  }, [chapterId]);

  const exec = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
    editorRef.current?.focus();
  };

  const handleSelectNote = (id: string) => {
    setActiveId(id);
    const note = notes.find((n) => n.id === id);
    if (editorRef.current && note) {
      editorRef.current.innerHTML = note.content ?? "";
    }
  };

  const handleNewNote = () => {
    const map = getStoredNotes();
    const current = map[chapterId] ?? [];
    const newNote: NoteRecord = {
      id: crypto.randomUUID(),
      content: "",
      updatedAt: Date.now(),
    };
    const updated = [...current, newNote];
    map[chapterId] = updated;
    setStoredNotes(map);
    setNotes(updated);
    setActiveId(newNote.id);
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
      editorRef.current.focus();
    }
  };

  const handleDeleteNote = (id: string) => {
    const map = getStoredNotes();
    const current = map[chapterId] ?? [];
    const updated = current.filter((n) => n.id !== id);
    map[chapterId] = updated;
    setStoredNotes(map);
    setNotes(updated);
    if (activeId === id) {
      const last = updated[updated.length - 1];
      setActiveId(last ? last.id : null);
      if (editorRef.current) {
        editorRef.current.innerHTML = last?.content ?? "";
      }
    }
  };

  const handleSaveActive = () => {
    if (!activeId) return;
    const html = editorRef.current?.innerHTML ?? "";
    const map = getStoredNotes();
    const current = map[chapterId] ?? notes;
    const updated = current.map((n) =>
      n.id === activeId ? { ...n, content: html, updatedAt: Date.now() } : n,
    );
    map[chapterId] = updated;
    setStoredNotes(map);
    setNotes(updated);
  };

  const hasNotes = notes.length > 0;

  return (
    <div className="mt-1 rounded-2xl border border-border/70 bg-card/50 shadow-inner backdrop-blur-sm">
      <button
        type="button"
        className="flex w-full items-center justify-between border-b border-border/60 px-4 py-3 text-sm font-black text-foreground transition-colors hover:bg-muted/40"
        onClick={() => setCollapsed((c) => !c)}
      >
        <span>ملاحظات الفصل · {chapterTitle}</span>
        <span className="text-xs font-bold text-muted-foreground">
          {collapsed ? "إظهار" : "إخفاء"} · {notes.length} ملاحظة
        </span>
      </button>
      {!collapsed && (
        <div className="flex flex-col divide-y divide-border/60 md:flex-row md:divide-x md:divide-y-0">
          <div className="w-full max-w-[40%] space-y-2 bg-muted/30 p-3 md:w-40">
            <button
              type="button"
              onClick={handleNewNote}
              className="inline-flex w-full items-center justify-center gap-1 rounded-xl bg-primary/15 px-2 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary/25"
            >
              <Plus className="h-3 w-3" />
              ملاحظة جديدة
            </button>
            <div className="max-h-48 overflow-y-auto space-y-1 custom-scrollbar">
              {!hasNotes ? (
                <p className="text-[11px] text-muted-foreground px-1 py-1.5">
                  لا توجد ملاحظات بعد. ابدأ بإنشاء أول ملاحظة.
                </p>
              ) : (
                notes
                  .slice()
                  .sort((a, b) => a.updatedAt - b.updatedAt)
                  .map((note, idx) => (
                    <div
                      key={note.id}
                      className={cn(
                        "flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] cursor-pointer group border border-transparent",
                        activeId === note.id
                          ? "bg-primary/10 border-primary/40 text-primary-foreground"
                          : "hover:bg-muted text-foreground",
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => handleSelectNote(note.id)}
                        className="flex-1 text-right overflow-hidden text-ellipsis whitespace-nowrap"
                      >
                        {`ملاحظة ${idx + 1}`}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-1 rounded hover:bg-destructive/10 text-destructive opacity-70 hover:opacity-100"
                        title="حذف الملاحظة"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div>
          <div className="flex-1 p-3 space-y-2">
            <div className="flex flex-wrap items-center gap-1 rounded-xl border border-border/80 bg-background/70 px-2 py-1.5 backdrop-blur-sm">
              <button
                type="button"
                onClick={() => exec("bold")}
                className="p-1.5 rounded hover:bg-muted"
                title="عريض"
              >
                <Bold className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => exec("italic")}
                className="p-1.5 rounded hover:bg-muted"
                title="مائل"
              >
                <Italic className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => exec("underline")}
                className="p-1.5 rounded hover:bg-muted"
                title="تحت خط"
              >
                <Underline className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => exec("insertUnorderedList")}
                className="p-1.5 rounded hover:bg-muted"
                title="قائمة نقطية"
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="max-h-[260px] min-h-[160px] overflow-y-auto rounded-xl border border-border/80 bg-background/80 p-3 shadow-inner backdrop-blur-sm">
              <div
                ref={editorRef}
                contentEditable
                className="min-h-[120px] w-full text-sm text-foreground focus:outline-none"
                data-placeholder="اكتب ملاحظتك هنا..."
                suppressContentEditableWarning
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={handleSaveActive}
                disabled={!activeId}
                className="rounded-xl bg-gradient-to-l from-[#1B8354] to-[#25935F] px-4 py-2 text-xs font-black text-primary-foreground shadow-md shadow-primary/20 transition-opacity disabled:opacity-50"
              >
                حفظ الملاحظة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
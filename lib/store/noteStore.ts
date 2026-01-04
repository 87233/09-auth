import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { NoteTag } from "@/types/note";

export const initialDraft = {
  title: "",
  content: "",
  tag: "Todo" as NoteTag,
};

type NoteDraft = typeof initialDraft;

type NoteStore = {
  draft: NoteDraft;
  setDraft: (draft: NoteDraft) => void;
  clearDraft: () => void;
};
export const useNoteDraftStore = create<NoteStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (draft) => set({ draft }),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: "note-draft",
    }
  )
);

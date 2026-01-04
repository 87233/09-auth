"use client";

import css from "./NoteForm.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { createNote } from "@/lib/api/clientApi";
import type { NoteFormValues, NoteTag } from "@/types/note";
import { useNoteDraftStore } from "@/lib/store/noteStore";

export default function NoteForm() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteDraftStore();
  const { mutate } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      toast.success("Note created!");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
      router.push("/notes/filter/all");
    },
    onError: () => {
      toast.error("Failed to create note");
    },
  });

  function handleCancel() {
    router.push("/notes/filter/all");
  }

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setDraft({
      ...draft,
      [event.target.name]: event.target.value,
    });
  };
  const handleSubmit = (formData: FormData) => {
    const rawValues = Object.fromEntries(formData);
    const values: NoteFormValues = {
      title: rawValues.title as string,
      content: rawValues.content as string,
      tag: rawValues.tag as NoteTag,
    };
    mutate(values);
  };

  return (
    <form className={css.form} action={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          required
          minLength={3}
          maxLength={50}
          defaultValue={draft.title}
          onInvalid={(e) =>
            e.currentTarget.setCustomValidity("Title is required")
          }
          onInput={(e) => e.currentTarget.setCustomValidity("")}
          onChange={handleChange}
          className={css.input}
          autoFocus
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          maxLength={500}
          rows={8}
          defaultValue={draft.content}
          onChange={handleChange}
          className={css.textarea}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          defaultValue={draft.tag}
          onChange={handleChange}
          className={css.select}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button type="submit" className={css.submitButton}>
          Create note
        </button>
      </div>
      <Toaster position="top-center" />
    </form>
  );
}

"use client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import Link from "next/link";
import css from "./NotesPage.module.css";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import Loader from "@/components/Loader/Loader";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import NoteList from "@/components/NoteList/NoteList";
import { Toaster } from "react-hot-toast";
import { fetchNotes } from "@/lib/api/clientApi";

import type { FetchNotesParams, FetchNotesResponse } from "@/lib/api/clientApi";

interface NotesClientProps {
  tag: string;
}

function NotesClient({ tag }: NotesClientProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const debounceSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 300);

  const params: FetchNotesParams = {
    search,
    page,
    tag,
  };

  const { data, isLoading, isSuccess, isError } = useQuery<
    FetchNotesResponse,
    Error
  >({
    queryKey: ["notes", params],
    queryFn: () => fetchNotes(params),
    staleTime: 1000 * 60 * 4,
    placeholderData: keepPreviousData,
  });

  return (
    <div className={css.app}>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          className: "toast-container",
          style: {
            zIndex: 9999,
          },
        }}
      />
      <header className={css.toolbar}>
        <SearchBox
          search={search}
          onChange={(value) => debounceSearch(value)}
        />
        {isSuccess && data?.totalPages && data.totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        )}
        <Link className={css.button} href="/notes/action/create">
          Create note +
        </Link>
      </header>
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isSuccess && !isLoading && <NoteList notes={data.notes} />}
    </div>
  );
}

export default NotesClient;

import type { Note, NoteFormValues } from "@/types/note";
import { nextServer } from "./api";
import { User } from "@/types/user";

export interface FetchNotesParams {
  search?: string;
  page: number;
  tag?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

// export const getSingleNote = async (id: string) => {
//   const res = await nextServer.get<Note>(`/notes/${id}`);
//   return res.data;
// };

export const fetchNotes = async (
  params: FetchNotesParams
): Promise<FetchNotesResponse> => {
  const response = await nextServer.get<FetchNotesResponse>("/notes", {
    params: {
      ...params,
      perPage: 12,
    },
  });

  return response.data;
};

export const createNote = async (noteData: NoteFormValues): Promise<Note> => {
  const { data } = await nextServer.post<Note>("/notes", noteData);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await nextServer.delete<Note>(`/notes/${id}`);
  return data;
};

export const fetchNoteById = async (id: string) => {
  const res = await nextServer.get<Note>(`/notes/${id}`);
  return res.data;
};

export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
};

export async function register(data: RegisterRequest) {
  const res = await nextServer.post<User>("/auth/register", data);
  return res.data;
}

export type LoginRequest = {
  email: string;
  password: string;
};

export const login = async (data: LoginRequest) => {
  const res = await nextServer.post<User>("/auth/login", data);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await nextServer.post("/auth/logout");
};

type CheckSessionRequest = {
  success: boolean;
};

export const checkSession = async () => {
  const res = await nextServer.get<CheckSessionRequest>("/auth/session");
  return res.data.success;
};

export const getMe = async () => {
  const { data } = await nextServer.get<User>("/users/me");
  return data;
};

export type UpdateUserRequest = {
  username: string;
  email: string;
  avatar?: string;
};

export const updateMe = async (payload: UpdateUserRequest) => {
  const { data } = await nextServer.patch<User>("/users/me", payload);
  return data;
};

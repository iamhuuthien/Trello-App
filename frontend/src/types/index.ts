export interface User {
  id: string;
  email?: string;
  name?: string;
  avatar?: string;
}

export interface Column {
  id: string;
  title: string;
}

export interface Board {
  id: string;
  title: string;
  description?: string;
  ownerId?: string;
  members?: string[] | { id: string; name?: string }[];
  columns?: Column[];
  createdAt?: string | number;
  updatedAt?: string | number;
}

export interface Card {
  id: string;
  boardId?: string;
  name: string;
  description?: string;
  status?: string; // column id
  members?: string[];
  deadline?: string | number;
  createdAt?: string | number;
  updatedAt?: string | number;
}

export interface Task {
  id: string;
  cardId?: string;
  title: string;
  description?: string;
  ownerId?: string;
  assigned?: string[];
  createdAt?: string | number;
  updatedAt?: string | number;
}

export interface Invite {
  id: string;
  boardId: string;
  inviteToEmail: string;
  createdAt: string;
  status?: string;
}
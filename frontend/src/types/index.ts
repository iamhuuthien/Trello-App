export interface User {
  name: string;
  email?: string;
}

export interface Board {
  id: string;
  title: string;
  ownerId: string;
  createdAt: string;
  updatedAt?: string;
  description?: string;
  members?: string[];
}

export interface Card {
  id: string;
  boardId?: string;
  name: string;
  description?: string;
  status?: string; // todo / doing / done
  members?: string[];
  priority?: string;
  deadline?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface Task {
  id: string;
  cardId?: string;
  title: string;
  description?: string;
  status?: string;
  ownerId?: string;
  assigned?: string[]; // user ids
  createdAt: string;
  updatedAt?: string;
}

export interface Invite {
  id: string;
  boardId: string;
  inviteToEmail: string;
  createdAt: string;
  status?: string;
}
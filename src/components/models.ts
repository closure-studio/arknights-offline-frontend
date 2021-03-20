export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export interface LoginFunc {
  (username: string, password: string): Promise<null>;
}

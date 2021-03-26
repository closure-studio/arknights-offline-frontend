export interface LoginFunc {
  (username: string, password: string): Promise<null>;
}

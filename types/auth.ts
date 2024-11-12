declare module "#auth-utils" {
  interface User {
    id: string;
    name: string | null;
    email: string | null;
  }
}

export {};

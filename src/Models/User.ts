export interface User {
  id: number;
  full_name: string;
  username: string;
  role: "Admin" | "User";
  phone_numer: number;
}
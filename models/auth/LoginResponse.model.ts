import { User } from "./User.model";

export type AuthSource = "ems" | "hris";

export interface LoginResponse {
  user: User;
  source: AuthSource;
  token: string;
}

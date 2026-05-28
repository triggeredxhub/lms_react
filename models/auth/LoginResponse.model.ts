import { User } from "./User.model";

export type AuthSource = "ems" | "hris" | "lms";

export interface LoginResponse {
  accessToken?: string;
  refreshToken?: string | null;
  user: User;
  source: AuthSource;
  token: string;
}

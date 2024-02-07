import { UserRole } from "./permission";

export interface SessionUser {
  blocked: boolean;
  createdAt: string;
  email: string;
  firstname: string;
  id: number;
  isActive: boolean;
  lastname: string;
  preferedLanguage: string | null;
  updatedAt: string;
  username: string | null;
  roles?: UserRole[];
}

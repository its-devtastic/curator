import { MediaItem } from "./media";
import { UserRole } from "./permission";

export interface AdminUser {
  blocked: boolean;
  createdAt: string;
  email: string;
  firstname: string;
  id: number;
  isActive: boolean;
  lastname: string;
  preferedLanguage: string | null;
  roles: UserRole[];
  updatedAt: string;
  username: string;
}

export interface AdminProfile {
  avatar: MediaItem | null;
}

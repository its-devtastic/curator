import { UserRole } from "./permission";
import { MediaItem } from "./media";

export interface AdminUser {
  blocked: boolean;
  createdAt: string;
  email: string;
  firstname: string;
  id: number;
  isActive: boolean;
  lastname: string;
  preferedLanguage: string;
  roles: UserRole[];
  updatedAt: string;
  username: string;
}

export interface AdminProfile {
  avatar: MediaItem | null;
}

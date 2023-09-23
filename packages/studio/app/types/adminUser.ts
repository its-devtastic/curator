import { UserRole } from "@/types/permission";
import { MediaItem } from "@/types/media";

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

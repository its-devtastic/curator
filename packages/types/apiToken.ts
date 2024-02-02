export interface ApiToken {
  id: number;
  name: string;
  description: string;
  lifespan: number | string | null;
  permissions: null | string[];
  type: "read-only" | "full-access" | "custom";
  accessKey: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
  lastUsedAt: string | null;
}

export interface Version {
  id: number;
  content: Record<string, any>;
  version: number;
  createdAt: string;
  createdBy: null | {
    id: number;
    firstname: string | null;
    lastname: string | null;
  };
}

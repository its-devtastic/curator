export interface Permission {
  action: string;
  conditions: [];
  id: number;
  subject: string | null;
  properties: {
    fields?: string[];
  };
}

export interface UserRole {
  id: number;
  code: string;
  description: string;
  name: string;
}

export interface PermissionConfig {
  controllers: {
    [name: string]: string[];
  };
}

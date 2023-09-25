export interface Webhook {
  id: number;
  name: string;
  headers: Record<string, string>;
  events: string[];
  isEnabled: boolean;
  url: string;
}

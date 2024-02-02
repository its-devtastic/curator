export interface GetManyParams {
  page?: number;
  pageSize?: number;
  sort?: `${string}:ASC` | `${string}:DESC`;
  _q?: string;
  locale?: string;
  [p: `filters${string}`]: string | number | (string | number)[];
}

export type Sort = `${string}:ASC` | `${string}:DESC`;

export interface GetMediaParams {
  page?: number;
  pageSize?: number;
  sort?: Sort;
  _q?: string;
  [p: `filters${string}`]: string | boolean | undefined;
}

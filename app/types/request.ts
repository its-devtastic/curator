export interface GetManyParams {
  page?: number;
  pageSize?: number;
  sort?: `${string}:ASC` | `${string}:DESC`;
  _q?: string;
  locale?: string;
}

export type Sort = `${string}:ASC` | `${string}:DESC`;

export interface GetMediaParams {
  page?: number;
  pageSize?: number;
  sort?: Sort;
  [p: `filters${string}`]: string;
}

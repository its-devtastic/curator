export interface GetManyParams {
  page?: number;
  pageSize?: number;
  sort?: `${string}:ASC` | `${string}:DESC`;
  _q?: string;
  locale?: string;
}

export interface GetMediaParams {
  page?: number;
  pageSize?: number;
  sort?: `${string}:ASC` | `${string}:DESC`;
  filters?: string;
}

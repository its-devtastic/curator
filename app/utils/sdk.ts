import axios, { AxiosInstance } from "axios";
import * as R from "ramda";

import { ContentType, StrapiComponent } from "~/types/contentType";
import { StrapiLocale } from "~/types/locales";
import { SessionUser } from "~/types/session";
import { MediaItem } from "~/types/media";
import { PaginatedResponse } from "~/types/response";
import { GetManyParams, GetMediaParams } from "~/types/request";
import { Permission, UserRole } from "~/types/permission";
import { AdminUser } from "~/types/adminUser";

export class StrapiSdk {
  public apiUrl: string;
  public http: AxiosInstance;
  public contentTypes: ContentType[] = [];
  public authenticated: boolean = false;
  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
    this.http = axios.create({ baseURL: apiUrl });

    this.http.interceptors.response.use(R.identity, (error) => {
      if (error.response?.status === 401) {
        this.setAuthorization(null);
      }
      throw error;
    });
  }
  public setAuthorization(token: string | null) {
    if (token) {
      this.http.defaults.headers["Authorization"] = `Bearer ${token}`;
    } else {
      delete this.http.defaults.headers["Authorization"];
    }
    this.authenticated = Boolean(token);
  }
  public async getContentTypes() {
    const {
      data: { data },
    } = await this.http.get<{
      data: ContentType[];
    }>("/content-manager/content-types");

    this.contentTypes = data;

    return data;
  }
  public async getLocales() {
    const { data } = await this.http.get<StrapiLocale[]>("/i18n/locales");

    return data;
  }
  public async getComponents() {
    const { data } = await this.http.get<{ data: StrapiComponent[] }>(
      "/content-manager/components"
    );

    return data.data;
  }

  public async getPermissions() {
    const { data } = await this.http.get<{ data: Permission[] }>(
      "/admin/users/me/permissions"
    );

    return data.data;
  }

  public async getMe() {
    const { data } = await this.http.get<{ data: SessionUser }>(
      "/admin/users/me"
    );

    return data.data;
  }

  public async login(credentials: any) {
    const {
      data: { data },
    } = await this.http.post<{
      data: { token: string; user: SessionUser };
    }>("/admin/login", credentials);

    return data;
  }

  public async forgotPassword(email: string) {
    await this.http.post("/admin/forgot-password", { email });
  }

  public async resetPassword(payload: { code: string; password: string }) {
    const {
      data: { data },
    } = await this.http.post<{
      data: { token: string; user: SessionUser };
    }>("/admin/reset-password", {
      password: payload.password,
      resetPasswordToken: payload.code,
    });

    return data;
  }

  public async getRegistrationInfo(registrationToken: string) {
    const {
      data: { data },
    } = await this.http.get<{
      data: { firstname: string; lastname: string; email: string };
    }>("/admin/registration-info", { params: { registrationToken } });

    return data;
  }

  public async register({
    registrationToken,
    ...userInfo
  }: {
    registrationToken: string;
    firstname: string;
    lastname: string;
    password: string;
  }) {
    const {
      data: { data },
    } = await this.http.post<{
      data: { token: string; user: SessionUser };
    }>("/admin/register", {
      registrationToken,
      userInfo,
    });

    return data;
  }

  public async getOne<T extends Record<string, any>>(
    apiID: string,
    id?: number,
    config?: any
  ) {
    const isSingleType =
      this.contentTypes.find(R.whereEq({ apiID }))?.kind === "singleType";
    const { data } = await this.http.get<T>(
      `${this.getContentUrl(apiID)}/${(isSingleType ? "" : id) ?? ""}`,
      config
    );

    return StrapiSdk.addTempKey(data);
  }

  public async getMany<T>(apiID: string, params?: GetManyParams) {
    const { data } = await this.http.get(this.getContentUrl(apiID), { params });

    return StrapiSdk.addTempKey(data);
  }

  public async save(
    apiID: string,
    attributes: Record<string, any>,
    config?: any
  ) {
    const isSingleType =
      this.contentTypes.find(R.whereEq({ apiID }))?.kind === "singleType";

    const { data } = await this.http[
      attributes.id || isSingleType ? "put" : "post"
    ](
      `${this.getContentUrl(apiID)}/${isSingleType ? "" : attributes.id ?? ""}`,
      attributes,
      config
    );

    return StrapiSdk.addTempKey(data);
  }

  public async deleteOne(apiID: string, id: number) {
    return await this.http.delete(`${this.getContentUrl(apiID)}/${id}`);
  }

  public async publish(apiID: string, id: number) {
    const { data } = await this.http.post(
      `${this.getContentUrl(apiID)}/${id}/actions/publish`
    );

    return StrapiSdk.addTempKey(data);
  }

  public async unpublish(apiID: string, id: number) {
    const { data } = await this.http.post(
      `${this.getContentUrl(apiID)}/${id}/actions/unpublish`
    );

    return StrapiSdk.addTempKey(data);
  }

  public async updateProfile(values: Partial<SessionUser>) {
    const { data } = await this.http.put<{ data: SessionUser }>(
      "/admin/users/me",
      values
    );

    return data.data;
  }

  public async getMediaItems(params?: GetMediaParams) {
    const { data } = await this.http.get<PaginatedResponse<MediaItem>>(
      "/upload/files",
      { params }
    );

    return data;
  }

  public async deleteMediaItem(id: number) {
    await this.http.delete(`/upload/files/${id}`);
  }

  public async upload(file: File) {
    const fd = new FormData();

    fd.append("files", file);
    fd.append("fileInfo", JSON.stringify({ name: file.name, folder: null }));

    const { data } = await this.http.post<MediaItem>("/upload", fd);

    return data;
  }

  public async createFolder(dto: { parent: number | null; name: string }) {
    const { data } = await this.http.post<{ data: any }>(
      "/upload/folders",
      dto
    );

    return data.data;
  }

  public async getFolders(parent: number | null = null) {
    const { data } = await this.http.get("/upload/folders", {
      params: {
        "filters[$and][0][parent][id][$null]": R.isNil(parent),
        pagination: {
          pageSize: -1,
        },
      },
    });

    return data;
  }

  public async getAdminUsers(params: GetManyParams) {
    const { data } = await this.http.get<{
      data: PaginatedResponse<AdminUser>;
    }>("/admin/users", { params });

    return data.data;
  }

  public async getAdminUser(id: number) {
    const { data } = await this.http.get<{
      data: AdminUser;
    }>(`/admin/users/${id}`);

    return data.data;
  }

  public async deleteAdminUser(id: number) {
    await this.http.delete<{
      data: AdminUser;
    }>(`/admin/users/${id}`);
  }

  public async updateAdminUser({
    id,
    ...value
  }: Pick<AdminUser, "id" | "email" | "firstname" | "lastname" | "isActive"> & {
    roles: number[];
  }) {
    const { data } = await this.http.put<{
      data: AdminUser;
    }>(`/admin/users/${id}`, value);

    return data.data;
  }

  public async createAdminUser(
    value: Pick<AdminUser, "email" | "firstname" | "lastname" | "roles">
  ) {
    const { data } = await this.http.post<{
      data: AdminUser & { registrationToken: string };
    }>("/admin/users", value);

    return data.data;
  }

  public async getAdminRoles() {
    const { data } = await this.http.get<{ data: UserRole[] }>("/admin/roles");

    return data.data;
  }

  private getContentUrl(apiID: string): string {
    const contentType = this.contentTypes.find(R.whereEq({ apiID }));

    if (!contentType) {
      throw new Error(`No content type with apiID ${apiID}`);
    }

    return `/content-manager/${
      contentType.kind === "singleType" ? "single-types" : "collection-types"
    }/${contentType.uid}`;
  }

  private static addTempKey<
    T extends Record<string, unknown> | Record<string, unknown>[]
  >(data: T): T {
    const mapFn = R.mapObjIndexed(
      R.when(Array.isArray, (items) =>
        items.map((item, idx) => ({ ...item, __temp_key__: idx + 1 }))
      )
    );

    return (Array.isArray(data) ? R.map(mapFn)(data) : mapFn(data)) as T;
  }
}

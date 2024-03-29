import axios, { type AxiosInstance } from "axios";
import * as R from "ramda";
import { nanoid } from "nanoid";

import type {
  AdminProfile,
  AdminUser,
  ApiToken,
  GetManyParams,
  GetMediaParams,
  MediaFolder,
  MediaFolderStructure,
  MediaItem,
  PaginatedResponse,
  Permission,
  PermissionConfig,
  SessionUser,
  StrapiComponent,
  StrapiContentType,
  StrapiLocale,
  UserRole,
  Version,
  Webhook,
} from "@curatorjs/types";

export class StrapiSdk {
  public apiUrl: string;
  public http: AxiosInstance;
  public contentTypes: StrapiContentType[] = [];
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
      data: StrapiContentType[];
    }>("/content-manager/content-types");

    this.contentTypes = data;

    return data;
  }

  public async getComponents() {
    const { data } = await this.http.get<{ data: StrapiComponent[] }>(
      "/content-manager/components",
    );

    return data.data;
  }

  public async getPermissions() {
    const { data } = await this.http.get<{ data: Permission[] }>(
      "/admin/users/me/permissions",
    );

    return data.data;
  }

  public async getMe() {
    const { data } = await this.http.get<{ data: SessionUser }>(
      "/admin/users/me",
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
    config?: any,
  ) {
    const isSingleType =
      this.contentTypes.find(R.whereEq({ apiID }))?.kind === "singleType";
    const { data } = await this.http.get<T>(
      `${this.getContentUrl(apiID)}/${(isSingleType ? "" : id) ?? ""}`,
      config,
    );

    return data;
  }

  public async getMany<T>(apiID: string, params?: GetManyParams) {
    const { data } = await this.http.get<PaginatedResponse<any>>(
      this.getContentUrl(apiID),
      { params },
    );

    return data;
  }

  public async getRelation(
    apiID: string,
    id: number,
    field: string,
    params?: GetManyParams,
  ) {
    const contentType = this.contentTypes.find(R.whereEq({ apiID }));

    const { data } = await this.http.get<{ data: { id: number } }>(
      `/content-manager/relations/${contentType?.uid}/${id}/${field}`,
      {
        params,
      },
    );

    return data.data;
  }

  public async getRelations(
    apiID: string,
    id: number,
    field: string,
    params?: GetManyParams,
  ) {
    const contentType = this.contentTypes.find(R.whereEq({ apiID }));

    const { data } = await this.http.get<PaginatedResponse<{ id: number }>>(
      `/content-manager/relations/${contentType?.uid}/${id}/${field}`,
      {
        params,
      },
    );

    return data;
  }

  public async save(
    apiID: string,
    attributes: Record<string, any>,
    config?: any,
  ) {
    const isSingleType =
      this.contentTypes.find(R.whereEq({ apiID }))?.kind === "singleType";

    const { data } = await this.http[
      attributes.id || isSingleType ? "put" : "post"
    ](
      `${this.getContentUrl(apiID)}/${isSingleType ? "" : attributes.id ?? ""}`,
      StrapiSdk.removeTmpId(attributes),
      config,
    );

    return data;
  }

  public async deleteOne(apiID: string, id: number) {
    return await this.http.delete(`${this.getContentUrl(apiID)}/${id}`);
  }

  public async publish(apiID: string, id: number) {
    const { data } = await this.http.post(
      `${this.getContentUrl(apiID)}/${id}/actions/publish`,
    );

    return data;
  }

  public async unpublish(apiID: string, id: number) {
    const { data } = await this.http.post(
      `${this.getContentUrl(apiID)}/${id}/actions/unpublish`,
    );

    return data;
  }

  public async updateProfile(values: Partial<SessionUser>) {
    const { data } = await this.http.put<{ data: SessionUser }>(
      "/admin/users/me",
      values,
    );

    return data.data;
  }

  public async getExtendedProfile() {
    const { data } = await this.http.get<AdminProfile>("/curator/profiles/me");

    return data;
  }

  public async updateExtendedProfile(values: Partial<AdminProfile>) {
    const { data } = await this.http.patch<AdminProfile>(
      "/curator/profiles/me",
      values,
    );

    return data;
  }

  public async getMediaItems(params?: GetMediaParams) {
    const { data } = await this.http.get<PaginatedResponse<MediaItem>>(
      "/upload/files",
      { params },
    );

    return data;
  }

  public async deleteMediaItem(id: number) {
    await this.http.delete(`/upload/files/${id}`);
  }

  public async updateMediaItem(dto: {
    id: number;
    caption: string | null;
    alternativeText: string | null;
    name: string;
    folder: number | null;
  }) {
    const fd = new FormData();

    fd.append("fileInfo", JSON.stringify(dto));

    const { data } = await this.http.post<MediaItem>("/upload", fd, {
      params: {
        id: dto.id,
      },
    });

    return data;
  }

  public async upload(file: File, folder: number | null = null) {
    const fd = new FormData();

    fd.append("files", file);
    fd.append("fileInfo", JSON.stringify({ name: file.name, folder }));

    const { data } = await this.http.post<MediaItem[]>("/upload", fd);

    return data;
  }

  public async createFolder(dto: { parent: number | null; name: string }) {
    const { data } = await this.http.post<{ data: any }>(
      "/upload/folders",
      dto,
    );

    return data.data;
  }

  public async updateFolder({
    id,
    name,
    parent,
  }: {
    id: number;
    name: string;
    parent: number | null;
  }) {
    const { data } = await this.http.put<{ data: any }>(
      `/upload/folders/${id}`,
      { parent, name },
    );

    return data.data;
  }

  public async getFolder(id: number) {
    const { data } = await this.http.get<{ data: MediaFolder }>(
      `/upload/folders/${id}`,
      {
        params: {
          "populate[parent][populate][parent]": "*",
        },
      },
    );

    return data.data;
  }

  public async getFolders(parent: number | null = null) {
    const { data } = await this.http.get<{ data: MediaFolder[] }>(
      "/upload/folders",
      {
        params: {
          "filters[$and][0][parent][id][$null]": R.isNil(parent) || undefined,
          "filters[$and][0][parent][id]": parent ?? undefined,
          "populate[parent][populate][parent]": "*",
          pagination: {
            pageSize: -1,
          },
        },
      },
    );

    return data.data;
  }

  public async getFolderStructure() {
    const { data } = await this.http.get<{ data: MediaFolderStructure[] }>(
      "/upload/folder-structure",
    );

    return data.data;
  }

  public async getAllPermissions() {
    const { data } = await this.http.get<{
      data: Record<string, PermissionConfig>;
    }>("/admin/content-api/permissions");

    return data.data;
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
    value: Pick<AdminUser, "email" | "firstname" | "lastname" | "roles">,
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

  /**
   * i18n plugin methods.
   */
  public async getLocales(params?: GetManyParams) {
    const { data } = await this.http.get<StrapiLocale[]>("/i18n/locales", {
      params,
    });

    return data;
  }

  public async createLocale(locale: string, name: string) {
    const { data } = await this.http.post<StrapiLocale>("/i18n/locales", {
      name,
      code: locale,
      isDefault: false,
    });

    return data;
  }

  public async updateLocale(id: number, payload: { isDefault?: boolean }) {
    const { data } = await this.http.put<StrapiLocale>(
      `/i18n/locales/${id}`,
      payload,
    );

    return data;
  }

  public async deleteLocale(id: number) {
    await this.http.delete<StrapiLocale>(`/i18n/locales/${id}`);
  }

  public async getIsoLocales() {
    const { data } =
      await this.http.get<{ code: string; name: string }[]>(
        "/i18n/iso-locales",
      );

    return data;
  }

  /**
   * API tokens CRUD methods.
   */
  public async getApiTokens() {
    const { data } = await this.http.get<{ data: ApiToken[] }>(
      "/admin/api-tokens",
    );

    return R.sortWith([R.descend(R.prop("id"))], data.data);
  }

  public async createApiToken(
    payload: Pick<
      ApiToken,
      "name" | "description" | "lifespan" | "permissions" | "type"
    >,
  ) {
    const { data } = await this.http.post<{ data: ApiToken }>(
      "/admin/api-tokens",
      payload,
    );

    return data.data;
  }

  public async updateApiToken(
    id: number,
    {
      name,
      description,
      type,
      permissions,
    }: Pick<ApiToken, "name" | "description" | "type" | "permissions">,
  ) {
    const { data } = await this.http.put<ApiToken>(`/admin/api-tokens/${id}`, {
      name,
      description,
      type,
      permissions,
    });

    return data;
  }

  public async deleteApiToken(id: number) {
    await this.http.delete(`/admin/api-tokens/${id}`);
  }

  public async regenerateApiToken(id: number) {
    const { data } = await this.http.post<{ data: { accessKey: string } }>(
      `/admin/api-tokens/${id}/regenerate`,
    );

    return data.data.accessKey;
  }

  /**
   * Webhooks CRUD methods.
   */
  public async getWebhooks() {
    const { data } = await this.http.get<{ data: Webhook[] }>(
      "/admin/webhooks",
    );

    return R.sortWith([R.descend(R.prop("id"))], data.data);
  }

  public async createWebhook(payload: Omit<Webhook, "id">) {
    const { data } = await this.http.post<{ data: Webhook }>(
      "/admin/webhooks",
      payload,
    );

    return data.data;
  }

  public async updateWebhook(
    id: number,
    { name, url, headers, isEnabled, events }: Webhook,
  ) {
    const { data } = await this.http.put<Webhook>(`/admin/webhooks/${id}`, {
      name,
      url,
      headers,
      isEnabled,
      events,
    });

    return data;
  }

  public async deleteWebhook(id: number) {
    await this.http.delete(`/admin/webhooks/${id}`);
  }

  public async triggerWebhook(id: number) {
    const { data } = await this.http.post<{
      data: { message: string; statusCode: number };
    }>(`/admin/webhooks/${id}/trigger`);

    return data.data;
  }

  /**
   * Secrets service.
   *
   * This method is for retrieving the secrets that the current user's role
   * has access to. It returns a single key-value object.
   */
  public async getSecrets() {
    const { data } =
      await this.http.get<Record<string, string>>("/curator/secrets");

    return data;
  }

  /**
   * Dashboard.
   */
  public async getDashboard() {
    const { data } = await this.http.get<{
      recent: Record<string, any>[];
      drafts: Record<string, any>[];
    }>("/curator/dashboard");

    return data;
  }

  /**
   * Versioning.
   */
  public async getVersions(
    apiID: string,
    id: number,
    params: { page?: number } = {},
  ) {
    const uid = this.contentTypes.find(R.whereEq({ apiID }))?.uid;

    const { data } = await this.http.get<PaginatedResponse<Version>>(
      `/curator/versioning/${uid}/${id}`,
      {
        params: {
          page: params.page ?? 1,
        },
      },
    );

    return data;
  }

  /**
   * Helper methods.
   */
  public generateTempId() {
    return `__tmp__${nanoid()}`;
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

  private static removeTmpId<
    T extends Record<string, unknown> | Record<string, unknown>[],
  >(data: T): T {
    function removeId(value: any): any {
      return R.cond([
        [Array.isArray, R.map(removeId)],
        [
          R.is(Object),
          R.pipe(
            R.evolve({
              id: R.when(R.startsWith("__tmp__"), R.always(undefined)),
            }),
            R.mapObjIndexed(removeId),
          ),
        ],
        [R.T, R.identity],
      ])(value as any);
    }

    return removeId(data);
  }
}

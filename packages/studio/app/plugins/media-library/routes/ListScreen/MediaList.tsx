import { MediaItem, Pagination as IPagination, Sort } from "@curatorjs/types";
import {
  Button,
  Pagination,
  Table,
  TableBody,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@curatorjs/ui";
import { Formik } from "formik";
import * as R from "ramda";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { PiGridFour, PiListBold, PiUploadSimpleBold } from "react-icons/pi";
import { useSearchParams } from "react-router-dom";
import { useAsync } from "react-use";

import usePreferences from "@/hooks/usePreferences";
import useStrapi from "@/hooks/useStrapi";
import ListView from "@/plugins/media-library/routes/ListScreen/ListView";

import UploadButton from "../../ui/UploadButton";
import EditMediaModal from "./EditMediaModal";
import FilterToolbar from "./FilterToolbar";
import FolderList from "./FolderList";
import FolderPath from "./FolderPath";

const MediaList: React.FC = () => {
  const { t } = useTranslation();
  const { sdk, permissions } = useStrapi();
  const { preferences, setPreference } = usePreferences();
  const [searchParams] = useSearchParams();
  const [edit, setEdit] = useState<MediaItem | null>(null);
  const view = preferences.mediaLibrary?.listView ?? "list";
  const canUpload = permissions.some(
    R.whereEq({ action: "plugin::upload.assets.create" }),
  );
  const canEdit = permissions.some(
    R.whereEq({ action: "plugin::upload.assets.update" }),
  );

  const [collection, setCollection] = useState<{
    pagination: IPagination | null;
    results: any[];
  }>({
    pagination: null,
    results: [],
  });
  const folder = R.unless(R.isNil, Number)(searchParams.get("folder"));

  const { loading } = useAsync(async () => {
    const data = await sdk.getMediaItems({
      sort: "createdAt:DESC",
      pageSize: 12,
      "filters[$and][0][folder][id]": folder || undefined,
      "filters[$and][0][folder][id][$null]": !folder || undefined,
    });
    setCollection(data);
  }, [sdk]);

  return (
    <Formik<{
      sort: Sort;
      _q: string;
      page: number;
      pageSize: number;
      folder: number | null;
    }>
      initialValues={{
        _q: "",
        sort: "createdAt:DESC",
        page: 1,
        pageSize: 12,
        folder,
      }}
      onSubmit={async ({ folder, ...values }) => {
        const data = await sdk.getMediaItems({
          "filters[$and][0][folder][id]": folder ? String(folder) : undefined,
          "filters[$and][0][folder][id][$null]": !folder || undefined,
          ...values,
        });
        setCollection(data);
      }}
    >
      {({ setFieldValue, submitForm }) => (
        <>
          {edit && canEdit && (
            <EditMediaModal
              media={edit}
              onCancel={() => setEdit(null)}
              onSave={() => {
                setEdit(null);
                submitForm();
              }}
              onDelete={() => {
                setEdit(null);
                submitForm();
              }}
            />
          )}
          <div className="px-4 md:px-12 py-6">
            <div className="flex flex-col md:flex-row items-center my-12 md:mb-24 gap-4">
              <h1 className="flex-1 text-3xl font-bold">
                {t("common.media_library")}
              </h1>
              <Tabs
                value={view}
                onValueChange={(view) =>
                  setPreference(
                    "mediaLibrary.listView",
                    view as "list" | "grid",
                  )
                }
              >
                <TabsList>
                  <TabsTrigger value="grid">
                    <PiGridFour className="size-4" />
                  </TabsTrigger>
                  <TabsTrigger value="list">
                    <PiListBold className="size-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              {canUpload && (
                <UploadButton
                  onUploadComplete={submitForm}
                  folder={folder}
                  button={
                    <Button>
                      <PiUploadSimpleBold className="size-4 mr-2" />
                      {t("media_library.upload")}
                    </Button>
                  }
                />
              )}
            </div>
            <div className="mb-4">
              <FilterToolbar />
            </div>
            <Table>
              <FolderPath />

              <TableBody>
                <FolderList />

                {view === "list" && (
                  <ListView mediaItems={collection.results} />
                )}
              </TableBody>
            </Table>
            <div className="mt-4">
              <Pagination
                current={collection.pagination?.page}
                pageSize={collection.pagination?.pageSize}
                total={collection.pagination?.total}
                onChange={(page) => {
                  setFieldValue("page", page);
                  submitForm();
                }}
              />
            </div>
          </div>
        </>
      )}
    </Formik>
  );
};

export default MediaList;

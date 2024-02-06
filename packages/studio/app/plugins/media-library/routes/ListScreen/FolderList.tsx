import { MediaFolder } from "@curatorjs/types";
import {
  faAngleRight,
  faFolder,
  faHome,
  faPen,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Input, List } from "antd";
import { useFormikContext } from "formik";
import * as R from "ramda";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useAsyncRetry } from "react-use";

import useStrapi from "@/hooks/useStrapi";

import EditFolderModal from "./EditFolderModal";

const FolderList: React.FC = () => {
  const { t } = useTranslation();
  const { sdk } = useStrapi();
  const { setFieldValue, submitForm } = useFormikContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [create, setCreate] = useState(false);
  const [edit, setEdit] = useState<MediaFolder | null>(null);
  const { permissions } = useStrapi();
  const canCreate = permissions.some(
    R.whereEq({ action: "plugin::upload.assets.create" }),
  );
  const canEdit = permissions.some(
    R.whereEq({ action: "plugin::upload.assets.update" }),
  );
  const parent = searchParams.get("folder");

  const { value: folders = [], retry } = useAsyncRetry(async () => {
    return await sdk.getFolders(parent ? Number(parent) : null);
  }, [parent]);

  const { value: folder } = useAsyncRetry(async () => {
    if (parent) {
      return await sdk.getFolder(Number(parent));
    }
  }, [parent]);

  const createFolder = useCallback(
    async (name: string) => {
      if (!name) {
        return;
      }

      try {
        await sdk.createFolder({
          parent: folder?.id || null,
          name,
        });
        retry();
        setCreate(false);
      } catch (e) {}
    },
    [folder?.id, retry],
  );

  useEffect(() => {
    setFieldValue("folder", parent);
    submitForm();
  }, [parent]);

  return (
    <>
      {edit && canEdit && (
        <EditFolderModal
          folder={edit}
          onCancel={() => setEdit(null)}
          onSave={() => {
            setEdit(null);
            retry();
          }}
        />
      )}
      <div className="border-gray-100 dark:border-gray-500">
        <div className="py-1 px-2 border-b border-b-gray-200 dark:border-b-gray-500 border-solid border-0 bg-gray-100 dark:bg-gray-900 rounded-t-md shadow-sm">
          <ul
            role="menu"
            className="flex items-center gap-2 list-none text-sm font-semibold m-0 p-0 [&_li:last-of-type]:text-indigo-600"
          >
            <li>
              <div
                role="menuitem"
                className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 w-8 h-8 flex items-center justify-center cursor-pointer"
                onClick={() =>
                  setSearchParams((searchParams) => {
                    searchParams.delete("folder");
                    return searchParams;
                  })
                }
              >
                <FontAwesomeIcon icon={faHome} className="text-gray-500" />
              </div>
            </li>
            {folder && <ParentFolder folder={folder} />}
            {canCreate && <FontAwesomeIcon icon={faAngleRight} />}
            <li>
              {canCreate &&
                (create ? (
                  <Input
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.code === "Escape") {
                        setCreate(false);
                      }
                    }}
                    onBlur={(e) => {
                      !e.currentTarget.value
                        ? setCreate(false)
                        : createFolder(e.currentTarget.value);
                    }}
                    onPressEnter={(e) => {
                      createFolder(e.currentTarget.value);
                    }}
                  />
                ) : (
                  <Button
                    size="small"
                    type="dashed"
                    icon={<FontAwesomeIcon icon={faPlus} />}
                    onClick={() => setCreate(true)}
                  >
                    {t("media_library.new_folder")}
                  </Button>
                ))}
            </li>
          </ul>
        </div>
        {!R.isEmpty(folders) && (
          <List
            className="border-0 border-solid border-b border-gray-100 dark:border-gray-500"
            dataSource={folders}
            size="small"
            renderItem={(item: MediaFolder) => (
              <List.Item
                className="hover:cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md group"
                onClick={() =>
                  setSearchParams((searchParams) => {
                    searchParams.set("folder", String(item.id));
                    return searchParams;
                  })
                }
                actions={[
                  canEdit && (
                    <Button
                      className="group-hover:block hidden"
                      key="edit"
                      icon={<FontAwesomeIcon icon={faPen} />}
                      type="text"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEdit(item);
                      }}
                    />
                  ),
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <div className="space-x-2">
                      <FontAwesomeIcon
                        icon={faFolder}
                        className="text-indigo-500"
                      />
                    </div>
                  }
                  title={item.name}
                />
              </List.Item>
            )}
          />
        )}
      </div>
    </>
  );
};

export default FolderList;

function ParentFolder({ folder }: { folder: MediaFolder }) {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <>
      {folder.parent && <ParentFolder folder={folder.parent} />}
      <FontAwesomeIcon icon={faAngleRight} />
      <li
        role="menuitem"
        className="hover:bg-gray-200 dark:hover:bg-gray-800 rounded-3xl py-1 px-3 cursor-pointer select-none"
        onClick={() =>
          setSearchParams((searchParams) => {
            searchParams.set("folder", String(folder.id));
            return searchParams;
          })
        }
      >
        {folder.name}
      </li>
    </>
  );
}

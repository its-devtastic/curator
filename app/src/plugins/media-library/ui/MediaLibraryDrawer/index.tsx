import React, { useState } from "react";
import { Button, Drawer } from "antd";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faCloudUpload } from "@fortawesome/free-solid-svg-icons";
import { useAsyncRetry } from "react-use";

import useStrapi from "~/hooks/useStrapi";

import UploadButton from "../../ui/UploadButton";
import ListView from "./ListView";

const MediaLibraryDrawer: React.FC<{
  open: boolean;
  onClose: VoidFunction;
}> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const { sdk } = useStrapi();
  const [page, setPage] = useState(1);

  const {
    value = { results: [], pagination: null },
    retry,
    loading,
  } = useAsyncRetry(async () => {
    return sdk.getMediaItems({ sort: "createdAt:DESC", page });
  }, [page]);

  const { value: folders } = useAsyncRetry(async () => {
    return sdk.getFolders(null);
  }, []);

  return (
    <Drawer
      title={t("common.media_library")}
      placement="left"
      open={open}
      onClose={onClose}
      size="large"
      destroyOnClose
      closeIcon={<FontAwesomeIcon icon={faClose} />}
      extra={
        <div className="space-x-2">
          {/*<Button type="dashed" className="space-x-2">*/}
          {/*  <FontAwesomeIcon icon={faFolderPlus} />*/}
          {/*  <span>{t("media_library.new_folder")}</span>*/}
          {/*</Button>*/}
          <UploadButton
            onUploadComplete={retry}
            button={
              <Button type="primary" className="space-x-2">
                <FontAwesomeIcon icon={faCloudUpload} />
                <span>{t("media_library.upload")}</span>
              </Button>
            }
          />
        </div>
      }
    >
      <ListView
        items={value.results}
        pagination={value.pagination}
        onPageChange={setPage}
        onDelete={retry}
        loading={loading}
      />
    </Drawer>
  );
};

export default MediaLibraryDrawer;

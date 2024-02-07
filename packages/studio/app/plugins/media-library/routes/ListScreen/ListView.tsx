import { MediaItem } from "@curatorjs/types";
import { Button, TableCell, TableRow } from "@curatorjs/ui";
import { faFile, faLink, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { message, Popconfirm } from "antd";
import { filesize } from "filesize";
import * as R from "ramda";
import React from "react";
import { useTranslation } from "react-i18next";
import { PiLinkBold, PiTrashBold } from "react-icons/pi";
import { useCopyToClipboard } from "react-use";

import useCurator from "@/hooks/useCurator";
import useStrapi from "@/hooks/useStrapi";
import EditMediaModal from "@/plugins/media-library/routes/ListScreen/EditMediaModal";
import CalendarTime from "@/ui/CalendarTime";

export default function ListView({ mediaItems }: { mediaItems: MediaItem[] }) {
  const { t } = useTranslation();
  const [_, copy] = useCopyToClipboard();
  const { sdk, permissions } = useStrapi();
  const {
    images: { getImageUrl },
  } = useCurator();

  const canEdit = permissions.some(
    R.whereEq({ action: "plugin::upload.assets.update" }),
  );
  const canCopyLink = permissions.some(
    R.whereEq({ action: "plugin::upload.assets.copy-link" }),
  );

  return mediaItems.map((item) => (
    <EditMediaModal key={item.id} media={item}>
      {(openEditModal) => (
        <TableRow
          className="hover:bg-secondary cursor-pointer group"
          onClick={() => openEditModal()}
        >
          <TableCell>
            {item.mime.startsWith("image/") ? (
              <img
                className="rounded-md object-contain size-8"
                src={getImageUrl(item)}
                alt=""
              />
            ) : (
              <div className="flex items-center justify-center bg-indigo-50 rounded-md select-none size-8">
                <FontAwesomeIcon icon={faFile} className="text-indigo-500" />
              </div>
            )}
          </TableCell>
          <TableCell>{item.name}</TableCell>
          <TableCell>
            <div className="space-y-2">
              {item.caption && (
                <div className="font-mono truncate">{item.caption}</div>
              )}
              <div className="space-x-4">
                <span>{item.ext.slice(1).toUpperCase()}</span>
                <span>{String(filesize(item.size * 1000, { round: 0 }))}</span>
                {item.mime.startsWith("image/") &&
                  item.width &&
                  item.height && (
                    <span>{`${item.width} x ${item.height}`}</span>
                  )}
                <CalendarTime>{item.createdAt}</CalendarTime>
              </div>
            </div>
          </TableCell>
          <TableCell align="right">
            <div className="flex items-center gap-2 invisible group-hover:visible">
              {canCopyLink && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    copy(item.url);
                    message.success(t("media_library.url_copied"));
                  }}
                >
                  <PiLinkBold className="size-4" />
                </Button>
              )}
              {canEdit && (
                <Popconfirm
                  title={t("media_library.delete_item_title")}
                  description={t("media_library.delete_item_description")}
                  onConfirm={async (e) => {
                    e?.stopPropagation();
                    await sdk.deleteMediaItem(item.id);
                  }}
                  onCancel={(e) => {
                    e?.stopPropagation();
                  }}
                  okText={t("common.yes")}
                  cancelText={t("common.no")}
                  okButtonProps={{ type: "primary", danger: true }}
                >
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <PiTrashBold className="size-4" />
                  </Button>
                </Popconfirm>
              )}
            </div>
          </TableCell>
        </TableRow>
      )}
    </EditMediaModal>
  ));
}

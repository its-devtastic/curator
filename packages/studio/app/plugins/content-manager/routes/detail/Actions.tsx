import { ContentTypeConfig } from "@curatorjs/types";
import { Button, useFormContext } from "@curatorjs/ui";
import {
  faEllipsisV,
  faExternalLink,
  faNewspaper,
  faPen,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown, Modal, notification, Switch, Tooltip } from "antd";
import * as R from "ramda";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import useContentPermission from "@/hooks/useContentPermission";
import usePreferences from "@/hooks/usePreferences";
import useStrapi from "@/hooks/useStrapi";

export default function Action({
  contentTypeConfig,
}: {
  contentTypeConfig: ContentTypeConfig;
}) {
  const { t } = useTranslation();
  const params = useParams();
  const hasPermission = useContentPermission();
  const apiID = params.apiID as string;
  const navigate = useNavigate();
  const { contentTypes, sdk } = useStrapi();
  const contentType = contentTypes.find(R.whereEq({ apiID }));
  const { watch, getValues, formState, reset } = useFormContext<any>();
  const hasDraftState = contentType?.options.draftAndPublish;
  const isDraft = hasDraftState && !watch("publishedAt");
  const isSingleType = contentType?.kind === "singleType";
  const [modal, contextHolder] = Modal.useModal();
  const { preferences, setPreference } = usePreferences();
  const id = watch("id");
  /*
   * CRUD permissions.
   */
  const hasCreatePermission = hasPermission("create", apiID);
  const hasUpdatePermission = hasPermission("update", apiID);
  const hasDeletePermission = hasPermission("delete", apiID);
  const hasPublishPermission = hasPermission("publish", apiID);
  const hasSavePermission =
    (!id && hasCreatePermission) || (id && hasUpdatePermission);

  return (
    <>
      {contextHolder}

      <div className="flex items-top gap-2">
        <div className="flex flex-col items-end">
          {hasSavePermission && (
            <Button type="submit" loading={formState.isSubmitting}>
              {t("common.save")}
            </Button>
          )}
        </div>

        {id && contentTypeConfig?.getEntityUrl && (
          <Tooltip title={t("phrases.view_page")}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                window.open(contentTypeConfig.getEntityUrl?.(getValues()));
              }}
            >
              <FontAwesomeIcon icon={faExternalLink} />
            </Button>
          </Tooltip>
        )}

        {id && !isSingleType && hasDeletePermission && (
          <Dropdown
            trigger={["click"]}
            placement="bottomRight"
            menu={{
              items: [
                isDraft &&
                  !R.isNil(id) &&
                  hasSavePermission && {
                    key: "autosave",
                    label: (
                      <div
                        className="space-x-2 cursor-pointer"
                        onClick={() =>
                          setPreference("autosave", !preferences.autosave)
                        }
                      >
                        <Switch
                          loading={formState.isSubmitting}
                          size="small"
                          checked={Boolean(preferences.autosave)}
                        />
                        <span className="text-xs select-none">
                          {t("content_manager.autosave")}
                        </span>
                      </div>
                    ),
                    onClick: (e: any) => {
                      e.stopPropagation();
                    },
                  },
                hasDraftState &&
                  hasPublishPermission && {
                    key: "publish",
                    label: isDraft
                      ? t("common.publish")
                      : t("common.unpublish"),
                    icon: (
                      <FontAwesomeIcon icon={isDraft ? faNewspaper : faPen} />
                    ),
                    async onClick() {
                      try {
                        const data = isDraft
                          ? await sdk.publish(apiID, id)
                          : await sdk.unpublish(apiID, id);
                        reset(data);
                        notification.success({
                          message: t("phrases.document_status_changed"),
                          description: t(
                            isDraft
                              ? "phrases.document_published"
                              : "phrases.document_unpublished",
                          ),
                        });
                      } catch (e) {
                        notification.error({ message: "Oops" });
                      }
                    },
                  },
                { type: "divider" },
                {
                  label: t("common.delete"),
                  key: "delete",
                  icon: <FontAwesomeIcon icon={faTrashAlt} />,
                  danger: true,
                  onClick() {
                    modal.confirm({
                      title: t("phrases.are_you_sure"),
                      okText: t("common.delete"),
                      cancelText: t("common.cancel"),
                      okButtonProps: { danger: true },
                      centered: true,
                      async onOk() {
                        await sdk.deleteOne(apiID, id);
                        notification.success({
                          message: t("phrases.document_deleted"),
                        });
                        navigate(`/content-manager/${apiID}`);
                      },
                    });
                  },
                },
              ].filter(Boolean) as any,
            }}
          >
            <Button variant="ghost" size="icon">
              <FontAwesomeIcon icon={faEllipsisV} />
            </Button>
          </Dropdown>
        )}
      </div>
    </>
  );
}

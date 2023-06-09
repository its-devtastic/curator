import React, { useEffect } from "react";
import {
  Badge,
  Button,
  Dropdown,
  notification,
  Modal,
  Tooltip,
  Switch,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisV,
  faTrashAlt,
  faExternalLink,
} from "@fortawesome/free-solid-svg-icons";
import * as R from "ramda";
import { useFormikContext } from "formik";
import { useParams, useNavigate, unstable_useBlocker } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDebounce, useBeforeUnload, useKey } from "react-use";

import useStrapi from "~/hooks/useStrapi";
import useModifierKey from "~/hooks/useModifierKey";
import usePreferences from "~/hooks/usePreferences";

import { PluginOptions } from "../../types";

const Actions: React.FC<{
  options: Required<Required<PluginOptions>["edit"]>[""]["header"];
}> = ({ options }) => {
  const { t } = useTranslation();
  const params = useParams();
  const apiID = params.apiID as string;
  const navigate = useNavigate();
  const { contentTypes, sdk } = useStrapi();
  const contentType = contentTypes.find(R.whereEq({ apiID }));
  const { values, resetForm, dirty, isSubmitting, submitForm } =
    useFormikContext<any>();
  const hasDraftState = contentType?.options.draftAndPublish;
  const isDraft = hasDraftState && !values.publishedAt;
  const isSingleType = contentType?.kind === "singleType";
  const [modal, contextHolder] = Modal.useModal();
  const { preferences, setPreference } = usePreferences();
  const { state, proceed, location } = unstable_useBlocker(dirty);
  const modifierKey = useModifierKey();

  // Autosave for drafts
  useDebounce(
    () => {
      if (isDraft && preferences.autosave && dirty) {
        submitForm();
      }
    },
    3_000,
    [isDraft, preferences.autosave, dirty]
  );

  // Warn user if navigating from a dirty form
  useBeforeUnload(dirty, t("content_manager.unsaved_changes"));
  useEffect(() => {
    if (
      location &&
      state === "blocked" &&
      confirm(t("content_manager.unsaved_changes"))
    ) {
      proceed();
    }
  }, [location]);

  // Catch native save shortcut
  useKey(
    "s",
    (e) => {
      if (e[modifierKey.value]) {
        e.preventDefault();
        submitForm();
      }
    },
    {},
    [modifierKey.value]
  );

  return (
    <>
      {contextHolder}

      <div className="flex items-top gap-2">
        {hasDraftState && (
          <div>
            <Dropdown
              disabled={!values.id}
              menu={{
                items: [
                  {
                    key: 1,
                    label: isDraft
                      ? t("common.publish")
                      : t("common.unpublish"),
                    async onClick() {
                      try {
                        const data = isDraft
                          ? await sdk.publish(apiID, values.id)
                          : await sdk.unpublish(apiID, values.id);
                        resetForm({ values: data });
                        notification.success({
                          message: t("phrases.document_status_changed"),
                          description: t(
                            isDraft
                              ? "phrases.document_published"
                              : "phrases.document_unpublished"
                          ),
                        });
                      } catch (e) {
                        notification.error({ message: "Oops" });
                      }
                    },
                  },
                ],
              }}
              trigger={["click"]}
            >
              <Button type="text">
                <Badge
                  color={isDraft ? "yellow" : "green"}
                  text={isDraft ? t("common.draft") : t("common.published")}
                />
              </Button>
            </Dropdown>
          </div>
        )}

        <div className="flex flex-col items-end">
          <Button
            type="primary"
            loading={isSubmitting}
            onClick={async () => {
              await submitForm();
              notification.success({ message: t("phrases.document_saved") });
            }}
          >
            {t("common.save")}
          </Button>
          {isDraft && (
            <div
              className="space-x-2 cursor-pointer"
              onClick={() => setPreference("autosave", !preferences.autosave)}
            >
              <Switch
                loading={isSubmitting}
                size="small"
                checked={Boolean(preferences.autosave)}
              />
              <span className="text-xs select-none">
                {t("content_manager.autosave")}
              </span>
            </div>
          )}
        </div>

        {values.id && options?.getEntityUrl && (
          <Tooltip title={t("phrases.view_page")}>
            <Button
              type="text"
              onClick={() => {
                window.open(options.getEntityUrl?.(values));
              }}
              icon={<FontAwesomeIcon icon={faExternalLink} />}
            />
          </Tooltip>
        )}

        {values.id && !isSingleType && (
          <Dropdown
            trigger={["click"]}
            placement="bottomRight"
            menu={{
              items: [
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
                        await sdk.deleteOne(apiID, values.id);
                        notification.success({
                          message: t("phrases.document_deleted"),
                        });
                        navigate(`/content-manager/${apiID}`);
                      },
                    });
                  },
                },
              ],
            }}
          >
            <Button type="text" icon={<FontAwesomeIcon icon={faEllipsisV} />} />
          </Dropdown>
        )}
      </div>
    </>
  );
};

export default Actions;

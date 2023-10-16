import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { Button, Dropdown, Modal, notification, Tag } from "antd";
import * as R from "ramda";

import useStrapi from "@/hooks/useStrapi";
import Table from "@/ui/Table";

import CreateButton from "./CreateButton";

export default function Internationalization() {
  const { t, i18n } = useTranslation();
  const { locales, sdk, permissions, refresh } = useStrapi();
  const [modal, contextHolder] = Modal.useModal();
  const languageNames = useMemo(
    () => new Intl.DisplayNames([i18n.language], { type: "language" }),
    [i18n.language],
  );
  const canUpdate = permissions.some(
    R.whereEq({ action: "plugin::i18n.locale.update" }),
  );
  const canDelete = permissions.some(
    R.whereEq({ action: "plugin::i18n.locale.delete" }),
  );

  return (
    <>
      {contextHolder}
      <div className="px-4 md:px-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 my-12 pb-6 border-b border-0 border-solid border-gray-200">
          <div className="text-center lg:text-left">
            <h1 className="mt-0 mb-4 font-serif font-normal">
              {t("internationalization.title")}
            </h1>
            <div className="text-sm text-gray-600">
              {t("internationalization.description")}
            </div>
          </div>
          <CreateButton />
        </div>
        <Table
          dataSource={R.sortWith(
            [R.descend(R.prop("isDefault")), R.ascend(R.prop("name"))],
            locales,
          )}
          pagination={{
            pageSize: 10,
            hideOnSinglePage: true,
          }}
          columns={[
            {
              key: "name",
              dataIndex: "code",
              title: t("common.name"),
              render(code) {
                return (
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-sm fi fi-${
                        code.startsWith("en") ? "us" : code.split("-")[0]
                      }`}
                    />
                    {languageNames.of(code)}
                  </div>
                );
              },
            },
            {
              key: "settings",
              render({ id, isDefault }) {
                return (
                  <div className="flex justify-end">
                    {isDefault ? (
                      <Tag color="green">{t("common.default")}</Tag>
                    ) : (
                      <Dropdown
                        trigger={["click"]}
                        menu={{
                          items: [
                            canUpdate && {
                              key: "default",
                              label: t("internationalization.set_as_default"),
                              async onClick() {
                                await sdk.updateLocale(id, { isDefault: true });
                                await refresh();
                                notification.success({
                                  message: t(
                                    "internationalization.default_updated",
                                  ),
                                });
                              },
                            },
                            canUpdate && canDelete && { type: "divider" },
                            canDelete && {
                              key: "delete",
                              danger: true,
                              label: t("common.delete"),
                              async onClick() {
                                modal.confirm({
                                  title: t("phrases.are_you_sure"),
                                  content: t(
                                    "internationalization.delete_warning",
                                  ),
                                  okText: t("common.delete"),
                                  cancelText: t("common.cancel"),
                                  okButtonProps: { danger: true },
                                  centered: true,
                                  async onOk() {
                                    await sdk.deleteLocale(id);
                                    refresh();
                                    notification.success({
                                      message: t(
                                        "internationalization.deleted",
                                      ),
                                    });
                                  },
                                });
                              },
                            },
                          ].filter(Boolean) as any[],
                        }}
                      >
                        <Button
                          type="text"
                          icon={<FontAwesomeIcon icon={faEllipsisV} />}
                        />
                      </Dropdown>
                    )}
                  </div>
                );
              },
            },
          ]}
        />
      </div>
    </>
  );
}

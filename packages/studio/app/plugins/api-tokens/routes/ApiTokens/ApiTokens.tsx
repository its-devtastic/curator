import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faUnlock } from "@fortawesome/free-solid-svg-icons";
import { Button, Dropdown, Modal, notification, Tag } from "antd";
import * as R from "ramda";
import { useAsyncRetry } from "react-use";
import dayjs from "dayjs";

import { ApiToken } from "@/types/apiToken";
import useStrapi from "@/hooks/useStrapi";
import Table from "@/ui/Table";

import CreateButton from "./CreateButton";
import ApiTokenForm from "./ApiTokenForm";
import CalendarTime from "@/ui/CalendarTime";

export default function ApiTokens() {
  const { t } = useTranslation();
  const { sdk, permissions } = useStrapi();
  const [edit, setEdit] = useState<ApiToken | null>(null);
  const [modal, contextHolder] = Modal.useModal();
  const canUpdate = permissions.some(
    R.whereEq({ action: "admin::api-tokens.update" }),
  );
  const canDelete = permissions.some(
    R.whereEq({ action: "admin::api-tokens.delete" }),
  );

  const { value: items = [], retry } = useAsyncRetry(async () => {
    try {
      return await sdk.getApiTokens();
    } catch (e) {}
  }, [sdk]);

  return (
    <>
      {contextHolder}
      {edit && (
        <ApiTokenForm
          item={edit}
          onClose={() => {
            setEdit(null);
            retry();
          }}
        />
      )}
      <div className="px-4 md:px-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 my-12 pb-6 border-b border-0 border-solid border-gray-200">
          <div className="text-center lg:text-left">
            <h1 className="mt-0 mb-4">{t("api_tokens.title")}</h1>
            <div className="text-sm text-gray-600">
              {t("api_tokens.description")}
            </div>
          </div>
          <CreateButton onCreate={retry} />
        </div>
        <Table
          dataSource={items}
          rowKey="id"
          columns={[
            {
              key: "name",
              render({ type, name, description }: ApiToken) {
                return (
                  <div className="space-y-2">
                    <div>
                      <strong>{name}</strong>
                    </div>
                    <div className="text-xs text-gray-500">{description}</div>
                    <div>
                      <Tag
                        bordered={false}
                        icon={
                          <FontAwesomeIcon
                            className="text-xs mr-1.5"
                            icon={faUnlock}
                          />
                        }
                        color={
                          {
                            "read-only": "geekblue",
                            "full-access": "orange",
                            custom: "purple",
                          }[type]
                        }
                      >
                        {t(`api_tokens.${type.replaceAll("-", "_")}`)}
                      </Tag>
                    </div>
                  </div>
                );
              },
            },
            {
              key: "lastUsedAt",
              dataIndex: "lastUsedAt",
              title: t("api_tokens.last_used"),
              render(lastUsedAt) {
                return lastUsedAt ? (
                  <CalendarTime>{lastUsedAt}</CalendarTime>
                ) : (
                  t("common.never")
                );
              },
            },
            {
              key: "expiresAt",
              dataIndex: "expiresAt",
              title: t("api_tokens.expires_at"),
              render(expiresAt) {
                return expiresAt
                  ? dayjs(expiresAt).format("l LT")
                  : t("common.never");
              },
            },
            {
              key: "settings",
              render(item) {
                return (
                  <div className="flex justify-end">
                    <Dropdown
                      trigger={["click"]}
                      menu={{
                        items: [
                          canUpdate && {
                            key: "update",
                            label: t("common.update"),
                            async onClick() {
                              setEdit(item);
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
                                content: t("api_tokens.delete_warning"),
                                okText: t("common.delete"),
                                cancelText: t("common.cancel"),
                                okButtonProps: { danger: true },
                                centered: true,
                                async onOk() {
                                  await sdk.deleteApiToken(item.id);
                                  retry();
                                  notification.success({
                                    message: t("api_tokens.deleted"),
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

import { Webhook } from "@curatorjs/types";
import {
  faEllipsisV,
  faFile,
  faPhotoFilm,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dropdown, Modal, notification, Tag } from "antd";
import * as R from "ramda";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAsyncRetry } from "react-use";

import useStrapi from "@/hooks/useStrapi";
import WebhookForm from "@/plugins/webhooks/routes/Webhooks/WebhookForm";
import Table from "@/ui/Table";

export default function Webhooks() {
  const { t } = useTranslation();
  const { sdk, permissions } = useStrapi();
  const [edit, setEdit] = useState<Webhook | { id: null } | null>(null);
  const [modal, contextHolder] = Modal.useModal();
  const canUpdate = permissions.some(
    R.whereEq({ action: "admin::webhooks.update" }),
  );
  const canDelete = permissions.some(
    R.whereEq({ action: "admin::webhooks.delete" }),
  );

  const {
    value: items = [],
    loading,
    retry,
  } = useAsyncRetry(async () => {
    try {
      return await sdk.getWebhooks();
    } catch (e) {}
  }, [sdk]);

  return (
    <>
      {contextHolder}
      {edit && (
        <WebhookForm
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
            <h1 className="mt-0 mb-4 font-serif font-normal">
              {t("webhooks.title")}
            </h1>
            <div className="text-sm text-gray-600">
              {t("webhooks.description")}
            </div>
          </div>
          <Button
            type="primary"
            onClick={() => {
              setEdit({ id: null });
            }}
          >
            {t("common.create")}
          </Button>
        </div>
        <Table
          loading={loading}
          dataSource={items}
          rowKey="id"
          columns={[
            {
              key: "name",
              dataIndex: "name",
              title: t("common.name"),
              render(name) {
                return <span className="font-semibold">{name}</span>;
              },
            },
            {
              key: "url",
              dataIndex: "url",
              title: t("common.url"),
              render(url, record) {
                return (
                  <div className="space-y-2">
                    <div className="font-mono">{url}</div>
                    <div>
                      {record.events.map((event: string) => (
                        <Tag
                          key={event}
                          color="geekblue"
                          bordered={false}
                          icon={
                            <FontAwesomeIcon
                              icon={
                                event.split(".")[0] === "entry"
                                  ? faFile
                                  : faPhotoFilm
                              }
                            />
                          }
                        >
                          <span className="ml-1">{event.split(".")[1]}</span>{" "}
                        </Tag>
                      ))}
                    </div>
                  </div>
                );
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
                            key: "edit",
                            label: t("common.edit"),
                            async onClick() {
                              setEdit(item);
                            },
                          },
                          canDelete && {
                            key: "delete",
                            danger: true,
                            label: t("common.delete"),
                            async onClick() {
                              modal.confirm({
                                title: t("phrases.are_you_sure"),
                                content: t("webhooks.delete_warning"),
                                okText: t("common.delete"),
                                cancelText: t("common.cancel"),
                                okButtonProps: { danger: true },
                                centered: true,
                                async onOk() {
                                  await sdk.deleteWebhook(item.id);
                                  retry();
                                  notification.success({
                                    message: t("webhooks.deleted"),
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

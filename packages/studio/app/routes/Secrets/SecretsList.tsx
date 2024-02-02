import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { Button, Dropdown, Modal, notification, Tag, Typography } from "antd";
import * as R from "ramda";
import { useAsyncRetry } from "react-use";
import { useSearchParams } from "react-router-dom";

import { Entity } from "@curatorjs/types";
import useStrapi from "@/hooks/useStrapi";
import Table from "@/ui/Table";
import Pagination from "@/ui/Pagination";

import Form from "./Form";

export default function SecretsList() {
  const { t } = useTranslation();
  const { sdk, permissions, refresh } = useStrapi();
  const [searchParams, setSearchParams] = useSearchParams();
  const [modal, contextHolder] = Modal.useModal();
  const [form, setForm] = useState<Partial<Entity> | null>(null);

  const canUpdate = permissions.some(
    R.whereEq({
      action: "plugin::content-manager.explorer.update",
      subject: "plugin::curator.curator-secret",
    }),
  );
  const canCreate = permissions.some(
    R.whereEq({
      action: "plugin::content-manager.explorer.create",
      subject: "plugin::curator.curator-secret",
    }),
  );
  const canDelete = permissions.some(
    R.whereEq({
      action: "plugin::content-manager.explorer.delete",
      subject: "plugin::curator.curator-secret",
    }),
  );

  const { value, loading, retry } = useAsyncRetry(async () => {
    try {
      return await sdk.getMany("curator-secret", {
        page: searchParams.get("p") ? Number(searchParams.get("p")) : undefined,
      });
    } catch (e) {
      console.error(e);
    }
  }, [sdk, searchParams]);

  return (
    <>
      {contextHolder}
      {form && (
        <Form
          item={form}
          onClose={() => {
            setForm(null);
            retry();
          }}
        />
      )}
      <div className="px-4 md:px-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 my-12 pb-6 border-b border-0 border-solid border-gray-200">
          <div className="text-center lg:text-left">
            <h1 className="mt-0 mb-4 font-serif font-normal">
              {t("secrets.title")}
            </h1>
            <div className="text-sm text-gray-600">
              {t("secrets.description")}
            </div>
          </div>
          <Button type="primary" onClick={() => setForm({})}>
            {t("common.create")}
          </Button>
        </div>
        <Table
          loading={loading}
          dataSource={value?.results ?? []}
          columns={[
            {
              key: "key",
              dataIndex: "key",
              title: t("secrets.key"),
            },
            {
              key: "value",
              dataIndex: "value",
              title: t("secrets.value"),
              render(value) {
                return (
                  <Typography.Text className="font-mono" copyable>
                    {value}
                  </Typography.Text>
                );
              },
            },
            {
              key: "roles",
              dataIndex: "roles",
              title: t("secrets.roles"),
              render({ count }) {
                return t("secrets.n_roles", { count });
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
                            key: "default",
                            label: t("common.edit"),
                            async onClick() {
                              setForm(item);
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
                                okText: t("common.delete"),
                                cancelText: t("common.cancel"),
                                okButtonProps: { danger: true },
                                centered: true,
                                async onOk() {
                                  await sdk.deleteOne(
                                    "curator-secret",
                                    item.id,
                                  );
                                  retry();
                                  notification.success({
                                    message: t("secrets.deleted"),
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
        <div className="mt-4">
          <Pagination
            current={value?.pagination.page ?? 1}
            pageSize={value?.pagination.pageSize}
            total={value?.pagination.total}
            onChange={(page) =>
              setSearchParams((searchParams) => {
                searchParams.set("p", String(page));
                return searchParams;
              })
            }
          />
        </div>
      </div>
    </>
  );
}

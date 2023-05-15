import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAsyncRetry, useCopyToClipboard } from "react-use";
import { Button, Card, List, message, Tooltip, Popconfirm } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import {
  faEye,
  faEyeSlash,
  faPaperPlane,
  faRefresh,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import CalendarTime from "~/ui/CalendarTime";

import useStrapi from "~/hooks/useStrapi";

const FormSubmissionsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { sdk } = useStrapi();
  const [page, setPage] = useState(1);
  const [_, copy] = useCopyToClipboard();

  const { value, loading, retry } = useAsyncRetry(async () => {
    try {
      return await sdk.getMany("form-submission", {
        sort: "id:DESC",
        pageSize: 10,
        page,
      });
    } catch (e) {
      console.error(e);
    }
  }, [sdk, page]);

  return (
    <div className="max-w-screen-xl p-12">
      <div className="flex items-center justify-between mb-12 gap-4">
        <h1>{t("form_submissions.menu_item")}</h1>
        <Button
          loading={loading}
          icon={<FontAwesomeIcon icon={faRefresh} />}
          onClick={retry}
        />
      </div>
      <Card>
        <List
          itemLayout="vertical"
          dataSource={value?.results ?? []}
          renderItem={(item: any) => (
            <List.Item
              className={classNames({ "bg-emerald-50": !item.read })}
              extra={
                <div className="text-xs text-slate-500">
                  <CalendarTime>{item.createdAt}</CalendarTime>
                </div>
              }
              actions={[
                <Tooltip
                  key="send_email"
                  title={t("form_submissions.send_email")}
                >
                  <Button
                    icon={<FontAwesomeIcon icon={faPaperPlane} />}
                    size="small"
                    type="text"
                    onClick={() => open(`mailto:${item.email}`, "_self")}
                  />
                </Tooltip>,
                <Tooltip
                  key="read"
                  title={t(
                    `form_submissions.${
                      item.read ? "mark_as_unread" : "mark_as_read"
                    }`
                  )}
                >
                  <Button
                    icon={
                      <FontAwesomeIcon icon={item.read ? faEyeSlash : faEye} />
                    }
                    size="small"
                    type="text"
                    onClick={async () => {
                      await sdk.save("form-submission", {
                        id: item.id,
                        read: !item.read,
                      });
                      retry();
                    }}
                  />
                </Tooltip>,
                <Popconfirm
                  title={t("form_submissions.confirm_delete")}
                  onConfirm={async () => {
                    await sdk.deleteOne("form-submission", item.id);
                    retry();
                  }}
                  okType="danger"
                  cancelText={t("common.cancel")}
                  okText={t("common.delete")}
                >
                  <Button
                    key="delete"
                    icon={<FontAwesomeIcon icon={faTrashAlt} />}
                    size="small"
                    type="text"
                    danger
                  />
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                title={item.name}
                description={
                  <span
                    className="cursor-pointer"
                    onClick={() => {
                      copy(item.email);
                      message.success(t("form_submissions.email_copied"));
                    }}
                  >
                    {item.email}
                  </span>
                }
              />
              {item.message}
            </List.Item>
          )}
          pagination={{
            pageSize: value?.pagination.pageSize,
            current: value?.pagination.page,
            total: value?.pagination.total,
            onChange: (page) => setPage(page),
          }}
        />
      </Card>
    </div>
  );
};

export default FormSubmissionsScreen;

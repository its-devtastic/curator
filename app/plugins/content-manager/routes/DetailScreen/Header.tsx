import React from "react";
import { Badge, Button, Dropdown, notification } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisV,
  faTrashAlt,
  faExternalLink,
} from "@fortawesome/free-solid-svg-icons";
import * as R from "ramda";
import { useFormikContext } from "formik";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import useStrapi from "~/hooks/useStrapi";
import useStrapion from "~/hooks/useStrapion";
import CalendarTime from "~/ui/CalendarTime";

import LanguageSwitcher from "./LanguageSwitcher";

const Header: React.FC = () => {
  const { t } = useTranslation();
  const params = useParams();
  const apiID = params.apiID as string;
  const navigate = useNavigate();
  const { contentTypes, sdk } = useStrapi();
  const config = useStrapion();
  const contentType = contentTypes.find(R.whereEq({ apiID }));
  const { values, resetForm, dirty, isSubmitting, submitForm } =
    useFormikContext<any>();
  const contentTypeConfig = config.contentTypes.find(R.whereEq({ apiID }));
  const hasDraftState = contentType?.options.draftAndPublish;
  const isSingleType = contentType?.kind === "singleType";

  return (
    <div className="mb-12 flex flex-col md:flex-row gap-6 items-center justify-between">
      <LanguageSwitcher />

      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-4 justify-center w-full md:w-auto">
          <div>
            {hasDraftState && (
              <div>
                <Dropdown
                  disabled={!values.id}
                  menu={{
                    items: [
                      {
                        key: 1,
                        label: values.publishedAt
                          ? t("common.unpublish")
                          : t("common.publish"),
                        async onClick() {
                          const isDraft = !values.publishedAt;
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
                      color={values.publishedAt ? "green" : "yellow"}
                      text={
                        values.publishedAt
                          ? t("common.published")
                          : t("common.draft")
                      }
                    />
                  </Button>
                </Dropdown>
              </div>
            )}
          </div>
          <Button
            type="primary"
            disabled={!dirty}
            loading={isSubmitting}
            onClick={() => submitForm()}
          >
            {t("common.save")}
          </Button>
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
                    async onClick() {
                      await sdk.deleteOne(apiID, values.id);
                      notification.success({
                        message: t("phrases.document_deleted"),
                      });
                      navigate(`/content-manager/${apiID}`);
                    },
                  },
                ],
              }}
            >
              <Button
                type="text"
                icon={<FontAwesomeIcon icon={faEllipsisV} />}
              />
            </Dropdown>
          )}
        </div>
        <span className="text-xs text-center mt-2 md:mt-0 md:text-right">
          {values.updatedAt && (
            <span className="text-gray-400 space-x-1">
              <span>{t("phrases.last_updated_at")}</span>
              <CalendarTime>{values.updatedAt}</CalendarTime>
              {values.updatedBy && (
                <>
                  <span>{t("common.by").toLowerCase()}</span>
                  <span className="inline-flex items-center gap-2">
                    {`${
                      [values.updatedBy.firstname, values.updatedBy.lastname]
                        .filter(Boolean)
                        .join(" ")
                        .trim() || values.updatedBy.username
                    }.`}
                  </span>
                </>
              )}
            </span>
          )}
          {values.id && contentTypeConfig?.buildUrl && (
            <a
              className="text-blue-500 space-x-1 ml-1"
              href={contentTypeConfig?.buildUrl(values)}
              target="_blank"
              rel="noreferrer nofollow noopener"
            >
              <span>{t("phrases.view_page")}</span>
              <FontAwesomeIcon icon={faExternalLink} />
            </a>
          )}
        </span>
      </div>
    </div>
  );
};

export default Header;

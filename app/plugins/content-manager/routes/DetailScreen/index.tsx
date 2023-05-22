import React from "react";
import { Card, notification } from "antd";
import * as R from "ramda";
import { useAsync } from "react-use";
import { Formik } from "formik";
import {
  useParams,
  useNavigate,
  useSearchParams,
  Link,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import { FieldDefinition } from "~/types/contentTypeConfig";
import useSecrets from "~/hooks/useSecrets";
import useStrapi from "~/hooks/useStrapi";
import useStrapion from "~/hooks/useStrapion";

import Spinner from "~/ui/Spinner";
import FieldRenderer from "../../ui/FieldRenderer";

import Header from "./Header";

const DetailScreen: React.FC = () => {
  const { t } = useTranslation();
  const params = useParams();
  const apiID = params.apiID as string;
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const config = useStrapion();
  const { contentTypes, sdk, locales } = useStrapi();
  const { getSecret } = useSecrets();

  const contentType = contentTypes.find(R.whereEq({ apiID }));
  const contentTypeConfig = config.contentTypes.find(R.whereEq({ apiID }));
  const hasDraftState = contentType?.options.draftAndPublish;
  const isSingleType = contentType?.kind === "singleType";
  const locale = search.get("locale");

  const { value, loading } = useAsync(async () => {
    const defaultLocale =
      locale ?? locales.find(R.whereEq({ isDefault: true }))?.code;

    if (params.id === "create") {
      await new Promise((resolve) => setTimeout(resolve, 0));
      return {
        locale: defaultLocale,
      };
    }

    try {
      return await sdk.getOne<any>(
        apiID,
        isSingleType ? undefined : Number(params.id),
        { params: { locale: defaultLocale } }
      );
    } catch (e: any) {
      if (e.response.status === 404) {
        if (isSingleType) {
          return { locale: defaultLocale };
        }
        navigate(`/content-manager/${apiID}`);
      }
    }
  }, [sdk, apiID, params.id, locale]);

  return (
    <div className="px-4 md:px-12">
      <div className="py-4 border-b border-0 border-dashed border-slate-200 flex justify-between items-center">
        <div className="flex-1">
          {!isSingleType && (
            <Link
              to={`/content-manager/${apiID}`}
              className="text-blue-600 no-underline text-sm space-x-2"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>{t("common.back")}</span>
            </Link>
          )}
        </div>
        <h1 className="m-0 text-right lg:text-center flex-1 text-lg font-semibold text-gray-700">
          {`${t("common.edit")} ${t(contentTypeConfig?.name ?? "", {
            ns: "custom",
          }).toLowerCase()}`}
        </h1>
        <div className="flex-1 hidden lg:block" />
      </div>
      {contentTypeConfig && contentType && value && !loading ? (
        <Formik
          initialValues={value}
          onSubmit={async (values, { resetForm }) => {
            try {
              const data = await sdk.save(apiID, values, {
                params: { "plugins[i18n][locale]": values.locale },
              });
              resetForm({ values: data });

              if (config.hooks?.save) {
                config.hooks.save(apiID, data, { getSecret });
              }

              notification.success({ message: t("phrases.document_saved") });
              if (params.id === "create") {
                navigate(`/content-manager/${apiID}/${data.id}`);
              }
            } catch (e) {
              notification.error({ message: "Oops" });
            }
          }}
        >
          {({ values }) => {
            const { side, main } = contentTypeConfig.fields ?? {};

            return (
              <div
                className={classNames("my-6 mx-auto rounded-xl", {
                  "bg-amber-50": hasDraftState && !values.publishedAt,
                })}
              >
                <Header />

                <div className="flex flex-col md:items-start md:flex-row justify-between gap-8">
                  {side && (
                    <Card className="flex-none lg:w-[400px] border-gray-200 overflow-hidden">
                      <div className="space-y-6">
                        {side.map((field: FieldDefinition) => (
                          <FieldRenderer
                            key={field.path}
                            field={field}
                            contentType={contentType}
                          />
                        ))}
                      </div>
                    </Card>
                  )}
                  {main && (
                    <Card className="flex-1 border-gray-200 shadow-sm">
                      <div className="space-y-6">
                        {main.map((field: FieldDefinition) => (
                          <FieldRenderer
                            key={field.path}
                            field={field}
                            contentType={contentType}
                          />
                        ))}
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            );
          }}
        </Formik>
      ) : (
        <div className="flex items-center justify-center p-12">
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default DetailScreen;

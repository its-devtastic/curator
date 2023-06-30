import React from "react";
import { notification } from "antd";
import * as R from "ramda";
import { useAsync } from "react-use";
import { Formik } from "formik";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import classNames from "classnames";

import useSecrets from "~/hooks/useSecrets";
import useStrapi from "~/hooks/useStrapi";
import useCurator from "~/hooks/useCurator";
import Spinner from "~/ui/Spinner";

import { PluginOptions } from "../../types";

import Header from "./Header";
import Main from "./Main";

const DetailScreen: React.FC<DetailScreenProps> = ({ pluginOptions }) => {
  const { t } = useTranslation();
  const params = useParams();
  const apiID = params.apiID as string;
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const config = useCurator();
  const { contentTypes, sdk, locales } = useStrapi();
  const { getSecret } = useSecrets();

  const contentType = contentTypes.find(R.whereEq({ apiID }));
  const contentTypeConfig = config.contentTypes?.find(R.whereEq({ apiID }));
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
      const data = await sdk.getOne<any>(
        apiID,
        isSingleType ? undefined : Number(params.id),
        { params: { locale: defaultLocale } }
      );
      const hooks = config.hooks?.filter(R.whereEq({ trigger: "view" })) ?? [];

      for (const hook of hooks) {
        hook.action(apiID, data, { getSecret });
      }

      return data;
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
      {contentTypeConfig && contentType && value && !loading ? (
        <Formik
          initialValues={value}
          onSubmit={async (values, { resetForm }) => {
            try {
              const data = await sdk.save(apiID, values, {
                params: { "plugins[i18n][locale]": values.locale },
              });
              const hooks =
                config.hooks?.filter(R.whereEq({ trigger: "save" })) ?? [];
              resetForm({ values: data });

              for (const hook of hooks) {
                hook.action(apiID, data, { getSecret });
              }

              if (params.id === "create") {
                navigate(`/content-manager/${apiID}/${data.id}`);
              }
            } catch (e) {
              notification.error({ message: "Oops" });
            }
          }}
        >
          {({ values }) => {
            return (
              <div>
                <Header
                  apiID={apiID}
                  contentTypeConfig={contentTypeConfig}
                  contentType={contentType}
                  pluginOptions={pluginOptions}
                />
                <div
                  className={classNames(
                    "my-6 p-4 mx-auto rounded-xl",
                    hasDraftState && !values.publishedAt
                      ? "bg-amber-50 border-2 border-dashed border-amber-100"
                      : "bg-gray-50"
                  )}
                >
                  <Main
                    contentType={contentType}
                    contentTypeConfig={contentTypeConfig}
                    apiID={apiID}
                    pluginOptions={pluginOptions}
                  />
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

interface DetailScreenProps {
  pluginOptions?: PluginOptions["edit"];
}

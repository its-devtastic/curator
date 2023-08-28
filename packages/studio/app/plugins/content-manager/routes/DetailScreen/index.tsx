import React, { useState } from "react";
import { notification } from "antd";
import * as R from "ramda";
import { useAsync } from "react-use";
import { Formik } from "formik";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";

import { Entity } from "@/types/content";
import useSecrets from "@/hooks/useSecrets";
import useStrapi from "@/hooks/useStrapi";
import useCurator from "@/hooks/useCurator";
import Spinner from "@/ui/Spinner";

import Header from "./Header";
import Main from "./Main";
import DraftBanner from "./DraftBanner";

const DetailScreen: React.FC = () => {
  const params = useParams();
  const apiID = params.apiID as string;
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const config = useCurator();
  const { contentTypes, sdk, locales } = useStrapi();
  const { getSecret } = useSecrets();
  const [document, setDocument] = useState<Omit<Entity, "id"> | null>(null);

  const contentType = contentTypes.find(R.whereEq({ apiID }));
  const contentTypeConfig = config.contentTypes?.find(R.whereEq({ apiID }));
  const hasDraftState = contentType?.options.draftAndPublish;
  const isSingleType = contentType?.kind === "singleType";
  const locale = search.get("locale");

  const { loading } = useAsync(async () => {
    const defaultLocale =
      locale ?? locales.find(R.whereEq({ isDefault: true }))?.code;

    if (params.id === "create") {
      await new Promise((resolve) => setTimeout(resolve, 0));
      setDocument({ locale: defaultLocale });
      return;
    }

    try {
      const data = await sdk.getOne<any>(
        apiID,
        isSingleType ? undefined : Number(params.id),
        { params: { locale: defaultLocale } }
      );
      const hooks = config.hooks?.filter(R.whereEq({ trigger: "view" })) ?? [];

      for (const hook of hooks) {
        hook.action({ getSecret, apiID, entity: data });
      }

      setDocument(data);
    } catch (e: any) {
      if (e.response.status === 404) {
        if (isSingleType) {
          return { locale: defaultLocale };
        }
        navigate(`/content-manager/${apiID}`);
      }
    }
  }, [sdk, apiID, params.id, locale]);

  return contentTypeConfig && contentType && document && !loading ? (
    <Formik
      initialValues={document}
      onSubmit={(values, { resetForm, setSubmitting }) => {
        // Running an async inside a sync function avoids Formik automatically
        // setting the isSubmitting state.
        (async () => {
          try {
            // We have to immediately reset the form to avoid loosing changes
            // made during the save.
            resetForm({
              values,
            });
            setSubmitting(true);
            const data = await sdk.save(apiID, values, {
              params: { "plugins[i18n][locale]": values.locale },
            });
            setDocument(data);
            const hooks =
              config.hooks?.filter(
                R.whereEq({
                  trigger: params.id === "create" ? "create" : "save",
                })
              ) ?? [];

            for (const hook of hooks) {
              hook.action({ getSecret, apiID, entity: data });
            }

            if (params.id === "create") {
              navigate(`/content-manager/${apiID}/${data.id}`);
            }
          } catch (e) {
            notification.error({ message: "Oops" });
          } finally {
            setSubmitting(false);
          }
        })();
      }}
    >
      {({ values }) => {
        return (
          <div>
            <DraftBanner />
            <div className="px-4 pb-4 lg:px-12 mx-auto max-w-screen-xl space-y-12">
              <Header
                contentTypeConfig={contentTypeConfig}
                document={document}
              />
              <Main
                contentType={contentType}
                contentTypeConfig={contentTypeConfig}
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
  );
};

export default DetailScreen;

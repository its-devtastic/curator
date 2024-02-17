import { Entity } from "@curatorjs/types";
import { Form, Spinner } from "@curatorjs/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { notification } from "antd";
import * as R from "ramda";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  useBlocker,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useAsync, useBeforeUnload, useDebounce, useKey } from "react-use";
import { z } from "zod";

import useContentPermission from "@/hooks/useContentPermission";
import useCurator from "@/hooks/useCurator";
import useModifierKey from "@/hooks/useModifierKey";
import usePreferences from "@/hooks/usePreferences";
import useSecrets from "@/hooks/useSecrets";
import useStrapi from "@/hooks/useStrapi";

import DraftBanner from "./DraftBanner";
import Header from "./Header";
import Main from "./Main";
import Side from "./Side";

export function DetailScreen() {
  const { t } = useTranslation();
  const params = useParams();
  const apiID = params.apiID as string;
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const modifierKey = useModifierKey();
  const config = useCurator();
  const hasPermission = useContentPermission();
  const { contentTypes, sdk, locales } = useStrapi();
  const { getSecret } = useSecrets();
  const { preferences } = usePreferences();
  const [document, setDocument] = useState<Omit<Entity, "id"> | null>(null);
  const hasCreatePermission = hasPermission("create", apiID);
  const hasUpdatePermission = hasPermission("update", apiID);
  const hasSavePermission =
    (!params.id && hasCreatePermission) || (params.id && hasUpdatePermission);

  const contentType = contentTypes.find(R.whereEq({ apiID }));
  const contentTypeConfig = config.contentTypes?.find(R.whereEq({ apiID }));
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
        { params: { locale: defaultLocale } },
      );

      const hooks = config.hooks?.filter(R.whereEq({ trigger: "view" })) ?? [];

      for (const hook of hooks) {
        try {
          hook.action({ getSecret, apiID, entity: data });
        } catch (e) {
          console.warn(e);
        }
      }

      setDocument(data);
    } catch (e: any) {
      console.error(e);
      if (e.response.status === 404) {
        if (isSingleType) {
          return setDocument({ locale: defaultLocale });
        }
        navigate(`/content-manager/${apiID}`);
      }
    }
  }, [sdk, apiID, params.id, locale]);

  const formSchema = z.any();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: document,
  });
  const onSubmit = async (values: any) => {
    try {
      const data = await sdk.save(apiID, values, {
        params: { "plugins[i18n][locale]": values.locale },
      });
      setDocument(data);
      const hooks =
        config.hooks?.filter(
          R.whereEq({
            trigger: params.id === "create" ? "create" : "save",
          }),
        ) ?? [];

      for (const hook of hooks) {
        hook.action({ getSecret, apiID, entity: data });
      }

      if (params.id === "create") {
        navigate(`/content-manager/${apiID}/${data.id}`);
      }
    } catch (e) {
      notification.error({ message: "Oops" });
    }
  };
  const hasDraftState = contentType?.options.draftAndPublish;
  const isDraft = hasDraftState && !form.getValues("publishedAt");
  const blocker = useBlocker(!R.isNil(params.id) && form.formState.isDirty);

  /*
   * Autosave for drafts.
   */
  useDebounce(
    () => {
      if (
        hasUpdatePermission &&
        form.watch("id") &&
        isDraft &&
        preferences.autosave &&
        form.formState.isDirty
      ) {
        form.handleSubmit(onSubmit);
      }
    },
    3_000,
    [form, isDraft, preferences.autosave],
  );
  /*
   * Catch native save shortcut.
   */
  useKey(
    "s",
    (e) => {
      if (e[modifierKey.value] && hasSavePermission) {
        e.preventDefault();
        form.handleSubmit(onSubmit);
      }
    },
    {},
    [modifierKey.value],
  );
  /*
   * Warn user if navigating from a dirty form.
   */
  useBeforeUnload(
    !R.isNil(params.id) && form.formState.isDirty,
    t("content_manager.unsaved_changes"),
  );
  useEffect(() => {
    if (
      location &&
      blocker.state === "blocked" &&
      confirm(t("content_manager.unsaved_changes"))
    ) {
      blocker.proceed();
    }
  }, [location, blocker.state]);

  return contentTypeConfig && contentType && document && !loading ? (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col flex-1"
      >
        <DraftBanner />
        <Header contentTypeConfig={contentTypeConfig} document={document} />
        <div className="flex flex-col md:flex-row flex-1">
          <Main
            contentType={contentType}
            contentTypeConfig={contentTypeConfig}
          />
          <Side contentType={contentType} />
        </div>
      </form>
    </Form>
  ) : (
    <div className="flex items-center justify-center p-12">
      <Spinner />
    </div>
  );
}

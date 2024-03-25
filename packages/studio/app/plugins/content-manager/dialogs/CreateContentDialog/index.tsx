import { Entity } from "@curatorjs/types";
import {
  cn,
  Dialog,
  DialogHeader,
  DialogTitle,
  Form,
  useToast,
} from "@curatorjs/ui";
import * as R from "ramda";
import React from "react";
import { useTranslation } from "react-i18next";

import useCurator from "@/hooks/useCurator";
import useSecrets from "@/hooks/useSecrets";
import useStrapi from "@/hooks/useStrapi";

import { usePluginOptions } from "../../hooks";
import FieldRenderer from "../../ui/FieldRenderer";

export default function CreateContentDialog({
  apiID,
  onCreate,
  onCancel,
}: CreateContentDialogProps) {
  const { t } = useTranslation();
  const config = useCurator();
  const { toast } = useToast();
  const { contentTypes, sdk } = useStrapi();
  const contentTypeConfig = config.contentTypes?.find(R.whereEq({ apiID }));
  const contentType = contentTypes.find(R.whereEq({ apiID }));
  const pluginOptions = usePluginOptions(
    (state) => state.options.contentTypes?.[apiID],
  );
  const { getSecret } = useSecrets();

  const onSubmit = async (values) => {
    try {
      const data = await sdk.save(apiID, values, {
        params: { "plugins[i18n][locale]": values.locale },
      });
      const hooks =
        config.hooks?.filter(R.whereEq({ trigger: "create" })) ?? [];

      for (const hook of hooks) {
        hook.action(apiID, data, { getSecret });
      }

      onCreate?.(data);
    } catch (e) {
      toast({ title: "Oops" });
    }
  };

  return contentTypeConfig && contentType ? (
    <Form>
      <Dialog>
        <DialogHeader>
          <DialogTitle>
            {`${t("phrases.create_new")} ${t(
              contentTypeConfig.name ?? contentType.info.displayName,
              {
                ns: "custom",
              },
            ).toLowerCase()}`}
          </DialogTitle>
        </DialogHeader>
        <div className="py-12 grid grid-cols-12 gap-6">
          {pluginOptions?.create?.main?.map((field) => (
            <div
              key={field.path}
              className={cn(`col-span-12 lg:col-span-${field.span ?? 12}`)}
            >
              <FieldRenderer
                apiID={apiID}
                field={
                  contentTypeConfig.fields.find(
                    R.whereEq({ path: field.path }),
                  )!
                }
                attribute={contentType.attributes[field.path]}
              />
            </div>
          ))}
        </div>
      </Dialog>
    </Form>
  ) : null;
}

interface CreateContentDialogProps {
  apiID: string;
  onCreate?(document: Entity): void;
  onCancel?: VoidFunction;
}

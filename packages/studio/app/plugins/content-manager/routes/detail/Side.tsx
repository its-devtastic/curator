import { ContentTypeConfig, StrapiContentType } from "@curatorjs/types";
import * as R from "ramda";
import React from "react";
import { useParams } from "react-router-dom";

import { usePluginOptions } from "@/plugins/content-manager/hooks";
import FieldRenderer from "@/plugins/content-manager/ui/FieldRenderer";

import LanguageSwitcher from "./LanguageSwitcher";

export default function Side({
  contentType,
  contentTypeConfig,
}: {
  contentType: StrapiContentType;
  contentTypeConfig: ContentTypeConfig;
}) {
  const { apiID = "" } = useParams();
  const blocks = usePluginOptions(
    (state) => (apiID && state.options.contentTypes?.[apiID]?.edit?.side) || [],
  );

  return (
    <section className="flex-none w-full md:w-64 bg-muted/50 h-full px-4 py-6">
      <div className="space-y-6">
        {contentType?.pluginOptions.i18n?.localized && <LanguageSwitcher />}
        {blocks.map(({ fields }, idx) => (
          <div key={idx}>
            {fields.map((field) => (
              <div key={field.path}>
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
        ))}
      </div>
    </section>
  );
}

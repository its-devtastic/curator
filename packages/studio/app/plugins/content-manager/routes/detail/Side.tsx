import { StrapiContentType } from "@curatorjs/types";
import React from "react";

import LanguageSwitcher from "./LanguageSwitcher";

export default function Side({
  contentType,
}: {
  contentType: StrapiContentType;
}) {
  return (
    <section className="flex-none w-full md:w-64 bg-muted/50 border-l h-full px-4 py-6">
      {contentType?.pluginOptions.i18n?.localized && <LanguageSwitcher />}
    </section>
  );
}

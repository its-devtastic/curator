import React from "react";

import { StrapiContentType } from "@/types/contentType";

import LanguageSwitcher from "./LanguageSwitcher";

const Top: React.FC<TopProps> = ({ contentType }) => {
  return (
    <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
      <div />
      {contentType.pluginOptions.i18n?.localized && <LanguageSwitcher />}
    </div>
  );
};

interface TopProps {
  contentType: StrapiContentType;
}
export default Top;

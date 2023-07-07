import React from "react";
import { Card } from "antd";
import * as R from "ramda";

import { StrapiContentType } from "~/types/contentType";
import { ContentTypeConfig } from "~/types/contentTypeConfig";

import FieldRenderer from "../../ui/FieldRenderer";
import { PluginOptions } from "../../types";
import Top from "./Top";

const Main: React.FC<MainProps> = ({
  pluginOptions,
  contentType,
  contentTypeConfig,
}) => {
  const { side, main } = pluginOptions.edit ?? {};

  return (
    <div className="space-y-6">
      <Top contentType={contentType} />

      <div className="flex flex-col lg:items-start lg:flex-row justify-between gap-8">
        {side && (
          <Card className="flex-none lg:w-[400px] border-gray-200 overflow-hidden">
            <div className="space-y-6">
              {side.map((field) => (
                <FieldRenderer
                  key={field.path}
                  field={
                    contentTypeConfig.fields.find(
                      R.whereEq({ path: field.path })
                    )!
                  }
                  attribute={contentType.attributes[field.path]}
                />
              ))}
            </div>
          </Card>
        )}
        {main && (
          <Card className="flex-1 border-gray-200 shadow-sm">
            <div className="space-y-6">
              {main.map((field) => (
                <FieldRenderer
                  key={field.path}
                  field={
                    contentTypeConfig.fields.find(
                      R.whereEq({ path: field.path })
                    )!
                  }
                  attribute={contentType.attributes[field.path]}
                />
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Main;

interface MainProps {
  pluginOptions: NonNullable<PluginOptions["contentTypes"]>[""];
  contentType: StrapiContentType;
  contentTypeConfig: ContentTypeConfig;
}

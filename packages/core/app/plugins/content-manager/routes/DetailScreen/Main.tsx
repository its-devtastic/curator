import React from "react";
import { Card } from "antd";
import * as R from "ramda";
import { useParams } from "react-router-dom";

import { StrapiContentType } from "~/types/contentType";
import { ContentTypeConfig } from "~/types/contentTypeConfig";

import FieldRenderer from "../../ui/FieldRenderer";
import { usePluginOptions } from "../../hooks";
import Top from "./Top";

const Main: React.FC<MainProps> = ({ contentType, contentTypeConfig }) => {
  const { apiID = "" } = useParams();
  const { side, main } = usePluginOptions(
    (state) => (apiID && state.options.contentTypes?.[apiID]?.edit) || {}
  );

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
                  apiID={apiID}
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
                  apiID={apiID}
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
  contentType: StrapiContentType;
  contentTypeConfig: ContentTypeConfig;
}

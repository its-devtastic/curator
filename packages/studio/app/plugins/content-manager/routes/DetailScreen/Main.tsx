import { ContentTypeConfig, StrapiContentType } from "@curatorjs/types";
import classNames from "classnames";
import * as R from "ramda";
import React from "react";
import { useParams } from "react-router-dom";

import { usePluginOptions } from "../../hooks";
import FieldRenderer from "../../ui/FieldRenderer";
import Top from "./Top";

const Main: React.FC<MainProps> = ({ contentType, contentTypeConfig }) => {
  const { apiID = "" } = useParams();
  const blocks = usePluginOptions(
    (state) => (apiID && state.options.contentTypes?.[apiID]?.edit) || [],
  );

  return (
    <div className="space-y-6">
      <Top contentType={contentType} />

      <div className="grid grid-cols-12 gap-8">
        {blocks.map(({ fields, span = 12 }, idx) => (
          <div
            key={idx}
            className={classNames(
              `shadow-sm p-4 md:p-8 rounded-lg border border-solid border-gray-200 col-span-12 lg:col-span-${span}`,
            )}
          >
            <div className="grid grid-cols-12 gap-x-4 gap-y-6">
              {fields.map((field) => (
                <div
                  key={field.path}
                  className={classNames(
                    `col-span-12 lg:col-span-${field.span ?? 12}`,
                  )}
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Main;

interface MainProps {
  contentType: StrapiContentType;
  contentTypeConfig: ContentTypeConfig;
}

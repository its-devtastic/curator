import { ContentTypeConfig, StrapiContentType } from "@curatorjs/types";
import { Card } from "@curatorjs/ui";
import classNames from "classnames";
import * as R from "ramda";
import React from "react";
import { useParams } from "react-router-dom";

import { usePluginOptions } from "../../hooks";
import FieldRenderer from "../../ui/FieldRenderer";

const Main: React.FC<MainProps> = ({ contentType, contentTypeConfig }) => {
  const { apiID = "" } = useParams();
  const blocks = usePluginOptions(
    (state) => (apiID && state.options.contentTypes?.[apiID]?.edit?.main) || [],
  );

  return (
    <div className="gap-8 flex-1 p-6 bg-muted/50">
      <Card className="min-h-full grid grid-cols-12 gap-4 p-8">
        {blocks.map(({ fields, span = 12 }, idx) => (
          <div
            key={idx}
            className={classNames(`col-span-12 lg:col-span-${span}`)}
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
      </Card>
    </div>
  );
};

export default Main;

interface MainProps {
  contentType: StrapiContentType;
  contentTypeConfig: ContentTypeConfig;
}

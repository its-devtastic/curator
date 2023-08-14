import React from "react";
import { Card } from "antd";
import * as R from "ramda";
import { useParams } from "react-router-dom";
import classNames from "classnames";

import { StrapiContentType } from "~/types/contentType";
import { ContentTypeConfig } from "~/types/contentTypeConfig";

import FieldRenderer from "../../ui/FieldRenderer";
import { usePluginOptions } from "../../hooks";
import Top from "./Top";

const Main: React.FC<MainProps> = ({ contentType, contentTypeConfig }) => {
  const { apiID = "" } = useParams();
  const blocks = usePluginOptions(
    (state) => (apiID && state.options.contentTypes?.[apiID]?.edit) || []
  );

  return (
    <div className="space-y-6">
      <Top contentType={contentType} />

      <div className="grid grid-cols-12 gap-8">
        {blocks.map(({ fields, span = 12 }, idx) => (
          <Card
            key={idx}
            className={classNames(`col-span-12 lg:col-span-${span}`)}
          >
            <div className="grid grid-cols-12 gap-4">
              {fields.map((field) => (
                <div
                  key={field.path}
                  className={classNames(
                    `col-span-12 lg:col-span-${field.span ?? 12}`
                  )}
                >
                  <FieldRenderer
                    apiID={apiID}
                    field={
                      contentTypeConfig.fields.find(
                        R.whereEq({ path: field.path })
                      )!
                    }
                    attribute={contentType.attributes[field.path]}
                  />
                </div>
              ))}
            </div>
          </Card>
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

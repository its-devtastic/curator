import { Button, useFormContext } from "@curatorjs/ui";
import { notification } from "antd";
import * as R from "ramda";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import useContentPermission from "@/hooks/useContentPermission";
import useStrapi from "@/hooks/useStrapi";

const DraftBanner: React.FC = () => {
  const { t } = useTranslation();
  const params = useParams();
  const hasPermission = useContentPermission();
  const apiID = params.apiID as string;
  const { contentTypes, sdk } = useStrapi();
  const contentType = contentTypes.find(R.whereEq({ apiID }));
  const { getValues, reset } = useFormContext<any>();
  const hasDraftState = contentType?.options.draftAndPublish;
  const isDraft = hasDraftState && !getValues("publishedAt");

  // Check permissions
  const hasPublishPermission = hasPermission("publish", apiID);

  const publish = useCallback(async () => {
    try {
      const data = await sdk.publish(apiID, getValues("id"));
      reset(data);
      notification.success({
        message: t("phrases.document_status_changed"),
        description: t(
          isDraft
            ? "phrases.document_published"
            : "phrases.document_unpublished",
        ),
      });
    } catch (e) {
      notification.error({ message: "Oops" });
    }
  }, [apiID, getValues("id")]);

  return hasPublishPermission && isDraft ? (
    <div className="flex items-center justify-center p-1 gap-3 bg-yellow-100 border-b border-b">
      <span className="text-xs font-semibold text-yellow-600 select-none">
        {t("content_manager.you_are_editing_a_draft")}
      </span>
      <Button
        size="sm"
        variant="outline"
        className="bg-yellow-50"
        onClick={publish}
      >
        {t("content_manager.publish_now")}
      </Button>
    </div>
  ) : null;
};

export default DraftBanner;

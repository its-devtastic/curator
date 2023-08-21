import React, { useCallback, useRef, useState } from "react";
import { useDrop } from "react-use";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUpload } from "@fortawesome/free-solid-svg-icons";

import useStrapi from "@/hooks/useStrapi";
import { MediaItem } from "@/types/media";

const UploadButton: React.FC<{
  button: React.ReactElement<{ onClick: VoidFunction; loading?: boolean }>;
  onUploadComplete?(item: MediaItem[]): void;
  folder?: number | null;
}> = ({ button, onUploadComplete, folder }) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const { sdk } = useStrapi();
  const [loading, setLoading] = useState(false);
  const { over } = useDrop({
    onFiles: (files) => uploadFiles(files),
  });

  const uploadFiles = useCallback(
    async (files: File[]) => {
      setLoading(true);
      try {
        for (const file of files) {
          const data = await sdk.upload(file, folder);
          onUploadComplete?.(data);
        }
      } finally {
        setLoading(false);
      }
    },
    [folder]
  );

  return (
    <>
      {over && (
        <div className="fixed top-0 left-0 right-0 bottom-0 z-50 bg-indigo-500/20 p-4">
          <div className="flex flex-col gap-4 items-center justify-center text-indigo-600 text-lg font-semibold h-full border-2 border-dashed border-indigo-500/40 rounded-lg">
            <FontAwesomeIcon
              icon={faCloudUpload}
              className="text-3xl animate-bounce"
            />
            <div>{t("media_library.upload")}</div>
          </div>
        </div>
      )}
      {React.cloneElement(button, {
        onClick: () => inputRef.current?.click(),
        loading,
      })}
      <input
        type="file"
        hidden
        className="hidden"
        ref={inputRef}
        onChange={async (e) => {
          if (e.target.files) {
            await uploadFiles(Array.from(e.target.files));
          }
        }}
      />
    </>
  );
};

export default UploadButton;

import React, { useRef, useState } from "react";

import useStrapi from "~/hooks/useStrapi";
import { MediaItem } from "~/types/media";

const UploadButton: React.FC<{
  button: React.ReactElement<{ onClick: VoidFunction; loading?: boolean }>;
  onUploadComplete?(item: MediaItem[]): void;
}> = ({ button, onUploadComplete }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { sdk } = useStrapi();
  const [loading, setLoading] = useState(false);

  return (
    <>
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
            setLoading(true);
            try {
              for (const file of e.target.files) {
                const data = await sdk.upload(file);
                onUploadComplete?.(data);
              }
            } finally {
              setLoading(false);
            }
          }
        }}
      />
    </>
  );
};

export default UploadButton;

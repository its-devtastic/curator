import { MediaFolderStructure } from "@curatorjs/types";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@curatorjs/ui";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as R from "ramda";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAsync } from "react-use";

import useStrapi from "@/hooks/useStrapi";

export default function FolderSelect({
  value,
  onChange,
}: {
  value?: number | null;
  onChange?(value: number | null): void;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { sdk } = useStrapi();
  const { value: folders = [] } = useAsync(async () => {
    return await sdk.getFolderStructure();
  }, []);

  const { data: folder, isFetching: loadingFolder } = useQuery({
    enabled: !!value,
    queryKey: ["folders", value],
    async queryFn() {
      if (value) {
        return await sdk.getFolder(value);
      }
      return null;
    },
  });

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger>
        <Button variant="outline" size="sm" loading={loadingFolder}>
          {!R.isNil(value) ? folder?.name : t("common.media_library")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger onClick={() => onChange?.(null)}>
            {t("common.media_library")}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {folders.map((folder) => (
              <SubMenu
                key={folder.id}
                folder={folder}
                onSelect={(folder) => {
                  onChange?.(folder);
                  setOpen(false);
                }}
              />
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SubMenu({
  folder,
  onSelect,
}: {
  folder: MediaFolderStructure;
  onSelect(value: number): void;
}) {
  return folder.children.length > 0 ? (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger
        key={folder.id}
        onClick={() => onSelect(folder.id)}
      >
        {folder.name}
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        {folder.children.map((folder) => (
          <SubMenu key={folder.id} folder={folder} onSelect={onSelect} />
        ))}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  ) : (
    <DropdownMenuItem key={folder.id} onClick={() => onSelect(folder.id)}>
      {folder.name}
    </DropdownMenuItem>
  );
}

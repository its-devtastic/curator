import { MediaFolder } from "@curatorjs/types";
import { Button, Input, TableCell, TableHeader, TableRow } from "@curatorjs/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as R from "ramda";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { PiCaretRightBold, PiHouseBold, PiPlusBold } from "react-icons/pi";
import { useSearchParams } from "react-router-dom";

import useStrapi from "@/hooks/useStrapi";

export default function FolderPath() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { sdk } = useStrapi();
  const [searchParams, setSearchParams] = useSearchParams();
  const [create, setCreate] = useState(false);
  const { permissions } = useStrapi();
  const canCreate = permissions.some(
    R.whereEq({ action: "plugin::upload.assets.create" }),
  );

  const parent = searchParams.get("folder");

  const { data: folder } = useQuery({
    queryKey: ["folders", parent],
    async queryFn() {
      if (parent) {
        return await sdk.getFolder(Number(parent));
      }
      return null;
    },
  });

  const { mutateAsync: createFolder } = useMutation({
    async mutationFn(name: string) {
      if (!name) {
        return;
      }

      await sdk.createFolder({
        parent: folder?.id || null,
        name,
      });
      setCreate(false);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });

  return (
    <TableHeader>
      <TableRow>
        <TableCell colSpan={4}>
          <div
            role="menu"
            className="flex items-center gap-1 list-none text-sm w-full"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setSearchParams((searchParams) => {
                  searchParams.delete("folder");
                  return searchParams;
                })
              }
            >
              <PiHouseBold className="size-4" />
            </Button>
            {folder && <ParentFolder folder={folder} />}
            {canCreate && (
              <PiCaretRightBold className="size-4 text-muted-foreground" />
            )}
            {canCreate &&
              (create ? (
                <Input
                  autoFocus
                  className="h-8"
                  onKeyDown={(e) => {
                    if (e.code === "Escape") {
                      setCreate(false);
                    }
                    if (e.code === "Enter") {
                      createFolder(e.currentTarget.value);
                    }
                  }}
                  onBlur={(e) => {
                    !e.currentTarget.value
                      ? setCreate(false)
                      : createFolder(e.currentTarget.value);
                  }}
                />
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-dashed"
                  onClick={() => setCreate(true)}
                >
                  <PiPlusBold className="szie-4 mr-2" />
                  {t("media_library.new_folder")}
                </Button>
              ))}
          </div>
        </TableCell>
      </TableRow>
    </TableHeader>
  );
}

function ParentFolder({ folder }: { folder: MediaFolder }) {
  const [_, setSearchParams] = useSearchParams();

  return (
    <>
      {folder.parent && <ParentFolder folder={folder.parent} />}
      <PiCaretRightBold className="size-4 text-muted-foreground" />
      <Button
        size="sm"
        variant="ghost"
        onClick={() =>
          setSearchParams((searchParams) => {
            searchParams.set("folder", String(folder.id));
            return searchParams;
          })
        }
      >
        {folder.name}
      </Button>
    </>
  );
}

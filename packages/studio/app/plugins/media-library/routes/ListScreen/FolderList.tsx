import { MediaFolder } from "@curatorjs/types";
import { Button, TableCell, TableRow } from "@curatorjs/ui";
import { useQuery } from "@tanstack/react-query";
import * as R from "ramda";
import React, { useState } from "react";
import { PiFolderBold, PiPencilSimpleBold } from "react-icons/pi";
import { useSearchParams } from "react-router-dom";

import useStrapi from "@/hooks/useStrapi";

import EditFolderModal from "./EditFolderModal";

export default function FolderList() {
  const { sdk } = useStrapi();
  const [searchParams, setSearchParams] = useSearchParams();
  const [edit, setEdit] = useState<MediaFolder | null>(null);
  const { permissions } = useStrapi();

  const canEdit = permissions.some(
    R.whereEq({ action: "plugin::upload.assets.update" }),
  );
  const parent = searchParams.get("folder");

  const { data: folders } = useQuery({
    queryKey: ["folders"],
    async queryFn() {
      return await sdk.getFolders(parent ? Number(parent) : null);
    },
  });

  return (
    <>
      {edit && canEdit && (
        <EditFolderModal
          folder={edit}
          onCancel={() => setEdit(null)}
          onSave={() => {
            setEdit(null);
          }}
        />
      )}

      {folders?.map((folder) => (
        <TableRow
          key={folder.id}
          className="hover:bg-secondary cursor-pointer group"
          onClick={() =>
            setSearchParams((searchParams) => {
              searchParams.set("folder", String(folder.id));
              return searchParams;
            })
          }
        >
          <TableCell width={40}>
            <PiFolderBold className="size-4" />
          </TableCell>
          <TableCell colSpan={2}>{folder.name}</TableCell>
          <TableCell align="right" width={40}>
            {canEdit && (
              <Button
                className="group-hover:visible invisible"
                size="icon"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  setEdit(folder);
                }}
              >
                <PiPencilSimpleBold className="size-4" />
              </Button>
            )}
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

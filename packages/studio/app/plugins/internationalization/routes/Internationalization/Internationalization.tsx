import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  Table,
  TableCell,
  TableRow,
  useToast,
} from "@curatorjs/ui";
import * as R from "ramda";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { PiDotsThreeBold } from "react-icons/pi";

import useStrapi from "@/hooks/useStrapi";

import CreateButton from "./CreateButton";

export default function Internationalization() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const { locales, sdk, permissions, refresh } = useStrapi();
  const languageNames = useMemo(
    () => new Intl.DisplayNames([i18n.language], { type: "language" }),
    [i18n.language],
  );
  const canUpdate = permissions.some(
    R.whereEq({ action: "plugin::i18n.locale.update" }),
  );
  const canDelete = permissions.some(
    R.whereEq({ action: "plugin::i18n.locale.delete" }),
  );

  return (
    <div className="px-4 md:px-12">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 my-12 pb-6 border-b border-0 border-solid border-gray-200">
        <div className="text-center lg:text-left">
          <h1 className="mt-0 mb-4 font-serif font-normal">
            {t("internationalization.title")}
          </h1>
          <div className="text-sm text-gray-600">
            {t("internationalization.description")}
          </div>
        </div>
        <CreateButton />
      </div>
      <Table>
        {R.sortWith(
          [R.descend(R.prop("isDefault")), R.ascend(R.prop("name"))],
          locales,
        ).map(({ id, isDefault, code }) => (
          <TableRow key={id}>
            <TableCell>
              {
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-sm fi fi-${
                      code.startsWith("en") ? "us" : code.split("-")[0]
                    }`}
                  />
                  {languageNames.of(code)}
                </div>
              }
            </TableCell>
            <TableCell>
              <div className="flex justify-end">
                {isDefault ? (
                  <Badge variant="success">{t("common.default")}</Badge>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuContent>
                      {canUpdate && (
                        <DropdownMenuItem
                          onClick={async () => {
                            await sdk.updateLocale(id, { isDefault: true });
                            await refresh();
                            toast({
                              title: t("internationalization.default_updated"),
                            });
                          }}
                        >
                          {t("internationalization.set_as_default")}
                        </DropdownMenuItem>
                      )}
                      {canDelete && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem>
                              {t("common.delete")}
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {t("phrases.are_you_sure")}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {t("internationalization.delete_warning")}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                {t("common.cancel")}
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={async () => {
                                  await sdk.deleteLocale(id);
                                  refresh();
                                  toast({
                                    title: t("internationalization.deleted"),
                                  });
                                }}
                              >
                                {t("common.delete")}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </DropdownMenuContent>
                    <Button variant="outline" size="icon">
                      <PiDotsThreeBold />
                    </Button>
                  </DropdownMenu>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </Table>
    </div>
  );
}

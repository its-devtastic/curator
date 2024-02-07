import { MediaItem } from "@curatorjs/types";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@curatorjs/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import useCurator from "@/hooks/useCurator";
import useStrapi from "@/hooks/useStrapi";
import FolderSelect from "@/plugins/media-library/routes/ListScreen/FolderSelect";

export default function EditMediaModal({
  media,
  children,
}: {
  media: MediaItem;
  children: (openModal: VoidFunction) => React.ReactElement;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const {
    images: { getImageUrl },
  } = useCurator();
  const { sdk } = useStrapi();
  const { id, caption, alternativeText, name, folder } = media;

  const formSchema = z.object({
    caption: z.string().optional().nullable(),
    alternativeText: z.string().optional().nullable(),
    name: z.string().optional(),
    folder: z.number().nullable(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caption,
      alternativeText,
      name,
      folder: folder?.id ?? null,
    },
  });
  const onSubmit = async ({
    folder,
    ...values
  }: z.infer<typeof formSchema>) => {
    try {
      await sdk.updateMediaItem({
        id,
        folder: folder ? Number(folder) : null,
        ...values,
      });
      setOpen(false);
    } catch (e) {}
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children(() => setOpen(true))}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("media_library.edit_media_item")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="py-12 flex flex-col items-center md:flex-row md:items-start gap-12">
              <div className="">
                <img
                  src={getImageUrl(media)}
                  alt=""
                  className="w-32 h-32 object-contain"
                />
              </div>
              <div className="space-y-4 w-full md:w-auto flex-1">
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("common.name")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="caption"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("common.caption")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="alternativeText"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("common.alternative_text")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="folder"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("common.location")}</FormLabel>
                      <div>
                        <FormControl>
                          <FolderSelect
                            value={field.value}
                            onChange={(folder) => {
                              field.onChange(folder);
                            }}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
        <DialogFooter>
          <div className="flex-1">
            <Button
              variant="destructive"
              onClick={async () => {
                await sdk.deleteMediaItem(id);
                setOpen(false);
              }}
            >
              {t("common.delete")}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <DialogClose asChild>
              <Button variant="ghost">{t("common.cancel")}</Button>
            </DialogClose>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              loading={form.formState.isLoading}
            >
              {t("common.save")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

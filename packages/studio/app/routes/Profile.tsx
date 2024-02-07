import { SessionUser } from "@curatorjs/types";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  CardHeader,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Spinner,
} from "@curatorjs/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { message } from "antd";
import * as R from "ramda";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import useSession from "@/hooks/useSession";
import useStrapi from "@/hooks/useStrapi";
import { MediaLibraryPopover } from "@/plugins/media-library";
import LocaleSelect from "@/ui/LocaleSelect";
import Popover from "@/ui/Popover";

export default function Profile() {
  const { user, profile, setSession } = useSession();
  const { t } = useTranslation();
  const { sdk } = useStrapi();

  const formSchema = z.object({
    email: z
      .string()
      .min(1, t("validations.required"))
      .email({
        message: t("validations.invalid_email"),
      }),
    username: z.string().optional(),
    firstname: z.string().min(1, t("validations.required")),
    lastname: z.string().min(1, t("validations.required")),
    preferedLanguage: z.string(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: R.evolve({
      username: R.defaultTo(""),
      preferedLanguage: R.defaultTo(""),
    })(user!) as Omit<SessionUser, "preferedLanguage" | "username"> & {
      preferedLanguage: string;
      username: string;
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const user = await sdk.updateProfile(values);
      setSession({ user });
    } catch (e: any) {
      message.error(e.response.data.error.message);
    }
  };

  return (
    <div>
      {user ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="px-4 md:px-12"
          >
            <div className="flex items-center justify-between my-12">
              <h1 className="text-3xl font-bold">{t("common.profile")}</h1>
              <Button type="submit">{t("common.save")}</Button>
            </div>
            <Card className="max-w-lg">
              <CardHeader />
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-col items-center mb-12">
                    <Popover
                      trigger={["click"]}
                      content={(close) => (
                        <MediaLibraryPopover
                          mime="image"
                          onChange={async (item) => {
                            const profile = await sdk.updateExtendedProfile({
                              avatar: item,
                            });
                            setSession({ profile });
                            close();
                          }}
                        />
                      )}
                    >
                      <Avatar className="size-24 text-3xl cursor-pointer">
                        {profile?.avatar?.url && (
                          <AvatarImage src={profile.avatar.url} alt="" />
                        )}
                        <AvatarFallback>
                          {(
                            user.username?.[0] ||
                            user.firstname?.[0] ||
                            user.email[0]
                          ).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Popover>
                  </div>
                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("profile.email")}</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <FormField
                        name="firstname"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("profile.firstname")}</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex-1">
                      <FormField
                        name="lastname"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("profile.lastname")}</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <FormField
                    name="username"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("profile.username")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="preferedLanguage"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("profile.interface_language")}</FormLabel>
                        <FormControl>
                          <LocaleSelect {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      ) : (
        <Spinner />
      )}
    </div>
  );
}

import { AdminUser } from "@curatorjs/types";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@curatorjs/ui";
import TagSelect from "@curatorjs/ui/components/TagSelect";
import { zodResolver } from "@hookform/resolvers/zod";
import { message } from "antd";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useCopyToClipboard } from "react-use";
import { z } from "zod";

import useStrapi from "@/hooks/useStrapi";

export default function InviteUserModal({
  children,
}: {
  children: React.ReactElement;
}) {
  const { t } = useTranslation();
  const { sdk, roles } = useStrapi();
  const [_, copy] = useCopyToClipboard();
  const [user, setUser] = useState<
    (AdminUser & { registrationToken: string }) | null
  >(null);

  const formSchema = z.object({
    firstname: z.string().min(1, t("validations.required")),
    lastname: z.string().min(1, t("validations.required")),
    email: z
      .string()
      .min(1, t("validations.required"))
      .email(t("validations.invalid_email")),
    roles: z.array(z.string()).min(1),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { firstname: "", lastname: "", email: "", roles: [] },
  });
  const onSubmit = async ({ roles, ...values }: z.infer<typeof formSchema>) => {
    try {
      const user = await sdk.createAdminUser({
        roles: roles.map(Number),
        ...values,
      });
      setUser(user);
    } catch (e) {
      message.error(t("team.error"));
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        {!user && (
          <DialogHeader>
            <DialogTitle>{t("team.invite")}</DialogTitle>
          </DialogHeader>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {user ? (
              <div className="text-center flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-8">
                  {t("team.copy_link", { name: user.firstname })}
                </h2>

                <div
                  role="button"
                  tabIndex={0}
                  className="font-mono font-semibold text-success cursor-pointer w-full mb-4"
                  onClick={() =>
                    copy(
                      `${window.location.origin}/register?registrationToken=${user.registrationToken}`,
                    )
                  }
                >
                  {`${window.location.origin}/register?registrationToken=${user.registrationToken}`}
                </div>
                <Button
                  className="mb-4"
                  variant="outline"
                  onClick={() =>
                    copy(
                      `${window.location.origin}/register?registrationToken=${user.registrationToken}`,
                    )
                  }
                >
                  {t("common.copy")}
                </Button>
                <DialogClose asChild>
                  <Button variant="ghost" key="done">
                    {t("common.done")}
                  </Button>
                </DialogClose>
              </div>
            ) : (
              <div className="py-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="firstname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("common.first_name")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("common.last_name")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("common.email")}</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="roles"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("team.user_roles_label")}</FormLabel>
                      <FormControl>
                        <TagSelect
                          className="w-full"
                          placeholder={t("team.user_roles_input")}
                          options={roles.map((role) => ({
                            label: role.name,
                            value: String(role.id),
                          }))}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("team.user_roles_help")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </form>
        </Form>
        {!user && (
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{t("common.cancel")}</Button>
            </DialogClose>
            <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
              {t("team.send_invite")}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

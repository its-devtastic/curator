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
import * as R from "ramda";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import useStrapi from "@/hooks/useStrapi";

export default function UpdateUserModal({
  user,
  children,
}: {
  user: AdminUser;
  onClose?: VoidFunction;
  onUpdate?: VoidFunction;
  children: React.ReactElement;
}) {
  const { t } = useTranslation();
  const { sdk, roles, permissions } = useStrapi();
  const canEditRoles = permissions.some(
    R.whereEq({ action: "admin::roles.read" }),
  );

  console.log(user);
  const formSchema = z.object({
    id: z.number(),
    firstname: z.string().min(1, t("validations.required")),
    lastname: z.string().min(1, t("validations.required")),
    email: z
      .string()
      .min(1, t("validations.required"))
      .email(t("validations.invalid_email")),
    roles: z.array(z.string()).min(1),
    isActive: z.boolean(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: R.evolve({ roles: R.map((role) => String(role.id)) })(user),
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await sdk.updateAdminUser(
        R.evolve({
          roles: R.map(Number),
        })(values),
      );
    } catch (e) {
      message.error(t("team.error"));
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("team.update_user")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
                        disabled={!canEditRoles}
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
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{t("common.cancel")}</Button>
          </DialogClose>
          <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
            {t("common.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

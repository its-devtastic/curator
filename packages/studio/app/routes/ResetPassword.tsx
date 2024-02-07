import {
  Alert,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  Input,
} from "@curatorjs/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { message } from "antd";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";
import { z } from "zod";

import useCurator from "@/hooks/useCurator";
import useSession from "@/hooks/useSession";
import useStrapi from "@/hooks/useStrapi";

const ResetPassword: React.FC = () => {
  const { t } = useTranslation();
  const { sdk } = useStrapi();
  const {
    about: { icon },
  } = useCurator();
  const { setSession } = useSession();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  const formSchema = z
    .object({
      password: z.string().min(8, t("validations.required")),
      confirmPassword: z.string().min(8, t("validations.required")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("reset_password.no_match"),
      path: ["confirmPassword"],
    });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const onSubmit = async ({ password }: z.infer<typeof formSchema>) => {
    if (!code) {
      return;
    }
    try {
      const data = await sdk.resetPassword({ password, code });
      setSession(data);
    } catch (e: any) {
      message.error(t("reset_password.error"));
    }
  };

  return (
    <div className="max-w-sm w-full">
      {icon && (
        <div className="mb-6">
          <img
            src={typeof icon === "string" ? icon : icon.auth}
            alt=""
            className="h-16 mx-auto"
          />
        </div>
      )}
      <h1 className="text-center mb-12 mt-6 select-none text-2xl font-bold">
        {t("reset_password.title")}
      </h1>
      {code ? (
        <Form {...form}>
          <Card>
            <CardHeader />
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-3">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("reset_password.password")}</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormDescription>
                        {t("reset_password.requirements")}
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("reset_password.confirm_password")}
                      </FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  type="submit"
                  loading={form.formState.isSubmitting}
                  disabled={!form.formState.isValid}
                >
                  {t("reset_password.button")}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </Form>
      ) : (
        <Alert variant="destructive">{t("reset_password.no_code")}</Alert>
      )}
      <div className="text-center my-6">
        <Link to="/login" className="text-sm hover:underline">
          {t("reset_password.ready")}
        </Link>
      </div>
    </div>
  );
};
export default ResetPassword;

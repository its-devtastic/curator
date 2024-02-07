import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Form,
  FormControl,
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
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

import useCurator from "@/hooks/useCurator";
import useStrapi from "@/hooks/useStrapi";

const ForgotPassword: React.FC = () => {
  const { t } = useTranslation();
  const { sdk } = useStrapi();
  const { about } = useCurator();
  const navigate = useNavigate();

  const formSchema = z.object({
    email: z
      .string()
      .min(1, t("validations.required"))
      .email({
        message: t("validations.invalid_email"),
      }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = async ({ email }: z.infer<typeof formSchema>) => {
    try {
      await sdk.forgotPassword(email);
      navigate("/forgot-password-success");
    } catch (e: any) {
      message.error(e.response.data.error.message);
    }
  };

  return (
    <div className="max-w-sm w-full">
      {about?.icon && (
        <div className="mb-6">
          <img
            src={typeof about.icon === "string" ? about.icon : about.icon.auth}
            alt=""
            className="h-16 mx-auto"
          />
        </div>
      )}
      <h1 className="text-center mb-12 mt-6 select-none font-bold text-2xl">
        {t("forgot_password.title")}
      </h1>
      <Card>
        <CardHeader />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CardContent>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("forgot_password.email")}</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              ></FormField>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                loading={form.formState.isSubmitting}
              >
                {t("forgot_password.button")}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      <div className="text-center my-6">
        <Link to="/login" className="text-sm hover:underline">
          {t("forgot_password.ready")}
        </Link>
      </div>
    </div>
  );
};
export default ForgotPassword;

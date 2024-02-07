import {
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
  FormMessage,
  Input,
} from "@curatorjs/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { message } from "antd";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { z } from "zod";

import useCurator from "@/hooks/useCurator";
import useSession from "@/hooks/useSession";
import useStrapi from "@/hooks/useStrapi";

const Login: React.FC = () => {
  const { t } = useTranslation();
  const { sdk } = useStrapi();
  const { about } = useCurator();
  const { setSession } = useSession();

  const formSchema = z.object({
    email: z
      .string()
      .min(1, t("validations.required"))
      .email({
        message: t("validations.invalid_email"),
      }),
    password: z.string().min(1, t("validations.required")),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const data = await sdk.login(values);
      setSession(data);
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
      <h1 className="text-center mb-2 mt-6 select-none text-2xl font-bold">
        {t("login.title")}
      </h1>
      <div className="mb-12 text-center text-sm text-muted-foreground">
        {t("login.subtitle")}
      </div>
      <Card>
        <CardHeader />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("login.email")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("login.password")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      <Link to="/forgot-password" className="hover:underline">
                        {t("login.forgot_password")}
                      </Link>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                type="submit"
                loading={form.formState.isSubmitting}
              >
                {t("login.button")}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};
export default Login;

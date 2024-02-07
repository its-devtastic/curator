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
  FormMessage,
  Input,
} from "@curatorjs/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { message } from "antd";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAsync } from "react-use";
import { z } from "zod";

import useCurator from "@/hooks/useCurator";
import useSession from "@/hooks/useSession";
import useStrapi from "@/hooks/useStrapi";

const Register: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { sdk } = useStrapi();
  const {
    about: { icon },
  } = useCurator();
  const { setSession } = useSession();
  const registrationToken = searchParams.get("registrationToken");

  const formSchema = z.object({
    firstname: z.string().min(1, t("validations.required")),
    lastname: z.string().min(1, t("validations.required")),
    email: z
      .string()
      .min(1, t("validations.required"))
      .email(t("validations.invalid_email")),
    password: z.string().min(8, t("validations.required")),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { firstname: "", lastname: "", email: "", password: "" },
  });
  const onSubmit = async ({
    email,
    ...userInfo
  }: z.infer<typeof formSchema>) => {
    if (!registrationToken) {
      return;
    }
    try {
      const data = await sdk.register({
        registrationToken,
        ...userInfo,
      });
      setSession(data);
    } catch (e: any) {
      message.error(e.response.data.error.message);
    }
  };

  const { value: registrationInfo } = useAsync(async () => {
    if (!registrationToken) {
      return;
    }

    try {
      const registrationInfo = await sdk.getRegistrationInfo(registrationToken);
      form.reset(registrationInfo);
      return registrationInfo;
    } catch (e: any) {
      if (e.response.status) {
        navigate("/login", { replace: true });
        message.error(t("register.invalid_token"));
      }
    }
  }, [registrationToken]);

  return (
    <div className="max-w-md w-full">
      {registrationInfo && registrationToken ? (
        <div>
          {icon && (
            <div className="mb-6">
              <img
                src={typeof icon === "string" ? icon : icon.auth}
                alt=""
                className="h-16 mx-auto"
              />
            </div>
          )}
          <h1 className="mt-0 mb-6 text-center font-bold text-2xl">
            {t("register.title")}
          </h1>
          <Card>
            <CardHeader />
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name="firstname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("register.first_name")}</FormLabel>
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
                          <FormLabel>{t("register.last_name")}</FormLabel>
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
                        <FormLabel>{t("register.email")}</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" disabled />
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
                        <FormLabel>{t("register.password")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          {t("register.password_requirements")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <div className="w-full space-y-4">
                    <Button
                      className="w-full"
                      type="submit"
                      loading={form.formState.isSubmitting}
                    >
                      {t("register.register_button")}
                    </Button>
                    <div className="text-center">
                      <Link to="/login" className="text-sm hover:underline">
                        {t("register.already_account")}
                      </Link>
                    </div>
                  </div>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      ) : (
        <Alert variant="destructive">{t("register.invalid_token")}</Alert>
      )}
    </div>
  );
};
export default Register;

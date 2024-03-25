import "@/utils/i18n";

import dayjs from "dayjs";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";

import useCurator from "@/hooks/useCurator";
import useSession from "@/hooks/useSession";
import Anon from "@/routes/Anon";
import Auth from "@/routes/Auth";
import ForgotPassword from "@/routes/ForgotPassword";
import ForgotPasswordSuccess from "@/routes/ForgotPasswordSuccess";
import Login from "@/routes/Login";
import Profile from "@/routes/Profile";
import Register from "@/routes/Register";
import ResetPassword from "@/routes/ResetPassword";
import Secrets from "@/routes/Secrets";

export default function App() {
  const { i18n } = useTranslation();
  const { user } = useSession();
  const config = useCurator();

  useEffect(() => {
    if (user?.preferedLanguage) {
      i18n.changeLanguage(user.preferedLanguage);
      dayjs.locale(i18n.language);
    }
  }, [user, i18n]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Auth />,
      loader: () => (user ? null : redirect("/login")),
      children: [
        { path: "/profile", element: <Profile /> },
        { path: "/settings/secrets", element: <Secrets /> },
        ...(config.routes ?? []),
      ],
    },
    {
      path: "/",
      element: <Anon />,
      loader: () => (!user ? null : redirect("/")),
      children: [
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/forgot-password",
          element: <ForgotPassword />,
        },
        {
          path: "/forgot-password-success",
          element: <ForgotPasswordSuccess />,
        },
        {
          path: "/auth/reset-password",
          element: <ResetPassword />,
        },
        {
          path: "/register",
          element: <Register />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

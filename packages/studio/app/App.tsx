import "@/utils/i18n";

import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { notification } from "antd";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import { useEffectOnce } from "react-use";

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

  useEffectOnce(() =>
    notification.config({
      placement: "bottomRight",
      closeIcon: <FontAwesomeIcon icon={faClose} />,
    }),
  );

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

  return (
    <div className="text-base font-sans antialiased text-gray-800 selection:bg-primary-200">
      <RouterProvider router={router} />
    </div>
  );
}

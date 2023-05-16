import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import dayjs from "dayjs";
import { notification } from "antd";
import { useEffectOnce } from "react-use";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

import useSession from "~/hooks/useSession";
import useStrapion from "~/hooks/useStrapion";

import "~/utils/i18n";

import Auth from "~/routes/Auth";
import Login from "~/routes/Login";
import Profile from "~/routes/Profile";
import Register from "~/routes/Register";

const App: React.FC = () => {
  const { i18n } = useTranslation();
  const { user } = useSession();
  const config = useStrapion();

  useEffectOnce(() =>
    notification.config({
      placement: "bottomRight",
      closeIcon: <FontAwesomeIcon icon={faClose} />,
    })
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
      children: [{ path: "/profile", element: <Profile /> }, ...config.routes],
    },
    {
      path: "/login",
      element: <Login />,
      loader: () => (!user ? null : redirect("/")),
    },
    {
      path: "/register",
      element: <Register />,
      loader: () => (!user ? null : redirect("/")),
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;

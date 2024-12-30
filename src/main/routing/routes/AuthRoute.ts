import { Logout } from "@presentation/pages/auth";
import { ForgotPassword } from "@presentation/pages/auth/components/ForgotPassword";
// import { Login } from "@pages/auth/components/Login";
import { Registration } from "@presentation/pages/auth/components/Registration";
import { Login } from "@presentation/pages/logIn/LogIn";
import { FC } from "react";

type authRouteType = {
  path: string;
  component: FC;
};

const AuthRoute: authRouteType[] = [
  {
    path: "index",
    component: Login,
  },
  {
    path: "login",
    component: Login,
  },
  {
    path: "logout",
    component: Logout,
  },
  {
    path: "registration",
    component: Registration,
  },
  {
    path: "forgot-password",
    component: ForgotPassword,
  },
];

export { AuthRoute };

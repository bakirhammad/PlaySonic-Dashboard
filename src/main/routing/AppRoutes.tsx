/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/app/modules/Auth/pages/AuthPage`, `src/app/BasePage`).
 */

import { FC, useEffect } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { PrivateRoutes } from "./PrivateRoutes";
import { ErrorsPage } from "@presentation/pages/errors";
import { App } from "./App";
import { AuthLayout, Logout } from "@presentation/pages/auth";
import { AuthRoute } from "./routes/AuthRoute";
import { useAuthStore } from "@infrastructure/storage/AuthStore";
import { useLang } from "@presentation/localization";
import { Constant } from "@presentation/helpers";
import { RoleTypesEnum } from "@domain/enums/roleTypesEnum/RoleTypesEnum";

/**
 * Base URL of the website.
 *
 * @see https://facebook.github.io/create-react-app/docs/using-the-public-folder
 */
const { BASE_URL } = import.meta.env;

const AppRoutes: FC = () => {
  const { currentUser, logout } = useAuthStore();

  const locale = useLang();
  useEffect(() => {
    const _dir = ["ar"].includes(locale) ? "rtl" : "ltr";
    document.documentElement.dir = _dir;
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    const handleUserActivity = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        logout();
      }, 1000 * 60 * Constant.userActivityTime);
    };

    let timeoutId = setTimeout(() => {
      logout();
    }, 1000 * 60 * Constant.userActivityTime);

    document.addEventListener("mousemove", handleUserActivity);
    document.addEventListener("keydown", handleUserActivity);
    document.addEventListener("click", handleUserActivity);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousemove", handleUserActivity);
      document.removeEventListener("keydown", handleUserActivity);
      document.removeEventListener("click", handleUserActivity);
    };
  }, [logout]);
  const auth = useAuthStore((e) => e.auth);

  return (
    <BrowserRouter basename={BASE_URL}>
      <Routes>
        <Route element={<App />}>
          <Route path="error/*" element={<ErrorsPage />} />
          <Route path="logout" element={<Logout />} />
          {currentUser ? (
            <>
              <Route path="/*" element={<PrivateRoutes />} />
              <Route
                path="auth/*"
                element={
                  <Navigate
                    to={
                      auth?.type == RoleTypesEnum["Super Admin"]
                        ? "/dashboard"
                        : "/apps/mycourts"
                    }
                  />
                }
              />
            </>
          ) : (
            <>
              <Route path="auth/*" element={<AuthLayout />}>
                {AuthRoute.map(({ component: Component, path }, i) => {
                  return path === "index" ? (
                    <Route index element={<Component />} key={i} />
                  ) : (
                    <Route path={path} element={<Component />} key={i} />
                  );
                })}
              </Route>
              <Route path="*" element={<Navigate to="/auth" />} />
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export { AppRoutes };

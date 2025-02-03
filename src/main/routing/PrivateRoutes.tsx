import { lazy, FC, Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { MasterLayout } from "../../presentation/layout/MasterLayout";
import TopBarProgress from "react-topbar-progress-indicator";
import { getCSSVariableValue } from "../../assets/ts/_utils";
import { WithChildren } from "../../presentation/helpers";
import { BuilderPageWrapper } from "../../presentation/pages/layoutBuilder";
import { routes } from "./routes/Routes";
import ProtectedRoute from "./ProtectedRoute";
import ComingSoon from "@presentation/pages/comingSoon";
import { useAuthStore } from "@infrastructure/storage/AuthStore";
import { RoleTypesEnum } from "@domain/enums/roleTypesEnum/RoleTypesEnum";

const PrivateRoutes = () => {
  const ProfilePage = lazy(
    () => import("../../presentation/pages/profile/ProfilePage")
  );
  const WizardsPage = lazy(
    () => import("../../partials/modules/wizards/WizardsPage")
  );
  const AccountPage = lazy(() => import("@presentation/pages/accounts/Index"));
  const WidgetsPage = lazy(
    () => import("../../partials/modules/widgets/WidgetsPage")
  );
  const ChatPage = lazy(() => import("../../presentation/pages/chat/ChatPage"));
  const auth = useAuthStore((e) => e.auth);
  return (
    <Routes>
      <Route element={<MasterLayout />}>
        <Route path="/comingsoon" element={<ComingSoon />} />
        <Route
          index
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
        <Route path="builder" element={<BuilderPageWrapper />} />
        <Route
          path="crafted/pages/profile/*"
          element={
            <SuspensedView>
              <ProfilePage />
            </SuspensedView>
          }
        />
        <Route
          path="crafted/pages/wizards/*"
          element={
            <SuspensedView>
              <WizardsPage />
            </SuspensedView>
          }
        />
        <Route
          path="crafted/widgets/*"
          element={
            <SuspensedView>
              <WidgetsPage />
            </SuspensedView>
          }
        />
        <Route
          path="crafted/account/*"
          element={
            <SuspensedView>
              <AccountPage />
            </SuspensedView>
          }
        />
        <Route
          path="apps/chat/*"
          element={
            <SuspensedView>
              <ChatPage />
            </SuspensedView>
          }
        />
        {routes.map(({ children, path, ...props }, i) => {
          return (
            <Route
              path={path}
              key={i}
              element={
                <SuspensedView>
                  <ProtectedRoute props={props} />
                </SuspensedView>
              }
            >
              {children?.map(({ path, ...props }, i) => (
                <Route
                  key={i}
                  path={path}
                  element={
                    <SuspensedView>
                      <ProtectedRoute props={props} />
                    </SuspensedView>
                  }
                />
              ))}
            </Route>
          );
        })}
        <Route path="*" element={<Navigate to="/error/404" />} />
        <Route path="/apps/*" element={<Navigate to="/comingsoon" />} />
      </Route>
    </Routes>
  );
};

const SuspensedView: FC<WithChildren> = ({ children }) => {
  const baseColor = getCSSVariableValue("--bs-primary");
  TopBarProgress.config({
    barColors: {
      "0": baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  });
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>;
};

export { PrivateRoutes };

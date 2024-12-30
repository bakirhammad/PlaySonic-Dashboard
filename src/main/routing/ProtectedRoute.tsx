import { useAuthStore } from "@infrastructure/storage/AuthStore";
import { PageLink, PageTitle } from "@presentation/layout/core";
import { FC } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute: FC<{
  props: {
    title: string;
    component: FC;
    role: string[];
    breadcrumbs: PageLink[];
  };
}> = ({ props }) => {
  const { title, component: Component, role, breadcrumbs } = props;
  const { currentUser } = useAuthStore();
  // eslint-disable-next-line no-constant-condition

  if (!role.some((role) => currentUser?.roles?.includes(role))) {
    return (
      <>
        <PageTitle breadcrumbs={breadcrumbs}>{title}</PageTitle>
        <Component />
      </>
    );
  } else {
    return <Navigate to="/error/404" />;
  }
};

export default ProtectedRoute;

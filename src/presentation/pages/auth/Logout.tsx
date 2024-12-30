import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@infrastructure/storage/AuthStore";

export function Logout() {
  const { logout } = useAuthStore();
  useEffect(() => {
    logout();
    document.location.reload();
  }, [logout]);

  return (
    <>
      <Navigate to="/auth/login" />
    </>
  );
}

import { useAuthStore } from "@infrastructure/storage/AuthStore";
import { FC, useEffect, useState } from "react";
import { LayoutSplashScreen, WithChildren } from "..";
import { makeLocalStorage } from "@main/factories/chache/localStorage";
import { makeRemoteAuthentication } from "@main/factories/usecases/authentication";
import { authenticationURLEnum } from "@domain/enums";

const AuthInit: FC<WithChildren> = ({ children }) => {
  const AUTH_LOCAL_STORAGE_KEY = import.meta.env.VITE_AUTH_LOCAL_STORAGE_KEY;
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const { currentUser, setCurrentUser, logout, setUserCurrencies } =
    useAuthStore();
  const requestUser = async () => {
    try {
      if (!currentUser) {
        const data = await makeRemoteAuthentication().getUserByToken(
          authenticationURLEnum.getUserByToken
        );

        if (data) {
          const { user, auth, roles } = data;
          setCurrentUser({ user, auth, roles });
          setUserCurrencies(user.userCurrencies);
        }
      }
    } catch (error) {
      console.error(error);
      if (currentUser) {
        logout();
      }
    } finally {
      setShowSplashScreen(false);
    }
  };
  const handleOnFocus = () => {
    if (makeLocalStorage().get(AUTH_LOCAL_STORAGE_KEY)?.expiration) {
      const expiration = makeLocalStorage().get(
        AUTH_LOCAL_STORAGE_KEY
      )?.expiration;
      const expirationDate = new Date(expiration);
      const now = new Date();
      if (now >= expirationDate) {
        logout();
      }
    }
  };
  useEffect(() => {
    if (
      makeLocalStorage().get(AUTH_LOCAL_STORAGE_KEY) &&
      makeLocalStorage().get(AUTH_LOCAL_STORAGE_KEY)?.token
    ) {
      requestUser();
    } else {
      logout();
      setShowSplashScreen(false);
    }

    window.addEventListener("focus", handleOnFocus);
    handleOnFocus();
    return () => {
      window.removeEventListener("focus", handleOnFocus);
    };
    // eslint-disable-next-line
  }, []);

  return showSplashScreen ? <LayoutSplashScreen /> : <>{children}</>;
};

export { AuthInit };

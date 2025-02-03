/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useAuthStore } from "@infrastructure/storage/AuthStore";
import { makeRemoteAuthentication } from "@main/factories/usecases/authentication";
import { authenticationURLEnum } from "@domain/enums";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [loginError, setError] = useState("");
  const { saveAuth, setCurrentUser, setUserCurrencies } = useAuthStore();
  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const { token, expiration, permissions, clubID, type } = await makeRemoteAuthentication().login(
        authenticationURLEnum.login,
        {
          username,
          password,
        }
      );

      saveAuth({ token, expiration, permissions, clubID, type });
      const { user, auth, roles } =
        await makeRemoteAuthentication().getUserByToken(
          authenticationURLEnum.getUserByToken
        );
        
        
        setCurrentUser({ user, auth, roles });
       setUserCurrencies(user.userCurrencies);
      
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred");
      throw error.message;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, loginError };
};

export { useLogin };

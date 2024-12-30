/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "@infrastructure/storage/AuthStore";
import { makeRemoteAuthentication } from "@main/factories/usecases/authentication";
import { authenticationURLEnum } from "@domain/enums";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [loginError, setError] = useState("");
  const navigate = useNavigate();
  const { saveAuth, setCurrentUser, setUserCurrencies } = useAuthStore();
  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const { token, expiration } = await makeRemoteAuthentication().login(
        "https://bigdapi.kensoftware.com/api/Authenticate/Authenticate/login",
        {
          username,
          password,
        }
      );

      saveAuth({ token, expiration });
      const { user, auth, roles } =
        await makeRemoteAuthentication().getUserByToken(
          "https://bigdapi.kensoftware.com/api/Authenticate/Users/getUserByToken"
        );

      setCurrentUser({ user, auth, roles });
      setUserCurrencies(user.userCurrencies);

      navigate("/dashboard");
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

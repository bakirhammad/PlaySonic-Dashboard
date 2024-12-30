import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { I18nProvider } from "../../presentation/localization/i18nProvider";
import {
  LayoutProvider,
  LayoutSplashScreen,
} from "../../presentation/layout/core";
import { MasterInit } from "../../presentation/layout/MasterInit";
import { ThemeModeProvider } from "../../partials";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LanguageInit } from "@presentation/services/languages/LanguageInit";
import CountryAppliedQueryList from "@presentation/services/general/CountryListInit";
import { AuthInit } from "@presentation/services/AuthInit";

const App = () => {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <I18nProvider>
        <LayoutProvider>
          <ThemeModeProvider>
            <AuthInit>
              <LanguageInit />
              <CountryAppliedQueryList />
              <Outlet />
              <MasterInit />
              <ToastContainer />
            </AuthInit>
          </ThemeModeProvider>
        </LayoutProvider>
      </I18nProvider>
    </Suspense>
  );
};

export { App };

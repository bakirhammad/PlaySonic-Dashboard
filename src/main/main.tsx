import { createRoot } from "react-dom/client";
import { Chart, registerables } from "chart.js";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import "../assets/sass/style.react.scss";
import "../assets/fonticon/fonticon.css";
import "../assets/keenicons/duotone/style.css";
import "../assets/keenicons/outline/style.css";
import "../assets/keenicons/solid/style.css";
import { AppRoutes } from "./routing/AppRoutes";
import { MetronicI18nProvider } from "@presentation/localization/Metronici18n";
import { getLayoutFromLocalStorage } from "@presentation/layout";
/**
 * Creates `axios-mock-adapter` instance for provided `axios` instance, add
 * basic Metronic mocks and returns it.
 *
 * @see https://github.com/ctimmerm/axios-mock-adapter
 */
/**
 * Inject Metronic interceptors for axios.
 *
 * @see https://github.com/axios/axios#interceptors
 */

Chart.register(...registerables);

const queryClient = new QueryClient();
queryClient.setDefaultOptions({
  queries: {
    refetchOnWindowFocus: false,
  },
});
const container = document.getElementById("root");

const importCssFile = async (rtlMode: boolean) => {
  if (rtlMode) {
    await import("../assets/css/style.rtl.css");
  } else {
    await import("../assets/sass/style.scss");
  }
};

const checkAndRenderApp = async () => {
  const config = getLayoutFromLocalStorage();
  const rtlMode = config.app?.general?.rtl;
  await importCssFile(rtlMode as boolean);

  if (container) {
    createRoot(container).render(
      <QueryClientProvider client={queryClient}>
        <MetronicI18nProvider>
          <AppRoutes />
        </MetronicI18nProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    );
  }
};

checkAndRenderApp();

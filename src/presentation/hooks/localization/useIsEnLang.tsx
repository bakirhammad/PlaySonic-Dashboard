import { useIntl } from "react-intl";

function useIsEnLang() {
  const { locale } = useIntl();
  return locale === "en";
}

export { useIsEnLang };

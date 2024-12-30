import { useIntl } from "react-intl";

const useLocaleFormate = (textId: string | undefined) => {
  const intl = useIntl();
  if (!textId) {
    return undefined;
  }
  if (typeof textId === "string") {
    return intl.formatMessage({ id: textId });
  } else {
    return "";
  }
};

export { useLocaleFormate };

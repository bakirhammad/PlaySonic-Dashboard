import { useLayout } from "../layout/core";
import { ThemeModeComponent } from "../../assets/ts/layout";
interface ItoAbsoluteUrl {
  pathname: string;
  size: "_200x200" | "_500x250" | "_1920x1080";
  extension: ".webp" | ".png" | ".jpg" | ".jpeg";
}
export const toAbsoluteUrl = ({ pathname, size, extension }: ItoAbsoluteUrl) =>
  import.meta.env.VITE_APP_MEDIA_URL + pathname + size + extension;

export const toAbsoluteUrlForLocalImage = (pathname: string) =>
  import.meta.env.BASE_URL + pathname;

export const useIllustrationsPath = (illustrationName: string): string => {
  const { config } = useLayout();

  const extension = illustrationName.substring(
    illustrationName.lastIndexOf("."),
    illustrationName.length
  );
  const illustration =
    ThemeModeComponent.getMode() === "dark"
      ? `${illustrationName.substring(
          0,
          illustrationName.lastIndexOf(".")
        )}-dark`
      : illustrationName.substring(0, illustrationName.lastIndexOf("."));
  return toAbsoluteUrlForLocalImage(
    `media/illustrations/${config.illustrations?.set}/${illustration}${extension}`
  );
};

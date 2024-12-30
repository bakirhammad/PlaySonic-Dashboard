import { FC } from "react";
import SVG from "react-inlinesvg";
import { toAbsoluteUrlForLocalImage } from "../../helpers/AssetHelpers";
type Props = {
  className?: string;
  path: string;
  svgClassName?: string;
};

const CustomKTSVG: FC<Props> = ({
  className = "",
  path,
  svgClassName = "mh-50px",
}) => {
  return (
    <span className={`svg-icon ${className}`}>
      <SVG src={toAbsoluteUrlForLocalImage(path)} className={svgClassName} />
    </span>
  );
};

export { CustomKTSVG };

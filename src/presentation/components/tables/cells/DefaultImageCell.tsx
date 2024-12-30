import { toAbsoluteUrlForLocalImage } from "@presentation/helpers";
import { type FC } from "react";

type Props = {
  alt?: string;
};

const DefaultImageCell: FC<Props> = ({ alt }) => {
  return (
    <div className="symbol-label">
      <img
        alt={alt}
        src={toAbsoluteUrlForLocalImage("media/default.png")}
        className="w-75"
      />
    </div>
  );
};

export default DefaultImageCell;

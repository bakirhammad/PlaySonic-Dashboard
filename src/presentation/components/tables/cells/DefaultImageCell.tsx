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
        src={(
          "https://media.istockphoto.com/id/1363976548/photo/paddle-tennis-racket-and-balls-on-the-blue-paddle-court.jpg?s=612x612&w=0&k=20&c=yxbb5H6rbALy_YG5awOHCRyn7Ge02SQL8SwAcbeKIwA="
        )}
        className="w-75"
      />
    </div>
  );
};

export default DefaultImageCell;

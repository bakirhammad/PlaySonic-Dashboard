import { FC } from "react";
import { toAbsoluteUrl } from "../../../helpers";
import DefaultImageCell from "./DefaultImageCell";

type Props = {
  image: string;
};

const CustomImageCell: FC<Props> = ({ image }) => (
  <>
    {image ? (
      <div className="d-flex align-items-center">
        <div className="symbol symbol-square symbol-50px overflow-hidden me-3">
          <a
            href={`${toAbsoluteUrl({
              pathname: image,
              extension: ".webp",
              size: "_1920x1080",
            })}`}
            target="_blank"
          >
            <div className="symbol-label">
              <img
                src={
                  toAbsoluteUrl({
                    pathname: image,
                    extension: ".webp",
                    size: "_200x200",
                  }) +
                  "?date=" +
                  new Date()
                }
                alt={image}
                className="w-100"
              />
            </div>
          </a>
        </div>
      </div>
    ) : (
      <div className="d-flex align-items-center">
        <DefaultImageCell />
      </div>
    )}
  </>
);

export { CustomImageCell };

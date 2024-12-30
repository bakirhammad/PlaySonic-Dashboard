import { FC } from "react";
import { CustomKTIcon } from "..";
import clsx from "clsx";
import { toAbsoluteUrl } from "@presentation/helpers";

interface Props {
  inedx: number;
  imageUrl: string;
  fileName: string;
  imageClassName?: string;
  deleteBtn?: boolean;
  onClickDelete?: () => void;
}
const CustomImageReviewForUpdate: FC<Props> = ({
  inedx,
  imageUrl,
  imageClassName,
  deleteBtn = true,
  onClickDelete,
}) => {
  return (
    <>
      <li
        key={inedx}
        className="d-flex  align-items-center border-bottom pb-5 flex-grow-0  mb-4"
      >
        <div
          className={clsx(
            ` me-3 min-w-200px`,
            imageClassName && imageClassName
          )}
        >
          <a
            href={`${toAbsoluteUrl({
              pathname: imageUrl,
              extension: ".webp",
              size: "_1920x1080",
            })}`}
            target="_blank"
          >
            <img
              src={
                toAbsoluteUrl({
                  pathname: imageUrl,
                  extension: ".webp",
                  size: "_200x200",
                }) +
                "?date=" +
                new Date()
              }
              className="w-100 h-100"
              alt={imageUrl}
            />
          </a>
        </div>

        {deleteBtn && (
          <div>
            <button
              type="button"
              className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
              onClick={onClickDelete}
            >
              <CustomKTIcon iconName="trash" className="fs-3" />
            </button>
          </div>
        )}
      </li>
    </>
  );
};
export { CustomImageReviewForUpdate };

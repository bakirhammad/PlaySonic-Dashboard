import { FC } from "react";
import { CustomKTIcon } from "..";
import clsx from "clsx";

interface Props {
  index: number;
  fileUrl: string;
  fileName: string;
  fileClassName?: string;
  deleteBtn?: boolean;
  extension?: string;
  onClickDelete?: () => void;
}

const CustomFileReviewForUpdate: FC<Props> = ({
  index,
  fileUrl,
  fileName,
  fileClassName,
  deleteBtn = true,
  extension,
  onClickDelete,
}) => {
  const getFileIcon = () => {
    switch (extension) {
      case ".pdf":
        return "file-pdf";
      case ".doc":
      case ".docx":
        return "file-word";
      case ".xls":
      case ".xlsx":
        return "file-excel";
      default:
        return "file";
    }
  };

  return (
    <>
      <li
        key={index}
        className="d-flex flex-row justify-content-between align-items-center border-bottom pb-5 mb-4 "
      >
        <a
          href={import.meta.env.VITE_APP_MEDIA_URL + fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={clsx(
            `symbol symbol-45px me-5`,
            fileClassName && fileClassName
          )}
        >
          <div className="d-flex align-items-center justify-content-center w-100 h-100">
            <CustomKTIcon iconName={getFileIcon()} className="fs-3" />
          </div>
        </a>
        <div className="d-flex justify-content-start flex-column">
          <div className="text-gray-900 fw-medium align-self-start fs-6">
            {fileName.split("/")[fileName.split("/").length - 1]}
          </div>
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

export { CustomFileReviewForUpdate };

import { FC, useEffect } from "react";
import { WithChildren } from "@presentation/helpers/react18MigrationHelpers";
import { useLocaleFormate } from "@presentation/hooks/index";

interface Props {
  modalTitle: string;
  subTitle?: string;
  modalBtnOpenTitle?: string;
  modalBtnOpenClassName?: string;
  modalBtnOpenIcon?: string;
  modalClassName?: string;
  modalSize: "sm" | "lg" | "xl" | "xxl" | "Default";
  translate?: boolean;
  onClick: () => void;
}

export const CustomModal: FC<Props & WithChildren> = ({
  modalTitle,
  modalClassName,
  modalSize,
  subTitle,
  onClick,
  children,
  translate = true,
}) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const _modalTitle = translate ? useLocaleFormate(modalTitle) : modalTitle;
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);
  return (
    <>
      {" "}
      <style>
        {`
      .modal-xxl {
        max-width: 85%;
      }
    `}
      </style>
      <div
        className="modal fade show d-block"
        data-bs-backdrop="static"
        data-bs-keyboard="true"
        tabIndex={50}
        aria-hidden="true"
      >
        <div
          className={`modal-dialog modal-dialog-centered ${
            modalSize === "Default" ? "" : `modal-${modalSize} `
          }  ${modalClassName}`}
          style={{ width: "90%" }}
        >
          <div className="modal-content  d-flex justify-content-between ">
            {_modalTitle && (
              
            <div className="modal-header">
              <h1
                className="modal-title fw-bolder fs-5"
                id="staticBackdropLabel"
              >
                {_modalTitle}
              </h1>
              {subTitle && (
                <div className=" p-5">
                  <h4>({subTitle})</h4>
                </div>
              )}
              <button
                type="button"
                className="btn-close"
                onClick={onClick}
                aria-label="Close"
              ></button>
            </div>
            )}

            <div className="modal-body">{children}</div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

import clsx from "clsx";
import { Dispatch, SetStateAction } from "react";

interface Iprops {
  showHidePassword: boolean;
  setShowHidePassword: Dispatch<SetStateAction<boolean>>;
  touched: boolean;
}
export default function CustomToggleShowPassword({
  showHidePassword,
  setShowHidePassword,
  touched,
}: Iprops) {
  return (
    <span
      className={clsx(
        "btn btn-sm btn-icon position-absolute translate-middle top-50 end-0",
        touched ? "me-3" : "me-n3"
      )}
    >
      {!showHidePassword && (
        <i
          className="ki-duotone ki-eye-slash fs-1"
          onClick={() => {
            setShowHidePassword((pre) => !pre);
          }}
        >
          <span className="path1"></span>
          <span className="path2"></span>
          <span className="path3"></span>
          <span className="path4"></span>
        </i>
      )}
      {showHidePassword && (
        <i
          className="ki-duotone ki-eye fs-1"
          onClick={() => {
            setShowHidePassword((pre) => !pre);
          }}
        >
          <span className="path1"></span>
          <span className="path2"></span>
          <span className="path3"></span>
        </i>
      )}
    </span>
  );
}

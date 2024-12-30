import { useAuthStore } from "@infrastructure/storage/AuthStore";
import { useLocaleFormate } from "@presentation/hooks";
import clsx from "clsx";
import { ErrorMessage, useField } from "formik";
import { ReactNode, useLayoutEffect } from "react";
import Select from "react-select";
interface IProps {
  label?: string;
  placeholder?: string;
  name: string;
  fieldClassName?: string;
  labelClassName?: string;
  isSubmitting?: boolean;
  labelRequired?: boolean;
  containerClassName?: string;
  isMulti?: boolean;
  closeMenuOnSelect?: boolean;
  disabled?: boolean;
  children?: ReactNode;
}
export default function CustomCurrncySelectDDL({
  name,
  closeMenuOnSelect,
  disabled,
  fieldClassName,
  isMulti,
  isSubmitting,
  containerClassName = "",
  label,
  labelClassName,
  labelRequired = true,
  placeholder,
  children,
}: IProps) {
  const { defaultUserCurrency, userCurrencies } = useAuthStore();
  const [{ value }, { touched, error }, { setValue, setTouched }] =
    useField(name);
  const _label = useLocaleFormate(label || "");
  const _placeholder = useLocaleFormate(placeholder || "");
  useLayoutEffect(() => {
    if (!value) {
      setValue(defaultUserCurrency);
    }
  }, []);
  return (
    <>
      <div
        className={`d-flex justify-content-between align-items-center gap-2 mb-7 border border-1  p-2 rounded-1 ${containerClassName}`}
      >
        <div className="flex-grow-1">{children}</div>
        <div className="flex-grow-0">
          <div
            className="min-w-75px fv-row mb-7 "
            style={{ position: "relative" }}
          >
            {_label ? (
              <label
                className={clsx(
                  {
                    required: labelRequired,
                    "fw-bold fs-6 mb-3": true,
                  },
                  labelClassName && labelClassName
                )}
              >
                {_label}
              </label>
            ) : null}
            <Select
              menuPlacement="auto"
              isDisabled={isSubmitting || disabled}
              closeMenuOnSelect={closeMenuOnSelect}
              formatOptionLabel={(options) => (
                <div className="d-flex flex-row gap-5 align-items-center">
                  {options.image && (
                    <img
                      src={options.image}
                      className="w-25px mw-25px h-25px mh-25px rounded-circle"
                      alt=""
                    />
                  )}
                  <div>{options.label}</div>
                </div>
              )}
              className={clsx(
                fieldClassName && fieldClassName,
                "border border-0",
                {
                  "is-invalid": touched && error,
                },
                {
                  "is-valid": touched && !error,
                }
              )}
              placeholder={_placeholder ? _placeholder : null}
              options={userCurrencies}
              isMulti={isMulti}
              onChange={(e) => {
                setValue(e);
              }}
              onBlur={() => {
                setTouched(true, true);
              }}
              value={value}
            />
            {/* {_Icon && (
              <i
                className={_Icon}
                style={{
                  position: "absolute",
                  right: "41px",
                  top: "50%",
                  fontSize: "17px",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
              ></i>
            )} */}
            <div className="fv-plugins-message-container ms-2">
              <div className="fv-help-block">
                <p role="alert">{<ErrorMessage name={name} key={name} />}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

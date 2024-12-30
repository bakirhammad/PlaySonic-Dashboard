/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from "clsx";
import { useLocaleFormate } from "../../hooks/localization/useLocaleFormate";
import { FC, HTMLInputTypeAttribute, useEffect, useState } from "react";
import {
  ErrorMessage,
  Field,
  FormikErrors,
  FormikTouched,
  useField,
} from "formik";
import CustomToggleShowPassword from "./CustomToggleShowPassword";
import { PasswordMeterComponent } from "@assets/ts/components";

interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputTypeAttribute> {
  label?: string;
  placeholder?: string;
  name: string;
  fieldClassName?: string;
  labelClassName?: string;
  as?: "textarea" | "select" | "input";
  touched?: FormikTouched<{ [key: string]: boolean | string | any }>;
  errors?: FormikErrors<any>;
  isSubmitting?: boolean;
  labelRequired?: boolean;
  containerClassName?: string;
  toggleShowPassword?: boolean;
  showPasswordMeter?: boolean;
  withTooltip?: boolean;
  tooltipTitle?: string;
}

const CustomInputField: FC<InputFieldProps> = ({
  label,
  placeholder,
  type = "text",
  name,
  fieldClassName,
  containerClassName,
  labelRequired = true,
  as = "input",
  isSubmitting = false,
  disabled,
  toggleShowPassword,
  showPasswordMeter,
  withTooltip = false,
  tooltipTitle = "",
}) => {
  const _label = useLocaleFormate(label || "");
  const _placeholder = useLocaleFormate(placeholder || "");
  const [, meta] = useField(name);
  const [showHidePassword, setShowHidePassword] = useState(false);

  useEffect(() => {
    showPasswordMeter && PasswordMeterComponent.bootstrap();
  }, [showPasswordMeter]);

  return (
    <div
      className={clsx("fv-row mb-7", containerClassName && containerClassName)}
      data-kt-password-meter={showPasswordMeter ? "true" : "false"}
    >
      {_label ? (
        <label
          className={clsx({
            ["required"]: labelRequired,
            ["fw-bold fs-6 mb-2"]: true,
          })}
        >
          {_label}
        </label>
      ) : null}
      {withTooltip && (
        <span className="mx-1">
          <i
            className="bi bi-info-circle text-primary"
            data-bs-toggle="tooltip"
            data-bs-trigger="hover"
            title={tooltipTitle}
          ></i>
        </span>
      )}
      <div className="position-relative">
        <Field
          as={as}
          placeholder={_placeholder ? _placeholder : null}
          type={showHidePassword ? "text" : type}
          name={name}
          className={clsx(
            fieldClassName && fieldClassName,
            "form-control form-control-solid mb-3 mb-lg-0",
            {
              "is-invalid": meta.touched && meta.error && labelRequired,
            },
            {
              "is-valid": meta.touched && !meta.error && labelRequired,
            }
          )}
          disabled={isSubmitting ? isSubmitting : disabled}
        />
        {toggleShowPassword && (
          <CustomToggleShowPassword
            setShowHidePassword={setShowHidePassword}
            showHidePassword={showHidePassword}
            touched={meta.touched}
          />
        )}
      </div>
      {showPasswordMeter && (
        <>
          <div
            className="d-flex align-items-center mt-5 mb-3"
            data-kt-password-meter-control="highlight"
          >
            <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
            <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
            <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
            <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px"></div>
          </div>
          <div className="text-muted">
            Use 6 or more characters with a mix of letters, numbers & symbols.
          </div>
        </>
      )}
      <div className="fv-plugins-message-container ms-2">
        <div className="fv-help-block">
          <p role="alert">{<ErrorMessage name={name} key={name} />}</p>
        </div>
      </div>
    </div>
  );
};

export { CustomInputField };

import { FC, HTMLInputTypeAttribute } from "react";
import { useLocaleFormate } from "../../hooks/localization/useLocaleFormate";
import { Field, FormikErrors, FormikTouched, useField } from "formik";
import clsx from "clsx";

interface CustomRadioBtnProps
  extends React.InputHTMLAttributes<HTMLInputTypeAttribute> {
  labelTxt?: string;
  labelClassName?: string;
  txtClassName?: string;
  additionalClassName?: string;
  name: string;
  labelRequired?: boolean;
  touched?: FormikTouched<{ [key: string]: boolean }>;
  errors?: FormikErrors<{ [key: string]: string }>;
}

const CustomRadioBtn: FC<CustomRadioBtnProps> = ({
  labelTxt,
  labelClassName,
  labelRequired = true,
  name,
  value,
  txtClassName,
  touched,
  errors,
  additionalClassName,
  ...inputProps
}) => {
  const _labelTxt = useLocaleFormate(labelTxt);
  const [, meta] = useField(name);
  return (
    <>
      <div
        className={clsx(
          " d-flex flex-column fv-row justify-items-center my-5",
          additionalClassName
        )}
      >
        <label
          className={clsx({
            ["required"]: labelRequired,
            ["fv-row form-check form-check-sm form-check-custom form-check-solid "]:
              true,
          })}
        >
          <Field
            className="form-check-input"
            type="radio"
            name={name}
            value={value}
            {...inputProps}
          />
          {_labelTxt && (
            <span
              className={clsx(
                "form-check-label",
                txtClassName && txtClassName,
                {
                  "is-invalid": meta.touched && meta.error && labelRequired,
                },
                {
                  "is-valid": meta.touched && !meta.error && labelRequired,
                }
              )}
            >
              {_labelTxt}
            </span>
          )}
        </label>
        <div>
          {errors && errors[name] && touched[name] && (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                <span role="alert">{errors[name]}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export { CustomRadioBtn };

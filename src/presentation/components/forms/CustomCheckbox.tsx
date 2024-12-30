import { FC, HTMLInputTypeAttribute } from "react";
import { useLocaleFormate } from "../../hooks/localization/useLocaleFormate";
import { Field, FormikErrors, FormikTouched } from "formik";
import clsx from "clsx";

interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputTypeAttribute> {
  labelTxt?: string;
  isTranslated?: boolean;
  labelClassName?: string;
  txtClassName?: string;
  additionalClassName?: string;
  name: string;
  labelRequired?: boolean;
  touched?: FormikTouched<{ [key: string]: boolean }>;
  errors?: FormikErrors<{ [key: string]: string }>;
}

const CustomCheckbox: FC<CheckboxProps> = ({
  labelTxt,
  labelClassName,
  labelRequired = false,
  name,
  txtClassName,
  touched,
  errors,
  isTranslated = true,
  additionalClassName,
  value,
  ...inputProps
}) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const _labelTxt = isTranslated ? useLocaleFormate(labelTxt) : labelTxt;

  return (
    <>
      <div
        className={clsx(
          "d-flex flex-column fv-row justify-content-center  my-5",
          additionalClassName
        )}
      >
        <label
          className={clsx({
            ["required"]: labelRequired,
            ["fv-row form-check form-check-sm form-check-custom form-check-solid "]:
              true,
            labelClassName: labelClassName,
          })}
        >
          <Field
            className="form-check-input"
            type="checkbox"
            name={name}
            value={value}
            {...inputProps}
          />
          {_labelTxt && (
            <span
              className={clsx(
                "form-check-label",
                txtClassName && txtClassName
                // {
                //   "is-invalid": touched[name] && errors[name],
                // },
                // {
                //   "is-valid": touched[name] && !errors[name],
                // }
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

export { CustomCheckbox };

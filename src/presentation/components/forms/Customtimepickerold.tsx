import { FC, useRef, useEffect } from "react";
import {
  Field,
  FieldProps,
  FormikErrors,
  FormikTouched,
  ErrorMessage,
  useField,
} from "formik";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/material_blue.css";
import clsx from "clsx";
import { useLocaleFormate } from "@presentation/hooks";
import { FormikValues, useFormikContext } from "formik";
import moment from "moment";

interface DatePickerProps extends flatpickr.Options.Options {
  label: string;
  labelRequired?: boolean;
  placeholder: string;
  name: string;
  date?: Date | null;

  format?: string;
  additionalClassName?: string;
  allowInput?: boolean;
  Mode?: "single" | "multiple" | "time" | "range";
  touched: FormikTouched<{ [key: string]: boolean }>;
  errors: FormikErrors<{ [key: string]: string }>;
  _disable?: boolean;
  minDate?: Date | string;
}

const CustomTimePicker: FC<DatePickerProps> = ({
  label,
  labelRequired = true,
  placeholder,
  name,
  format = "Y-m-d H:i",
  position = "auto center",
  minDate,
  additionalClassName,
  allowInput = true,
  Mode = "single",
  ...props
}) => {
  const dateFormat = Mode === "time" ? "H:i" : format;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const _label = useLocaleFormate(label || "");
  const _placeholder = useLocaleFormate(placeholder || "");
  const { setFieldValue, setFieldTouched } = useFormikContext<FormikValues>();
  const [, meta] = useField(name);

  const convertToISO8601 = (dateString: string) => {
    return moment.utc(dateString, "YYYY-MM-DD HH:mm").toISOString();
  };

  useEffect(() => {
    if (inputRef.current) {
      flatpickr(inputRef?.current, {
        mode: Mode,
        altInput: true,
        allowInput,
        position: position,
        dateFormat: dateFormat,
        minDate: minDate,
        closeOnSelect: Mode == "multiple" ? false : true,
        ...props,

        onChange: (selectedDates) => {
          if (selectedDates) {
            let value;
            if (Mode === "single") {
              value = convertToISO8601(inputRef.current?.value || "");
            } else if (Mode === "time") {
              const timeValue = inputRef.current?.value || "";
              const [hour, minute] = timeValue.split(":");
              value = `${hour}:${minute}`;
            } else {
              value = selectedDates;
            }
            setFieldValue(name, value);
          } else {
            setFieldValue(name, null);
          }
        },
        onClose: () => {
          setFieldTouched(name);
        },
      });
    }
  }, [minDate]);

  return (
    <Field name={name}>
      {({ field, form }: FieldProps) => (
        <>
          {console.log("field.value", field.value)}
          <div
            className={clsx(
              additionalClassName
                ? additionalClassName
                : "fw-bold fs-6 fv-row mb-7"
            )}
          >
            {_label && (
              <label
                className={clsx({
                  required: labelRequired,
                  "fw-bold fs-6 fv-row mb-2 ": true,
                  flatpickr: true,
                  className: true,
                })}
              >
                {_label}
              </label>
            )}

            <input
              ref={inputRef}
              type="text"
              placeholder={_placeholder}
              className={clsx(
                "form-control form-control-solid  mb-3 mb-lg-0",
                {
                  "is-invalid": meta.touched && meta.error,
                },
                {
                  "is-valid": meta.touched && !meta.error,
                }
              )}
              {...field}
              onBlur={() => form.setFieldTouched(name)}
              value={field.value}
            />

            <div className="fv-plugins-message-container ms-2">
              <div className="fv-help-block">
                <p role="alert">{<ErrorMessage name={name} key={name} />}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </Field>
  );
};

export default CustomTimePicker;

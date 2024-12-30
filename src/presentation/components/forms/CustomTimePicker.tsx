import { useLocaleFormate } from "@presentation/hooks";
import clsx from "clsx";
import {
  useField,
  Field,
  FieldProps,
  ErrorMessage,
  FormikErrors,
  FormikTouched,
} from "formik";
import flatpickr from "flatpickr";
import moment from "moment";
import { FC, useRef, useEffect } from "react";

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
  touched?: FormikTouched<{ [key: string]: boolean }>;
  errors?: FormikErrors<{ [key: string]: string }>;
  _disable?: boolean;
  minDate?: string | Date;
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
  _disable = false,
  allowInput = true,
  Mode = "single",
  time_24hr = true,
  ...props
}) => {
  const dateFormat = Mode === "time" ? "H:i" : format;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const flatpickrInstance = useRef<flatpickr.Instance | null>(null);
  const _label = useLocaleFormate(label || "");
  const _placeholder = useLocaleFormate(placeholder || "");
  const [field, meta, { setTouched, setValue }] = useField(name);

  const convertToDataWithTime = (dateString: Date | string) => {
    return moment(dateString).format("YYYY-MM-DD HH:mm");
  };
  const convertToDate = (dateString: Date | string) => {
    return moment(dateString).format("YYYY-MM-DD");
  };

  useEffect(() => {
    if (inputRef.current) {
      const minDateValue = minDate ? convertToDate(minDate) : undefined;
      flatpickrInstance.current = flatpickr(inputRef?.current, {
        mode: Mode,
        altInput: Mode === "multiple" ? true : false,
        errorHandler: () => {},
        allowInput,
        time_24hr,
        position: position,
        // dateFormat: dateFormat,
        minDate: minDateValue,
        closeOnSelect: Mode === "single" || Mode === "time",
        // defaultDate: field.value,
        defaultHour: moment().hour(),
        defaultMinute: moment().minute(),
        onChange: (selectedDates) => {
          if (selectedDates.length > 0) {
            let value;
            if (Mode === "single") {
              if (props.enableTime) {
                value = convertToDataWithTime(selectedDates[0]);
              } else {
                value = convertToDate(selectedDates[0]);
              }
            } else if (Mode === "time") {
              value = moment(selectedDates[0]).format("HH:mm");
            } else if (Mode === "multiple") {
              value = selectedDates.map((date) => {
                return props.enableTime
                  ? convertToDataWithTime(date)
                  : convertToDate(date);
              });
            }
            if (JSON.stringify(value) !== JSON.stringify(field.value)) {
              setValue(value);
            }
          } else {
            setValue(null);
          }
        },
        onClose: () => {
          setTouched(true);
        },
        ...props,
      });

      const stopPropagation = (event: MouseEvent) => {
        event.stopPropagation();
      };
      flatpickrInstance.current.calendarContainer?.addEventListener(
        "click",
        stopPropagation
      );

      return () => {
        flatpickrInstance.current?.calendarContainer?.removeEventListener(
          "click",
          stopPropagation
        );

        if (flatpickrInstance?.current) {
          if (!Array.isArray(flatpickrInstance?.current)) {
            flatpickrInstance?.current?.destroy();
          }
        }
      };
    }
  }, [Mode, minDate, allowInput, dateFormat, position, name]);

  useEffect(() => {
    if (flatpickrInstance.current) {
      const value = Array.isArray(field.value)
        ? field.value.map((date) => new Date(date))
        : field.value;
      flatpickrInstance.current.setDate(value, true); // Ensure multiple dates are set
    }
  }, []); // Keep dependencies minimal

  const openCalendar = () => {
    if (flatpickrInstance.current && inputRef.current) {
      flatpickrInstance.current.open();
    }
  };
  return (
    <Field name={name} disabled={_disable}>
      {({ field }: FieldProps) => (
        <>
          <div
            className={clsx(
              !!additionalClassName && additionalClassName,
              "fw-bold fs-6 fv-row mb-7"
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

            <div className="input-group">
              <input
                ref={inputRef}
                type="text"
                placeholder={_placeholder}
                disabled={_disable}
                className={clsx(
                  "form-control form-control-solid mb-3 mb-lg-0",
                  {
                    "is-invalid": meta.touched && meta.error,
                  },
                  {
                    "is-valid": meta.touched && !meta.error,
                  },
                  {
                    active: _disable,
                  }
                )}
                {...field}
                onBlur={() => setTouched(true)}
                // value={
                //   Array.isArray(field.value)
                //     ? field.value.join(",")
                //     : field.value
                // }
              />
              <span
                className="input-group-text btn btn-light active z-0"
                style={{ position: "relative", zIndex: 0 }}
                onClick={openCalendar}
              >
                <i className="bi bi-calendar3"></i>
              </span>
            </div>

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

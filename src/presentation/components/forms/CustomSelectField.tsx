/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IDDlOption,
  IDDlOptionClub,
  IDDlOptionSlotType,
} from "@domain/entities";
import { useLocaleFormate } from "@presentation/hooks/index";
import clsx from "clsx";
import {
  ErrorMessage,
  Field,
  FieldProps,
  FormikErrors,
  FormikTouched,
  useField,
} from "formik";
import { FC, useCallback, useMemo, useState } from "react";
import Select, { CSSObjectWithLabel } from "react-select";
interface InputFieldProps {
  label?: string;
  placeholder?: string;
  name: string;
  _Icon?: string;
  fieldClassName?: string;
  labelClassName?: string;
  touched?: FormikTouched<{ [key: string]: boolean | string | any }>;
  errors?: FormikErrors<any>;
  isSubmitting?: boolean;
  labelRequired?: boolean;
  containerClassName?: string;
  isMulti?: boolean;
  closeMenuOnSelect?: boolean;
  isloading?: boolean;
  options: IDDlOption[] | IDDlOptionClub[] | IDDlOptionSlotType[];
  disabled?: boolean;
  isOptionDisabled?: (option: any) => boolean;
}
const CustomSelectField: FC<InputFieldProps> = ({
  label,
  placeholder,
  name,
  fieldClassName,
  containerClassName,
  labelClassName,
  labelRequired = true,
  _Icon = "",
  closeMenuOnSelect = true,
  isSubmitting = false,
  isMulti = false,
  isloading = false,
  options = [],
  disabled = false,
  isOptionDisabled,
}: InputFieldProps) => {
  const _label = useLocaleFormate(label || "");
  const _placeholder = useLocaleFormate(placeholder || "");
  const [_, meta] = useField(name);
  const [inputValue, setInputValue] = useState("");
  const newOptions = useMemo(() => {
    return !isloading
      ? isMulti
        ? [
            { label: "All", value: "all" },
            { label: "All Filtered", value: "allFiltered" },
            ...options,
          ]
        : options
      : [];
  }, [isMulti, isloading, options]);

  const handleSelectChange = useCallback(
    (option: IDDlOption[], form: any, inputValue: string) => {
      if (Object.keys(option).length) {
        if (isMulti) {
          if (option.find((ele: any) => ele.value === "all")) {
            form.setFieldValue(name, options);
          } else if (option.find((ele: any) => ele.value === "allFiltered")) {
            const uniqueOptions = new Set(form.values[name] || []);

            const searchTerm = inputValue.toLowerCase();
            options
              .filter((option) =>
                typeof option.label === "string"
                  ? option.label.toLowerCase().includes(searchTerm)
                  : option.label
              )
              .forEach((option) => uniqueOptions.add(option));

            form.setFieldValue(name, Array.from(uniqueOptions));
          } else {
            form.setFieldValue(name, option);
          }
        } else {
          form.setFieldValue(name, option);
        }
      } else {
        form.setFieldValue(name, null);
      }
    },
    [isMulti, name, options]
  );

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();
  return (
    <>
      <div
        className={clsx(
          "fv-row mb-7",
          containerClassName && containerClassName
        )}
      >
        {_label ? (
          <label
            className={clsx(
              {
                required: labelRequired,
                "fw-bold fs-6": true,
              },
              labelClassName && labelClassName
            )}
          >
            {_label}
          </label>
        ) : null}

        <div onClick={stopPropagation} style={{ position: "relative" }}>
          <Field name={name} disabled={isSubmitting || disabled}>
            {({ field, form }: FieldProps) => (
              <>
                <Select
                  styles={customStyles}
                  isOptionDisabled={isOptionDisabled}
                  menuPlacement="auto"
                  isDisabled={disabled}
                  filterOption={(option, inputValue) => {
                    if (!inputValue) {
                      return option.value === "allFiltered" ? false : true;
                    }
                    if (option.value === "all") {
                      return false;
                    }
                    return (
                      option.label
                        .toLowerCase()
                        .includes(inputValue.toLowerCase()) ||
                      option.value === "allFiltered"
                    );
                  }}
                  closeMenuOnSelect={closeMenuOnSelect}
                  isLoading={isloading}
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
                    "react-select-styled react-select-solid",
                    fieldClassName && fieldClassName,
                    "form-control border border-0 mb-3 mb-lg-0",
                    {
                      "is-invalid": meta.touched && meta.error && labelRequired,
                    },
                    {
                      "is-valid": meta.touched && !meta.error && labelRequired,
                    }
                  )}
                  classNamePrefix="react-select"
                  placeholder={_placeholder ? _placeholder : null}
                  {...field}
                  options={newOptions || []}
                  isMulti={isMulti}
                  onChange={(option: IDDlOption[]) => {
                    handleSelectChange(option, form, inputValue);
                  }}
                  onInputChange={(value) => setInputValue(value)}
                  onBlur={() => {
                    form.setFieldTouched(name);
                  }}
                  value={field.value}
                />
                {_Icon && (
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
                )}
                <div className="fv-plugins-message-container ms-2">
                  <div className="fv-help-block">
                    <p role="alert">
                      {<ErrorMessage name={name} key={name} />}
                    </p>
                  </div>
                </div>
              </>
            )}
          </Field>
        </div>
      </div>
    </>
  );
};

export default CustomSelectField;

const customStyles = {
  menu: (defaultStyles: CSSObjectWithLabel) => ({
    ...defaultStyles,
    // backgroundColor: "#212529",
    zIndex: 1000,
  }),
  // option: (
  //   defaultStyles: CSSObjectWithLabel,
  //   state: { isSelected: boolean; isFocused: boolean }
  // ) => ({
  //   ...defaultStyles,
  //   color: state.isSelected ? "#fff" : state.isFocused ? "#212529" : "#fff",

  //   backgroundColor: state.isSelected
  //     ? "#056ee9"
  //     : state.isFocused
  //     ? "#deebff"
  //     : "#212529",
  // }),

  // control: (defaultStyles: CSSObjectWithLabel) => ({
  //   ...defaultStyles,
  //   backgroundColor: "#212529",
  //   border: "none",
  // }),
  // singleValue: (defaultStyles: CSSObjectWithLabel) => ({
  //   ...defaultStyles,
  //   color: "#fff",
  // }),
};

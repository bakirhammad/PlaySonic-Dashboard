import {
  CustomButton,
  CustomInputField,
  CustomKTIcon,
  showAreYouSure,
  showConfirmationAlert,
} from "@presentation/components";
import { useLocaleFormate } from "@presentation/hooks";
import clsx from "clsx";
import { FieldArray, FormikValues, useFormikContext } from "formik";

interface IProps {
  name: string;
  label: string;
  labelRequired?: boolean;
}

export interface IRange {
  ageFrom: string;
  ageTo: string;
  isDeleted?: boolean;
}

const CustomAddRange = ({ name, label, labelRequired = true }: IProps) => {
  const { values, errors, touched } = useFormikContext<FormikValues>();
  const _label = useLocaleFormate(label || "");

  return (
    <div className="fv-row mb-7">
      {_label ? (
        <>
          <hr />
          <h2
            className={clsx({
              required: labelRequired,
              "fw-bold text-info mx-auto  mb-2": true,
            })}
          >
            {_label}
          </h2>
        </>
      ) : null}
      <FieldArray name={name}>
        {({ remove, push }) => (
          <>
            <div className="d-flex justify-content-end pe-5">
              <CustomButton
                type="button"
                className="btn btn-primary"
                text="ADD_RANGE"
                onClick={() =>
                  push({ id: 0, ageFrom: "", ageTo: "", isDeleted: false })
                }
                icon
                iconName="bi bi-plus-lg"
              />
            </div>
            {values[name]?.map(
              (range: IRange, index: number) =>
                !range.isDeleted && (
                  <>
                    <div key={index} className="row  mb-3">
                      <div className="col-md-5">
                        <CustomInputField
                          name={`${name}[${index}].ageFrom`}
                          label={"FROM"}
                          placeholder={"FROM"}
                          touched={touched}
                          errors={errors}
                          labelRequired={labelRequired}
                        />
                      </div>
                      <div className="col-md-5">
                        <CustomInputField
                          name={`${name}[${index}].ageTo`}
                          label={"TO"}
                          placeholder={"TO"}
                          touched={touched}
                          errors={errors}
                          labelRequired={labelRequired}
                        />
                      </div>
                      {values[name]?.length > 1 && (
                        <div className="col-md-2 d-flex align-items-center w-auto p-2">
                          <button
                            type="button"
                            className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                            onClick={async () => {
                              if (values[name][index].id == 0) {
                                remove(index);
                              } else {
                                const confirm = await showConfirmationAlert();
                                if (confirm) {
                                  remove(index);
                                }
                              }
                            }}
                          >
                            <CustomKTIcon iconName="trash" className="fs-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )
            )}
          </>
        )}
      </FieldArray>
    </div>
  );
};

export default CustomAddRange;

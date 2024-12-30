import { CustomCheckbox } from "@presentation/components";
import { servicesOptionDDL } from "@presentation/helpers";
import { FormikErrors, FormikTouched } from "formik";
import { FC } from "react";

interface IProps {
  touched: FormikTouched<{ [key: string]: boolean }>;
  errors: FormikErrors<{ [key: string]: string }>;
  name: string;
}

const ServicesCheckbox: FC<IProps> = ({ name, errors, touched }) => {
  return (
    <div className="row">
      <div className="col-6 d-flex flex-wrap gap-5">
        {servicesOptionDDL.map((day) => (
          <CustomCheckbox
            labelTxt={day.label}
            isTranslated={false}
            name={name}
            labelRequired={false}
            touched={touched}
            errors={errors}
            key={day.value}
            value={String(day.value)}
          />
        ))}
      </div>
    </div>
  );
};

export default ServicesCheckbox;

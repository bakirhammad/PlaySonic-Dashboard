import { type FC } from "react";

type StepperProps = {
  activeStep: number;
};

const Stepper: FC<StepperProps> = ({ activeStep }) => {
  const steps = [
    { id: 1, label: "Your Choice" },
    { id: 2, label: "Your Details" },
    { id: 3, label: "Confirmation" },
  ];

  return (
    <ul className="tw-relative tw-flex tw-flex-row tw-gap-x-2 tw-mb-10">
      {steps.map((step, index) => (
        <li key={step.id} className="tw-shrink tw-basis-0 tw-flex-1 group ">
          <div className="tw-min-w-7 tw-min-h-7 tw-w-full tw-inline-flex tw-items-center tw-text-xs tw-align-middle">
            <span
              className={`tw-size-12 tw-flex tw-justify-center tw-items-center tw-shrink-0 tw-font-medium tw-rounded-full   ${
                activeStep === step.id
                  ? "tw-bg-[#2FA3DB] tw-text-white "
                  : "tw-border tw-border-[#2FA3DB] tw-bg-transparent tw-text-[#2FA3DB]"
              }`}
            >
              {step.id}
            </span>
            {index < steps.length && (
              <div
                className={`tw-ms-2 tw-w-full tw-h-px tw-flex-1  ${
                  activeStep > step.id ? "tw-bg-[#2FA3DB]" : "tw-bg-gray-200"
                }`}
              ></div>
            )}
          </div>
          <div className="tw-mt-3 tw-flex tw-items-center">
            <span className="tw-block tw-text-sm tw-font-medium tw-text-gray-800">
              {step.label}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default Stepper;

import { useLanguageStore } from "@infrastructure/storage/LanguageStore";
import { isNotEmpty } from "./crudHelper/helpers";

type type = {
  nameFieldName: string;
  nameFieldDesc: string;
  values: any;
  setFieldError: (field: string, message: string | undefined) => void;
  setLanguageInput: (id: number) => void;
};

function CheckNameFieldIfRequired({
  nameFieldDesc,
  nameFieldName,
  setFieldError,
  setLanguageInput,
  values,
}: type) {
  const Languages = useLanguageStore.getState().Languages;
  let isRequired = false;
  for (const { id } of Languages) {
    const descriptionValue = values[`${nameFieldDesc}${id}`];
    const nameValue = values[`${nameFieldName}${id}`];

    if (isNotEmpty(descriptionValue) && !isNotEmpty(nameValue)) {
      setFieldError(`${nameFieldName}${id}`, "This field is required");
      setLanguageInput(id);
      isRequired = true;
      break; // Exit early if a required field is found
    }
  }

  return { isRequired };
}
export { CheckNameFieldIfRequired };

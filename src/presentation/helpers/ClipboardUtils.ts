import { CustomToast } from "@presentation/components";

const copyToClipboard = async (values: Array<number | string | object>) => {
  console.log("vvvv", values);

  try {
    const formattedValues = JSON.stringify(values, null, 2);
    console.log("formattedValues", formattedValues);

    await navigator.clipboard.writeText(formattedValues);
    CustomToast("Copied to clipboard successfully!", "success", {
      autoClose: 2000,
    });
  } catch (err) {
    CustomToast(`Failed to copy text to clipboard ${err}`, "error", {
      autoClose: 2000,
    });
    console.error("Failed to copy text to clipboard ", err);
  }
};

const pasteFromClipboard = async (
  setFieldValue: (fieldPath: string, value: number | string | object) => void,
  nameFieldsToPaste: Array<string> | string,

  index = 0
) => {
  try {
    const text = await navigator.clipboard.readText();

    const values = JSON.parse(text) as Array<number | string | object>;

    !Array.isArray(nameFieldsToPaste)
      ? setFieldValue(`${nameFieldsToPaste}[${[index]}]`, values)
      : nameFieldsToPaste.forEach((fieldPath, index) => {
          if (values[index] !== null && values[index] !== undefined) {
            setFieldValue(fieldPath, values[index]);
          }
        });

    CustomToast("Pasted from clipboard successfully!", "success", {
      autoClose: 2000,
    });
  } catch (err) {
    CustomToast(`Failed to paste text from clipboard ${err}`, "error", {
      autoClose: 2000,
    });
    console.error("Failed to read clipboard contents: ", err);
  }
};

export { copyToClipboard, pasteFromClipboard };

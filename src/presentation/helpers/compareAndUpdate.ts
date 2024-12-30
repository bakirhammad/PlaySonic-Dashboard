import { FormikValues } from "formik";

export function compareAndUpdate<T>(
  initialArray: T[] | [],
  currentArray: FormikValues | []
) {
  const initialMap = new Map(initialArray?.map((item) => [item.id, item]));

  currentArray?.forEach((item: any) => {
    const parseItem = item;

    if (initialMap.has(parseItem.id)) {
      initialMap.delete(parseItem.id);
    } else {
      parseItem.id ? (parseItem.id = 0) : "";
    }
  });

  initialMap?.forEach((item) => {
    const parseItem = item;

    currentArray?.push({ ...parseItem, isDeleted: true });
  });
  return currentArray?.map((item) => {
    return item;
  });
}

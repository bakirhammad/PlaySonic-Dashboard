export function extractEnumLabelsFromBits(
  values: number,
  _enum: object,
  extractMultiple: boolean,
  extractValues?: boolean
) {
  if (extractMultiple) {
    return Object.keys(_enum)
      .filter((v) => (extractValues ? typeof v === "number" : isNaN(Number(v))))
      .filter((key) => {
        return _enum[key as keyof typeof _enum] & values;
      });
  } else {
    return Object.keys(_enum)
      .filter((v) => (extractValues ? typeof v === "number" : isNaN(Number(v))))
      .find((key) => {
        return _enum[key as keyof typeof _enum] & values;
      });
  }
}

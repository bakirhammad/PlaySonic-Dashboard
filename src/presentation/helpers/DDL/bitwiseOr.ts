export function combineBits(values: number[] | undefined): number {
  if (!values || values.length === 0) {
    return 0;
  }

  return values.reduce(
    (accumulator, currentValue) => accumulator | currentValue,
    0
  );
}
 
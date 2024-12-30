export interface IDDlOption {
  value: number | boolean | string;
  label: string;
  image?: string | undefined;
  service?: number | undefined;

  otherValues?: { [type: string]: { value: number | boolean | string } };
}

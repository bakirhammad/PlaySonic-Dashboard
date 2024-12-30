import { channel } from "@domain/enums/channel";
export interface IchannelOptionsDDL {
  value: number;
  label: string;
  image?: string | undefined;
}
export const channelOptionsDDL: IchannelOptionsDDL[] = Object.keys(channel)
  .filter((v) => isNaN(Number(v)))
  .map((key) => ({
    value: channel[key as keyof typeof channel],
    label: key,
  }));

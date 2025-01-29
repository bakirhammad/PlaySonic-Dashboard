/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ICountryCommand {
  createCountry(url: string, body: any): Promise<ICountryBody[]>;
  updateCountry(url: string, body: ICountryBody): Promise<ICountryBody[]>;
  deleteCountry(url: string, id: number): Promise<ICountryBody>;
  multipleDeleteCountry(url: string, ids: number[]): Promise<ICountryBody>;
  deleteImage(
    url: string,
    id: number,
    isDeleteFlag: boolean,
    isDeleteImage: boolean
  ): Promise<ICountryBody>;
}
export interface ICountryQuery {
  getCountryList(url: string): Promise<ICountryBody>;
}
export interface ICountryQueryById {
  getCountryById(url: string, id: number | string): Promise<ICountryData>;
}
export interface ICountryBody {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  data: ICountryData[];
}
export interface ICountryData {
  id: number;
  rank: number,
  payload: string,
  translations: ICountryTranslation[];
}

export interface ICountryTranslation {
  id: number;
  countryId: number;
  name: string;
  langId: number;
  description: string;
}

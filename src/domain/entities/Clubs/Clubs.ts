/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IClubCommand {
  createClub(url: string, body: any): Promise<IClubData>;
  updateClub(
    url: string,
    body: IClubBody
  ): Promise<IClubData>;
  deleteClub(url: any, id: number): Promise<IClubData>;
  multipleDeleteClub(
    url: string,
    ids: number[]
  ): Promise<IClubData>;
}

export interface IClubQuery {
  getClubList(url: string): Promise<IClubBody>;
}

export interface IClubQueryById {
  getClubById(
    url: string,
    id: number | string
  ): Promise<IClubData>;
}

export interface IClubBody {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  data: IClubData[];
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    message: string;
  };
}

export interface IClubData {
  id: number;
  categoryId: number;
  image: string;
  images: string;
  status: boolean;
  durationDays: number;
  durationHours: number;
  durationMinutes: number;
  pickUpTime: string;
  maxNumberOfSeats: number;
  closingDay: number;
  closingDates: closingDates[];
  translationResponses: IClubTranslation[];
  cityId: number;
  countryId: number;
}

export interface IClubTranslation {
  id: number;
  tourId: number;
  name: string;
  description: string;
  note: string;
  langId: number;
}
export interface closingDates {
  id: number;
  tourId: number;
  closingDate: string;
}

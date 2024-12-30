/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ISightSeeingTourCommand {
  createSightSeeingTour(url: string, body: any): Promise<ISightSeeingTourData>;
  updateSightSeeingTour(
    url: string,
    body: ISightSeeingTourBody
  ): Promise<ISightSeeingTourData>;
  deleteSightSeeingTour(url: any, id: number): Promise<ISightSeeingTourData>;
  multipleDeleteSightSeeingTour(
    url: string,
    ids: number[]
  ): Promise<ISightSeeingTourData>;
  deleteMainImageSightSeeingTour(
    url: string,
    body: number
  ): Promise<ISightSeeingTourData>;
  deleteImagesSightSeeingTour(
    url: string,
    id: number,
    imgname: string
  ): Promise<ISightSeeingTourData>;
}

export interface ISightSeeingTourQuery {
  getSightSeeingTourList(url: string): Promise<ISightSeeingTourBody>;
}

export interface ISightSeeingTourQueryById {
  getSightSeeingTourById(
    url: string,
    id: number | string
  ): Promise<ISightSeeingTourData>;
}

export interface ISightSeeingTourBody {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  data: ISightSeeingTourData[];
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    message: string;
  };
}

export interface ISightSeeingTourData {
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
  translationResponses: ISightSeeingTourTranslation[];
  cityId: number;
  countryId: number;
}

export interface ISightSeeingTourTranslation {
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

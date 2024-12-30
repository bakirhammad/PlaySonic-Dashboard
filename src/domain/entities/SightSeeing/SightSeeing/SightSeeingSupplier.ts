/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ISightSeeingSupplierCommand {
  createSightSeeingSupplier(
    url: string,
    body: any
  ): Promise<ISightSeeingSupplierData>;
  updateSightSeeingSupplier(
    url: string,
    body: ISightSeeingSupplierBody
  ): Promise<ISightSeeingSupplierData>;
  deleteSightSeeingSupplier(
    url: any,
    id: number
  ): Promise<ISightSeeingSupplierData>;
  multipleDeleteSightSeeingSupplier(
    url: string,
    ids: number[]
  ): Promise<ISightSeeingSupplierData>;
}

export interface ISightSeeingSupplierQuery {
  getSightSeeingSupplierList(url: string): Promise<ISightSeeingSupplierBody>;
}

export interface ISightSeeingSupplierQueryById {
  getSightSeeingSupplierById(
    url: string,
    id: number | string
  ): Promise<ISightSeeingSupplierData>;
}

export interface ISightSeeingSupplierBody {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  data: ISightSeeingSupplierData[];
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    message: string;
  };
}
interface CityCountryDetails {
  cityId: number;
  cityName: string;
  countryId: number;
  countryName: string;
}

interface SightSeeingTourDetails {
  sightSeeingTourId: number;
  sightSeeingTourName: string;
  countryId: number;
  countryName: string;
  cityId: number;
  cityName: string;
}

export interface SightSeeingSearchData {
  cityCountryDetails: CityCountryDetails[];
  sightSeeingTourDetails: SightSeeingTourDetails[];
}

export interface ISightSeeingSupplierData {
  id: number;
  tourId: number;
  supplierId: number;
  status: boolean;
  tourName: string;
  supplierName: string;
}

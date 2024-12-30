/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ISightSeeingTourRateCommand {
  createSightSeeingTourRate(
    url: string,
    body: any
  ): Promise<ISightSeeingTourRateData>;
  updateSightSeeingTourRate(
    url: string,
    body: ISightSeeingTourRateBody
  ): Promise<ISightSeeingTourRateData>;
  deleteSightSeeingTourRate(
    url: any,
    id: number
  ): Promise<ISightSeeingTourRateData>;
  multipleDeleteSightSeeingTourRate(
    url: string,
    ids: number[]
  ): Promise<ISightSeeingTourRateData>;
}

export interface ISightSeeingTourRateQuery {
  getSightSeeingTourRateList(url: string): Promise<ISightSeeingTourRateBody>;
}

export interface ISightSeeingTourRateQueryById {
  getSightSeeingTourRateById(
    url: string,
    id: number | string
  ): Promise<ISightSeeingTourRateData>;
}

export interface ISightSeeingTourRateBody {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  data: ISightSeeingTourRateData[];
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    message: string;
  };
}

export interface ISightSeeingTourRateData {
  id: number;
  tourId: number;
  sightSeeingSupplierId: number;
  fromDate: string;
  toDate: string;
  tourName: string;
  creationDateUtc: string;
  createdByUserId: string;
  adultCostCurrencyId: number;
  adultMarkupCurrencyId: number;
  currencyId: number;
  currencyName: string;
  marketId: number;
  marketName: string;
  numberOfAdults: number;
  numberOfChildren: number;
  adultCost: number;
  adultMarkup: number;
  isActive: boolean;
  children: ISightSeeingTourRateChild[];
  policies: ISightSeeingTourRatePolicy[];
  translations: ISightSeeingTourRateTranslation[];
  marketResponses: ISightSeeingTourRateMarket[];
}

export interface ISightSeeingTourRateChild {
  id: number;
  rateId: number;
  childNumber: number;
  rangeFrom: number;
  rangeTo: number;
  childCost: number;
  childMarkup: number;
  childCostCurrencyId: number;
  childMarkupCurrencyId: number;
  isDeleted: boolean;
}

export interface ISightSeeingTourRatePolicy {
  id: number;
  rateId: number;
  policyId: number;
  isDeleted: boolean;
}

export interface ISightSeeingTourRateTranslation {
  id: number;
  rateId: number;
  name: string;
  note: string;
  sightSeeingCategoryId: number;
  langId: number;
}
export interface ISightSeeingTourRateMarket {
  sightSeeingTourRateId: number;
  marketId: number;
  marketName: string;
}

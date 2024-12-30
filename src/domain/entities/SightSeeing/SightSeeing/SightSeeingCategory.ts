/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ISightSeeingCategoryCommand {
  createSightSeeingCategory(
    url: string,
    body: any
  ): Promise<ISightSeeingCategoryData>;
  updateSightSeeingCategory(
    url: string,
    body: ISightSeeingCategoryBody
  ): Promise<ISightSeeingCategoryData>;
  deleteSightSeeingCategory(
    url: any,
    id: number
  ): Promise<ISightSeeingCategoryData>;
  multipleDeleteSightSeeingCategory(
    url: string,
    ids: number[]
  ): Promise<ISightSeeingCategoryData>;
}

export interface ISightSeeingCategoryQuery {
  getSightSeeingCategoryList(url: string): Promise<ISightSeeingCategoryBody>;
}

export interface ISightSeeingCategoryQueryById {
  getSightSeeingCategoryById(
    url: string,
    id: number | string
  ): Promise<ISightSeeingCategoryData>;
}

export interface ISightSeeingCategoryBody {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  data: ISightSeeingCategoryData[];
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    message: string;
  };
}

export interface ISightSeeingCategoryData {
  id: number;
  code: string;
  status: boolean;
  translations: ISightSeeingCategoryTranslation[];
}

export interface ISightSeeingCategoryTranslation {
  id: number;
  sightSeeingCategoryId: number;
  langId: number;
  name: string;
}

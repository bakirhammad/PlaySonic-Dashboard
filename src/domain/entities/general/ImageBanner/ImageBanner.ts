/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IImageBannerCommand {
  createImageBanner(url: string, body: any): Promise<IImageBannerData>;
  updateImageBanner(
    url: string,
    body: IImageBannerBody
  ): Promise<IImageBannerData>;
  deleteImageBanner(url: any, id: number): Promise<IImageBannerData>;
  multipleDeleteImageBanner(
    url: string,
    ids: number[]
  ): Promise<IImageBannerData>;

    deleteBannerImage(
      url: string,
      id: number,
      isDeleteImage: boolean
    ): Promise<IImageBannerData>;
}

export interface IImageBannerQuery {
  getImageBannerList(url: string): Promise<IImageBannerBody>;
}

export interface IImageBannerQueryById {
  getImageBannerById(
    url: string,
    id: number | string
  ): Promise<IImageBannerData>;
}

export interface IImageBannerBody {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  data: IImageBannerData[];
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    message: string;
  };
}

export interface IImageBannerData {
  id: number,
  title: string,
  description: string,
  image: string
  path: string
}

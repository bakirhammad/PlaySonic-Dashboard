/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IGetPlaySonicById {
  getPlaySonicById(
    url: string,
    id: number | string
  ): Promise<IPlaySonicData>;


}

export interface IPalaySonicBody {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  data: IPlaySonicData[];
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    message: string;
  };
}

export interface IPlaySonicData {
  id: number;
  userName: string,
  phoneNumer: string,
  userId: string,
  playSonicId: number
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IMyUsersCommand {
  createMyUsers(url: string, body: any): Promise<IMyUsersData>;
  updateMyUsers(
    url: string,
    body: IMyUsersBody
  ): Promise<IMyUsersData>;
  deleteMyUsers(url: any, id: number): Promise<IMyUsersData>;
  multipleDeleteMyUsers(
    url: string,
    ids: number[]
  ): Promise<IMyUsersData>;
}

export interface IMyUsersQuery {
  getMyUsersList(url: string): Promise<IMyUsersBody>;
}

export interface IMyUsersQueryById {
  getMyUsersById(
    url: string,
    id: number | string
  ): Promise<IMyUsersData>;
}

export interface IMyUsersBody {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  data: IMyUsersData[];
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    message: string;
  };
}

export interface IMyUsersData {
  id: number;
  email: string;
  userName: string;
  phoneNo: string;
  firstName: string;
  lastName: string;
  address: string | null;
  countryId: string | null;
  cityId: string | null;
  postCode: string | null;
  photo: string | null;
  active: boolean;
  level: number;
  otp: string;
  token: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IManageStaffCommand {
  createManageStaff(url: string, body: any): Promise<IManageStaffData>;
  updateManageStaff(url: string, body: any): Promise<IManageStaffData>;
  deleteManageStaff(url: string, id: number): Promise<IManageStaffData>;
  multipleDeleteStaff(url: string, ids: number[]): Promise<IManageStaffData>;
}
export interface IManageStaffQuery {
  getManageStaffList(url: string): Promise<IManageStaffBody>;
}
export interface IManageStaffQueryById {
  getManageStaffById(
    url: string,
    id: number | string
  ): Promise<IManageStaffData>;
}

export interface IManageStaffBody {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  data: IManageStaffData[];
}
export interface IManageStaffData {
  id: number;
  userId: string;
  valIdLoginIp: string;
  branchId: number;
  branchName: string;
  role: number;
  photo: string;
  agentTarget: number;
  assignCredit: number;
  allowBooking: boolean;
  user: IUserData;
}
export interface IUserData {
  id: number;
  email: string;
  userName: string;
  phoneNo: number;
  cityName: string;
  mobileNo: number;
  firstName: string;
  language: string;
  lastName: string;
  address: string;
  cityId: number;
  dateOfBirth: string;
  passportExpiryDate: string;
  countryId: number;
  passportNo: string;
  passportCountryId: number;
  mobileNumber: number;
  mealPreference: number;
  postCode: string;
  img: string;
  companyName: string;
  seatPreference: string;
  isActive: boolean;
  timeZone: string;
  userCurrencies: IUserCurrencies[];
}

export interface IUserCurrencies {
  id: number;
  currencyId: number;
  applicationUserId: string;
  isDefault: boolean;
  isDeleted: boolean;
  symbol: string;
}

import { IUserCurrencies, IUserData } from "../Admin/manageStaff/manageStaff";

export interface IAuthentication {
  login(url: string, body: LoginBody): Promise<AuthModel>;
  getUserByToken(url: string): Promise<Model>;
  CheckUserName(url: string): Promise<AuthModel>;
  CheckOldPassword(url: string): Promise<{ user: IUserData }>;
  getUsersList(url: string): Promise<IManageUsersResponse>;
}

export type LoginBody = {
  username: string;
  password: string;
};

export type Model = UserModel;

export interface IManageUsersResponse {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  data: IUser[];
}

export interface UserModel {
  user: IUser;
  roles?: string[];
  auth?: AuthModel;
}

export interface IUser {
  id: number;
  supplierId: string;
  password: string | undefined;
  email: string;
  companyName?: string;
  language?: "en" | "ar" | undefined;
  firstName: string;
  branchId: number;
  fullName: string;
  lastName: string;
  emailConfirmed: boolean;
  accessFailedCount: number;
  address: string;
  city: string | null;
  cityId: number;
  concurrencyStamp: string;
  country: string | null;
  countryId: number;
  createdOn: string;
  userCurrencies: IUserCurrencies[];
  dateOfBirth: string;
  fullImagePath: string;
  img: string | null;
  isActive: boolean;
  lockoutEnabled: boolean;
  lockoutEnd: string | null;
  mealPreference: number;
  mobileNumber: string;
  normalizedEmail: string;
  normalizedUserName: string;
  passportCountryId: number;
  passportExpiryDate: string;
  passportNo: string;
  passwordHash: string;
  phoneNumber: string;
  phoneNumberConfirmed: boolean;
  postCode: string;
  seatPreference: number;
  securityStamp: string;
  twoFactorEnabled: boolean;
  userName: string;
}

export interface AuthModel {
  token: string;
  expiration?: Date;
}

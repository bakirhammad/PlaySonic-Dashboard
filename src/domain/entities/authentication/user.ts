import { IUserData } from "../Admin/manageStaff/manageStaff";

export interface IUserClassCommand {
  createUserClass(url: string, body: UserData): Promise<UserData>;
  updateUserClass(url: string, body: UserData): Promise<UserData>;
  UpdateUserPassword(
    url: string,
    body: Pick<UserData, "id" | "password">
  ): Promise<Pick<UserData, "id" | "password">>;
}
export interface IUserQueryById {
  getUserById(url: string, id: string): Promise<IUserData>;
}

export interface UserData {
  id: string;
  password: string;
  email: string;
  userName: string;
  phoneNo: string;
  firstName: string;
  lastName: string;
  address: string;
  countryId: number;
  cityId: number;
  postCode: string;
  img: string;
  isActive: boolean;
  mobileNumber: string;
  dateOfBirth: string;
  passportNo: string;
  passportCountryId: number;
  passportExpiryDate: string;
  mealPreference: number;
  seatPreference: number;
  companyName: string;
}

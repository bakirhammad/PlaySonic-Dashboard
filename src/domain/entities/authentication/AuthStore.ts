import { AuthModel, IDDlOption, IUserCurrencies, UserModel } from "..";

export interface IAuthStore {
  auth: AuthModel | undefined;
  currentUser: UserModel | undefined;
  defaultUserCurrency: IDDlOption | undefined;
  userCurrencies: IDDlOption[];

  saveAuth: (auth: AuthModel | undefined) => void;
  setUserCurrencies: (userCurrencies: IUserCurrencies[]) => void;
  setCurrentUser: (user: UserModel | undefined) => void;
  logout: () => void;
}

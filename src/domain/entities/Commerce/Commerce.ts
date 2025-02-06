/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ICommerceCommand {
  addUserBalance(url: string, body: any): Promise<ICommerceData>;
  removeUserBalance(url: string, body: any): Promise<ICommerceData>;
}

export interface ICommerceQuery {
  getCommerceList(url: string): Promise<ICommerceBody>;
}

export interface ICommerceQueryById {
  getCommerceById(
    url: string,
    id: number | string
  ): Promise<ICommerceData>;


}

export interface ICommerceBody {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  data: ICommerceData[];
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    message: string;
  };
}

export interface ICommerceData {
  id: string;
  userId: string;
  userName: string;
  dateAdded: string;
  transactionType: number;
  amount: number;
  pending: boolean;
  notes: string;
  refTransactionId: string | null;
}

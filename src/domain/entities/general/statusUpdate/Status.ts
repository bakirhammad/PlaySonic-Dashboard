/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IStatusCommand {
  updateStatus(url: string, body: IStatusBody): Promise<IStatusBody[]>;
}

export interface IStatusBody {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  data: IStatusData[];
}
export interface IStatusData {
  id: number;
  status: number,
}

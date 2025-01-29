/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IRolesCommand {
  createRoles(url: string, body: any): Promise<IRolesData>;
  updateRoles(
    url: string,
    body: IRolesBody
  ): Promise<IRolesData>;
  deleteRoles(url: any, id: number): Promise<IRolesData>;
  multipleDeleteRoles(
    url: string,
    ids: number[]
  ): Promise<IRolesData>;
}

export interface IRolesQuery {
  getRolesList(url: string): Promise<IRolesBody>;
}

export interface IRolesQueryById {
  getRolesById(
    url: string,
    id: number | string
  ): Promise<IRolesData>;
}

export interface IRolesBody {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  data: IRolesData[];
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    message: string;
  };
}

export interface IRolesData {
  id: number,
name : string,
type : number,
permissions : number
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ISlotTypeCommand {
  createSlotType(url: string, body: any): Promise<ISlotTypeData>;
  updateSlotType(
    url: string,
    body: ISlotTypeBody
  ): Promise<ISlotTypeData>;
  deleteSlotType(url: any, id: number): Promise<ISlotTypeData>;
  multipleDeleteSlotType(
    url: string,
    ids: number[]
  ): Promise<ISlotTypeData>;
}

export interface ISlotTypeQuery {
  getSlotTypeList(url: string): Promise<ISlotTypeBody>;
}

export interface ISlotTypeQueryById {
  getSlotTypeById(
    url: string,
    id: number | string
  ): Promise<ISlotTypeData>;
}

export interface ISlotTypeBody {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  data: ISlotTypeData[];
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    message: string;
  };
}

export interface ISlotTypeData {
  id: number;
  duration: number
}

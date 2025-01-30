/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IAddReservationUserCommand {
  addReservationUserCommand(
    url: string,
    id: number | string
  ): Promise<IAddReservationUserData>;


}

export interface IAddReservationUserBody {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  data: IAddReservationUserData[];
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    message: string;
  };
}

export interface IAddReservationUserData {
  id: number;
  userName: string,
  phoneNumer: string,
  userId: string,
  playSonicId: number
}

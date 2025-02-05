export enum PermissionsEnum {
  "Access Super Club" = 1,
  "Access Super Courts" = 2,
  "Access Super Genderal" = 4,
  "Access Super Reservtion" = 8,
  "Access Admin Control" = 16,
  "Access Super Delete" = 32,
  "Access Super Edit" = 64,
  "Access Super Create" = 128,
  "Access Club Reservation" = 256,
  "Access Club Courts" = 512,
  // "Access Club Users" = 1024,
}


// These below enums used only in update and create Role component, to show only one of them , but the above enum contain all of them to use it in useCheckPermission compontnet and PermissionsCell component to check them as all. **make sure the below enums be the same in key and value in above enum.

export enum SuberAdmin {
  "Access Super Club" = 1,
  "Access Super Courts" = 2,
  "Access Super Genderal" = 4,
  "Access Super Reservtion" = 8,
  "Access Admin Control" = 16,
  "Access Super Delete" = 32,
  "Access Super Edit" = 64,
  "Access Super Create" = 128,
}

export enum ClubAdmin {
  "Access Club Reservation" = 256,
  "Access Club Courts" = 512,
  // "Access Club Users" = 1024,
}
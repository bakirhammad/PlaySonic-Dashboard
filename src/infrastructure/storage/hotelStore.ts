import { IHotelStore } from "@domain/entities/Hotel/hotelStore";
import { create } from "zustand";

export const useHotelStore = create<IHotelStore>((set) => ({
  HotelSupplierData: {
    id: 0,
    hotelId: 0,
    supplierId: 0,
    status: false,
    hotelName: "",
    supplierName: "",
  },
  setHotelSupplier: (HotelSupplier) =>
    set({ HotelSupplierData: HotelSupplier }),
  resetHotelSupplier: () => set({ HotelSupplierData: undefined }),
}));

import {
  FlightDetails,
  ICharterBundlesData,
  IFlightAirlines,
  IFlightAirports,
} from "@domain/entities";
import { initialQueryState } from "@presentation/helpers";
import { SearchValues } from "@presentation/pages/bookings/BookingForDirectClient/searchPanel/types";
import { create } from "zustand";

interface IFilterOptions {
  airportsOptions: IFlightAirports[];
  airlinesOptions: IFlightAirlines[];
  minPrice: number;
  maxPrice: number;
  departureMinDuration: number;
  departureMaxDuration: number;
  returnMinDuration: number;
  returnMaxDuration: number;
}
interface IFilterValues {
  price: { min: number; max: number } | null;
  departureDuration: { min: number; max: number } | null;
  returnDuration: { min: number; max: number } | null;
  selectedAirlines: string[] | null;
  selectedAirports: string[] | null;
  originFlightTime: {
    departureTime: { min: number; max: number }[] | null;
    arrivalTime: { min: number; max: number }[] | null;
  };
  returnFlightTime: {
    departureTime: { min: number; max: number }[] | null;
    arrivalTime: { min: number; max: number }[] | null;
  };
}

export interface IBookingRequest {
  travelType?: number;
  langId?: number;
  channel?: number;
  origin?: string | number | boolean | undefined;
  return?: string | number | boolean | undefined;
  isAllAirports?: boolean;
  multiCities?: {
    origin?: string | number | boolean | undefined;
    return?: string | number | boolean | undefined;
    departureDate?: string;
  }[];
  departureDate?: string;
  returnDate?: string;
  CabinClass?: string | number | boolean | undefined;
  numberOfAdultPassengers?: number;
  numberOfChildPassengers?: number;
  numberOfInfantPassengers?: number;
  flight?: {
    flightId: number;
    classId: number;
  }[];
}

export interface IBookingStore {
  bookingSearchValues: SearchValues | null;
  bookingSearchBody: IBookingRequest | null;
  filterOptions: IFilterOptions | null;
  filterValues: IFilterValues;
  selectedBundles: ICharterBundlesData[] | null;
  setSelectedBundles: (Bundles: ICharterBundlesData[]) => void;
  setBookingSearchValues: (bookingSearchValues: SearchValues) => void;
  setBookingSearchBody: (bookingSearchValues: SearchValues) => void;
  setFilterOptions: (filterOptions: IFilterOptions) => void;
  setFlightsDetails: (flightrOptions: FlightDetails) => void;
  flightsDetails: FlightDetails | null;
  setFilterValues: <T extends keyof IFilterValues>(
    filterType: T,
    value: IFilterValues[T] | ((preValue: IFilterValues[T]) => IFilterValues[T])
  ) => void;
  resetFilterValues: (filterOptions?: IFilterOptions | undefined) => void;
}

const initialValue = {
  bookingSearchValues: null,
  bookingSearchBody: null,
  filterOptions: null,
  selectedBundles: [],
  flightsDetails: null,
  filterValues: {
    price: null,
    departureDuration: null,
    returnDuration: null,
    selectedAirlines: null,
    selectedAirports: null,
    originFlightTime: { departureTime: null, arrivalTime: null },
    returnFlightTime: { departureTime: null, arrivalTime: null },
  },
};

export const useBookingStore = create<IBookingStore>((set) => ({
  ...initialValue,
  setSelectedBundles: (Flights) => set({ selectedBundles: Flights }),
  setFlightsDetails: (Flights) => set({ flightsDetails: Flights }),
  setFilterOptions: (filterOptions) => set({ filterOptions }),

  setFilterValues: (filterType, value) => {
    const callbackFunc = typeof value === "function" ? value : null;
    if (callbackFunc) {
      set((state) => {
        const value = callbackFunc(state.filterValues[filterType]);
        return {
          filterValues: { ...state.filterValues, [filterType]: value },
        };
      });
    } else {
      set((state) => {
        return {
          filterValues: { ...state.filterValues, [filterType]: value },
        };
      });
    }
  },
  resetFilterValues: () => {
    set({ filterValues: initialValue.filterValues });
  },

  setBookingSearchValues: (bookingSearchValues) =>
    set({ bookingSearchValues: bookingSearchValues }),
  setBookingSearchBody: (bookingSearchValues) => {
    const {
      departDate,
      flightType,
      from,
      passengersCount,
      returnDate,
      ticketType,
      to,
      // passengersCountBitwise,
      multiCities,
    } = bookingSearchValues;

    const multiCityArray = multiCities?.map((city) => ({
      origin: city.fromCity?.value,
      return: city.toCity?.value,
      departureDate: city.cityDepartDate,
    }));

    const requestQuery = {
      travelType: flightType?.value,
      langId: initialQueryState.culture === "en" ? 2 : 1,
      channel: 63,
      ...(from?.value ? { origin: Number(from?.value) } : {}),
      ...(to?.value ? { return: Number(to?.value) } : {}),
      // isAllAirports: from?.label.includes("All") || to?.label.includes("All"),
      IsAllAirportOrigin: from?.label.includes("All"),
      IsAllAirportReturn: to?.label.includes("All"),
      ...(flightType?.value == 4 && multiCityArray?.length
        ? { multiCities: multiCityArray[0].origin ? multiCityArray : [] }
        : {}),
      // ...(departDate ? { departureDate: departDate } : {}),
      // ...(returnDate ? { returnDate } : {}),
      ...(flightType?.value !== 4 && departDate
        ? { departureDate: departDate }
        : {}),
      ...(flightType?.value !== 4 && returnDate ? { returnDate } : {}),

      CabinClass: Number(ticketType?.value),
      numberOfAdultPassengers: passengersCount.Adults,
      numberOfChildPassengers: passengersCount.Children,
      numberOfInfantPassengers: passengersCount.Infants,
      // passengersBitwise: passengersCountBitwise,
      // currencyId: 0,
      // flightIds: [],
      refetch: Math.random(),
    };

    set({ bookingSearchBody: requestQuery });
  },
}));

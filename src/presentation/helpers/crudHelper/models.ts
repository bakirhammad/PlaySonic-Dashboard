import { Dispatch, SetStateAction } from "react";
import {
  defaultPageNumberInPagination,
  defaultPageSizeInPagination,
} from "./consts";
import { getConfigLang } from "@presentation/localization";

export type PaginationState = {
  pageNumber?: number;
  pageSize?: number;
  links?: Array<{
    label: string;
    active: boolean;
    url: string | null;
    page: number | null;
  }>;
};
export type SortState = {
  orderBy?: string;
  orderDirection?: boolean;
};

export type FilterState = {
  filter?: unknown;
};

export type SearchState = {
  search?: string;
};

export type Response<T> = {
  data?: T;
  payload?: {
    message?: string;
    errors?: {
      [key: string]: Array<string>;
    };
    pagination?: PaginationState;
  };
};

export type QueryState = PaginationState &
  SortState &
  FilterState &
  SearchState &
  culture;

type culture = { culture?: string };

export type QueryRequestContextProps = {
  state: QueryState;
  query: string;
  data: any | null;
  isLoading: boolean;
  error: Error | null;
  setError: Dispatch<SetStateAction<Error | null>>;
  updateData: <T = unknown>(updates: T) => void;
  updateState: (updates: Partial<QueryState>) => void;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  resetQuery: Function;
};

export const initialQueryState: QueryState = {
  pageNumber: defaultPageNumberInPagination,
  pageSize: defaultPageSizeInPagination,
  culture: getConfigLang().selectedLang,
};

export const initialQueryRequest: QueryRequestContextProps = {
  state: initialQueryState,
  query: "",
  data: "",
  error: null,
  isLoading: false,
  setError: () => {},
  updateState: () => {},
  updateData: () => {},
  setIsLoading: () => {},
  resetQuery: () => {},
};

/**
 * NULL => (CREATION MODE) | MODAL IS OPENED
 * NUMBER => (EDIT MODE) | MODAL IS OPENED
 *  UNDEFINED => MODAL IS CLOSED
 * */
export type ID = undefined | null | number;
export type ListViewContextProps = {
  selected: Array<number>;
  itemIdForUpdate?: ID | string;
  isAllSelected: boolean;
  disabled: boolean;
  isModalOpen: boolean;
  onSelect: (selectedId: number) => void;
  onSelectAll: () => void;
  clearSelected: () => void;
  setItemIdForUpdate: Dispatch<SetStateAction<ID | string>>;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

export const initialListView: ListViewContextProps = {
  selected: [],
  isAllSelected: false,
  disabled: false,
  isModalOpen: false,
  onSelect: () => {},
  onSelectAll: () => {},
  clearSelected: () => {},
  setItemIdForUpdate: () => {},
  setIsModalOpen: () => {},
};

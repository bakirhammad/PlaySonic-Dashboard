/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import qs from "qs";
import { ID, QueryState } from "./models";

function isNotEmpty(obj: unknown) {
  return obj !== undefined && obj !== null && obj !== "";
}

// Example: page=1&pageSize=10&sort=id&order=desc&search=a&filter_name=a&filter_online=false
function stringifyRequestQuery(state: QueryState): string {
  const pagination = qs.stringify(state, {
    filter: ["pageNumber", "pageSize"],
    skipNulls: true,
  });
  const culture = qs.stringify(state, {
    filter: ["culture"],
    skipNulls: true,
  });
  const sort = qs.stringify(state, {
    filter: ["orderBy", "orderDirection"],
    skipNulls: true,
  });
  const search = isNotEmpty(state.search)
    ? qs.stringify(state, { filter: ["search"], skipNulls: true })
    : "";
  const filter = state.filter
    ? Object.entries(state.filter)
        .filter((obj) => isNotEmpty(obj[1]))
        .map((obj) => {
          return `${obj[0]}=${obj[1]}`;
        })
        .join("&")
    : "";

  return [pagination, sort, search, filter, culture]
    .filter((f) => f)
    .join("&")
    .toLowerCase();
}

function parseRequestQuery(query: string): QueryState {
  const cache: unknown = qs.parse(query);
  return cache as QueryState;
}

function calculatedGroupingIsDisabled<T>(
  isLoading: boolean,
  data: Array<T> | undefined
): boolean {
  if (isLoading) {
    return true;
  }

  return !data || !data.length;
}

function calculateIsAllDataSelected<T>(
  data: Array<T> | undefined,
  selected: Array<ID>
): boolean {
  if (!data) {
    return false;
  }

  return data.length > 0 && data.length === selected.length;
}

function groupingOnSelect(
  id: number,
  selected: Array<number>,
  setSelected: Dispatch<SetStateAction<Array<number>>>
) {
  if (!id) {
    return;
  }

  if (selected.includes(id)) {
    setSelected(selected.filter((itemId) => itemId !== id));
  } else {
    const updatedSelected = [...selected];
    updatedSelected.push(id);
    setSelected(updatedSelected);
  }
}

function groupingOnSelectAll<T>(
  isAllSelected: boolean,
  setSelected: Function,
  data?: Array<T & { id?: number }>
) {
  if (isAllSelected) {
    setSelected([]);
    return;
  }

  if (!data || !data.length) {
    return;
  }

  setSelected(data.filter((item) => item.id).map((item) => item.id));
}

// Hook
function useDebounce(value: string | undefined, delay: number) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );
  return debouncedValue;
}

/**
 * Creates a debounced function that delays invoking the provided function.
 *
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The delay in milliseconds before the function is invoked.
 * @param {Object} [options] - Optional settings to control the debounce behavior.
 * @param {boolean} [options.leading=false] - If `true`, the function will be invoked on the leading edge of the delay instead of the trailing.
 * @param {boolean} [options.trailing=true] - If `true`, the function will be invoked on the trailing edge of the delay.
 * @returns {Function} A new debounced function that delays the invocation of the provided function according to the specified delay and options.
 */
function functionDebounce(
  func: Function,
  delay: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): Function {
  let timeoutId: NodeJS.Timeout | null;
  let returnedData: any;
  return (...args: any[]) => {
    const callNow = options.leading && !timeoutId;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (options.trailing) {
        returnedData = func(...args);
      }
    }, delay);

    if (callNow) {
      returnedData = func(...args);
    }

    return returnedData;
  };
}
export {
  stringifyRequestQuery,
  parseRequestQuery,
  calculatedGroupingIsDisabled,
  calculateIsAllDataSelected,
  groupingOnSelect,
  groupingOnSelectAll,
  functionDebounce,
  useDebounce,
  isNotEmpty,
};

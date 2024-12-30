/* eslint-disable react-refresh/only-export-components */
import {
  FC,
  useState,
  createContext,
  useContext,
  useMemo,
  useEffect,
} from "react";
import {} from "../../helpers";
import {
  QueryRequestContextProps,
  QueryState,
  WithChildren,
  initialQueryRequest,
  stringifyRequestQuery,
  initialQueryState,
  PaginationState,
} from "../../helpers";
const QueryRequestContext =
  createContext<QueryRequestContextProps>(initialQueryRequest);

const QueryRequestProvider: FC<WithChildren> = ({ children }) => {
  const [state, setState] = useState<QueryState>(initialQueryRequest.state);
  const [data, setData] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [query, setQuery] = useState<string>(stringifyRequestQuery(state));

  const updateState = (updates: Partial<QueryState>) => {
    const updatedState = { ...state, ...updates } as QueryState;
    setState(updatedState);
  };
  const updateData = (data: any) => {
    setData(data);
  };
  // use to rest query afte update , create , delete , delete selected (all action)
  const resetQuery = () => {
    setState(initialQueryRequest.state);
  };
  const updatedQuery = useMemo(() => stringifyRequestQuery(state), [state]);

  useEffect(() => {
    if (query !== updatedQuery) {
      setQuery(updatedQuery);
    }
  }, [updatedQuery]);

  return (
    <QueryRequestContext.Provider
      value={{
        state,
        query,
        data,
        isLoading,
        error,
        setError,
        updateState,
        updateData,
        setIsLoading,
        resetQuery,
      }}
    >
      {children}
    </QueryRequestContext.Provider>
  );
};

const useQueryRequest = () => useContext(QueryRequestContext);

const useQueryResponsePagination = () => {
  const { data, state } = useQueryRequest();

  const defaultPaginationState: PaginationState = {
    links: [],
    ...initialQueryState,
  };

  const paginationobject: PaginationState = {
    links: [],
    pageNumber: state?.pageNumber,
    pageSize: state?.pageSize,
  };

  const totalPages = Math.ceil(data?.totalPages);
  for (let i = 1; i <= totalPages; i++) {
    paginationobject?.links?.push({
      url: `/?page=${i}`,
      label: i.toString(),
      active: true,
      page: i,
    });
  }

  if (!paginationobject) {
    return defaultPaginationState;
  }
  return paginationobject;
};

const useQueryResponseLoading = (): boolean => {
  const { isLoading } = useQueryRequest();
  return isLoading;
};

export {
  QueryRequestProvider,
  useQueryRequest,
  useQueryResponsePagination,
  useQueryResponseLoading,
};

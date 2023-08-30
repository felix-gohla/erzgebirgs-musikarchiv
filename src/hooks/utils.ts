import React from 'react';

/**
 * The return value of a data fetching hook.
 */
export type FetchingHook<T, O = never> = {
    /**
    * Whether the data is currently fetching.
    */
    isLoading: boolean,

    /**
     * Whether there was an error while fetching the data.
     */
    error?: Error,

    /**
     * The fetched data or `undefined` if data was not fetched.
     */
    data: T | undefined,

    /**
     * Whether the query is currently enabled.
     */
    enabled: boolean,

    refetch: (options?: O) => Promise<T | undefined>
}

export const useBaseFetchHook = <T, O>(fetcher: (options?: O) => Promise<T>, options?: O, enabled?: boolean): FetchingHook<T, O> => {
  const [data, setData] = React.useState<T | undefined>(undefined);
  const [isFetching, setIsFetching] = React.useState(true);
  const [error, setError] = React.useState<Error | undefined>(undefined);

  const refetch = React.useCallback(async (options?: O) => {
    setError(undefined);
    if (!(enabled ?? true)) {
      setIsFetching(false);
      setData(undefined);
      return;
    }
    setIsFetching(true);
    try {
      const fetchedData = await fetcher(options);
      setData(fetchedData);
      return fetchedData;
    } finally {
      setIsFetching(false);
    }
  }, [enabled, fetcher]);

  React.useEffect(() => {
    let active = true;

    refetch(options).catch((ex) => {
      if (active) {
        if (ex instanceof Error) {
          setError(ex);
        } else {
          setError(new Error('Unbekannter Fehler bei der Anfrage.'));
        }
      }
    });

    return () => {
      active = false;
      setIsFetching(false);
    };
  }, [refetch, options]);

  return {
    data: data,
    isLoading: isFetching,
    error,
    enabled: enabled ?? true,
    refetch,
  };
};
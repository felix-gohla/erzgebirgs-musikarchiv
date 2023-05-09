import React from 'react';

/**
 * The return value of a data fetching hook.
 */
export type FetchingHook<T> = {
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
}

export const useBaseFetchHook = <T>(fetcher: () => Promise<T>, enabled: boolean): FetchingHook<T> => {
  const [data, setData] = React.useState<T | undefined>(undefined);
  const [isFetching, setIsFetching] = React.useState(false);
  const [error, setError] = React.useState<Error | undefined>(undefined);

  React.useEffect(() => {
    let active = true;

    (async () => {
      setError(undefined);
      if (!enabled) {
        setIsFetching(false);
        setData(undefined);
        return;
      }
      setIsFetching(true);
      try {
        const fetchedData = await fetcher();
        setData(fetchedData);
      } catch (ex) {
        if (active) {
          if (ex instanceof Error) {
            setError(ex);
          } else {
            setError(new Error('Unbekannter Fehler beim Laden der Lieder.'));
          }
        }
      } finally {
        setIsFetching(false);
      }
    })();

    return () => {
      active = false;
      setIsFetching(false);
    };
  }, [fetcher, enabled]);

  return {
    data: data,
    isLoading: isFetching,
    error,
    enabled,
  };
};
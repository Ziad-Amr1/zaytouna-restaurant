import { useCallback, useEffect, useState } from "react";

/**
 * A lightweight custom hook that encapsulates standard data-fetching boilerplate:
 * loading state, error handling, cancellation on unmount, and manual refetching.
 */
export default function useFetchData(fetcherFn, initialData = null) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const refetch = useCallback(() => {
    setReloadKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const execute = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await fetcherFn();
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            typeof err === "string"
              ? err
              : err?.response?.data?.message || "An unexpected error occurred. Please try again.";
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void execute();

    return () => {
      cancelled = true;
    };
  }, [fetcherFn, reloadKey]);

  return { data, setData, loading, error, refetch };
}

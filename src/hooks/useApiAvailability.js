import { useCallback, useEffect, useRef, useState } from "react";
import api from "@/api/axiosClient";

const CHECKING = "checking";
const ONLINE = "online";
const UNAVAILABLE = "unavailable";

const CHECK_TIMEOUT_MS = 8000;

const useApiAvailability = () => {
  const [status, setStatus] = useState(CHECKING);
  const didRun = useRef(false);
  const mounted = useRef(true);

  const check = useCallback(async () => {
    setStatus(CHECKING);

    try {
      const response = await api.get("/health", { timeout: CHECK_TIMEOUT_MS });

      if (mounted.current && response.status >= 200 && response.status < 300) {
        setStatus(ONLINE);
      }
    } catch {
      if (mounted.current) {
        setStatus(UNAVAILABLE);
      }
    }
  }, []);

  useEffect(() => {
    if (didRun.current) {
      return;
    }

    didRun.current = true;
    check();
  }, [check]);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  return { status, check };
};

export default useApiAvailability;
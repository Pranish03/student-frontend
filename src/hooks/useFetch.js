import { useCallback, useEffect, useState } from "react";
import { axios } from "../lib/axios";

export const useFetch = (endpoint) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAPI = useCallback(async () => {
    try {
      setLoading(true);

      const res = await axios.get(endpoint);

      setData(res.data);
    } catch (error) {
      if (error.response) {
        setError(error.response?.data?.message || "Internal server error");
      } else if (error.request) {
        setError("No response from server");
      } else {
        setError("Something went wrong");
      }

      setData(null);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchAPI();
  }, [fetchAPI]);

  return { data, error, loading, reFetch: fetchAPI };
};

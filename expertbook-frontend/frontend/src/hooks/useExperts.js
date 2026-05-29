import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";

/**
 * useExperts – Custom Hook
 *
 * Encapsulates data fetching logic so components stay clean.
 * Returns data, loading state, error, and a refetch function.
 *
 * Key concept: Custom hooks let you reuse stateful logic across
 * multiple components without duplicating code.
 */
const useExperts = (filters = {}) => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [meta,    setMeta]    = useState({ total: 0, page: 1, pages: 1 });

  const fetchExperts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query string from filters object
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, val]) => {
        if (val) params.append(key, val);
      });

      const res = await api.get(`/experts?${params.toString()}`);
      setExperts(res.data.data);
      setMeta({
        total: res.data.total,
        page:  res.data.page,
        pages: res.data.pages,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load experts");
    } finally {
      setLoading(false);  // always runs, even on error
    }
  }, [JSON.stringify(filters)]); // re-run when filters change

  useEffect(() => {
    fetchExperts();
  }, [fetchExperts]);

  return { experts, loading, error, meta, refetch: fetchExperts };
};

export default useExperts;

import { useEffect, useRef } from "react";
import { useBusinessDetailStore } from "../stores/BusinessDetailStore";
import { getBusinessById } from "@/actions/business/BusinessActions";

export const useBusinessDetail = (businessId: string) => {
  const { business, loading, error, setBusiness, setLoading, setError, reset } =
    useBusinessDetailStore();
  const hasFetched = useRef(false);
  const currentBusinessId = useRef<string | null>(null);

  useEffect(() => {
    if (!businessId) return;

    // Reset if businessId changes
    if (currentBusinessId.current !== businessId) {
      hasFetched.current = false;
      currentBusinessId.current = businessId;
    }

    const fetchBusiness = async () => {
      if (!hasFetched.current) {
        hasFetched.current = true;
        setLoading(true);
        setError(null);
        try {
          const data = await getBusinessById(businessId);
          setBusiness(data);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch business",
          );
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBusiness();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId]);

  useEffect(() => {
    return () => {
      reset();
      hasFetched.current = false;
    };
  }, []);

  return {
    business,
    loading,
    error,
  };
};

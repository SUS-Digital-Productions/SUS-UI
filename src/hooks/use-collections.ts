import { useQuery } from "@tanstack/react-query";
import { fetchCollections } from "@/api/atomicApi";
import { useAtomic } from "@/hooks/use-atomic";

interface UseCollectionsOptions {
  page?: number;
  limit?: number;
  order?: string; // asc or desc
  sort?: string; // field name: created, updated, collection_name, etc.
  enabled?: boolean;
}

/**
 * Hook for fetching WAX NFT collections using TanStack Query
 * Automatically handles caching, refetching, and error states
 */
export const useCollections = (options: UseCollectionsOptions = {}) => {
  const { assetsEndpoint } = useAtomic();
  const { page = 1, limit = 12, order = "desc", sort = "created", enabled = true } = options;

  return useQuery({
    queryKey: ["collections", assetsEndpoint, page, limit, order, sort],
    queryFn: () =>
      fetchCollections({
        endpoint: assetsEndpoint,
        page,
        limit,
        order,
        sort,
      }),
    enabled: enabled && !!assetsEndpoint,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    retry: 2, // retry failed requests twice
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // exponential backoff
    // throwOnError: false, // handle errors gracefully in components
  });
};

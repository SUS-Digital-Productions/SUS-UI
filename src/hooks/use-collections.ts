import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { fetchCollections } from "@/api/atomicApi";
import { useAtomic } from "@/hooks/use-atomic";

interface UseCollectionsOptions {
  page?: number;
  limit?: number;
  order?: string; // asc or desc
  sort?: string; // field name: created, updated, collection_name, etc.
  match?: string; // search term for filtering collections
  enabled?: boolean;
}

/**
 * Hook for fetching WAX NFT collections using TanStack Query
 * Automatically handles caching, refetching, and error states
 */
export const useCollections = (options: UseCollectionsOptions = {}) => {
  const { assetsEndpoint } = useAtomic();
  const { page = 1, limit = 12, order = "desc", sort = "created", match, enabled = true } = options;

  return useQuery({
    queryKey: ["collections", assetsEndpoint, page, limit, order, sort, match],
    queryFn: () =>
      fetchCollections({
        endpoint: assetsEndpoint,
        page,
        limit,
        order,
        sort,
        match,
      }),
    enabled: enabled && !!assetsEndpoint,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    retry: 2, // retry failed requests twice
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // exponential backoff
    // throwOnError: false, // handle errors gracefully in components
  });
};

/**
 * Hook for fetching WAX NFT collections with infinite scroll support
 */
export const useInfiniteCollections = (options: Omit<UseCollectionsOptions, 'page'> = {}) => {
  const { assetsEndpoint } = useAtomic();
  const { limit = 24, order = "desc", sort = "created", match, enabled = true } = options;

  return useInfiniteQuery({
    queryKey: ["collections-infinite", assetsEndpoint, limit, order, sort, match],
    queryFn: ({ pageParam = 1 }) =>
      fetchCollections({
        endpoint: assetsEndpoint,
        page: pageParam,
        limit,
        order,
        sort,
        match,
      }),
    enabled: enabled && !!assetsEndpoint,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // If we got less results than the limit, we've reached the end
      if (lastPage.data.length < limit) {
        return undefined;
      }
      // Otherwise, return the next page number
      return allPages.length + 1;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

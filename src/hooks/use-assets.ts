import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { fetchAssets } from "@/api/atomicApi";
import { useAtomic } from "@/hooks/use-atomic";

interface UseAssetsOptions {
  owner: string;
  collection_name?: string;
  page?: number;
  limit?: number;
  order?: string; // asc or desc
  sort?: string; // field name: created, updated, transferred, minted, etc.
  enabled?: boolean;
}

/**
 * Hook for fetching WAX NFT assets using TanStack Query
 * Automatically handles caching, refetching, and error states
 */
export const useAssets = (options: UseAssetsOptions) => {
  const { assetsEndpoint } = useAtomic();
  const {
    owner,
    collection_name,
    page = 1,
    limit = 12,
    order = "desc",
    sort = "transferred",
    enabled = true,
  } = options;

  return useQuery({
    queryKey: ["assets", assetsEndpoint, owner, collection_name, page, limit, order, sort],
    queryFn: () =>
      fetchAssets({
        endpoint: assetsEndpoint,
        owner,
        collection_name,
        page,
        limit,
        order,
        sort,
      }),
    enabled: enabled && !!assetsEndpoint && !!owner,
    staleTime: 1000 * 60 * 2, // 2 minutes (more frequent updates for user assets)
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    retry: 2, // retry failed requests twice
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // exponential backoff
    // throwOnError: false, // handle errors gracefully in components
  });
};

/**
 * Hook for fetching WAX NFT assets with infinite scroll using TanStack Query
 * Automatically handles pagination and loading more data
 */
export const useInfiniteAssets = (options: Omit<UseAssetsOptions, 'page'>) => {
  const { assetsEndpoint } = useAtomic();
  const {
    owner,
    collection_name,
    limit = 12,
    order = "desc",
    sort = "transferred",
    enabled = true,
  } = options;

  return useInfiniteQuery({
    queryKey: ["infiniteAssets", assetsEndpoint, owner, collection_name, limit, order, sort],
    queryFn: ({ pageParam = 1 }) =>
      fetchAssets({
        endpoint: assetsEndpoint,
        owner,
        collection_name,
        page: pageParam,
        limit,
        order,
        sort,
      }),
    getNextPageParam: (lastPage, allPages) => {
      // If last page returned fewer items than limit, we've reached the end
      if (!lastPage.data || lastPage.data.length < limit) {
        return undefined;
      }
      return allPages.length + 1;
    },
    initialPageParam: 1,
    enabled: enabled && !!assetsEndpoint && !!owner,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Search, ExternalLink, TrendingUp } from "lucide-react";
import { useInfiniteCollections } from "@/hooks/use-collections";
import { useSearchParams } from "react-router";
import { LazyImage } from "@/components/ui/lazy-image";

// Helper: Build image URL from IPFS hash or direct URL
function getCollectionImgUrl(img?: string): string | undefined {
  if (!img) return undefined;
  
  // If already a full URL, return as-is
  if (/^https?:\/\//.test(img)) return img;
  
  // Handle IPFS hashes (Qm... format - 46 characters)
  if (img.startsWith('Qm') && img.length === 46) {
    return `https://ipfs.io/ipfs/${img}`;
  }
  
  // Handle IPFS CIDv1 hashes (bafkrei..., bafyrei..., etc - variable length)
  if (img.startsWith('baf') && img.length >= 46) {
    return `https://ipfs.io/ipfs/${img}`;
  }
  
  // If it doesn't match any known pattern, return undefined
  return undefined;
}

export const CollectionsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams] = useSearchParams();
  const observerTarget = useRef<HTMLDivElement>(null);
  
  // Parse URL query parameters for ordering/sorting
  const view = searchParams.get("view");
  const urlOrder = searchParams.get("order");
  const urlSort = searchParams.get("sort");

  // Semantic view mappings
  const viewMap: Record<string, { order: string; sort: string }> = {
    trending: { order: "desc", sort: "created" },
    newest: { order: "desc", sort: "created" },
    oldest: { order: "asc", sort: "created" },
    updated: { order: "desc", sort: "updated" },
  };

  // Determine final order/sort with priority: explicit params > view mapping > defaults
  const order = urlOrder || (view && viewMap[view]?.order) || "desc";
  const sort = urlSort || (view && viewMap[view]?.sort) || "created";

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteCollections({ limit: 24, order, sort });

  // Flatten all pages into single array
  const allCollections = data?.pages.flatMap(page => page.data) || [];
  
  // Filter based on search term
  const filteredCollections = allCollections.filter(collection =>
    collection.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.collection_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const target = observerTarget.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="w-full mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">WAX Collections</h1>
        <p className="text-muted-foreground mb-6">
          Discover and explore NFT collections on the WAX blockchain
        </p>
        
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search collections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => refetch()} disabled={isLoading}>
            Refresh
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 grid-cols-3xl-8 grid-cols-4xl-10 grid-cols-5xl-12 grid-cols-6xl-14 gap-4 lg:gap-5 xl:gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="aspect-square w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 grid-cols-3xl-8 grid-cols-4xl-10 grid-cols-5xl-12 grid-cols-6xl-14 gap-4 lg:gap-5 xl:gap-6">
          {filteredCollections.map((collection) => {
            const imageUrl = getCollectionImgUrl(collection.img);
            
            return (
              <Card key={collection.collection_name} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="aspect-square overflow-hidden rounded-t-lg bg-muted">
                    {imageUrl ? (
                      <LazyImage
                        src={imageUrl}
                        alt={collection.name || collection.collection_name}
                        className="w-full h-full object-cover"
                        containerClassName="w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No Image
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2 truncate">
                    {collection.name || collection.collection_name}
                  </CardTitle>
                  <CardDescription className="mb-3">
                    Collection: {collection.collection_name}
                  </CardDescription>
                  
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary" className="text-xs">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {collection.market_fee}% Fee
                    </Badge>
                    <span className="text-xs text-muted-foreground truncate ml-2">
                      By {collection.author}
                    </span>
                  </div>

                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a 
                      href={`https://wax.atomichub.io/explorer/collection/${collection.collection_name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View on AtomicHub
                    </a>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {!isLoading && filteredCollections.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No collections found</p>
          <Button onClick={() => refetch()} className="mt-4">
            Try Again
          </Button>
        </div>
      )}

      {/* Infinite scroll observer target */}
      {filteredCollections.length > 0 && (
        <div ref={observerTarget} className="flex justify-center mt-8 py-4">
          {isFetchingNextPage && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Spinner className="h-5 w-5" />
              <span className="text-sm">Loading more collections...</span>
            </div>
          )}
          {!hasNextPage && !isFetchingNextPage && (
            <p className="text-sm text-muted-foreground">No more collections to load</p>
          )}
        </div>
      )}
    </div>
  );
};

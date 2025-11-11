import { useState, useEffect, useRef, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Search, ExternalLink } from "lucide-react";
import { useInfiniteCollections } from "@/hooks/use-collections";
import { useSearchParams } from "react-router";
import { LazyImage } from "@/components/ui/lazy-image";
import { useDebounce } from "@/hooks/use-debounce";

// Helper: Build image URL from IPFS hash or direct URL
function getCollectionImgUrl(img?: string): string | undefined {
  if (!img) return undefined;
  
  // If already a full URL, return as-is
  if (/^https?:\/\//.test(img)) return img;
  
  // Handle IPFS hashes (Qm... format - CIDv0)
  if (img.startsWith('Qm') && img.length >= 46) {
    return `https://gateway.pinata.cloud/ipfs/${img}`;
  }
  
  // Handle IPFS CIDv1 hashes (bafkrei..., bafyrei..., etc)
  if (img.startsWith('baf') && img.length >= 46) {
    return `https://gateway.pinata.cloud/ipfs/${img}`;
  }
  
  // If it doesn't match any known pattern, return undefined
  return undefined;
}

export const CollectionsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // 300ms delay
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

  // Pass debounced search term to API
  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteCollections({ 
    limit: 24, 
    order, 
    sort,
    match: debouncedSearchTerm || undefined // Only pass if not empty
  });

  // Flatten all pages into single array
  const allCollections = useMemo(() => {
    return data?.pages.flatMap(page => page.data) || [];
  }, [data]);

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
        
        <div className="flex gap-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name, collection ID, or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
          <Button onClick={() => refetch()} disabled={isLoading}>
            Refresh
          </Button>
        </div>
        
        {/* Search results info */}
        {debouncedSearchTerm && (
          <div className="text-sm text-muted-foreground mb-2">
            {allCollections.length === 0 ? (
              <span>No collections found for "{debouncedSearchTerm}"</span>
            ) : (
              <span>
                Found {allCollections.length} collection{allCollections.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 lg:gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-square w-full" />
              <div className="p-2">
                <Skeleton className="h-4 w-3/4 mb-1.5" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 lg:gap-4">
          {allCollections.map((collection) => {
            // Try to get image from collection.img first, then fall back to collection.data.img
            const imgSource = collection.img || collection.data?.img;
            const imageUrl = getCollectionImgUrl(imgSource);
            
            return (
              <Card 
                key={collection.collection_name} 
                className="group overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1 flex flex-col h-full"
              >
                {/* Image Section - Compact */}
                <div className="relative aspect-square overflow-hidden bg-linear-to-br from-muted/50 to-accent/30">
                  {imageUrl ? (
                    <LazyImage
                      src={imageUrl}
                      alt={collection.name || collection.collection_name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      containerClassName="w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm font-medium">
                      No Image
                    </div>
                  )}
                  
                  {/* Overlay gradient on hover */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Fee badge - top right */}
                  <div className="absolute top-2 right-2 z-10">
                    <Badge className="bg-primary/90 text-primary-foreground shadow-lg text-[10px] px-1.5 py-0.5 font-bold backdrop-blur-sm">
                      {collection.market_fee * 100}%
                    </Badge>
                  </div>

                  {/* Quick view button - center, on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="shadow-xl bg-primary hover:bg-primary/90"
                      asChild
                    >
                      <a 
                        href={`https://wax.atomichub.io/explorer/collection/${collection.collection_name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                        View
                      </a>
                    </Button>
                  </div>
                </div>

                {/* Content Section - Ultra Compact */}
                <div className="p-2 flex flex-col flex-1 bg-linear-to-b from-card to-muted/10">
                  {/* Collection Name - Bold and prominent */}
                  <h3 className="font-bold text-sm leading-tight truncate mb-1 text-foreground group-hover:text-primary transition-colors" title={collection.name || collection.collection_name}>
                    {collection.name || collection.collection_name}
                  </h3>
                  
                  {/* Collection ID - Subtle */}
                  <p className="text-[10px] text-muted-foreground truncate mb-1.5 font-mono" title={collection.collection_name}>
                    {collection.collection_name}
                  </p>
                  
                  {/* Author - Bottom */}
                  <div className="mt-auto pt-1 border-t border-border/50">
                    <p className="text-[10px] text-muted-foreground truncate font-medium" title={`By ${collection.author}`}>
                      <span className="text-muted-foreground/70">by</span> {collection.author}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {!isLoading && allCollections.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No collections found</p>
          <Button onClick={() => refetch()} className="mt-4">
            Try Again
          </Button>
        </div>
      )}

      {/* Infinite scroll observer target */}
      {allCollections.length > 0 && (
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

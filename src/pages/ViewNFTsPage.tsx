import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  CheckSquare,
  Square,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { useInfiniteAssets } from "@/hooks/use-assets";
import { useWaxSession } from "@/hooks/use-wax-session";
import { useDebounce } from "@/hooks/use-debounce";
import { Asset } from "@/components/custom/Asset";
import { toast } from "sonner";

export const ViewNFTsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [owner, setOwner] = useState("");
  const [collection, setCollection] = useState("");
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());
  const { session } = useWaxSession();
  const observerTarget = useRef<HTMLDivElement>(null);

  // Debounce search inputs
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const debouncedOwner = useDebounce(owner, 500);
  const debouncedCollection = useDebounce(collection, 500);

  // Auto-populate owner from session if logged in
  useEffect(() => {
    if (session?.actor && !owner) {
      setOwner(session.actor.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  // Fetch assets using infinite scroll
  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteAssets({
    owner: debouncedOwner,
    collection_name: debouncedCollection,
    limit: 24,
    enabled: !!debouncedOwner,
  });

  // Flatten all pages into single array
  const allNFTs = data?.pages.flatMap((page) => page.data) || [];

  // Filter based on search term
  const filteredNFTs = allNFTs.filter(
    (nft) =>
      nft.name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      nft.collection.name
        ?.toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase())
  );

  // Selection handlers
  const handleSelectionChange = (assetId: string, selected: boolean) => {
    setSelectedAssets((prev) => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(assetId);
      } else {
        newSet.delete(assetId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedAssets.size === filteredNFTs.length) {
      setSelectedAssets(new Set());
    } else {
      setSelectedAssets(new Set(filteredNFTs.map((nft) => nft.asset_id)));
    }
  };

  const handleClearSelection = () => {
    setSelectedAssets(new Set());
  };

  const handleBulkAction = async () => {
    const selectedIds = Array.from(selectedAssets);
    try {
      if (session == null) {
        toast.error("You must be logged in to perform bulk actions.");
        return;
      }
      const actions = {
        action: {
          account: "atomicassets",
          name: "transfer",
          authorization: [session.permissionLevel],
          data: {
            from: session.actor.toString(),
            to: "iredeempacks",
            asset_ids: selectedIds,
            memo: "Bulk action transfer",
          },
        },
      };
      const response = await session.transact(actions, { broadcast: false });
      if (response) {
        toast.success("Bulk action completed successfully.");
      }
      selectedAssets.clear();
    } catch {
      toast.error("An error occurred while performing the bulk action.");
    }
    // Add your bulk action logic here
  };

  // Clear selection when switching accounts or collections
  useEffect(() => {
    setSelectedAssets(new Set());
    setSelectionMode(false);
  }, [debouncedOwner, debouncedCollection]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
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
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">
          View NFTs
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
          Browse and explore NFTs on the WAX blockchain
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <Input
            placeholder="Owner account name..."
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            className="text-sm"
          />

          <Input
            placeholder="Collection name (optional)..."
            value={collection}
            onChange={(e) => setCollection(e.target.value)}
            className="text-sm"
          />

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search NFTs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>

          <Button
            onClick={() => refetch()}
            disabled={isLoading || !debouncedOwner.trim()}
            className="text-sm"
          >
            <Filter className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>

        {session?.actor && (
          <div className="mb-4 flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOwner(session.actor.toString())}
              className="text-xs sm:text-sm"
            >
              View My NFTs
            </Button>

            {filteredNFTs.length > 0 && (
              <Button
                variant={selectionMode ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectionMode(!selectionMode);
                  if (selectionMode) {
                    handleClearSelection();
                  }
                }}
                className="text-xs sm:text-sm"
              >
                {selectionMode ? (
                  <>
                    <CheckSquare className="w-4 h-4 mr-2" />
                    Exit Selection
                  </>
                ) : (
                  <>
                    <Square className="w-4 h-4 mr-2" />
                    Select Mode
                  </>
                )}
              </Button>
            )}
          </div>
        )}

        {/* Bulk Actions Bar */}
        {selectionMode && filteredNFTs.length > 0 && (
          <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="default" className="text-xs">
                {selectedAssets.size} selected
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="text-xs"
              >
                {selectedAssets.size === filteredNFTs.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>
              {selectedAssets.size > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSelection}
                  className="text-xs"
                >
                  Clear
                </Button>
              )}
            </div>

            {selectedAssets.size > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleBulkAction()}
                  className="text-xs"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Bulk Transfer
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleBulkAction()}
                  className="text-xs"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Bulk Burn
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 grid-cols-3xl-8 grid-cols-4xl-10 grid-cols-5xl-12 grid-cols-6xl-14 gap-2 sm:gap-3 md:gap-4 lg:gap-4 xl:gap-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-40 sm:h-48 md:h-52 lg:h-56 w-full" />
              <CardContent className="p-3 sm:p-4">
                <Skeleton className="h-3 sm:h-4 w-full mb-2" />
                <Skeleton className="h-3 sm:h-4 w-2/3 mb-3" />
                <Skeleton className="h-6 sm:h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 grid-cols-3xl-8 grid-cols-4xl-10 grid-cols-5xl-12 grid-cols-6xl-14 gap-2 sm:gap-3 md:gap-4 lg:gap-4 xl:gap-5">
          {filteredNFTs.map((nft) => {
            const rarityValue = nft.data?.rarity || nft.data?.Rarity;
            return (
              <Asset
                key={nft.asset_id}
                name={nft.name}
                assetId={nft.asset_id}
                templateMint={nft.template_mint}
                templateId={nft.template?.template_id}
                maxSupply={nft.template?.max_supply}
                img={
                  (nft.data?.img || nft.img || nft.collection?.img) as string
                }
                collectionName={nft.collection.collection_name}
                collectionDisplayName={nft.collection.name}
                schemaName={nft.schema.schema_name}
                rarity={
                  typeof rarityValue === "string" ? rarityValue : undefined
                }
                owner={nft.owner}
                selectable={selectionMode}
                selected={selectedAssets.has(nft.asset_id)}
                onSelectionChange={handleSelectionChange}
              />
            );
          })}
        </div>
      )}

      {!isLoading && filteredNFTs.length === 0 && debouncedOwner && (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">
            No NFTs found for this account
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Try searching for a different account or collection
          </p>
        </div>
      )}

      {!isLoading && !debouncedOwner && (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">
            Enter an account name to view NFTs
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            You can search for any WAX account or log in to view your own NFTs
          </p>
        </div>
      )}

      {/* Infinite scroll observer target */}
      {filteredNFTs.length > 0 && (
        <div
          ref={observerTarget}
          className="flex justify-center mt-6 sm:mt-8 py-4"
        >
          {isFetchingNextPage && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Spinner className="h-5 w-5" />
              <span className="text-sm">Loading more...</span>
            </div>
          )}
          {!hasNextPage && !isFetchingNextPage && (
            <p className="text-sm text-muted-foreground">
              No more NFTs to load
            </p>
          )}
        </div>
      )}
    </div>
  );
};

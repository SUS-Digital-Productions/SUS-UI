import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { LazyImage } from "@/components/ui/lazy-image";
import { ExternalLink, Maximize2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

function getAssetImgUrl(image?: string): string | undefined {
  if (!image) return undefined;
  if (/^https?:\/\//.test(image)) return image;
  if (
    (image.startsWith("Qm") && image.length >= 46) ||
    (image.startsWith("baf") && image.length >= 46)
  ) {
    return `https://gateway.pinata.cloud/ipfs/${image}`;
  }
  return undefined;
}

interface AssetProps {
  name: string;
  assetId: string;
  templateMint?: number;
  templateId?: string;
  maxSupply?: string;
  collectionName?: string;
  collectionDisplayName?: string;
  schemaName?: string;
  rarity?: string;
  img?: string;
  owner?: string;
  mint?: string | number;
  className?: string;
  // Optional button customization
  actionButtonText?: string;
  actionButtonIcon?: React.ReactNode;
  onActionClick?: (assetId: string, e: React.MouseEvent) => void;
  // Selection feature
  selectable?: boolean;
  selected?: boolean;
  onSelectionChange?: (assetId: string, selected: boolean) => void;
}

export const Asset = ({
  name,
  assetId,
  templateMint,
  templateId,
  maxSupply,
  collectionName,
  collectionDisplayName,
  schemaName,
  rarity,
  img,
  owner,
  mint,
  className,
  actionButtonText = "View on AtomicHub",
  actionButtonIcon,
  onActionClick,
  selectable = false,
  selected = false,
  onSelectionChange,
}: AssetProps) => {
  const [showFull, setShowFull] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const imgUrl = getAssetImgUrl(img);
  const displayMint = templateMint ?? mint;
  const displayMaxSupply = maxSupply ?? "∞";
  const displayOwner = owner ?? "—";

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onActionClick) {
      onActionClick(assetId, e);
    } else {
      // Default action: open AtomicHub
      window.open(
        `https://wax.atomichub.io/explorer/asset/${assetId}`,
        "_blank"
      );
    }
  };

  const handleCardClick = () => {
    if (selectable && onSelectionChange) {
      onSelectionChange(assetId, !selected);
    }
  };

  return (
    <>
      <Card
        className={cn(
          "hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 overflow-hidden group flex flex-col h-full border-2 border-border hover:border-primary/50 bg-card",
          selected && "border-primary ring-2 ring-primary/50",
          selectable && "cursor-pointer",
          className
        )}
        onMouseEnter={() => setShowDetails(true)}
        onMouseLeave={() => setShowDetails(false)}
        onClick={handleCardClick}
      >
        {/* Image Section */}
        <div className="relative overflow-hidden shrink-0 h-52 sm:h-56 md:h-60">
          {imgUrl ? (
            <LazyImage
              src={imgUrl}
              alt={name}
              className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-110"
              containerClassName="w-full h-full bg-linear-to-br from-muted/50 to-accent/30"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-linear-to-br from-muted/50 to-accent/30">
              <span className="text-sm font-medium">No Image</span>
            </div>
          )}

          {/* Overlay buttons - top right, visible on hover */}
          {showDetails && imgUrl && (
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-30">
              <Button
                variant="secondary"
                size="icon"
                className="h-7 w-7 rounded-full shadow-lg bg-primary/90 hover:bg-primary text-primary-foreground border-0"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  window.open(imgUrl, "_blank");
                }}
                title="Open in new tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-7 w-7 rounded-full shadow-lg bg-primary/90 hover:bg-primary text-primary-foreground border-0"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  setShowFull(true);
                }}
                title="View full image"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}

          {/* Rarity badge - top left */}
          {rarity && (
            <div className="absolute top-1.5 z-10 left-1.5 group-hover:opacity-0 transition-opacity">
              <Badge
                variant="default"
                className="shadow-lg text-[11px] px-2 py-0.5 bg-primary text-primary-foreground font-bold uppercase tracking-wide"
              >
                {rarity}
              </Badge>
            </div>
          )}

          {/* Mint number badge - top right (only when not hovering for buttons) */}
          {displayMint && (
            <div className="absolute top-2 right-2 z-10 group-hover:opacity-0 transition-opacity">
              <Badge
                variant="secondary"
                className="shadow-lg text-[11px] px-2 py-0.5 bg-accent/90 text-accent-foreground font-bold border border-primary/20"
              >
                #{displayMint}
              </Badge>
            </div>
          )}

          {/* Hover details overlay - bottom */}
          {showDetails && (
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-primary/95 via-primary/80 to-transparent p-2.5 z-20 border-t border-primary-foreground/10">
              <div className="grid grid-cols-2 gap-1.5 text-[10px] text-primary-foreground">
                <div>
                  <div className="text-primary-foreground/70 text-[9px] uppercase tracking-wider font-semibold">
                    Template
                  </div>
                  <div className="font-bold truncate">
                    {templateId ? `#${templateId}` : "—"}
                  </div>
                </div>
                <div>
                  <div className="text-primary-foreground/70 text-[9px] uppercase tracking-wider font-semibold">
                    Supply
                  </div>
                  <div className="font-bold truncate">{displayMaxSupply}</div>
                </div>
                <div>
                  <div className="text-primary-foreground/70 text-[9px] uppercase tracking-wider font-semibold">
                    Schema
                  </div>
                  <div className="font-bold truncate">{schemaName || "—"}</div>
                </div>
                <div>
                  <div className="text-primary-foreground/70 text-[9px] uppercase tracking-wider font-semibold">
                    Owner
                  </div>
                  <div className="font-bold truncate text-[9px]">
                    {displayOwner}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content Section - always visible */}
        <CardContent className="p-1.5 space-y-1 flex flex-col flex-1 bg-linear-to-b from-card to-muted/20">
          {/* Name - with visual separation */}
          <div className="border-b border-primary/20 pb-0.5">
            <h3
              className="font-bold text-[13px] leading-tight line-clamp-2 text-foreground"
              title={name}
            >
              {name}
            </h3>
          </div>

          {/* Collection name - prominent with solid background, fixed position above button */}
          <div className="flex-1 flex items-center">
            <div
              className="text-xs font-bold truncate px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 w-full text-center"
              title={collectionDisplayName || collectionName}
            >
              {collectionDisplayName || collectionName || "Unknown Collection"}
            </div>
          </div>

          {/* Footer - Reusable action button */}
          <div>
            <Button
              variant="default"
              size="sm"
              className="w-full justify-center gap-1.5 h-6 text-[11px] font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all"
              onClick={handleActionClick}
            >
              {actionButtonIcon || <ExternalLink className="w-3 h-3" />}
              <span>{actionButtonText}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Full Image Dialog */}
      <Dialog open={showFull} onOpenChange={setShowFull}>
        <DialogContent className="max-w-7xl max-h-[95vh] p-2 bg-black/95 border-primary/20" showCloseButton={false}>
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={imgUrl}
              alt={name}
              className="max-h-[90vh] max-w-full object-contain rounded-lg"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 rounded-full bg-background/80 hover:bg-background"
              onClick={() => setShowFull(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

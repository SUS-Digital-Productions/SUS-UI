import { Asset } from "@/components/wax/Asset";

export const LandingPage = () => {
  return (
    <div className="bg-primary w-full h-full flex p-10 gap-2">
      <Asset
        name="Some nft"
        mint={300}
        link="/nfts/300"
        isSelectable={true}
        isTemplate={false}
        image="https://ipfs.neftyblocks.io/ipfs/QmPe1JAAg2HhXhMy1t12rdPWYMoRDurkb4VTjqq2rfiFR5"
        collection="warsaken"
      ></Asset>
      <Asset
        name="Some nft"
        mint={300}
        link="/nfts/300"
        isSelectable={true}
        isTemplate={false}
        image="https://wrskn.io/assets/mats/nft/00001"
        collection="warsaken"
      ></Asset>
    </div>
  );
};

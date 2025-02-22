import { Asset } from "@/components/wax/Asset";

export const LandingPage = () => {
  return (
    <div className="bg-green-300 w-full h-full flex p-10">
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

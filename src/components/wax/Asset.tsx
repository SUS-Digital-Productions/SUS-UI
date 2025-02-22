import { Check } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";

type AssetProps = {
  name: string;
  mint: number;
  link: string;
  isSelectable: boolean;
  isTemplate: boolean;
  image: string;
  collection: string;
};

export const Asset = (props: AssetProps) => {
  const navigate = useNavigate();

  const [selected, setSelected] = useState<boolean>(false);

  return (
    <Card
      className="bg-accent w-28 h-52 sm:w-42 sm:h-64 lg:w-56 lg:h-80 rounded-xl hover-pointer"
      onClick={() => navigate(props.link)}
    >
      <div className="flex items-center justify-between m-1">
        {props.isSelectable && (
          <Badge
            onClick={(e) => {
              e.stopPropagation();
              setSelected(!selected);
            }}
            className="rounded-lg h-4 w-7"
          >
            {selected && <Check></Check>}
          </Badge>
        )}
        {!props.isTemplate && <Badge className="text-xs">{props.mint}</Badge>}
      </div>
      <Separator className="bg-primary"></Separator>
      <div className="flex items-center justify-center m-1 h-22 sm:h-34 lg:h-48">
        <img src={props.image} className="h-full w-full object-contain"></img>
      </div>
      <Separator className="bg-primary"></Separator>
      <div className="flex items-center justify-center">
        <div className="text-xs">{props.collection}</div>
      </div>
      <Separator className="bg-primary"></Separator>
      <div className="flex items-center justify-center">
        <div className="text-sm">{props.name}</div>
      </div>
      <div className="flex items-center justify-center mt-1">
        <Button className="text-xs w-24 sm:w-32 lg:w-48 lg:text-sm"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          List on Market
        </Button>
      </div>
    </Card>
  );
};

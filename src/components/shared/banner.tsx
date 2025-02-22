import { useNavigate } from "react-router";
import sus from "@/assets/sus.svg";

export const Banner = () => {
  const navigate = useNavigate();

  const handleOnClick = () => {
    navigate("/");
  };

  return (
    <div
      className="flex items-center gap-0 cursor-pointer"
      onClick={handleOnClick}
    >
      <img src={sus} className="w-14 -my-3 dark:filter-white" alt="logo"></img>
      <span className="text-lg font-bold">
        <span className="text-primary text-xl">SUS</span>UI
      </span>
    </div>
  );
};

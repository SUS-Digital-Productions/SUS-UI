import { Link } from "react-router";

export const Banner = () => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
        <span className="text-primary-foreground font-bold text-sm">SUS</span>
      </div>
      <span className="font-semibold text-lg hidden sm:block">SUS UI</span>
    </Link>
  );
};
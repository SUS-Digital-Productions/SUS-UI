import { useSession } from "@/hooks/use-session";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export const LogoutPage = () => {
  const wax = useSession();
  const navigate = useNavigate();
  useEffect(() => {
    wax.logout();
    navigate("/");
  }, [wax, navigate]);

  return <></>;
};

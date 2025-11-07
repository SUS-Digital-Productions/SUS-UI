import { useState, useEffect, type ReactNode } from "react";
import { Session } from "@wharfkit/session";
import { sessionKitObject, WaxSessionContext, type WaxSessionContextType } from "@/contexts/WaxSessionContext";

interface WaxSessionProviderProps {
  children: ReactNode;
}

export const WaxSessionProvider = ({ children }: WaxSessionProviderProps) => {
  const [session, setSession] = useState<Session | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionKit] = useState(() => {
    return sessionKitObject;
  });

  const login = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await sessionKit.login();
      setSession(response.session);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      if (session) {
        await sessionKit.logout(session);
      }
      setSession(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const restored = await sessionKit.restore();
        if (restored) {
          setSession(restored);
        }
      } catch {
        console.log("No session to restore");
      }
    };

    restoreSession();
  }, [sessionKit]);

  const value: WaxSessionContextType = {
    session,
    login,
    logout,
    loading,
    error,
  };

  return (
    <WaxSessionContext.Provider value={value}>
      {children}
    </WaxSessionContext.Provider>
  );
};

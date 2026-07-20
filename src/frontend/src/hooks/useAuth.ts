import { useEffect, useMemo, useState } from "react";

const AUTH_KEY = "budgetwise-auth";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginStatus, setLoginStatus] = useState<string>("idle");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stored = window.localStorage.getItem(AUTH_KEY);
    if (stored === "true") {
      setIsAuthenticated(true);
      setLoginStatus("authenticated");
    }
    setIsInitializing(false);
  }, []);

  const login = async () => {
    setIsLoggingIn(true);
    setLoginStatus("logging-in");

    if (typeof window !== "undefined") {
      window.localStorage.setItem(AUTH_KEY, "true");
    }

    setIsAuthenticated(true);
    setLoginStatus("authenticated");
    setIsLoggingIn(false);
  };

  const clear = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(AUTH_KEY);
    }
    setIsAuthenticated(false);
    setLoginStatus("logged-out");
  };

  return useMemo(
    () => ({
      identity: null,
      isAuthenticated,
      isLoading: isInitializing || isLoggingIn,
      loginStatus,
      login,
      logout: clear,
    }),
    [isAuthenticated, isInitializing, isLoggingIn, loginStatus],
  );
}

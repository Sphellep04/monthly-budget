import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AUTH_KEY = "budgetwise-auth";

interface AuthContextValue {
  identity: null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginStatus: string;
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
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

  const login = useCallback(async () => {
    setIsLoggingIn(true);
    setLoginStatus("logging-in");

    if (typeof window !== "undefined") {
      window.localStorage.setItem(AUTH_KEY, "true");
    }

    setIsAuthenticated(true);
    setLoginStatus("authenticated");
    setIsLoggingIn(false);
  }, []);

  const clear = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(AUTH_KEY);
    }
    setIsAuthenticated(false);
    setLoginStatus("logged-out");
  }, []);

  const value = useMemo(
    () => ({
      identity: null,
      isAuthenticated,
      isLoading: isInitializing || isLoggingIn,
      loginStatus,
      login,
      logout: clear,
    }),
    [isAuthenticated, isInitializing, isLoggingIn, loginStatus, login, clear],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

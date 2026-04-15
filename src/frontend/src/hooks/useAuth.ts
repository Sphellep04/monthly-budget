import { useInternetIdentity } from "@caffeineai/core-infrastructure";

export function useAuth() {
  const {
    identity,
    loginStatus,
    login,
    clear,
    isAuthenticated,
    isInitializing,
    isLoggingIn,
  } = useInternetIdentity();

  const isLoading = isInitializing || isLoggingIn;

  return {
    identity,
    isAuthenticated,
    isLoading,
    loginStatus,
    login,
    logout: clear,
  };
}

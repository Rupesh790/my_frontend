import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOnboardingStatus } from "../services/brokerService";
import { googleLogin, logoutUser, refreshToken } from "../googlelogin/authService";
import { getToken, removeToken, saveToken } from "../googlelogin/tokenService";
import { getUserProfile } from "../googlelogin/userService";
import { AuthContext, getAuthInitialState } from "./authContext";

const REFRESH_INTERVAL_MS = 4 * 60 * 1000;

export function AuthProvider({ children }) {
  const initial = getAuthInitialState();
  const [user, setUser] = useState(initial.user);
  const [isLoading, setIsLoading] = useState(initial.isLoading);
  const [error, setError] = useState(initial.error);
  const [onboarding, setOnboarding] = useState(null);
  const navigate = useNavigate();

  const loadOnboarding = useCallback(async () => {
    try {
      const status = await getOnboardingStatus();
      setOnboarding(status);
      return status;
    } catch {
      setOnboarding(null);
      return null;
    }
  }, []);

  const redirectAfterAuth = useCallback(
    async (replace = true) => {
      const status = await loadOnboarding();
      if (!status || status.next_step === "select_broker") {
        navigate("/brokers/select", { replace });
      } else if (status.next_step === "connect_broker") {
        navigate("/brokers/connect", { replace });
      } else {
        navigate("/dashboard", { replace });
      }
    },
    [loadOnboarding, navigate]
  );

  const logout = useCallback(async () => {
    const token = getToken();
    try {
      if (token?.refresh) await logoutUser(token.refresh);
      else removeToken();
    } catch {
      removeToken();
    }
    setUser(null);
    setOnboarding(null);
    navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const googleAccessToken = hashParams.get("access_token");
    let cancelled = false;

    if (googleAccessToken) {
      (async () => {
        try {
          await googleLogin(googleAccessToken);
          const token = getToken();
          const profile = await getUserProfile(token.access);
          if (cancelled) return;
          setUser(profile);
          setError(null);
          window.history.replaceState(null, "", window.location.pathname);
          await redirectAfterAuth(true);
        } catch (err) {
          if (!cancelled) {
            setError(err.message);
            navigate("/login", { replace: true });
          }
        } finally {
          if (!cancelled) setIsLoading(false);
        }
      })();
      return () => { cancelled = true; };
    }

    const token = getToken();
    if (!token?.access) return undefined;

    (async () => {
      try {
        const profile = await getUserProfile(token.access);
        if (!cancelled) {
          setUser(profile);
          setError(null);
          await loadOnboarding();
        }
      } catch (err) {
        if (!cancelled) {
          removeToken();
          setUser(null);
          setError(err.message);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [loadOnboarding, navigate, redirectAfterAuth]);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const token = getToken();
      if (!token?.refresh) return;
      try {
        const data = await refreshToken(token);
        if (data?.access) saveToken({ ...token, access: data.access });
      } catch {
        removeToken();
        setUser(null);
      }
    }, REFRESH_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, []);

  const refreshUser = useCallback(async () => {
    const token = getToken();
    if (!token?.access) { setUser(null); return; }
    setIsLoading(true);
    try {
      const profile = await getUserProfile(token.access);
      setUser(profile);
      setError(null);
      await loadOnboarding();
    } catch (err) {
      removeToken();
      setUser(null);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [loadOnboarding]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      error,
      onboarding,
      logout,
      refreshUser,
      loadOnboarding,
      redirectAfterAuth,
    }),
    [user, isLoading, error, onboarding, logout, refreshUser, loadOnboarding, redirectAfterAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

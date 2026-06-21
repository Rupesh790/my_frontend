import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOnboardingStatus } from "../services/brokerService";
import {
  googleLogin,
  logoutUser,
  refreshToken,
} from "../googlelogin/authService";
import {
  getToken,
  removeToken,
} from "../googlelogin/tokenService";
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
      if (token?.refresh) {
        await logoutUser(token.refresh);
      } else {
        removeToken();
      }
    } catch {
      removeToken();
    }

    setUser(null);
    setOnboarding(null);
    setError(null);

    navigate("/login", { replace: true });
  }, [navigate]);

  // Initial Login / Session Restore
  useEffect(() => {
    let cancelled = false;

    const initializeAuth = async () => {
      try {
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1)
        );

        const googleAccessToken =
          hashParams.get("access_token");

        // Google OAuth callback
        if (googleAccessToken) {
          await googleLogin(googleAccessToken);

          window.history.replaceState(
            null,
            "",
            window.location.pathname
          );
        }

        let token = getToken();

        if (!token?.access) {
          setIsLoading(false);
          return;
        }

        // Refresh token on startup
        try {
          token = await refreshToken(token);
        } catch (err) {
          console.warn("Startup token refresh failed:", err);
        }

        const profile = await getUserProfile(
          token.access
        );

        if (cancelled) return;

        setUser(profile);
        setError(null);

        await loadOnboarding();

        if (googleAccessToken) {
          await redirectAfterAuth(true);
        }
      } catch (err) {
        if (!cancelled) {
          removeToken();
          setUser(null);
          setOnboarding(null);
          setError(err.message || "Authentication failed");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      cancelled = true;
    };
  }, [loadOnboarding, redirectAfterAuth]);

  // Automatic Token Refresh
  useEffect(() => {
    const intervalId = setInterval(async () => {
      const token = getToken();

      if (!token?.refresh) return;

      try {
        await refreshToken(token);
      } catch (err) {
        console.error("Token refresh failed:", err);

        removeToken();
        setUser(null);
        setOnboarding(null);
      }
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, []);

  const refreshUser = useCallback(async () => {
    const token = getToken();

    if (!token?.access) {
      setUser(null);
      return;
    }

    setIsLoading(true);

    try {
      const profile = await getUserProfile(
        token.access
      );

      setUser(profile);
      setError(null);

      await loadOnboarding();
    } catch (err) {
      removeToken();
      setUser(null);
      setOnboarding(null);
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
    [
      user,
      isLoading,
      error,
      onboarding,
      logout,
      refreshUser,
      loadOnboarding,
      redirectAfterAuth,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
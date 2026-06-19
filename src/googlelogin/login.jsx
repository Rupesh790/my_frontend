import { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "../components/LoadingSpinner";
import "./login.css";

function Login() {
  const { isAuthenticated, isLoading, error, redirectAfterAuth } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      redirectAfterAuth(true);
    }
  }, [isAuthenticated, isLoading, redirectAfterAuth]);

  const loginWithGoogle = () => {
    window.location.href = import.meta.env.VITE_GOOGLE_LINK;
  };

  if (isLoading) {
    return <LoadingSpinner message="Checking session..." />;
  }

  return (
    <div className="auth-page fade-in">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-logo">IndiaTrade</span>
          <p>Sign in to access your trading dashboard</p>
        </div>

        <button
          type="button"
          className="btn-google"
          onClick={loginWithGoogle}
          aria-label="Sign in with Google"
        >
          <FcGoogle size={22} aria-hidden="true" />
          Sign in with Google
        </button>

        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}

        <p className="auth-footer">
          By signing in, you agree to our terms of service and privacy policy.
        </p>
      </div>
    </div>
  );
}

export default Login;

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { googleLogin } from "./authService";

function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const login = async () => {
      const hashParams =
        new URLSearchParams(
          window.location.hash.substring(1)
        );

      const accessToken =
        hashParams.get("access_token");

      if (!accessToken) {
        navigate("/login");
        return;
      }

      const data = await googleLogin(
        accessToken
      );

      if (data.refresh) {
        navigate("/profile");
      }
    };

    login();
  }, []);

  return <h2>Logging in...</h2>;
}

export default GoogleCallback;
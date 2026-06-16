import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import fetchUserProfile from "./fetchuserprofile";

function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const GOOGLELOGIN_API = import.meta.env.VITE_GOOGLELOGIN;
  const USERME_API = import.meta.env.VITE_USERME;
  const BLACKLIST_API = import.meta.env.VITE_BLACKLIST;
  const REFRESHTOKEN_API = import.meta.env.VITE_REFRESHTOKEN;

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("auth_token"));
    const REFRESH_INTERVAL = 1000 * 60 * 4; // 4 minutes
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get("access_token");

    if (accessToken) {
      handleGoogleLogin(accessToken);
    } else if (token) {
      fetchUserProfile(token);
    } else {
      navigate("/login");
    }

    const intervalId = setInterval(() => {
      const token = JSON.parse(localStorage.getItem("auth_token"));
      if (token?.refresh) {
        updateToken(token);
      }
    }, REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch(USERME_API, {
        headers: {
          Authorization: `Bearer ${token?.access}`,
        },
      });
      const data = await response.json();
      setUser(data);
    } catch {
      navigate("/login");
    }
  };

  const handleGoogleLogin = async (accessToken) => {
  try {
    console.log("Access Token:", accessToken);
    console.log("API URL:", GOOGLELOGIN_API);

    const response = await fetch(GOOGLELOGIN_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_token: accessToken,
      }),
    });

    console.log("Status:", response.status);

    const text = await response.text();
    console.log("Response:", text);

  } catch (err) {
    console.error("ERROR:", err);
  }
};

  const blacklisttoken = async (token) => {
    try {
      await fetch(BLACKLIST_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: token?.refresh }),
      });
    } catch (err) {
      console.error("Error blacklisting token:", err);
    }
  };

  const logout = () => {
    const token = JSON.parse(localStorage.getItem("auth_token"));
    localStorage.removeItem("auth_token");
    blacklisttoken(token);
    navigate("/login");
  };

  const updateToken = async (token) => {
    try {
      const response = await fetch(REFRESHTOKEN_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: token?.refresh }),
      });

      const data = await response.json();
      if (response.status === 200) {
        const updatedToken = { ...token, access: data.access };
        localStorage.setItem("auth_token", JSON.stringify(updatedToken));
      } else {
        logout();
      }
    } catch {
      logout();
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile">
      <img src={user.image} alt="userprofile" className="profile-image" />
      <div className="profile-details">
        <div className="user_name">
          Name: <span>{user.username}</span>
        </div>
        <div className="user_email">
          Email: <span>{user.email}</span>
        </div>
        <br />
        <button onClick={logout}>Sign out</button>
      </div>
    </div>
  );
}

export default Home;
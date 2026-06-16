import { useEffect, useState } from "react";
import { getToken } from "./tokenService";
import { getUserProfile } from "./userService";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const token = getToken();

      const data =
        await getUserProfile(
          token.access
        );

      setUser(data);
    };

    loadUser();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <img src={user.image} alt="" />

      <h3>{user.username}</h3>

      <p>{user.email}</p>
    </div>
  );
}

export default Profile;
const USERME_API = import.meta.env.VITE_USERME;

export const getUserProfile = async (
  accessToken
) => {
  const response = await fetch(
    USERME_API,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return await response.json();
};
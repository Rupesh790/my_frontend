import { apiGet } from "../api/client";

export async function getUserProfile(accessToken) {
  return apiGet("/users/me/", accessToken);
}

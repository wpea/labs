import axios from "axios";
import { apiAddress } from "./api";

export function readJson(key) {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}
export function clearLegacyBambooSession() {
  ["user", "x-client-token", "other", "other_user_data"].forEach((key) =>
    localStorage.removeItem(key)
  );
}
export async function bamboo(
  path,
  { method = "GET", accountId, data = {}, signal } = {}
) {
  const token = readJson("token");
  if (!token) throw new Error("Please sign in to continue.");
  const payload = {
    ...data,
    ...(accountId ? { account_id: Number(accountId) } : {}),
  };
  try {
    const response = await axios({
      url: `${apiAddress}/bamboo${path}`,
      method,
      signal,
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      ...(method === "GET" ? { params: payload } : { data: payload }),
    });
    return response.data.data;
  } catch (error) {
    if (axios.isCancel(error)) throw error;
    const fields = error.response?.data?.errors;
    error.message = fields
      ? Object.values(fields).flat().join(" ")
      : error.response?.data?.message ||
        error.message ||
        "Request failed. Please retry.";
    error.code = error.response?.data?.code || error.code;
    throw error;
  }
}
export function isCancelled(error) {
  return axios.isCancel(error) || error?.code === "ERR_CANCELED";
}

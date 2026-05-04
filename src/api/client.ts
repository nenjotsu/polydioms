const API_BASE = import.meta.env.VITE_API_BASE;

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("pd_token");

  console.log(API_BASE);
  

  const res = await fetch(`${API_BASE}/${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json();
  if (!data.success) throw new Error(data.error ?? "Request failed");
  return data.data as T;
}

export const api = {
  get:  <T>(endpoint: string, params?: Record<string, string>) =>
    apiFetch<T>(endpoint + (params ? "?" + new URLSearchParams(params) : "")),
  post: <T>(endpoint: string, body: unknown) =>
    apiFetch<T>(endpoint, { method: "POST", body: JSON.stringify(body) }),
};
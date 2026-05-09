import "server-only";

import { apiGetJson, getApiBaseUrl } from "@/lib/api/client";
import { listHubs, type Hub } from "@/lib/data/hubs";

type ExternalHubsResponse = {
  data: Hub[];
};
 export async function fetchHubsServer(): Promise<{
  hubs: Hub[];
  source: "external" | "mock";
}> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    return { hubs: listHubs(), source: "mock" };
  }

  try {
    // Expected Node API endpoint: GET {DROPTY_API_BASE_URL}/customers
    // If your API path is different, change it here.
    const result = await apiGetJson<ExternalHubsResponse>("/hubs");
    return { hubs: result.data ?? [], source: "external" };
  } catch {
    // Fallback so the UI still works if the API is down during development.
    return { hubs: listHubs(), source: "mock" };
  }
}

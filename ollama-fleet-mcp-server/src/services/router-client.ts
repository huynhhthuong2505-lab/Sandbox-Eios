import { FLEET_API_KEY, FLEET_OPS_URL, FLEET_ROUTER_URL } from "../constants.js";
import type {
  FleetChatResponse,
  FleetModel,
  FleetRequestDetail,
  FleetRequestSummary,
  FleetRoutePreview,
  FleetServer,
  PaginationResult,
} from "../types.js";

type HttpMethod = "GET" | "POST";

function buildUrl(baseUrl: string, path: string, query?: Record<string, string | number | boolean | undefined>): URL {
  const url = new URL(path, `${baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`}`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url;
}

async function requestJson<T>(
  baseUrl: string,
  path: string,
  method: HttpMethod,
  body?: unknown,
  query?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
  const url = buildUrl(baseUrl, path, query);
  const response = await fetch(url, {
    method,
    headers: {
      "content-type": "application/json",
      "accept": "application/json",
      ...(FLEET_API_KEY ? { authorization: `Bearer ${FLEET_API_KEY}` } : {}),
    },
    body: method === "POST" ? JSON.stringify(body ?? {}) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    const fallback = errorText || `HTTP ${response.status}`;

    if (response.status === 404) {
      throw new Error(`Không tìm thấy tài nguyên ở ${path}. Kiểm tra lại ID hoặc route backend.`);
    }
    if (response.status === 429) {
      throw new Error("Backend fleet đang rate limit. Hãy thử lại sau vài giây.");
    }
    if (response.status >= 500) {
      throw new Error(`Backend fleet lỗi nội bộ: ${fallback}`);
    }

    throw new Error(`Yêu cầu tới backend thất bại: ${fallback}`);
  }

  return response.json() as Promise<T>;
}

function coercePagination<T>(value: unknown): PaginationResult<T> {
  const payload = value as Partial<PaginationResult<T>>;
  const items = Array.isArray(payload.items) ? payload.items : [];
  const total = typeof payload.total === "number" ? payload.total : items.length;
  const offset = typeof payload.offset === "number" ? payload.offset : 0;
  const count = typeof payload.count === "number" ? payload.count : items.length;
  const hasMore = typeof payload.has_more === "boolean" ? payload.has_more : total > offset + count;
  const nextOffset = typeof payload.next_offset === "number" ? payload.next_offset : hasMore ? offset + count : undefined;

  return {
    total,
    count,
    offset,
    items,
    has_more: hasMore,
    ...(typeof nextOffset === "number" ? { next_offset: nextOffset } : {}),
  };
}

export class RouterClient {
  async listModels(query: Record<string, string | number | boolean | undefined>): Promise<PaginationResult<FleetModel>> {
    const data = await requestJson<unknown>(FLEET_OPS_URL, "v1/models", "GET", undefined, query);
    return coercePagination<FleetModel>(data);
  }

  async listServers(query: Record<string, string | number | boolean | undefined>): Promise<PaginationResult<FleetServer>> {
    const data = await requestJson<unknown>(FLEET_OPS_URL, "v1/servers", "GET", undefined, query);
    return coercePagination<FleetServer>(data);
  }

  async getServerStatus(serverId: string): Promise<FleetServer> {
    return requestJson<FleetServer>(FLEET_OPS_URL, `v1/servers/${encodeURIComponent(serverId)}`, "GET");
  }

  async chat(body: Record<string, unknown>): Promise<FleetChatResponse> {
    return requestJson<FleetChatResponse>(FLEET_ROUTER_URL, "v1/chat", "POST", body);
  }

  async routePreview(body: Record<string, unknown>): Promise<FleetRoutePreview> {
    return requestJson<FleetRoutePreview>(FLEET_ROUTER_URL, "v1/route/preview", "POST", body);
  }

  async listRecentRequests(query: Record<string, string | number | boolean | undefined>): Promise<PaginationResult<FleetRequestSummary>> {
    const data = await requestJson<unknown>(FLEET_OPS_URL, "v1/requests", "GET", undefined, query);
    return coercePagination<FleetRequestSummary>(data);
  }

  async getRequestById(requestId: string, includePromptMetadata: boolean): Promise<FleetRequestDetail> {
    return requestJson<FleetRequestDetail>(
      FLEET_OPS_URL,
      `v1/requests/${encodeURIComponent(requestId)}`,
      "GET",
      undefined,
      { include_prompt_metadata: includePromptMetadata },
    );
  }

  async warmModel(body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return requestJson<Record<string, unknown>>(FLEET_OPS_URL, "v1/models/warm", "POST", body);
  }

  async evictModel(body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return requestJson<Record<string, unknown>>(FLEET_OPS_URL, "v1/models/evict", "POST", body);
  }

  async setServerState(serverId: string, body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return requestJson<Record<string, unknown>>(
      FLEET_OPS_URL,
      `v1/servers/${encodeURIComponent(serverId)}/state`,
      "POST",
      body,
    );
  }
}

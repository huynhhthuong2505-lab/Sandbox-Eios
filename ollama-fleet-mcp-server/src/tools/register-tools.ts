import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  ChatSchema,
  EvictModelSchema,
  GetRequestByIdSchema,
  GetServerStatusSchema,
  ListModelsSchema,
  ListServersSchema,
  RecentRequestsSchema,
  RoutePreviewSchema,
  SetServerStateSchema,
  WarmModelSchema,
} from "../schemas/index.js";
import { RouterClient } from "../services/router-client.js";
import {
  formatChatMarkdown,
  formatModelsMarkdown,
  formatMutationMarkdown,
  formatRecentRequestsMarkdown,
  formatRequestDetailMarkdown,
  formatResult,
  formatRoutePreviewMarkdown,
  formatServersMarkdown,
  formatServerStatusMarkdown,
} from "../utils/format.js";

function toolError(message: string) {
  return {
    isError: true,
    content: [{ type: "text" as const, text: `Error: ${message}` }],
  };
}

function toStructured(value: unknown): Record<string, unknown> {
  return value as Record<string, unknown>;
}

export function registerTools(server: McpServer, client: RouterClient): void {
  server.registerTool(
    "ollama_fleet_list_models",
    {
      title: "List Fleet Models",
      description: "Liệt kê model hiện có trong fleet Ollama, kèm vị trí node và trạng thái warm.",
      inputSchema: ListModelsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async (params) => {
      try {
        const result = await client.listModels(params);
        const formatted = formatResult(params.response_format, formatModelsMarkdown(result), result);
        return {
          content: [{ type: "text", text: formatted.text }],
          structuredContent: toStructured(formatted.data),
        };
      } catch (error) {
        return toolError(error instanceof Error ? error.message : String(error));
      }
    },
  );

  server.registerTool(
    "ollama_fleet_list_servers",
    {
      title: "List Fleet Servers",
      description: "Liệt kê node trong fleet cùng health, state, load và warm models.",
      inputSchema: ListServersSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async (params) => {
      try {
        const result = await client.listServers(params);
        const formatted = formatResult(params.response_format, formatServersMarkdown(result), result);
        return {
          content: [{ type: "text", text: formatted.text }],
          structuredContent: toStructured(formatted.data),
        };
      } catch (error) {
        return toolError(error instanceof Error ? error.message : String(error));
      }
    },
  );

  server.registerTool(
    "ollama_fleet_get_server_status",
    {
      title: "Get Fleet Server Status",
      description: "Lấy tình trạng chi tiết của một node Ollama trong fleet.",
      inputSchema: GetServerStatusSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ server_id, response_format }) => {
      try {
        const result = await client.getServerStatus(server_id);
        const formatted = formatResult(response_format, formatServerStatusMarkdown(result), result);
        return {
          content: [{ type: "text", text: formatted.text }],
          structuredContent: toStructured(formatted.data),
        };
      } catch (error) {
        return toolError(error instanceof Error ? error.message : String(error));
      }
    },
  );

  server.registerTool(
    "ollama_fleet_chat",
    {
      title: "Chat Through Fleet",
      description: "Gửi chat request tới fleet-router để hệ thống tự chọn node phù hợp nhất.",
      inputSchema: ChatSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    async (params) => {
      try {
        const result = await client.chat(params);
        const formatted = formatResult(params.response_format, formatChatMarkdown(result), result);
        return {
          content: [{ type: "text", text: formatted.text }],
          structuredContent: toStructured(formatted.data),
        };
      } catch (error) {
        return toolError(error instanceof Error ? error.message : String(error));
      }
    },
  );

  server.registerTool(
    "ollama_fleet_route_request_preview",
    {
      title: "Preview Fleet Route Decision",
      description: "Cho biết router sẽ chọn node nào cho một request mà chưa thực thi inference thật.",
      inputSchema: RoutePreviewSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async (params) => {
      try {
        const result = await client.routePreview(params);
        const formatted = formatResult(params.response_format, formatRoutePreviewMarkdown(result), result);
        return {
          content: [{ type: "text", text: formatted.text }],
          structuredContent: toStructured(formatted.data),
        };
      } catch (error) {
        return toolError(error instanceof Error ? error.message : String(error));
      }
    },
  );

  server.registerTool(
    "ollama_fleet_get_recent_requests",
    {
      title: "List Recent Fleet Requests",
      description: "Liệt kê request gần đây trong fleet để phục vụ dashboard và điều tra vận hành.",
      inputSchema: RecentRequestsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async (params) => {
      try {
        const result = await client.listRecentRequests(params);
        const formatted = formatResult(params.response_format, formatRecentRequestsMarkdown(result), result);
        return {
          content: [{ type: "text", text: formatted.text }],
          structuredContent: toStructured(formatted.data),
        };
      } catch (error) {
        return toolError(error instanceof Error ? error.message : String(error));
      }
    },
  );

  server.registerTool(
    "ollama_fleet_get_request_by_id",
    {
      title: "Get Fleet Request By ID",
      description: "Lấy chi tiết một request cụ thể theo request_id.",
      inputSchema: GetRequestByIdSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ request_id, include_prompt_metadata, response_format }) => {
      try {
        const result = await client.getRequestById(request_id, include_prompt_metadata);
        const formatted = formatResult(response_format, formatRequestDetailMarkdown(result), result);
        return {
          content: [{ type: "text", text: formatted.text }],
          structuredContent: toStructured(formatted.data),
        };
      } catch (error) {
        return toolError(error instanceof Error ? error.message : String(error));
      }
    },
  );

  server.registerTool(
    "ollama_fleet_warm_model",
    {
      title: "Warm Fleet Model",
      description: "Yêu cầu preload một model lên node mục tiêu hoặc để backend tự chọn node.",
      inputSchema: WarmModelSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    async (params) => {
      try {
        const result = await client.warmModel(params);
        const text = formatMutationMarkdown("Warm Model Accepted", result);
        return {
          content: [{ type: "text", text }],
          structuredContent: toStructured(result),
        };
      } catch (error) {
        return toolError(error instanceof Error ? error.message : String(error));
      }
    },
  );

  server.registerTool(
    "ollama_fleet_evict_model",
    {
      title: "Evict Fleet Model",
      description: "Yêu cầu gỡ model khỏi warm memory trên một node cụ thể.",
      inputSchema: EvictModelSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    async (params) => {
      try {
        const result = await client.evictModel(params);
        const text = formatMutationMarkdown("Evict Model Accepted", result);
        return {
          content: [{ type: "text", text }],
          structuredContent: toStructured(result),
        };
      } catch (error) {
        return toolError(error instanceof Error ? error.message : String(error));
      }
    },
  );

  server.registerTool(
    "ollama_fleet_set_server_state",
    {
      title: "Set Fleet Server State",
      description: "Đổi trạng thái vận hành của một node, ví dụ active, draining hoặc disabled.",
      inputSchema: SetServerStateSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ server_id, state, reason }) => {
      try {
        const result = await client.setServerState(server_id, { state, reason });
        const text = formatMutationMarkdown("Server State Updated", result);
        return {
          content: [{ type: "text", text }],
          structuredContent: toStructured(result),
        };
      } catch (error) {
        return toolError(error instanceof Error ? error.message : String(error));
      }
    },
  );
}

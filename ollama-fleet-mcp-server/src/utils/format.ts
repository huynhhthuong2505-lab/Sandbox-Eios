import { CHARACTER_LIMIT } from "../constants.js";
import type {
  FleetChatResponse,
  FleetModel,
  FleetRequestDetail,
  FleetRequestSummary,
  FleetRoutePreview,
  FleetServer,
  PaginationResult,
  ResponseFormat,
} from "../types.js";

function safeJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

function truncate(text: string): string {
  if (text.length <= CHARACTER_LIMIT) {
    return text;
  }

  return `${text.slice(0, CHARACTER_LIMIT)}\n\n[truncated: response exceeded ${CHARACTER_LIMIT} characters]`;
}

export function formatResult<T>(format: ResponseFormat, markdown: string, data: T): { text: string; data: T } {
  const text = format === "json" ? safeJson(data) : markdown;
  return { text: truncate(text), data };
}

export function formatModelsMarkdown(result: PaginationResult<FleetModel>): string {
  const lines: string[] = [
    "# Fleet Models",
    "",
    `Tổng: ${result.total}, đang hiển thị: ${result.count}, offset: ${result.offset}`,
    "",
  ];

  for (const model of result.items) {
    lines.push(`## ${model.name}`);
    if (model.family) lines.push(`- Family: ${model.family}`);
    if (model.size_label) lines.push(`- Size: ${model.size_label}`);
    if (model.quantization) lines.push(`- Quantization: ${model.quantization}`);
    if (model.capabilities?.length) lines.push(`- Capabilities: ${model.capabilities.join(", ")}`);
    if (model.locations?.length) {
      const locations = model.locations
        .map((location) => `${location.server_name} (${location.server_id})${location.is_warm ? " [warm]" : ""}`)
        .join(", ");
      lines.push(`- Locations: ${locations}`);
    }
    lines.push("");
  }

  if (result.has_more && typeof result.next_offset === "number") {
    lines.push(`Còn dữ liệu. Dùng offset=${result.next_offset} để xem tiếp.`);
  }

  return lines.join("\n");
}

export function formatServersMarkdown(result: PaginationResult<FleetServer>): string {
  const lines: string[] = [
    "# Fleet Servers",
    "",
    `Tổng: ${result.total}, đang hiển thị: ${result.count}, offset: ${result.offset}`,
    "",
  ];

  for (const server of result.items) {
    lines.push(`## ${server.name} (${server.id})`);
    lines.push(`- Health: ${server.status}`);
    lines.push(`- State: ${server.state}`);
    if (typeof server.current_load === "number") lines.push(`- Load: ${server.current_load}`);
    if (typeof server.gpu_memory_used === "number" && typeof server.gpu_memory_total === "number") {
      lines.push(`- GPU memory: ${server.gpu_memory_used}/${server.gpu_memory_total}`);
    }
    if (server.warm_models?.length) lines.push(`- Warm models: ${server.warm_models.join(", ")}`);
    if (server.last_heartbeat_at) lines.push(`- Last heartbeat: ${server.last_heartbeat_at}`);
    lines.push("");
  }

  if (result.has_more && typeof result.next_offset === "number") {
    lines.push(`Còn dữ liệu. Dùng offset=${result.next_offset} để xem tiếp.`);
  }

  return lines.join("\n");
}

export function formatServerStatusMarkdown(server: FleetServer): string {
  const lines: string[] = [
    `# Server Status: ${server.name} (${server.id})`,
    "",
    `- Health: ${server.status}`,
    `- State: ${server.state}`,
  ];

  if (server.base_url) lines.push(`- Base URL: ${server.base_url}`);
  if (typeof server.current_load === "number") lines.push(`- Load: ${server.current_load}`);
  if (typeof server.gpu_memory_used === "number" && typeof server.gpu_memory_total === "number") {
    lines.push(`- GPU memory: ${server.gpu_memory_used}/${server.gpu_memory_total}`);
  }
  if (server.available_models?.length) lines.push(`- Available models: ${server.available_models.join(", ")}`);
  if (server.warm_models?.length) lines.push(`- Warm models: ${server.warm_models.join(", ")}`);
  if (server.last_heartbeat_at) lines.push(`- Last heartbeat: ${server.last_heartbeat_at}`);
  if (server.last_error) lines.push(`- Last error: ${server.last_error}`);

  return lines.join("\n");
}

export function formatChatMarkdown(result: FleetChatResponse): string {
  const lines = [
    `# Fleet Chat Result`,
    "",
    `- Request ID: ${result.request_id}`,
    `- Model: ${result.model}`,
    `- Routed server: ${result.routed_server_name ?? result.routed_server_id} (${result.routed_server_id})`,
  ];

  if (typeof result.latency_ms === "number") lines.push(`- Latency: ${result.latency_ms} ms`);
  if (result.finish_reason) lines.push(`- Finish reason: ${result.finish_reason}`);
  if (result.usage?.total_tokens) lines.push(`- Total tokens: ${result.usage.total_tokens}`);

  lines.push("", result.output_text);
  return lines.join("\n");
}

export function formatRoutePreviewMarkdown(result: FleetRoutePreview): string {
  const lines = [
    "# Route Preview",
    "",
    `- Selected server: ${result.selected_server_name ?? result.selected_server_id} (${result.selected_server_id})`,
    `- Decision reason: ${result.decision_reason.join(", ")}`,
  ];

  if (result.fallback_server_ids?.length) {
    lines.push(`- Fallbacks: ${result.fallback_server_ids.join(", ")}`);
  }

  return lines.join("\n");
}

export function formatRecentRequestsMarkdown(result: PaginationResult<FleetRequestSummary>): string {
  const lines: string[] = [
    "# Recent Fleet Requests",
    "",
    `Tổng: ${result.total}, đang hiển thị: ${result.count}, offset: ${result.offset}`,
    "",
  ];

  for (const item of result.items) {
    lines.push(`## ${item.request_id}`);
    lines.push(`- Kind: ${item.request_kind}`);
    lines.push(`- Model: ${item.model}`);
    if (item.server_id) lines.push(`- Server: ${item.server_id}`);
    lines.push(`- Status: ${item.status}`);
    if (typeof item.latency_ms === "number") lines.push(`- Latency: ${item.latency_ms} ms`);
    lines.push(`- Created at: ${item.created_at}`);
    lines.push("");
  }

  if (result.has_more && typeof result.next_offset === "number") {
    lines.push(`Còn dữ liệu. Dùng offset=${result.next_offset} để xem tiếp.`);
  }

  return lines.join("\n");
}

export function formatRequestDetailMarkdown(item: FleetRequestDetail): string {
  const lines = [
    `# Fleet Request: ${item.request_id}`,
    "",
    `- Kind: ${item.request_kind}`,
    `- Model: ${item.model}`,
    `- Status: ${item.status}`,
    `- Created at: ${item.created_at}`,
  ];

  if (item.server_id) lines.push(`- Server: ${item.server_id}`);
  if (typeof item.latency_ms === "number") lines.push(`- Latency: ${item.latency_ms} ms`);
  if (item.usage?.total_tokens) lines.push(`- Total tokens: ${item.usage.total_tokens}`);
  if (item.error_code) lines.push(`- Error code: ${item.error_code}`);
  if (item.error_message) lines.push(`- Error message: ${item.error_message}`);

  return lines.join("\n");
}

export function formatMutationMarkdown(title: string, data: Record<string, unknown>): string {
  const lines = [`# ${title}`, ""];
  for (const [key, value] of Object.entries(data)) {
    lines.push(`- ${key}: ${typeof value === "string" ? value : safeJson(value)}`);
  }
  return lines.join("\n");
}

export type ResponseFormat = "markdown" | "json";
export type RequestKind = "chat" | "generate" | "embed";
export type ServerState = "active" | "draining" | "disabled";

export interface FleetModelLocation {
  server_id: string;
  server_name: string;
  is_warm: boolean;
}

export interface FleetModel {
  name: string;
  family?: string;
  size_label?: string;
  quantization?: string;
  capabilities?: string[];
  locations?: FleetModelLocation[];
}

export interface FleetServer {
  id: string;
  name: string;
  status: string;
  state: ServerState | string;
  base_url?: string;
  current_load?: number;
  gpu_memory_used?: number;
  gpu_memory_total?: number;
  available_models?: string[];
  warm_models?: string[];
  last_heartbeat_at?: string;
  last_error?: string | null;
}

export interface FleetUsage {
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
}

export interface FleetChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface FleetChatResponse {
  request_id: string;
  model: string;
  routed_server_id: string;
  routed_server_name?: string;
  finish_reason?: string;
  latency_ms?: number;
  usage?: FleetUsage;
  output_text: string;
}

export interface FleetRoutePreview {
  selected_server_id: string;
  selected_server_name?: string;
  decision_reason: string[];
  fallback_server_ids?: string[];
}

export interface FleetRequestSummary {
  request_id: string;
  request_kind: RequestKind | string;
  model: string;
  server_id?: string;
  status: string;
  latency_ms?: number;
  created_at: string;
}

export interface FleetRequestDetail extends FleetRequestSummary {
  usage?: FleetUsage;
  error_code?: string | null;
  error_message?: string | null;
}

export interface PaginationResult<T> {
  total: number;
  count: number;
  offset: number;
  items: T[];
  has_more: boolean;
  next_offset?: number;
}

import { z } from "zod";

export const ResponseFormatSchema = z.enum(["markdown", "json"]);
export const ServerStateSchema = z.enum(["active", "draining", "disabled"]);
export const RequestKindSchema = z.enum(["chat", "generate", "embed"]);

export const PaginationSchema = {
  limit: z.number().int().min(1).max(100).default(20).describe("Số lượng bản ghi tối đa trả về"),
  offset: z.number().int().min(0).default(0).describe("Số lượng bản ghi bỏ qua để phân trang"),
};

export const ListModelsSchema = z.object({
  ...PaginationSchema,
  only_warm: z.boolean().default(false).describe("Chỉ trả model đang warm trên ít nhất một node"),
  server_id: z.string().min(1).optional().describe("Lọc theo máy chủ cụ thể"),
  capability: z.string().min(1).optional().describe("Lọc theo khả năng model, ví dụ chat hoặc reasoning"),
  response_format: ResponseFormatSchema.default("markdown"),
}).strict();

export const ListServersSchema = z.object({
  ...PaginationSchema,
  status: z.string().min(1).optional().describe("Lọc theo health status, ví dụ healthy hoặc degraded"),
  only_available: z.boolean().default(false).describe("Chỉ trả node có thể nhận request"),
  response_format: ResponseFormatSchema.default("markdown"),
}).strict();

export const GetServerStatusSchema = z.object({
  server_id: z.string().min(1).describe("ID máy chủ trong fleet"),
  response_format: ResponseFormatSchema.default("markdown"),
}).strict();

export const ChatMessageSchema = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: z.string().min(1).describe("Nội dung tin nhắn"),
}).strict();

export const ChatSchema = z.object({
  model: z.string().min(1).describe("Tên model, ví dụ qwen3:6b"),
  messages: z.array(ChatMessageSchema).min(1).describe("Danh sách message cho chat completion"),
  temperature: z.number().min(0).max(2).optional().describe("Nhiệt độ sampling"),
  top_p: z.number().min(0).max(1).optional().describe("Top-p sampling"),
  max_tokens: z.number().int().min(1).max(32768).optional().describe("Số token tối đa cần sinh"),
  server_preference: z.string().min(1).optional().describe("Ưu tiên route vào một server nếu nó vẫn healthy"),
  require_warm: z.boolean().default(false).describe("Chỉ route tới node đang warm model"),
  metadata: z.record(z.string(), z.unknown()).optional().describe("Metadata phụ để backend log hoặc trace"),
  response_format: ResponseFormatSchema.default("markdown"),
}).strict();

export const RoutePreviewSchema = z.object({
  model: z.string().min(1).describe("Tên model cần route"),
  request_kind: RequestKindSchema.default("chat"),
  require_warm: z.boolean().default(false),
  server_preference: z.string().min(1).optional(),
  response_format: ResponseFormatSchema.default("markdown"),
}).strict();

export const RecentRequestsSchema = z.object({
  ...PaginationSchema,
  status: z.string().min(1).optional(),
  model: z.string().min(1).optional(),
  server_id: z.string().min(1).optional(),
  response_format: ResponseFormatSchema.default("markdown"),
}).strict();

export const GetRequestByIdSchema = z.object({
  request_id: z.string().min(1),
  include_prompt_metadata: z.boolean().default(false),
  response_format: ResponseFormatSchema.default("markdown"),
}).strict();

export const WarmModelSchema = z.object({
  model: z.string().min(1),
  server_id: z.string().min(1).optional(),
  wait_until_ready: z.boolean().default(false),
  reason: z.string().min(1).optional(),
}).strict();

export const EvictModelSchema = z.object({
  model: z.string().min(1),
  server_id: z.string().min(1),
  reason: z.string().min(1).optional(),
}).strict();

export const SetServerStateSchema = z.object({
  server_id: z.string().min(1),
  state: ServerStateSchema,
  reason: z.string().min(1).optional(),
}).strict();

export type ListModelsInput = z.infer<typeof ListModelsSchema>;
export type ListServersInput = z.infer<typeof ListServersSchema>;
export type GetServerStatusInput = z.infer<typeof GetServerStatusSchema>;
export type ChatInput = z.infer<typeof ChatSchema>;
export type RoutePreviewInput = z.infer<typeof RoutePreviewSchema>;
export type RecentRequestsInput = z.infer<typeof RecentRequestsSchema>;
export type GetRequestByIdInput = z.infer<typeof GetRequestByIdSchema>;
export type WarmModelInput = z.infer<typeof WarmModelSchema>;
export type EvictModelInput = z.infer<typeof EvictModelSchema>;
export type SetServerStateInput = z.infer<typeof SetServerStateSchema>;

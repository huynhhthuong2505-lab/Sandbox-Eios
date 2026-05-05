# Đặc Tả Tool Cho `ollama-fleet-mcp`

Tài liệu này định nghĩa bộ tool khuyến nghị cho MCP server điều phối fleet Ollama nhiều node.

## Nguyên Tắc Thiết Kế

- tất cả tool dùng prefix `ollama_fleet_`
- tool tên theo dạng `động_từ + tài_nguyên`
- hỗ trợ `response_format` là `markdown` hoặc `json` cho các tool trả dữ liệu
- các tool list phải có `limit`, `offset`, `has_more`, `next_offset`
- tool admin phải tách riêng khỏi tool inference
- lỗi phải có gợi ý xử lý tiếp theo

## Enum Chung

### `response_format`

```json
["markdown", "json"]
```

### `server_state`

```json
["active", "draining", "disabled"]
```

### `request_kind`

```json
["chat", "generate", "embed"]
```

## 1. `ollama_fleet_list_models`

### Mục Đích

Liệt kê model mà fleet hiện có, kèm thông tin model đang warm ở node nào.

### Input

```json
{
  "limit": "number = 20, min 1, max 100",
  "offset": "number = 0, min 0",
  "only_warm": "boolean = false",
  "server_id": "string | undefined",
  "capability": "string | undefined",
  "response_format": "\"markdown\" | \"json\" = \"markdown\""
}
```

### Output JSON

```json
{
  "total": 2,
  "count": 2,
  "offset": 0,
  "items": [
    {
      "name": "qwen3:6b",
      "family": "qwen3",
      "size_label": "6b",
      "quantization": "q4_k_m",
      "capabilities": ["chat", "reasoning"],
      "locations": [
        {
          "server_id": "spark-ollama-01",
          "server_name": "spark-ollama-01",
          "is_warm": true
        }
      ]
    }
  ],
  "has_more": false
}
```

### Annotations

- `readOnlyHint: true`
- `destructiveHint: false`
- `idempotentHint: true`
- `openWorldHint: true`

## 2. `ollama_fleet_list_servers`

### Mục Đích

Liệt kê node hiện có trong fleet cùng load, health và model warm.

### Input

```json
{
  "limit": "number = 20, min 1, max 100",
  "offset": "number = 0, min 0",
  "status": "string | undefined",
  "only_available": "boolean = false",
  "response_format": "\"markdown\" | \"json\" = \"markdown\""
}
```

### Output JSON

```json
{
  "total": 3,
  "count": 3,
  "offset": 0,
  "items": [
    {
      "id": "spark-ollama-01",
      "name": "spark-ollama-01",
      "status": "healthy",
      "state": "active",
      "current_load": 0.37,
      "gpu_memory_used": 18800,
      "gpu_memory_total": 24576,
      "warm_models": ["qwen3:6b"],
      "last_heartbeat_at": "2026-05-04T09:10:00Z"
    }
  ],
  "has_more": false
}
```

### Annotations

- `readOnlyHint: true`
- `destructiveHint: false`
- `idempotentHint: true`
- `openWorldHint: true`

## 3. `ollama_fleet_get_server_status`

### Mục Đích

Lấy tình trạng chi tiết của một node.

### Input

```json
{
  "server_id": "string",
  "response_format": "\"markdown\" | \"json\" = \"markdown\""
}
```

### Output JSON

```json
{
  "id": "spark-ollama-01",
  "name": "spark-ollama-01",
  "status": "healthy",
  "state": "active",
  "base_url": "http://spark-ollama-01:11434",
  "current_load": 0.37,
  "gpu_memory_used": 18800,
  "gpu_memory_total": 24576,
  "available_models": ["qwen3:6b", "llama3.1:8b"],
  "warm_models": ["qwen3:6b"],
  "last_heartbeat_at": "2026-05-04T09:10:00Z",
  "last_error": null
}
```

### Annotations

- `readOnlyHint: true`
- `destructiveHint: false`
- `idempotentHint: true`
- `openWorldHint: true`

## 4. `ollama_fleet_chat`

### Mục Đích

Gửi yêu cầu chat tới fleet-router để hệ thống tự chọn node.

### Input

```json
{
  "model": "string",
  "messages": [
    {
      "role": "\"system\" | \"user\" | \"assistant\"",
      "content": "string"
    }
  ],
  "temperature": "number | undefined",
  "top_p": "number | undefined",
  "max_tokens": "number | undefined",
  "server_preference": "string | undefined",
  "require_warm": "boolean = false",
  "metadata": "object | undefined",
  "response_format": "\"markdown\" | \"json\" = \"markdown\""
}
```

### Output JSON

```json
{
  "request_id": "req_01",
  "model": "qwen3:6b",
  "routed_server_id": "spark-ollama-01",
  "routed_server_name": "spark-ollama-01",
  "finish_reason": "stop",
  "latency_ms": 842,
  "usage": {
    "prompt_tokens": 120,
    "completion_tokens": 244,
    "total_tokens": 364
  },
  "output_text": "Nội dung phản hồi từ model"
}
```

### Hành Vi

- nếu `require_warm = true`, router chỉ được chọn node đã warm model
- nếu `server_preference` được cung cấp, router ưu tiên node đó nhưng vẫn phải kiểm tra health
- nếu không có node phù hợp, trả lỗi hành động được

### Annotations

- `readOnlyHint: false`
- `destructiveHint: false`
- `idempotentHint: false`
- `openWorldHint: true`

## 5. `ollama_fleet_route_request_preview`

### Mục Đích

Cho agent xem router sẽ chọn node nào nếu thực hiện một request, nhưng chưa chạy inference thật.

### Input

```json
{
  "model": "string",
  "request_kind": "\"chat\" | \"generate\" | \"embed\" = \"chat\"",
  "require_warm": "boolean = false",
  "server_preference": "string | undefined",
  "response_format": "\"markdown\" | \"json\" = \"markdown\""
}
```

### Output JSON

```json
{
  "selected_server_id": "spark-ollama-01",
  "selected_server_name": "spark-ollama-01",
  "decision_reason": [
    "model_available",
    "server_healthy",
    "model_warm",
    "lowest_load"
  ],
  "fallback_server_ids": ["spark-ollama-03"]
}
```

### Annotations

- `readOnlyHint: true`
- `destructiveHint: false`
- `idempotentHint: true`
- `openWorldHint: true`

## 6. `ollama_fleet_get_recent_requests`

### Mục Đích

Liệt kê request gần đây để phục vụ giám sát.

### Input

```json
{
  "limit": "number = 20, min 1, max 100",
  "offset": "number = 0, min 0",
  "status": "string | undefined",
  "model": "string | undefined",
  "server_id": "string | undefined",
  "response_format": "\"markdown\" | \"json\" = \"markdown\""
}
```

### Output JSON

```json
{
  "total": 24,
  "count": 20,
  "offset": 0,
  "items": [
    {
      "request_id": "req_01",
      "request_kind": "chat",
      "model": "qwen3:6b",
      "server_id": "spark-ollama-01",
      "status": "success",
      "latency_ms": 842,
      "created_at": "2026-05-04T09:10:00Z"
    }
  ],
  "has_more": true,
  "next_offset": 20
}
```

### Annotations

- `readOnlyHint: true`
- `destructiveHint: false`
- `idempotentHint: true`
- `openWorldHint: true`

## 7. `ollama_fleet_get_request_by_id`

### Mục Đích

Lấy chi tiết một request cụ thể.

### Input

```json
{
  "request_id": "string",
  "include_prompt_metadata": "boolean = false",
  "response_format": "\"markdown\" | \"json\" = \"markdown\""
}
```

### Output JSON

```json
{
  "request_id": "req_01",
  "request_kind": "chat",
  "model": "qwen3:6b",
  "server_id": "spark-ollama-01",
  "status": "success",
  "latency_ms": 842,
  "usage": {
    "prompt_tokens": 120,
    "completion_tokens": 244,
    "total_tokens": 364
  },
  "created_at": "2026-05-04T09:10:00Z",
  "error_code": null,
  "error_message": null
}
```

### Annotations

- `readOnlyHint: true`
- `destructiveHint: false`
- `idempotentHint: true`
- `openWorldHint: true`

## 8. `ollama_fleet_warm_model`

### Mục Đích

Yêu cầu preload một model lên một node hoặc để hệ thống tự chọn node.

### Input

```json
{
  "model": "string",
  "server_id": "string | undefined",
  "wait_until_ready": "boolean = false",
  "reason": "string | undefined"
}
```

### Output JSON

```json
{
  "job_id": "warm_01",
  "model": "qwen3:6b",
  "target_server_id": "spark-ollama-01",
  "status": "accepted"
}
```

### Annotations

- `readOnlyHint: false`
- `destructiveHint: false`
- `idempotentHint: false`
- `openWorldHint: true`

## 9. `ollama_fleet_evict_model`

### Mục Đích

Yêu cầu gỡ model khỏi bộ nhớ nóng trên node.

### Input

```json
{
  "model": "string",
  "server_id": "string",
  "reason": "string | undefined"
}
```

### Output JSON

```json
{
  "job_id": "evict_01",
  "model": "qwen3:6b",
  "server_id": "spark-ollama-01",
  "status": "accepted"
}
```

### Annotations

- `readOnlyHint: false`
- `destructiveHint: true`
- `idempotentHint: false`
- `openWorldHint: true`

## 10. `ollama_fleet_set_server_state`

### Mục Đích

Đổi trạng thái vận hành của một node, ví dụ chuyển sang `draining` trước khi bảo trì.

### Input

```json
{
  "server_id": "string",
  "state": "\"active\" | \"draining\" | \"disabled\"",
  "reason": "string | undefined"
}
```

### Output JSON

```json
{
  "server_id": "spark-ollama-01",
  "previous_state": "active",
  "current_state": "draining",
  "status": "updated"
}
```

### Annotations

- `readOnlyHint: false`
- `destructiveHint: true`
- `idempotentHint: true`
- `openWorldHint: true`

## Lỗi Khuyến Nghị

### Không Tìm Thấy Model

```text
Error: Model 'qwen3:32b' is not available in the fleet. Try `ollama_fleet_list_models` to inspect available models or remove `require_warm=true`.
```

### Không Có Node Khỏe

```text
Error: No healthy server is currently available for model 'qwen3:6b'. Try `ollama_fleet_list_servers` to inspect server health or retry after the fleet recovers.
```

### Node Không Warm

```text
Error: No warm server is available for model 'qwen3:6b'. Retry with `require_warm=false` or call `ollama_fleet_warm_model` first.
```

### Lỗi Router

```text
Error: The fleet router timed out while processing the request. Retry with a lower `max_tokens` or inspect recent fleet health.
```

## Bộ Tool MVP Khuyên Dùng

Nếu muốn đi nhanh, bộ đầu tiên nên là:

- `ollama_fleet_list_models`
- `ollama_fleet_list_servers`
- `ollama_fleet_get_server_status`
- `ollama_fleet_chat`
- `ollama_fleet_route_request_preview`

Admin tool như `warm`, `evict`, `set_server_state` nên bật theo role hoặc tách ra giai đoạn sau.

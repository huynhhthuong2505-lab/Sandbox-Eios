# Kiến Trúc `ollama-fleet-mcp`

## Mục Tiêu

Thiết kế này biến cụm Ollama nhiều node của bạn thành một năng lực có thể được agent tiêu thụ qua MCP, thay vì để agent phải hiểu topology nội bộ hoặc gọi thẳng từng node.

Nguyên tắc chính:

- `MCP server` là lớp giao tiếp cho agent
- `fleet-router` là lớp điều phối inference
- `SQLite` là lớp trạng thái và telemetry chung
- `dashboard` là lớp quan sát và vận hành
- node Ollama chỉ tập trung vào chạy model

## Sơ Đồ Đề Xuất

```text
Agents / OpenClaw / Claude / OpenAI
               │
               ▼
     ┌───────────────────────┐
     │ ollama-fleet-mcp      │
     │ MCP tools + schemas   │
     └───────┬───────────────┘
             │
     ┌───────┴───────────────────────────┐
     │                                   │
     ▼                                   ▼
┌───────────────┐                 ┌──────────────────┐
│ fleet-router  │                 │ fleet state DB   │
│ route/fallback│                 │ SQLite + WAL     │
└──────┬────────┘                 └────────▲─────────┘
       │                                   │
       ▼                                   │
┌───────────────┐  ┌───────────────┐  ┌────┴──────────┐
│ spark-ollama01│  │ spark-ollama02│  │ dashboard     │
│ qwen warm     │  │ gemma warm    │  │ fleet view    │
└───────────────┘  └───────────────┘  └───────────────┘
       │
       ▼
┌───────────────┐
│ spark-ollama03│
│ llama warm    │
└───────────────┘
```

## Vai Trò Từng Thành Phần

### 1. `ollama-fleet-mcp`

Đây là lớp mà agent nhìn thấy.

Nhiệm vụ:

- expose các tool MCP với schema rõ ràng
- chuẩn hóa input/output cho các use case inference và vận hành
- gọi xuống `fleet-router` và `ops API`
- che giấu topology nội bộ khỏi agent
- trả lỗi theo hướng dẫn hành động tiếp theo

Không nên:

- kết nối trực tiếp tới từng node Ollama trong từng tool
- chứa logic cân bằng tải phức tạp
- truy vấn SQLite trực tiếp nếu đã có `ops API`

### 2. `fleet-router`

Đây là lớp điều phối inference.

Nhiệm vụ:

- chọn node phù hợp theo `model`, `health`, `load`, `warm state`
- retry hoặc fallback khi node lỗi
- chuẩn hóa request tới Ollama
- ghi metadata request vào DB
- trả về routing decision để quan sát được

Chính sách route khuyến nghị cho MVP:

- ưu tiên node đang `warm`
- loại node `unhealthy` hoặc `draining`
- nếu có nhiều node phù hợp thì chọn `least_loaded`
- fallback sang node khác cùng model nếu request lỗi hạ tầng

### 3. `fleet state DB`

MVP dùng `SQLite` là hợp lý nếu:

- bật `WAL mode`
- dashboard chỉ đọc
- transaction ngắn
- không lưu payload prompt quá lớn trong mọi request

Thông tin nên lưu:

- node registry
- model inventory theo node
- warm/cold state
- heartbeat
- request log
- routing decision
- operational events

### 4. `dashboard`

Dashboard chỉ nên là lớp quan sát và thao tác vận hành được kiểm soát.

Nhiệm vụ:

- xem tình trạng fleet
- xem model nào đang nằm trên node nào
- xem recent requests
- xem latency, lỗi, success rate
- tùy chọn gửi lệnh warm/evict/drain qua `ops API`

Không nên để dashboard ghi thẳng vào DB.

### 5. Node `spark-ollama-*`

Mỗi node có thể chứa:

- Ollama runtime
- model preload/warm cache
- health reporter
- metrics exporter

Node nên tự báo:

- `status`
- `current_load`
- `gpu_memory_used`
- `available_models`
- `warm_models`
- `last_heartbeat_at`

## Luồng Chính

### Luồng Chat / Generate

1. Agent gọi `ollama_fleet_chat`
2. `ollama-fleet-mcp` validate input
3. MCP gọi `fleet-router`
4. Router chọn node tốt nhất
5. Router gọi Ollama node
6. Router ghi metadata vào DB
7. MCP trả kết quả cho agent

### Luồng Quan Sát

1. Agent gọi `ollama_fleet_list_models` hoặc `ollama_fleet_get_server_status`
2. MCP gọi `ops API`
3. `ops API` đọc từ DB
4. MCP trả dữ liệu dạng `structuredContent`

### Luồng Warm Model

1. Agent hoặc dashboard gọi `ollama_fleet_warm_model`
2. MCP hoặc dashboard gửi yêu cầu xuống `ops API`
3. `ops API` chọn node mục tiêu
4. node kéo model vào memory
5. DB cập nhật `is_warm`, `loaded_at`, `last_used_at`

## Ranh Giới API Khuyến Nghị

Để MCP không bị gắn chặt vào DB schema, nên có hai lớp HTTP nội bộ:

### `fleet-router API`

Dùng cho inference:

- `POST /v1/chat`
- `POST /v1/generate`
- `POST /v1/embed`
- `POST /v1/route/preview`

### `fleet-ops API`

Dùng cho read-model và admin:

- `GET /v1/models`
- `GET /v1/servers`
- `GET /v1/servers/:id`
- `GET /v1/requests`
- `GET /v1/requests/:id`
- `POST /v1/models/warm`
- `POST /v1/models/evict`
- `POST /v1/servers/:id/state`

## DB Schema Tối Thiểu

### Bảng `servers`

- `id`
- `name`
- `base_url`
- `status`
- `current_load`
- `gpu_memory_used`
- `gpu_memory_total`
- `last_heartbeat_at`

### Bảng `models`

- `id`
- `name`
- `family`
- `size_label`
- `quantization`
- `capabilities_json`

### Bảng `server_models`

- `server_id`
- `model_id`
- `is_warm`
- `loaded_at`
- `last_used_at`

### Bảng `requests`

- `id`
- `request_kind`
- `requested_model`
- `routed_server_id`
- `status`
- `latency_ms`
- `tokens_in`
- `tokens_out`
- `error_code`
- `created_at`

### Bảng `events`

- `id`
- `event_type`
- `server_id`
- `request_id`
- `payload_json`
- `created_at`

## Chính Sách Route Cho MVP

Áp dụng thứ tự ưu tiên:

1. đúng `model`
2. node `healthy`
3. model đang `warm`
4. node không ở trạng thái `draining`
5. `current_load` thấp nhất
6. `last_success_at` gần đây nhất

## Tool MCP Nên Có

MVP:

- `ollama_fleet_list_models`
- `ollama_fleet_list_servers`
- `ollama_fleet_get_server_status`
- `ollama_fleet_chat`
- `ollama_fleet_route_request_preview`

Giai đoạn 2:

- `ollama_fleet_get_recent_requests`
- `ollama_fleet_get_request_by_id`
- `ollama_fleet_warm_model`
- `ollama_fleet_evict_model`
- `ollama_fleet_set_server_state`

## Bảo Mật Và Vận Hành

- MCP dùng API key hoặc bearer token cho `router` và `ops API`
- tool read-only phải đánh dấu `readOnlyHint: true`
- tool admin phải đánh dấu `destructiveHint` phù hợp
- với transport HTTP cục bộ, bind `127.0.0.1` và kiểm tra `Origin`
- không log prompt nhạy cảm trừ khi đã có chính sách bảo mật rõ ràng

## MVP Khuyến Nghị

Pha đầu nên triển khai:

1. `fleet-router`
2. `fleet-ops API`
3. `SQLite` với 4 bảng cốt lõi
4. `ollama-fleet-mcp`
5. `dashboard fleet overview`

## Kết Luận

Kiến trúc tốt nhất cho bài toán này là:

- agent nói chuyện với `MCP`
- `MCP` nói chuyện với `router` và `ops API`
- `router` nói chuyện với các node Ollama
- `DB` là trạng thái dùng chung
- `dashboard` chỉ quan sát và vận hành có kiểm soát

Điểm mấu chốt là giữ cho agent thấy một giao diện đơn giản: `fleet capabilities`, thay vì buộc nó hiểu chi tiết từng máy chủ trong cụm.

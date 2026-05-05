# Thiết Kế Dữ Liệu

## Mục Tiêu

State store phục vụ cho:

- inventory node và model
- heartbeat và health
- route decision
- request log và telemetry
- operational events

## Lựa Chọn MVP

- `SQLite`
- bật `WAL mode`
- dashboard chỉ đọc
- transaction ngắn và đơn giản

## Bảng `servers`

### Cột tối thiểu

- `id`
- `name`
- `base_url`
- `status`
- `current_load`
- `gpu_memory_used`
- `gpu_memory_total`
- `last_heartbeat_at`

### Ý nghĩa

Lưu thông tin runtime và sức khỏe hiện tại của từng node.

## Bảng `models`

### Cột tối thiểu

- `id`
- `name`
- `family`
- `size_label`
- `quantization`
- `capabilities_json`

### Ý nghĩa

Lưu thông tin chuẩn hóa của model, tách riêng khỏi node để tránh lặp dữ liệu.

## Bảng `server_models`

### Cột tối thiểu

- `server_id`
- `model_id`
- `is_warm`
- `loaded_at`
- `last_used_at`

### Ý nghĩa

Biểu diễn inventory model theo từng node và trạng thái warm hiện tại.

## Bảng `requests`

### Cột tối thiểu

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

### Ý nghĩa

Lưu metadata của mỗi request để quan sát, audit và hỗ trợ tối ưu route.

## Bảng `events`

### Cột tối thiểu

- `id`
- `event_type`
- `server_id`
- `request_id`
- `payload_json`
- `created_at`

### Ý nghĩa

Ghi lại sự kiện vận hành như warm, evict, drain, timeout hoặc fallback.

## Gợi Ý Chỉ Mục

- index theo `servers.status`
- index theo `server_models.server_id`
- index theo `requests.created_at`
- index theo `requests.routed_server_id`
- index theo `events.created_at`

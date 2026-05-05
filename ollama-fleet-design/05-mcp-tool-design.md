# Thiết Kế Tool MCP

## Nguyên Tắc

- tất cả tool dùng prefix `ollama_fleet_`
- tên tool theo dạng động từ cộng tài nguyên
- tool list hỗ trợ `limit`, `offset`, `has_more`, `next_offset`
- tool dữ liệu hỗ trợ `response_format = markdown | json`
- tool admin tách biệt với tool inference

## Bộ Tool MVP

### `ollama_fleet_list_models`

- mục đích: liệt kê model hiện có trong fleet và vị trí warm
- loại: read-only
- input chính: `limit`, `offset`, `only_warm`, `server_id`, `capability`, `response_format`

### `ollama_fleet_list_servers`

- mục đích: liệt kê node và tình trạng tải hoặc health
- loại: read-only
- input chính: `limit`, `offset`, `status`, `only_available`, `response_format`

### `ollama_fleet_get_server_status`

- mục đích: xem tình trạng chi tiết của một node
- loại: read-only
- input chính: `server_id`, `response_format`

### `ollama_fleet_chat`

- mục đích: gửi yêu cầu chat để router tự chọn node
- loại: inference
- input chính: `model`, `messages`, `temperature`, `top_p`, `max_tokens`, `server_preference`, `require_warm`, `metadata`, `response_format`

### `ollama_fleet_route_request_preview`

- mục đích: xem router sẽ chọn node nào mà chưa chạy thật
- loại: read-only
- input chính: `model`, `request_kind`, `require_warm`, `server_preference`, `response_format`

## Bộ Tool Giai Đoạn 2

### `ollama_fleet_get_recent_requests`

- mục đích: xem request gần đây
- loại: read-only

### `ollama_fleet_get_request_by_id`

- mục đích: xem chi tiết một request
- loại: read-only

### `ollama_fleet_warm_model`

- mục đích: preload model lên node
- loại: write

### `ollama_fleet_evict_model`

- mục đích: gỡ model khỏi bộ nhớ nóng
- loại: admin, destructive

### `ollama_fleet_set_server_state`

- mục đích: chuyển trạng thái node sang `active`, `draining` hoặc `disabled`
- loại: admin, có thể ảnh hưởng luồng route

## Annotation Khuyến Nghị

- tool read-only: `readOnlyHint: true`
- tool admin phá hủy hoặc ảnh hưởng vận hành: `destructiveHint: true`
- tool đọc dữ liệu lặp lại an toàn: `idempotentHint: true`
- hầu hết tool nên để `openWorldHint: true`

## Lỗi Khuyến Nghị

- model không tồn tại trong fleet
- không có server healthy cho model yêu cầu
- không có server warm khi `require_warm = true`
- fleet router timeout

Các lỗi này nên có thông điệp chỉ rõ tool tiếp theo mà người dùng hoặc agent nên gọi để tự chẩn đoán.

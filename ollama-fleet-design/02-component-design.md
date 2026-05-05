# Thiết Kế Thành Phần

## `ollama-fleet-mcp`

### Vai trò

- expose các tool MCP với schema rõ ràng
- chuẩn hóa input và output cho inference và vận hành
- che giấu topology nội bộ khỏi agent
- trả lỗi có hướng dẫn bước xử lý tiếp theo

### Không nên làm

- gọi trực tiếp từng node Ollama trong từng tool
- chứa logic cân bằng tải phức tạp
- phụ thuộc chặt vào schema DB nếu đã có `ops API`

## `fleet-router`

### Vai trò

- chọn node phù hợp theo `model`, `health`, `load`, `warm state`
- retry hoặc fallback khi có lỗi hạ tầng
- chuẩn hóa request gửi tới Ollama node
- ghi metadata request và quyết định route

### Chính sách route MVP

1. đúng model
2. node healthy
3. model đang warm
4. node không ở trạng thái draining
5. `current_load` thấp nhất
6. `last_success_at` gần đây nhất

## `fleet state DB`

### Vai trò

- lưu registry của node
- lưu inventory model theo node
- lưu trạng thái warm hoặc cold
- lưu heartbeat, request log, routing decision và event vận hành

### Ràng buộc MVP

- dùng `SQLite`
- bật `WAL mode`
- transaction ngắn
- không lưu prompt payload quá lớn trên mọi request

## `dashboard`

### Vai trò

- quan sát tình trạng fleet
- xem model đang nằm ở node nào
- xem request gần đây, latency, lỗi và success rate
- gửi lệnh warm, evict hoặc drain qua `ops API`

### Quy tắc

- chỉ là lớp quan sát và vận hành có kiểm soát
- không ghi thẳng vào DB

## Node `spark-ollama-*`

### Vai trò

- chạy Ollama runtime
- preload hoặc giữ warm cache cho model
- report health và metrics

### Dữ liệu node nên tự báo

- `status`
- `current_load`
- `gpu_memory_used`
- `available_models`
- `warm_models`
- `last_heartbeat_at`

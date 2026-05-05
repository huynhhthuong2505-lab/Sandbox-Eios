# Luồng Xử Lý Chính

## 1. Luồng Chat / Generate

1. Agent gọi `ollama_fleet_chat`
2. MCP validate input
3. MCP gọi `fleet-router`
4. Router chọn node tốt nhất theo policy
5. Router gọi Ollama node mục tiêu
6. Router ghi metadata request vào DB
7. MCP trả kết quả đã chuẩn hóa cho agent

## 2. Luồng Quan Sát

1. Agent gọi `ollama_fleet_list_models` hoặc `ollama_fleet_get_server_status`
2. MCP gọi `fleet-ops API`
3. `fleet-ops API` đọc từ DB
4. MCP trả dữ liệu qua `structuredContent`

## 3. Luồng Preview Route

1. Agent gọi `ollama_fleet_route_request_preview`
2. MCP gửi yêu cầu preview tới router
3. Router đánh giá `model`, `health`, `warm state`, `load`
4. Router trả node được chọn và danh sách fallback
5. MCP trả quyết định route cho agent mà chưa chạy inference thật

## 4. Luồng Warm Model

1. Agent hoặc dashboard gọi `ollama_fleet_warm_model`
2. MCP hoặc dashboard gửi yêu cầu xuống `ops API`
3. `ops API` chọn node mục tiêu hoặc nhận node chỉ định
4. node kéo model vào memory
5. DB cập nhật `is_warm`, `loaded_at`, `last_used_at`

## 5. Luồng Bảo Trì Node

1. operator gọi `ollama_fleet_set_server_state`
2. `ops API` đổi state node sang `draining`
3. router ngừng chọn node đó cho request mới
4. request đang chạy hoàn tất hoặc timeout theo policy
5. operator bảo trì xong và chuyển node về `active`

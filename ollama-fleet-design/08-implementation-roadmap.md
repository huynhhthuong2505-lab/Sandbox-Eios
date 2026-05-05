# Lộ Trình Triển Khai

## MVP Khuyến Nghị

1. triển khai `fleet-router`
2. triển khai `fleet-ops API`
3. dựng `SQLite` với các bảng cốt lõi
4. dựng `ollama-fleet-mcp`
5. dựng dashboard fleet overview

## Thứ Tự Ưu Tiên Kỹ Thuật

### Giai đoạn 1

- `ollama_fleet_list_models`
- `ollama_fleet_list_servers`
- `ollama_fleet_get_server_status`
- `ollama_fleet_chat`
- `ollama_fleet_route_request_preview`

### Giai đoạn 2

- `ollama_fleet_get_recent_requests`
- `ollama_fleet_get_request_by_id`
- `ollama_fleet_warm_model`
- `ollama_fleet_evict_model`
- `ollama_fleet_set_server_state`

## Gợi Ý Triển Khai Code

- dùng TypeScript
- validate schema bằng `zod`
- tách `RouterClient`, `tool registration`, `formatting` và `schemas`
- hỗ trợ cả `stdio` và `streamable HTTP`

## Biến Môi Trường Dự Kiến

```bash
FLEET_ROUTER_URL=http://127.0.0.1:4100
FLEET_OPS_URL=http://127.0.0.1:4200
FLEET_API_KEY=replace-me
TRANSPORT=stdio
PORT=3000
```

## Bước Tiếp Theo Nên Làm

- map endpoint backend thực tế vào `RouterClient`
- bổ sung auth mạnh hơn nếu service chạy remote
- thêm resource MCP nếu muốn expose fleet snapshot theo URI
- thêm tách quyền cho admin tools

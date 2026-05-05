# `ollama-fleet-mcp-server`

MCP server TypeScript mẫu cho kiến trúc Ollama fleet gồm:

- `fleet-router` cho inference
- `fleet-ops API` cho inventory, health, requests và admin actions
- `SQLite` làm state store ở phía backend của bạn

Project này được scaffold để:

- có naming đúng chuẩn MCP
- có input validation bằng `zod`
- trả `structuredContent`
- tách `router client`, `formatting` và `tool registration`
- hỗ trợ `stdio` và `streamable HTTP`

## Tool Đã Có

- `ollama_fleet_list_models`
- `ollama_fleet_list_servers`
- `ollama_fleet_get_server_status`
- `ollama_fleet_chat`
- `ollama_fleet_route_request_preview`
- `ollama_fleet_get_recent_requests`
- `ollama_fleet_get_request_by_id`
- `ollama_fleet_warm_model`
- `ollama_fleet_evict_model`
- `ollama_fleet_set_server_state`

## Cấu Hình Môi Trường

```bash
export FLEET_ROUTER_URL="http://127.0.0.1:4100"
export FLEET_OPS_URL="http://127.0.0.1:4200"
export FLEET_API_KEY="replace-me"
export TRANSPORT="stdio"
export PORT="3000"
```

Nếu backend của bạn chưa tách `router` và `ops`, bạn có thể trỏ cả hai biến URL về cùng một service.

## API Backend Mà Project Này Mong Đợi

### Router API

- `POST /v1/chat`
- `POST /v1/route/preview`

### Ops API

- `GET /v1/models`
- `GET /v1/servers`
- `GET /v1/servers/:id`
- `GET /v1/requests`
- `GET /v1/requests/:id`
- `POST /v1/models/warm`
- `POST /v1/models/evict`
- `POST /v1/servers/:id/state`

## Chạy Cục Bộ

```bash
npm install
npm run build
npm start
```

## Chạy HTTP

```bash
npm install
npm run build
npm run start:http
```

Endpoint MCP HTTP:

```text
POST /mcp
```

## Gợi Ý Bước Tiếp Theo

1. map route backend thực tế của bạn vào `RouterClient`
2. thêm auth mạnh hơn nếu service chạy remote
3. thêm resources nếu muốn expose fleet snapshot theo URI
4. thêm phân quyền riêng cho admin tools

## Cấu Trúc

```text
src/
  constants.ts
  index.ts
  types.ts
  schemas/
    index.ts
  services/
    router-client.ts
  tools/
    register-tools.ts
  utils/
    format.ts
```

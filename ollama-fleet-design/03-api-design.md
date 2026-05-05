# Thiết Kế API

## Nguyên Tắc

- MCP không nên bị gắn chặt vào schema DB
- tách API inference và API vận hành để ranh giới rõ ràng
- response nên đủ metadata để phục vụ quan sát và debug

## `fleet-router API`

Dùng cho inference và preview route.

### Endpoints MVP

- `POST /v1/chat`
- `POST /v1/generate`
- `POST /v1/embed`
- `POST /v1/route/preview`

### Trách Nhiệm

- chọn node phù hợp
- gọi tới Ollama node
- fallback nếu lỗi hạ tầng
- trả về routing decision

## `fleet-ops API`

Dùng cho read-model và admin actions.

### Endpoints MVP

- `GET /v1/models`
- `GET /v1/servers`
- `GET /v1/servers/:id`
- `GET /v1/requests`
- `GET /v1/requests/:id`
- `POST /v1/models/warm`
- `POST /v1/models/evict`
- `POST /v1/servers/:id/state`

### Trách Nhiệm

- trả inventory model
- trả tình trạng server và heartbeat
- trả lịch sử request
- nhận các lệnh warm, evict, đổi state

## Giao Ước Với MCP Server

### Input

- validate bằng schema rõ ràng
- enum và field tùy chọn phải nhất quán giữa các tool
- tool list phải có `limit` và `offset`

### Output

- hỗ trợ `response_format = markdown | json`
- trả `structuredContent` cho dữ liệu có cấu trúc
- các list nên có `has_more` và `next_offset`
- lỗi phải gợi ý hành động tiếp theo

## Mapping Công Việc

- agent gọi tool MCP
- MCP map input sang router hoặc ops API
- backend xử lý và trả dữ liệu chuẩn hóa
- MCP định dạng phản hồi cuối cho client MCP

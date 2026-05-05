# Kiến Trúc Tổng Quan `ollama-fleet-mcp`

## Mục Tiêu

Biến cụm Ollama nhiều node thành một năng lực thống nhất có thể được agent tiêu thụ qua MCP, thay vì để agent phải biết chi tiết topology nội bộ hoặc gọi thẳng từng node.

## Nguyên Tắc Thiết Kế

- `MCP server` là lớp giao tiếp duy nhất cho agent
- `fleet-router` chịu trách nhiệm route, fallback và chuẩn hóa inference
- `SQLite` là state store và telemetry dùng chung cho MVP
- `dashboard` chỉ để quan sát và thao tác vận hành có kiểm soát
- node Ollama chỉ tập trung chạy model và báo cáo trạng thái

## Sơ Đồ Kiến Trúc

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

## Lợi Ích Kiến Trúc Này

- agent thấy một giao diện đơn giản và ổn định
- dễ thay đổi topology nội bộ mà không ảnh hưởng tool contract
- gom được telemetry, request log và operational event về một nơi
- giúp route theo `model`, `health`, `warm state` và `load`
- hỗ trợ dashboard vận hành mà không cho dashboard ghi thẳng DB

## Phạm Vi MVP

- inference qua `fleet-router`
- inventory và health qua `fleet-ops API`
- state dùng `SQLite` bật `WAL`
- dashboard ở mức overview
- MCP server cung cấp bộ tool cốt lõi cho agent

# Bảo Mật Và Vận Hành

## Bảo Mật Kết Nối

- MCP nên dùng `API key` hoặc `bearer token` khi gọi `fleet-router` và `fleet-ops API`
- nếu dùng transport HTTP cục bộ, chỉ bind `127.0.0.1`
- kiểm tra `Origin` khi mở transport HTTP
- không log prompt nhạy cảm nếu chưa có chính sách bảo mật rõ ràng

## Phân Quyền Tool

- tool đọc dữ liệu nên để read-only
- tool admin như `warm`, `evict`, `set_server_state` nên phân quyền riêng
- có thể tách nhóm tool admin sang role khác hoặc giai đoạn triển khai sau

## Quan Sát Hệ Thống

Dashboard nên hiển thị:

- trạng thái fleet
- model theo node
- recent requests
- latency
- lỗi
- success rate

## Telemetry Tối Thiểu

- heartbeat mỗi node
- current load
- GPU memory used hoặc total
- warm models
- request latency
- routing decision
- operational events

## Nguyên Tắc Vận Hành

- dashboard không ghi trực tiếp vào DB
- mọi thao tác vận hành đi qua `ops API`
- route policy phải loại node `unhealthy` hoặc `draining`
- fallback chỉ nên xảy ra với lỗi hạ tầng hoặc timeout phù hợp

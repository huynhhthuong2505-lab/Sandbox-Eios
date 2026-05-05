# Bộ Tài Liệu Thiết Kế `ollama-fleet`

Thư mục này gom lại bộ file thiết kế cho hệ thống `ollama-fleet-mcp`, được tách từ tài liệu kiến trúc và đặc tả tool trong gói bạn tải lên.

## Danh Sách File

- `01-architecture-overview.md`: mục tiêu, phạm vi và sơ đồ kiến trúc tổng thể
- `02-component-design.md`: trách nhiệm và ranh giới của từng thành phần
- `03-api-design.md`: ranh giới API giữa MCP, router và ops
- `04-database-design.md`: thiết kế dữ liệu và các bảng SQLite tối thiểu
- `05-mcp-tool-design.md`: bộ tool MCP, schema đầu vào và hành vi chính
- `06-sequence-flows.md`: các luồng xử lý chính của hệ thống
- `07-security-operations.md`: bảo mật, vận hành và quan sát
- `08-implementation-roadmap.md`: lộ trình triển khai MVP và giai đoạn sau

## Mã Nguồn Scaffold

Mã nguồn TypeScript scaffold đã được chép ra tại:

- `../ollama-fleet-mcp-server`

Thư mục đó chứa:

- server MCP mẫu
- các schema `zod`
- `RouterClient`
- đăng ký tool
- bản `dist` đã build sẵn

## Mục Tiêu Thiết Kế

Thiết kế này nhằm giúp agent chỉ cần nói chuyện với một lớp MCP thống nhất, trong khi lớp `fleet-router` chịu trách nhiệm route inference tới các node Ollama thích hợp, còn `fleet-ops API` và `SQLite` đảm nhiệm phần trạng thái, điều hành và quan sát.

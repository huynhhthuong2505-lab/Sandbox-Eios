export const SERVER_NAME = "ollama-fleet-mcp-server";
export const SERVER_VERSION = "0.1.0";
export const CHARACTER_LIMIT = 25_000;
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export const FLEET_ROUTER_URL = process.env.FLEET_ROUTER_URL ?? "http://127.0.0.1:4100";
export const FLEET_OPS_URL = process.env.FLEET_OPS_URL ?? "http://127.0.0.1:4200";
export const FLEET_API_KEY = process.env.FLEET_API_KEY ?? "";
export const TRANSPORT = process.env.TRANSPORT ?? "stdio";
export const PORT = Number.parseInt(process.env.PORT ?? "3000", 10);

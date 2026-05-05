#!/usr/bin/env node

import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { FLEET_API_KEY, PORT, SERVER_NAME, SERVER_VERSION, TRANSPORT } from "./constants.js";
import { RouterClient } from "./services/router-client.js";
import { registerTools } from "./tools/register-tools.js";

function assertEnvironment(): void {
  if (!FLEET_API_KEY) {
    console.error("Cảnh báo: `FLEET_API_KEY` chưa được thiết lập. Server vẫn chạy nhưng backend có thể từ chối yêu cầu.");
  }
}

function createServer(): McpServer {
  const server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
  });

  registerTools(server, new RouterClient());
  return server;
}

async function runStdio(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`${SERVER_NAME} đang chạy qua stdio`);
}

async function runHttp(): Promise<void> {
  const app = express();
  app.use(express.json({ limit: "2mb" }));

  app.post("/mcp", async (req, res) => {
    try {
      const server = createServer();
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
        enableJsonResponse: true,
      });

      res.on("close", () => {
        void transport.close();
      });

      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
    } catch (error) {
      console.error("Lỗi MCP HTTP:", error);
      if (!res.headersSent) {
        res.status(500).json({
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  });

  app.get("/health", (_req, res) => {
    res.json({
      ok: true,
      server: SERVER_NAME,
      version: SERVER_VERSION,
      transport: "http",
    });
  });

  await new Promise<void>((resolve) => {
    app.listen(PORT, "127.0.0.1", () => {
      console.error(`${SERVER_NAME} đang chạy tại http://127.0.0.1:${PORT}/mcp`);
      resolve();
    });
  });
}

async function main(): Promise<void> {
  assertEnvironment();

  if (TRANSPORT === "http") {
    await runHttp();
    return;
  }

  await runStdio();
}

main().catch((error) => {
  console.error("MCP server dừng do lỗi:", error);
  process.exit(1);
});

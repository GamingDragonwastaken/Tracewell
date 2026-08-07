import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)));
const mime = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};
const portArg = process.argv.find((arg) => arg.startsWith("--port="));
const portIndex = process.argv.indexOf("--port");
const port = Number(portArg?.split("=")[1] ?? (portIndex >= 0 ? process.argv[portIndex + 1] : 4174));

const server = createServer(async (request, response) => {
  const requestPath = request.url?.split("?")[0] ?? "/";
  const relativePath = requestPath === "/" ? "demo/index.html" : requestPath.replace(/^\/+/, "");
  const candidate = resolve(root, normalize(relativePath));
  if (!(candidate === root || candidate.startsWith(root + sep))) {
    response.writeHead(400).end("Bad path");
    return;
  }
  try {
    const body = await readFile(candidate);
    response.writeHead(200, { "content-type": mime[extname(candidate)] ?? "application/octet-stream" });
    response.end(body);
  } catch {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" }).end("Not found");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Tracewell listening at http://127.0.0.1:${port}`);
});

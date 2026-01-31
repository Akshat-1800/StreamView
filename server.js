const { createServer } = require("http");
const next = require("next");
const { initSocket } = require("./lib/socket");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  // 🔥 Initialize socket.io
  initSocket(server);

  server.listen(8080, () => {
    console.log("🚀 Server ready on http://localhost:8080");
  });
});

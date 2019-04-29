const server = require("./server");
const debug = require("debug")("express:server");
const http = require("http");
const httpPort = normalizePort(process.env.PORT || 8080);
const app = server.App.bootstrap().app;
app.set("port", httpPort);
const httpServer = http.createServer(app);
httpServer.listen(httpPort);
httpServer.on("error", function (error) {
    if (error.syscall !== "listen") {
        throw error;
    }
    const bind = typeof httpPort === "string"
        ? "Pipe " + httpPort
        : "Port " + httpPort;
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
});
httpServer.on("listening", function () {
    const addr = httpServer.address();
    debug("Listening on " + typeof addr === "string"
        ? "pipe " + addr
        : "port " + addr.port);
});
function normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
}

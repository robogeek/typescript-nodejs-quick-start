
import { default as server } from './server.js';
import * as http from "http";

const httpPort = normalizePort(process.env.PORT || 8080);
const app = server.app;
app.set("port", httpPort);
const httpServer = http.createServer(app);
httpServer.listen(httpPort);

// Abstracted from https://nodejs.org/api/errors.html
interface SystemError {
    address: string; 
    code: string; 
    dest: string;
    errno: number | string;
    info: any;
    message: string;
    path: string;
    port: number;
    syscall: string;
}

httpServer.on("error", function(error: SystemError) {
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

function normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) { return val; }
    if (port >= 0) { return port; }
    return false;
}

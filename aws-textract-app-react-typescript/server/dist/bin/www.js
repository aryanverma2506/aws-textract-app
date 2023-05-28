#!/usr/bin/env node
/**
 * Module dependencies.
 */
import debug from "debug";
import http from "http";
debug("textract-upload:server");
import app from "../app.js";
/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env["PORT"]);
app.set("port", port);
/**
 * Create HTTP server.
 */
const server = http.createServer(app);
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`Server is listening on http://localhost:${port}/`));
server.on("error", onError);
server.on("listening", onListening);
/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(port) {
    const parsedPort = parseInt(port.toString(), 10);
    if (isNaN(parsedPort)) {
        // Named pipe
        return port;
    }
    if (parsedPort >= 0) {
        // Port number
        return parsedPort;
    }
    return false;
}
/**
 * Event listener for HTTP server "error" event.
 */
function onError(error, port) {
    if (error.syscall !== "listen") {
        throw error;
    }
    const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
    // handle specific listen errors with friendly messages
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
}
/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr?.port;
    debug("Listening on " + bind);
}

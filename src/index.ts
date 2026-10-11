import documentation from "./docs.html";
import { handleInbound } from "./handlers/inbound";
import { handleSend } from "./handlers/send";
import { error, html, json, methodNotAllowed, preflight } from "./http";

export default {
    async fetch(request, env): Promise<Response> {
        const { pathname } = new URL(request.url);
        const { method } = request;

        if (method === "OPTIONS") {
            return preflight();
        }

        switch (pathname) {
            case "/":
                return method === "GET" || method === "HEAD"
                    ? html(documentation)
                    : methodNotAllowed("GET, HEAD");

            case "/health":
                return method === "GET"
                    ? json({ success: true, status: "ok" })
                    : methodNotAllowed("GET");

            case "/send":
                return method === "POST"
                    ? handleSend(request, env)
                    : methodNotAllowed("POST");

            default:
                return error("Not found", 404);
        }
    },

    async email(message, env): Promise<void> {
        await handleInbound(message, env);
    },
} satisfies ExportedHandler<Env>;

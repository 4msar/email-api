import { isAuthorized } from "../auth";
import { error, json } from "../http";
import { validateSendEmail } from "../validation";

interface EmailError extends Error {
    code?: string;
}

const LIMIT_ERRORS = new Set(["E_RATE_LIMIT_EXCEEDED", "E_DAILY_LIMIT_EXCEEDED"]);

const REJECTED_ERRORS = new Set([
    "E_VALIDATION_ERROR",
    "E_FIELD_MISSING",
    "E_RECIPIENT_NOT_ALLOWED",
    "E_SENDER_NOT_VERIFIED",
    "E_SENDER_DOMAIN_NOT_AVAILABLE",
]);

export async function handleSend(request: Request, env: Env): Promise<Response> {
    if (!env.API_KEY || !env.FROM_EMAIL) {
        console.error("Worker is missing API_KEY or FROM_EMAIL");
        return error("Service is not configured", 500);
    }

    if (!(await isAuthorized(request, env.API_KEY))) {
        return error("Unauthorized", 401);
    }

    if (!request.headers.get("content-type")?.includes("application/json")) {
        return error("Content-Type must be application/json", 415);
    }

    let body: unknown;

    try {
        body = await request.json();
    } catch {
        return error("Invalid JSON body", 400);
    }

    const result = validateSendEmail(body);

    if (!result.ok) {
        return error(result.error, 422);
    }

    try {
        const sent = await env.EMAIL.send({
            from: { email: env.FROM_EMAIL, name: env.FROM_NAME },
            ...result.value,
        });

        return json({
            success: true,
            message: "Email sent successfully",
            messageId: sent.messageId,
        });
    } catch (err) {
        const { code, message } = err as EmailError;

        console.error("Email sending failed", { code, message });

        if (code && LIMIT_ERRORS.has(code)) {
            return error("Email sending limit exceeded", 429);
        }

        if (code && REJECTED_ERRORS.has(code)) {
            return error(message || "Email rejected", 400, { code });
        }

        return error("Failed to send email", 500, { code });
    }
}

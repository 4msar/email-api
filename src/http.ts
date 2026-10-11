const CORS_HEADERS: HeadersInit = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
};

export function json(
    data: unknown,
    status = 200,
    extraHeaders: HeadersInit = {},
): Response {
    return Response.json(data, {
        status,
        headers: {
            ...CORS_HEADERS,
            ...extraHeaders,
            "Cache-Control": "no-store",
        },
    });
}

export function error(
    message: string,
    status: number,
    extra: Record<string, unknown> = {},
    extraHeaders: HeadersInit = {},
): Response {
    return json({ success: false, error: message, ...extra }, status, extraHeaders);
}

export function methodNotAllowed(allow: string): Response {
    return error("Method not allowed", 405, {}, { Allow: allow });
}

export function html(body: string): Response {
    return new Response(body, {
        headers: {
            ...CORS_HEADERS,
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "public, max-age=300",
        },
    });
}

export function preflight(): Response {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
}

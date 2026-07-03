export const documentation = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Cloudflare Email API</title>
  <style>
    :root {
      color-scheme: light dark;
      --bg: #0b0d10;
      --border: #2a3140;
      --text: #e8edf5;
      --muted: #9aa6b8;
      --accent: #f6821f;
      --code-bg: #0f131a;
    }
    @media (prefers-color-scheme: light) {
      :root {
        --bg: #f6f8fb;
        --border: #d8dee9;
        --text: #1b2430;
        --muted: #5b677a;
        --accent: #d66a00;
        --code-bg: #eef2f7;
      }
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
      line-height: 1.6;
      color: var(--text);
      background: var(--bg);
    }
    main {
      max-width: 52rem;
      margin: 0 auto;
      padding: 2.5rem 1.25rem 4rem;
    }
    h1 {
      margin: 0 0 0.5rem;
      font-size: 2rem;
      letter-spacing: -0.02em;
    }
    h2 {
      margin: 2.5rem 0 0.75rem;
      font-size: 1.25rem;
      border-bottom: 1px solid var(--border);
      padding-bottom: 0.35rem;
    }
    h3 {
      margin: 1.25rem 0 0.5rem;
      font-size: 0.875rem;
      color: var(--muted);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    p, li { color: var(--text); }
    .lead { color: var(--muted); margin: 0 0 1.5rem; }
    ul { padding-left: 1.25rem; margin: 0.5rem 0 1rem; }
    li + li { margin-top: 0.25rem; }
    code {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 0.9em;
      background: var(--code-bg);
      border: 1px solid var(--border);
      border-radius: 0.25rem;
      padding: 0.1em 0.35em;
    }
    pre {
      margin: 0.75rem 0 1rem;
      padding: 1rem 1.1rem;
      overflow-x: auto;
      background: var(--code-bg);
      border: 1px solid var(--border);
      border-radius: 0.5rem;
    }
    pre code {
      display: block;
      padding: 0;
      border: 0;
      background: transparent;
      font-size: 0.85rem;
      line-height: 1.5;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .method {
      display: inline-block;
      font-weight: 600;
      margin-right: 0.35rem;
    }
    .path { font-weight: 600; }
    .note { color: var(--muted); font-size: 0.95rem; }
  </style>
</head>
<body>
  <main>
    <h1>Cloudflare Email API</h1>
    <p class="lead">Base URL: <code>https://email-api.msar.me</code></p>

    <h2><code class="method">GET</code> <code class="path">/health</code></h2>
    <p>Check that the API is running. No authentication required.</p>

    <h3>cURL</h3>
    <pre><code>curl https://email-api.msar.me/health</code></pre>

    <h3>JavaScript</h3>
    <pre><code>const response = await fetch("https://email-api.msar.me/health");
const data = await response.json();
console.log(data);</code></pre>

    <h3>Response</h3>
    <pre><code>{
  "success": true,
  "status": "ok"
}</code></pre>

    <h2><code class="method">POST</code> <code class="path">/send</code></h2>
    <p>Send an email. Requires <code>Authorization: Bearer YOUR_API_KEY</code>.</p>

    <p>Request body (JSON):</p>
    <ul>
      <li><code>to</code> — recipient email (required)</li>
      <li><code>subject</code> — email subject (required)</li>
      <li><code>text</code> — plain text body (required if <code>html</code> is omitted)</li>
      <li><code>html</code> — HTML body (required if <code>text</code> is omitted)</li>
      <li><code>replyTo</code> — reply-to address (optional)</li>
    </ul>

    <h3>cURL</h3>
    <pre><code>curl -X POST "https://email-api.msar.me/send" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"to":"recipient@example.com","subject":"Hello","text":"Plain text fallback","html":"&lt;h1&gt;Hello&lt;/h1&gt;&lt;p&gt;Sent from my Worker.&lt;/p&gt;","replyTo":"hello@msar.me"}'</code></pre>

    <h3>JavaScript</h3>
    <pre><code>const response = await fetch("https://email-api.msar.me/send", {
  method: "POST",
  headers: {
    Authorization: "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    to: "recipient@example.com",
    subject: "Hello",
    text: "Plain text fallback",
    html: "&lt;h1&gt;Hello&lt;/h1&gt;&lt;p&gt;Sent from my Worker.&lt;/p&gt;",
    replyTo: "hello@msar.me",
  }),
});

const data = await response.json();
console.log(data);</code></pre>

    <h3>Response</h3>
    <pre><code>{
  "success": true,
  "message": "Email sent successfully",
  "messageId": "..."
}</code></pre>
    <p class="note">On error, <code>success</code> is <code>false</code> and <code>error</code> describes the problem (e.g. validation, unauthorized).</p>
  </main>
  <footer>
    <p>Crafted by <a href="https://msar.me">Saiful Alam</a></p>
    <p>Source code: <a href="https://github.com/4msar/email-api">https://github.com/4msar/email-api</a></p>
  </footer>
</body>
</html>`;

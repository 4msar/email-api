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
      --surface: #141820;
      --border: #2a3140;
      --text: #e8edf5;
      --muted: #9aa6b8;
      --accent: #f6821f;
      --code-bg: #0f131a;
    }
    @media (prefers-color-scheme: light) {
      :root {
        --bg: #f6f8fb;
        --surface: #ffffff;
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
      margin: 1.5rem 0 0.5rem;
      font-size: 1rem;
      color: var(--muted);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    p, li { color: var(--text); }
    .lead { color: var(--muted); margin: 0 0 1.5rem; }
    ul { padding-left: 1.25rem; }
    li + li { margin-top: 0.25rem; }
    a { color: var(--accent); }
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
    .endpoint {
      display: inline-block;
      margin-right: 0.5rem;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <main>
    <h1>Cloudflare Email API</h1>
    <p class="lead">Minimal authenticated HTTP email API built with Cloudflare Workers and Cloudflare Email Service.</p>

    <h2>Endpoints</h2>
    <ul>
      <li><code class="endpoint">GET</code> <code>/health</code></li>
      <li><code class="endpoint">POST</code> <code>/send</code></li>
    </ul>

    <h2>URLs</h2>
    <ul>
      <li>Production: <a href="https://email-api.msar.me">https://email-api.msar.me</a></li>
      <li>Development: <a href="https://email-api.msar.workers.dev">https://email-api.msar.workers.dev</a></li>
    </ul>

    <h2>Setup</h2>

    <h3>1. Configure Cloudflare Email Service</h3>
    <p>Onboard your sending domain in Cloudflare Email Service.</p>
    <p>Update the sender configuration in <code>wrangler.jsonc</code>:</p>
    <pre><code>{
  "vars": {
    "FROM_EMAIL": "noreply@msar.me",
    "FROM_NAME": "MSAR"
  }
}</code></pre>

    <h3>2. Install dependencies</h3>
    <pre><code>yarn install</code></pre>

    <h3>3. Configure the API key</h3>
    <p>For production:</p>
    <pre><code>npx wrangler secret put API_KEY</code></pre>
    <p>Enter a long random API key.</p>
    <p>For local development:</p>
    <pre><code>cp .dev.vars.example .dev.vars</code></pre>
    <p>Then update <code>.dev.vars</code>:</p>
    <pre><code>API_KEY=your-local-api-key</code></pre>

    <h3>4. Start development server</h3>
    <pre><code>yarn dev</code></pre>

    <h3>5. Deploy</h3>
    <pre><code>yarn deploy</code></pre>

    <h2>Health check</h2>
    <pre><code>curl https://email-api.msar.me/health</code></pre>
    <p>Response:</p>
    <pre><code>{
  "success": true,
  "status": "ok"
}</code></pre>

    <h2>Send an email</h2>
    <pre><code>curl -X POST "https://email-api.msar.me/send" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"to":"recipient@example.com","subject":"Hello from Cloudflare","text":"Plain text fallback","html":"&lt;h1&gt;Hello&lt;/h1&gt;&lt;p&gt;Sent from my Worker.&lt;/p&gt;","replyTo":"hello@msar.me"}'</code></pre>
    <p>At least one of <code>text</code> or <code>html</code> is required.</p>

    <h2>Successful response</h2>
    <pre><code>{
  "success": true,
  "message": "Email sent successfully",
  "messageId": "..."
}</code></pre>

    <h2>Validation error</h2>
    <pre><code>{
  "success": false,
  "error": "A valid to email address is required"
}</code></pre>

    <h2>Unauthorized response</h2>
    <pre><code>{
  "success": false,
  "error": "Unauthorized"
}</code></pre>

    <h2>Security</h2>
    <ul>
      <li>The sender email address is configured server-side.</li>
      <li>The API does not accept a <code>from</code> field from the request body.</li>
      <li>The <code>/send</code> endpoint requires Bearer token authentication.</li>
      <li>Do not expose the API key in frontend or browser-side JavaScript.</li>
      <li>Use this API from trusted backend applications.</li>
    </ul>
  </main>
</body>
</html>`;

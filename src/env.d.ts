// Bindings and required secrets come from `wrangler types` (worker-configuration.d.ts).
// Optional values that wrangler can't infer are declared here.
interface Env {
    FORWARD_TO?: string;
}

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getWorkspaceAccess } from "@/lib/admin/workspace-access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Reuse the immutable workspace template across warm serverless invocations.
// The response itself remains private and non-cacheable because it requires a session.
let workspaceHtmlPromise: Promise<string> | undefined;

export async function GET() {
  const access = await getWorkspaceAccess();
  if (!access) {
    return new Response("Authentication required.", {
      status: 401,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "private, no-store, max-age=0",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }

  try {
    workspaceHtmlPromise ??= readFile(join(process.cwd(), "private", "Software of OMCAR Inspection.html"), "utf8");
    const html = await workspaceHtmlPromise;
    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": 'inline; filename="OMCAR Inspection Workspace.html"',
        "Cache-Control": "private, no-store, no-cache, max-age=0, must-revalidate",
        "Pragma": "no-cache",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "no-referrer",
        "Content-Security-Policy": "default-src 'self'; img-src 'self' data: blob: https:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self'; font-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'",
      },
    });
  } catch {
    return new Response("The inspection workspace could not be loaded. Please reload or contact the administrator.", {
      status: 503,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "private, no-store, max-age=0",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }
}

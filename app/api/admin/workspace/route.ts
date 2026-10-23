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
    // Bring inspectors directly to the per-component evidence checklist after they
    // select an inspection type. The vehicle-details step remains available in the workflow rail.
    const inspectionNavigation = `<script>
(function(){
  function focusInspectionParts(){
    var target=document.querySelector('section[aria-labelledby="evidenceHeading"]');
    if(!target)return;
    var rail=document.getElementById("omcarWorkflowRail");
    if(rail){
      rail.querySelectorAll("[data-omcar-step]").forEach(function(button){
        var active=button.dataset.omcarStep==="inspection";
        button.classList.toggle("is-active",active);
        if(active)button.setAttribute("aria-current","step");
        else button.removeAttribute("aria-current");
      });
    }
    target.scrollIntoView({behavior:"auto",block:"start"});
  }
  document.addEventListener("click",function(event){
    if(event.target.closest("#launchScreen [data-start-type]")){
      window.setTimeout(focusInspectionParts,180);
    }
    if(event.target.closest('#omcarWorkflowRail [data-omcar-step="inspection"]')){
      window.setTimeout(focusInspectionParts,0);
    }
  });
})();
</script>`;
    const bodyClose = html.toLowerCase().lastIndexOf("</body>");
    const enhancedHtml = bodyClose >= 0
      ? html.slice(0, bodyClose) + inspectionNavigation + html.slice(bodyClose)
      : html + inspectionNavigation;
    return new Response(enhancedHtml, {
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

import {NextResponse} from "next/server";
import {PDFDocument,StandardFonts,rgb} from "pdf-lib";
import {createClient} from "@/lib/supabase/server";

function lineWrap(text:string,max=88){const words=text.split(/\s+/);const lines:string[]=[];let line="";for(const w of words){if((line+" "+w).trim().length>max){if(line)lines.push(line.trim());line=w}else line+=(line?" ":"")+w}if(line)lines.push(line.trim());return lines}

export async function GET(_req:Request,{params}:{params:Promise<{id:string}>}){
 const {id}=await params;const supabase=await createClient();
 if(!supabase)return new NextResponse("PDF generation is not configured.",{status:503});
 const {data:{user}}=await supabase.auth.getUser();if(!user)return new NextResponse("Unauthorized",{status:401});
 const {data:m}=await supabase.from("memberships").select("organization_id").eq("user_id",user.id).eq("status","active").order("created_at").limit(1).maybeSingle();
 if(!m?.organization_id)return new NextResponse("No organization",{status:409});
 const {data:report}=await supabase.from("reports").select("id,current_version,report_versions(snapshot_json)").eq("id",id).eq("organization_id",m.organization_id).single();
 if(!report)return new NextResponse("Report not found",{status:404});
 const versions:any=(report as any).report_versions;const snapshot=Array.isArray(versions)?versions[0]?.snapshot_json:versions?.snapshot_json;
 const pdf=await PDFDocument.create();const font=await pdf.embedFont(StandardFonts.Helvetica);const bold=await pdf.embedFont(StandardFonts.HelveticaBold);
 let page=pdf.addPage([595,842]);let y=790;
 const draw=(text:string,size=10,strong=false)=>{if(y<55){page=pdf.addPage([595,842]);y=790}page.drawText(text,{x:42,y,size,font:strong?bold:font,color:rgb(.09,.13,.20)});y-=size+8};
 page.drawRectangle({x:0,y:780,width:595,height:62,color:rgb(.06,.09,.15)});page.drawText("OM Car Inspection",{x:42,y:805,size:22,font:bold,color:rgb(.94,.80,.50)});page.drawText("Vehicle Inspection Report",{x:42,y:787,size:11,font,color:rgb(1,1,1)});y=755;
 draw(`Inspection ${snapshot?.inspection?.number??""}`,16,true);
 draw(`Vehicle: ${[snapshot?.vehicle?.make,snapshot?.vehicle?.model,snapshot?.vehicle?.variant].filter(Boolean).join(" ")||"—"}`,11,true);
 draw(`Registration: ${snapshot?.vehicle?.registration||"—"}    VIN: ${snapshot?.vehicle?.vin||"—"}`);
 draw(`Score: ${snapshot?.score?.overall??"—"}/100    Recommendation: ${snapshot?.recommendation??"—"}`,11,true);
 draw("Key findings",13,true);for(const f of snapshot?.findings??[]){draw(`• ${f.name} • ${f.severity}`);for(const l of lineWrap(f.default_description||""))draw(l)}
 draw("Summary",13,true);for(const l of lineWrap(snapshot?.summary||"No summary supplied."))draw(l);
 draw("Inspection disclaimer",13,true);for(const l of lineWrap("This report records observed condition at the time of inspection. It does not replace an independent specialist assessment where required."))draw(l);
 const bytes=await pdf.save();return new NextResponse(Buffer.from(bytes),{headers:{"content-type":"application/pdf","content-disposition":`attachment; filename="${snapshot?.inspection?.number??"inspection"}.pdf"`}});
}
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
 const {data:report}=await supabase.from("reports").select("id,inspection_id,current_version,report_versions(snapshot_json)").eq("id",id).eq("organization_id",m.organization_id).single();
 if(!report)return new NextResponse("Report not found",{status:404});
 const versions:any=(report as any).report_versions;const snapshot=Array.isArray(versions)?versions[0]?.snapshot_json:versions?.snapshot_json;
  const {data:mediaRows}=await supabase.from("inspection_media").select("file_path,media_type,original_filename,mime_type,section_name").eq("inspection_id",(report as any).inspection_id).eq("organization_id",m.organization_id).order("created_at",{ascending:true});
 const media=(mediaRows??[]).filter((m:any)=>m.media_type==="image");
 async function addEvidencePages(){
   if(!media.length)return;
   page=pdf.addPage([595,842]);y=790;
   draw("Evidence & Imported Images",15,true);
   draw(`${media.length} image${media.length===1?"":"s"} attached to this inspection.`,9);
   let col=0,row=0;
   for(const m of media){
     const signed=await supabase.storage.from("inspection-media").createSignedUrl(m.file_path,300);
     if(signed.error||!signed.data?.signedUrl)continue;
     try{
       const response=await fetch(signed.data.signedUrl,{cache:"no-store"});if(!response.ok)continue;
       const bytes=await response.arrayBuffer();const type=(m.mime_type||"").toLowerCase();
       const image=type.includes("png")?await pdf.embedPng(bytes):type.includes("jpeg")||type.includes("jpg")?await pdf.embedJpg(bytes):null;
       if(!image)continue;
       if(row>=2){row=0;col=0;page=pdf.addPage([595,842]);y=790;draw("Evidence photos",14,true)}
       const x=42+col*265, top=730-row*270;
       const maxW=240,maxH=205,scale=Math.min(maxW/image.width,maxH/image.height);
       const w=image.width*scale,h=image.height*scale;
       page.drawRectangle({x,y:top-h-35,width:maxW,height:maxH+35,borderColor:rgb(.88,.9,.93),borderWidth:1});
       page.drawImage(image,{x:x+((maxW-w)/2),y:top-h+5+((maxH-h)/2),width:w,height:h});
       page.drawText(String(m.section_name||m.original_filename||"Evidence"),{x:x+7,y:top-25,size:8,font:font,color:rgb(.28,.34,.42)});
       col++;if(col===2){col=0;row++}if(row===2){row=0}
     }catch{continue}
   }
 }
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
 await addEvidencePages();
 const bytes=await pdf.save();return new NextResponse(Buffer.from(bytes),{headers:{"content-type":"application/pdf","content-disposition":`attachment; filename="${snapshot?.inspection?.number??"inspection"}.pdf"`}});
}
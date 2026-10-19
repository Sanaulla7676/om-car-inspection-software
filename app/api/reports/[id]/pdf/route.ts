import {NextResponse} from "next/server";
import {PDFDocument,StandardFonts,rgb} from "pdf-lib";
import { getStaffContext } from "@/lib/supabase/authorization";

function safePdfText(text:string){return text.replace(/•/g,"-").replace(/·/g,"|").replace(/[–—]/g,"-").replace(/₹/g,"INR ").replace(/…/g,"...").replace(/[^\\x20-\\x7E\\xA0-\\xFF]/g," ")}
function lineWrap(text:string,max=88){const words=text.split(/\s+/);const lines:string[]=[];let line="";for(const w of words){if((line+" "+w).trim().length>max){if(line)lines.push(line.trim());line=w}else line+=(line?" ":"")+w}if(line)lines.push(line.trim());return lines}

export async function GET(_req:Request,{params}:{params:Promise<{id:string}>}){
 const {id}=await params;
 const context=await getStaffContext();
 if(!context.ok)return new NextResponse(context.error,{status:context.status});
 const {supabase,organizationId}=context;
 const storageClient=supabase;
 const {data:report}=await supabase.from("reports").select("id,inspection_id,current_version,report_versions(snapshot_json)").eq("id",id).eq("organization_id",organizationId).single();
 if(!report)return new NextResponse("Report not found",{status:404});
 const versions:any=(report as any).report_versions;const snapshot=Array.isArray(versions)?versions[0]?.snapshot_json:versions?.snapshot_json;
 if(!snapshot)return new NextResponse("Report snapshot not found",{status:404});
  const {data:mediaRows}=await supabase.from("inspection_media").select("file_path,media_type,original_filename,mime_type,section_name").eq("inspection_id",(report as any).inspection_id).eq("organization_id",m.organization_id).order("created_at",{ascending:true});
 const media=(mediaRows??[]).filter((m:any)=>m.media_type==="image");
 async function addEvidencePages(){
   if(!media.length)return;
   page=pdf.addPage([595,842]);y=790;
   draw("Evidence & Imported Images",15,true);
   draw(`${media.length} image${media.length===1?"":"s"} attached to this inspection.`,9);
   let col=0,row=0;
   for(const m of media){
     const signed=await storageClient.storage.from("inspection-media").createSignedUrl(m.file_path,300);
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
       page.drawText(safePdfText(String(m.section_name||m.original_filename||"Evidence")),{x:x+7,y:top-25,size:8,font:font,color:rgb(.28,.34,.42)});
       col++;if(col===2){col=0;row++}if(row===2){row=0}
     }catch{continue}
   }
 }
 const pdf=await PDFDocument.create();const font=await pdf.embedFont(StandardFonts.Helvetica);const bold=await pdf.embedFont(StandardFonts.HelveticaBold);
 let page=pdf.addPage([595,842]);let y=790;
 const draw=(text:string,size=10,strong=false)=>{if(y<55){page=pdf.addPage([595,842]);y=790}page.drawText(safePdfText(text),{x:42,y,size,font:strong?bold:font,color:rgb(.09,.13,.20)});y-=size+8};
 page.drawRectangle({x:0,y:780,width:595,height:62,color:rgb(.06,.09,.15)});page.drawText("OM Car Inspection",{x:42,y:805,size:22,font:bold,color:rgb(.94,.80,.50)});page.drawText("Vehicle Inspection Report",{x:42,y:787,size:11,font,color:rgb(1,1,1)});y=755;
 draw(`Inspection ${snapshot?.inspection?.number??""}`,16,true);
 draw(`Vehicle: ${[snapshot?.vehicle?.make,snapshot?.vehicle?.model,snapshot?.vehicle?.variant].filter(Boolean).join(" ")||"—"}`,11,true);
 draw(`Registration: ${snapshot?.vehicle?.registration||"—"}    VIN: ${snapshot?.vehicle?.vin||"—"}`);
 draw(`Score: ${snapshot?.score?.overall??"—"}/100    Recommendation: ${snapshot?.recommendation??"—"}`,11,true);
 const registry=snapshot?.vehicle?.registryDetails;
 if(registry){
   draw("Verified vehicle registry",13,true);
   const registryRows=[
     ["RC status",registry.rcStatus],["Registration date",registry.registrationDate],["Category",registry.category],["Body type",registry.bodyType],
     ["Emission norm",registry.emissionNorm],["Fitness valid until",registry.fitnessValidUntil],["Insurance valid until",registry.insuranceValidUntil],
     ["PUC valid until",registry.puccValidUntil],["Permit",registry.permitValidUntil],["Owner count",registry.ownerCount],["Financer",registry.financer],
     ["Blacklist status",registry.blacklistStatus],["Registered owner",registry.ownerName]
   ].filter((x:any)=>x[1]);
   for(const [label,value] of registryRows)draw(`${label}: ${value}`,9);
 }
 draw("Key findings",13,true);for(const f of snapshot?.findings??[]){draw(`• ${f.name} • ${f.severity}`);for(const l of lineWrap(f.default_description||""))draw(l)}
 draw("Summary",13,true);for(const l of lineWrap(snapshot?.summary||"No summary supplied."))draw(l);
 
 const val=snapshot?.valuation, vt=snapshot?.valuationTotals;
 if(val){
   draw("Valuation sheet and legacy inspection details",14,true);
   draw("PO name: "+(val.header?.poName||"—")+" · Enquiry date: "+(val.header?.enquiryDate||"—")+" · Valuation date: "+(val.header?.valuationDate||"—"),9);
   draw("Source: "+(val.source?.sourceType||"—")+" · Branch: "+(val.source?.branchType||"—")+" · Customer: "+(val.customer?.name||"—")+" · Phone: "+(val.customer?.mobile||val.customer?.phone||"—"),9);
   draw("Registration: "+(val.vehicle?.registration||"—")+" · Make: "+(val.vehicle?.manufacturer||"—")+" · Model: "+(val.vehicle?.modelSuffix||"—")+" · Year: "+(val.vehicle?.monthYear||"—"),9);
   draw("Colour: "+(val.vehicle?.color||"—")+" · KM run: "+(val.vehicle?.kmRun||"—")+" · Owners: "+(val.vehicle?.owners||"—")+" · Fuel: "+(val.vehicle?.fuel||"—"),9);
   draw("Chassis/VIN: "+(val.vehicle?.chassis||"—")+" · Engine number: "+(val.vehicle?.engine||"—"),9);
   draw("RC book: "+(val.documents?.rcBookType||"—")+" · Registration date: "+(val.documents?.registrationDate||"—")+" · HP entry: "+(val.documents?.hpEntry||"—"),9);
   draw("Insurance: "+(val.insurance?.type||"—")+" · Company: "+(val.insurance?.companyName||"—")+" · Expiry: "+(val.insurance?.expiryDate||"—")+" · IDV: "+(val.insurance?.idvValue||"—"),9);
   draw("Exterior Defect Details [W]",10,true);
   for(const row of val.exteriorRows||[])if(row.part||row.damageType||row.rfCost)draw("W / "+(row.part||"Exterior part")+" · Qty "+(row.quantity||"—")+" · "+(row.damageType||"—")+" · Level "+row.damageLevel+" · RF INR "+(row.rfCost||"0"),8);
   draw("Other exterior L/R damage · RF INR",9,true);
   for(const [part,row] of Object.entries(val.exteriorOtherDamage||{}) as [string,any][])if(row.left||row.right||row.rfCost)draw(part+" · L "+row.left+" · R "+row.right+" · RF INR "+(row.rfCost||"0"),8);
   draw("Interior Defect Details [X]",10,true);
   for(const [label,checked] of Object.entries(val.interiorOverall||{}))if(checked)draw("Interior overall / "+label,8);
   for(const row of val.interiorRows||[])if(row.part||row.damageType||row.rfCost)draw("X / "+(row.part||"Interior part")+" · Qty "+(row.quantity||"—")+" · "+(row.damageType||"—")+" · Level "+row.damageLevel+" · RF INR "+(row.rfCost||"0"),8);
   for(const [label,row] of Object.entries(val.interiorDamage||{}) as [string,any][])if(row.level||row.rfCost)draw("Interior part / "+label+" · Level "+row.level+" · RF INR "+(row.rfCost||"0"),8);
   draw("Function Defect Details [Y]",10,true);
   for(const [label,row] of Object.entries(val.functionItems||{}) as [string,any][])if(row.severity||row.details||row.rfCost)draw("Y / "+label+" · "+(row.severity==="Small"?"S":row.severity==="Large"?"L":"—")+" · "+(row.details||"No details")+" · RF INR "+(row.rfCost||"0"),8);
   draw("Frame Defect Details [Z]",10,true);
   for(const [label,row] of Object.entries(val.frameItems||{}) as [string,any][])if(row.dent||row.repair||row.replaced||row.size||row.rfCost)draw("Z / "+label+" · Dent "+(row.dent?"Yes":"No")+" · Repair "+(row.repair?"Yes":"No")+" · Replaced "+(row.replaced?"Yes":"No")+" · "+(row.size||"—")+" · RF INR "+(row.rfCost||"0"),8);
   for(const [label,row] of Object.entries(val.weldedExterior||{}) as [string,any][])if(row.repaired||row.replaced||row.rfCost)draw("Welded exterior / "+label+" · Repair "+(row.repaired?"Yes":"No")+" · Replaced "+(row.replaced?"Yes":"No")+" · RF INR "+(row.rfCost||"0"),8);
   for(const row of val.frameRows||[])if(row.part||row.rfCost)draw("Z / "+(row.part||"Frame defect")+" · RF INR "+(row.rfCost||"0"),8);
   draw("Standard refurbishment [C]: INR "+String(vt?.standardRf??0)+" · Accessories [B]: INR "+String(vt?.accessoryValue??0)+" · Other correction [E]: INR "+String(vt?.otherCorrection??0),9);
   draw("Exterior rating [A]: "+String(vt?.exteriorRating??"—")+"/5 · Interior [B]: "+String(vt?.interiorRating??"—")+"/5 · Function [C]: "+String(vt?.functionRating??"—")+"/5 · Frame factor [D]: "+String(vt?.frameFactor??"—"),9,true);
   draw("Total RF cost [W+X+Y+Z]: INR "+String(vt?.totalRf??0)+" · Final score: "+String(vt?.finalScore??"—")+" · Level: "+String(vt?.finalLevel??"—"),10,true);
   draw("Net Buying Price = A + B − C − D − E: INR "+String(vt?.netBuyingPrice??0),10,true);
   for(const row of val.followUps||[])if(row.date||row.status||row.details||row.nextActionDate)draw("Follow-up · "+(row.date||"—")+" · "+(row.status||"—")+" · "+(row.details||"")+" · TL: "+(row.tlComment||"")+" · Next: "+(row.nextActionDate||"—"),8);
   if(val.dropReason)draw("Drop reason: "+val.dropReason,9);
 }

 draw("Inspection disclaimer",13,true);for(const l of lineWrap("This report records observed condition at the time of inspection. It does not replace an independent specialist assessment where required."))draw(l);
 await addEvidencePages();
 const bytes=await pdf.save();const safeFilename=String(snapshot?.inspection?.number??"inspection").replace(/[^A-Za-z0-9_-]/g,"_");return new NextResponse(Buffer.from(bytes),{headers:{"content-type":"application/pdf","content-disposition":`attachment; filename="${safeFilename}.pdf"`}});
}
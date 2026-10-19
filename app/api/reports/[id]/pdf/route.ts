import {NextResponse} from "next/server";
import {PDFDocument,StandardFonts,rgb} from "pdf-lib";
import { getStaffContext } from "@/lib/supabase/authorization";

function safePdfText(text:string){return text.replace(/•/g,"-").replace(/·/g,"|").replace(/[–—]/g,"-").replace(/₹/g,"INR ").replace(/…/g,"...").replace(/[^\x20-\x7E]/g," ")}
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
  const {data:mediaRows,error:mediaError}=await supabase.from("inspection_media").select("file_path,media_type,original_filename,mime_type,section_name").eq("inspection_id",(report as any).inspection_id).eq("organization_id",organizationId).order("created_at",{ascending:true});
 if(mediaError)return new NextResponse("Evidence records could not be loaded; the PDF was not generated.",{status:503});
 const media=(mediaRows??[]).filter((m:any)=>m.media_type==="image");
 const expectedPhotos=Array.isArray(snapshot.photos)?snapshot.photos.filter((p:any)=>p?.path&&(p.mediaType==="image"||!p.mediaType)).length:0;
 if(expectedPhotos>0&&media.length!==expectedPhotos)return new NextResponse(`Evidence mismatch: report expects ${expectedPhotos} photo(s), but ${media.length} are stored. Re-upload missing evidence before exporting.`,{status:503});
 async function addEvidencePages(){
   if(!media.length)return;
   let imageIndex=0;
   for(const m of media){
     const signed=await storageClient.storage.from("inspection-media").createSignedUrl(m.file_path,300);
     if(signed.error||!signed.data?.signedUrl)throw new Error(`Could not access evidence photo ${m.original_filename||m.file_path}: ${signed.error?.message||"signed URL unavailable"}`);
     const response=await fetch(signed.data.signedUrl,{cache:"no-store"});
     if(!response.ok)throw new Error(`Evidence photo download failed (${response.status}).`);
     const bytes=await response.arrayBuffer();
     const type=(m.mime_type||response.headers.get("content-type")||"").toLowerCase();
     let image;
     if(type.includes("png"))image=await pdf.embedPng(bytes);
     else if(type.includes("jpeg")||type.includes("jpg"))image=await pdf.embedJpg(bytes);
     else throw new Error(`Unsupported evidence image format: ${type||"unknown"}. Upload photos as JPG or PNG.`);
     if(imageIndex%4===0){page=pdf.addPage([595,842]);y=790;draw("Photographic evidence",15,true);draw("Stored inspection photos • all images attached to this report",9);}
     const slot=imageIndex%4,col=slot%2,row=Math.floor(slot/2),x=42+col*265,cardTop=770-row*330;
     const maxW=220,maxH=205,scale=Math.min(maxW/image.width,maxH/image.height),w=image.width*scale,h=image.height*scale;
     page.drawRectangle({x,y:cardTop-270,width:240,height:270,borderColor:rgb(.88,.9,.93),borderWidth:1});
     page.drawText(safePdfText(String(m.section_name||m.original_filename||`Evidence ${imageIndex+1}`)),{x:x+7,y:cardTop-23,size:8,font:font,color:rgb(.28,.34,.42)});
     page.drawImage(image,{x:x+10+(220-w)/2,y:cardTop-250+(205-h)/2,width:w,height:h});
     imageIndex++;
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
 try{await addEvidencePages()}catch(e){return new NextResponse(e instanceof Error?`PDF evidence error: ${e.message}`:"PDF evidence could not be embedded.",{status:503})}
 const bytes=await pdf.save();const safeFilename=String(snapshot?.inspection?.number??"inspection").replace(/[^A-Za-z0-9_-]/g,"_");return new NextResponse(Buffer.from(bytes),{headers:{"content-type":"application/pdf","content-disposition":`attachment; filename="${safeFilename}.pdf"`}});
}
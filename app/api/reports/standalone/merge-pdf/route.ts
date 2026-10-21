import { NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import { getStaffContext } from "@/lib/supabase/authorization";
import { readRequestBodyLimited, requestWithBodyBytes } from "@/lib/request-body";

const MAX_PDF_BYTES=25*1024*1024;
const MAX_REQUEST_BYTES=52*1024*1024;

export async function POST(req:Request){
  const context=await getStaffContext();
  if(!context.ok)return NextResponse.json({error:context.error},{status:context.status});
  const {supabase}=context;

  const boundedBody = await readRequestBodyLimited(req, MAX_REQUEST_BYTES);
  if (!boundedBody.ok) {
    return NextResponse.json(
      { error: boundedBody.tooLarge ? "PDF merge upload is too large." : "The PDF upload could not be read." },
      { status: boundedBody.tooLarge ? 413 : 400 },
    );
  }
  let form: FormData;
  try {
    form = await requestWithBodyBytes(req, boundedBody.bytes).formData();
  } catch {
    return NextResponse.json({ error: "Upload a valid multipart PDF form." }, { status: 400 });
  }
  const base=form.get("basePdf"),attachment=form.get("attachment");
  if(!(base instanceof File)||!(attachment instanceof File))return NextResponse.json({error:"basePdf and attachment are required."},{status:400});
  if(![base,attachment].every(f=>f.type==="application/pdf"||f.name.toLowerCase().endsWith(".pdf")))return NextResponse.json({error:"Both files must be PDFs."},{status:415});
  if(base.size>MAX_PDF_BYTES||attachment.size>MAX_PDF_BYTES)return NextResponse.json({error:"Each PDF must be 25 MB or smaller."},{status:413});
  try{
    const merged=await PDFDocument.create();
    const first=await PDFDocument.load(await base.arrayBuffer()),second=await PDFDocument.load(await attachment.arrayBuffer());
    (await merged.copyPages(first,first.getPageIndices())).forEach(p=>merged.addPage(p));
    (await merged.copyPages(second,second.getPageIndices())).forEach(p=>merged.addPage(p));
    const bytes=await merged.save();
    return new NextResponse(Buffer.from(bytes),{headers:{"content-type":"application/pdf","content-disposition":'attachment; filename="OM-Car-Inspection-complete-package.pdf"',"cache-control":"no-store"}});
  }catch{return NextResponse.json({error:"One of the PDFs is invalid or could not be merged."},{status:422})}
}

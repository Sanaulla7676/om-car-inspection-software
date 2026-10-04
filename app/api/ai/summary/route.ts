import { NextResponse } from "next/server";

function deterministic(findings:any[],vehicle:any,score:number){
  const major=findings.filter(f=>f.severity==="Major"||f.severity==="Critical").length;
  const issues=findings.length;
  const vehicleName=[vehicle?.make,vehicle?.model,vehicle?.variant].filter(Boolean).join(" ")||"the inspected vehicle";
  if(!issues) return `${vehicleName} was assessed with an overall inspection score of ${score}/100. No recorded findings were selected in the inspection workflow. Final acceptance should remain subject to the documented inspection methodology.`;
  return `${vehicleName} received an overall inspection score of ${score}/100 with ${issues} recorded finding(s), including ${major} major or critical item(s). The findings and supporting evidence should be reviewed before purchase or delivery, with safety-related observations evaluated by an appropriate specialist.`;
}

export async function POST(req:Request){
  const body=await req.json();
  const findings=body.findings??[];
  const vehicle=body.vehicle??{};
  const score=Number(body.score??0);
  const fallback=deterministic(findings,vehicle,score);
  const key=process.env.OPENAI_API_KEY;
  const model=process.env.OPENAI_MODEL;
  if(!key||!model) return NextResponse.json({summary:fallback,source:"deterministic"});

  try{
    const res=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"content-type":"application/json",authorization:`Bearer ${key}`},body:JSON.stringify({
      model,
      messages:[
        {role:"system",content:"You are an automotive inspection report editor. Rewrite only supplied facts into a concise professional customer-facing summary. Never invent findings, measurements, vehicle data, causes, safety claims, or final recommendations."},
        {role:"user",content:JSON.stringify({vehicle,score,findings})}
      ],
      temperature:0.2
    })});
    const json=await res.json();
    const text=json?.choices?.[0]?.message?.content?.trim();
    if(!res.ok||!text) return NextResponse.json({summary:fallback,source:"deterministic"});
    return NextResponse.json({summary:text,source:"ai"});
  }catch{
    return NextResponse.json({summary:fallback,source:"deterministic"});
  }
}

export type DamageType = "" | "P" | "B" | "X";
export type DamageRow = { part:string; quantity:string; damageType:DamageType; damageLevel:0|1|2|3; rfCost:string };
export type FrameSize = "" | "Small" | "Medium" | "Large";
export type FunctionSeverity = "" | "Small" | "Large";
export type ValuationDraft = {
 header:Record<string,string>;source:{sourceType:string;branchType:string;name:string};customerType:"Individual"|"Corporate"|"Business";customer:Record<string,string>;
 assessment:{currentCar:string;purchaseDate:string;usage:string[];usageOther:string;sellingReason:string;replacementType:string;newCarDetails:string;enquiryNumber:string};
 vehicle:Record<string,string>;documents:Record<string,string>;insurance:Record<string,string>;
 refurbishmentRows:{item:string;cost:string}[];accessoriesRows:{item:string;value:string}[];correctionRows:{item:string;value:string}[];pricing:Record<string,string>;
 exteriorRows:DamageRow[];exteriorOtherDamage:Record<string,{left:number;right:number;rfCost:string}>;interiorRows:DamageRow[];
 interiorOverall:Record<string,boolean>;interiorDamage:Record<string,{level:0|1|2|3;rfCost:string}>;
 functionItems:Record<string,{system:string;s:number;l:number;severity:FunctionSeverity;details:string;rfCost:string}>;
 frameItems:Record<string,{group:number;dent:boolean;repair:boolean;replaced:boolean;size:FrameSize;rfCost:string}>;
 weldedExterior:Record<string,{repaired:boolean;replaced:boolean;rfCost:string}>;replacedPanels:Record<string,{left:boolean;right:boolean}>;
 frameRows:{part:string;rfCost:string}[];followUps:{date:string;status:"P"|"H"|"S"|"D"|"";details:string;tlComment:string;nextActionDate:string}[];dropReason:string;
};
export type ValuationTotals={exteriorPoints:number;exteriorRating:number;exteriorRf:number;interiorPoints:number;interiorRating:number;interiorRf:number;functionPoints:number;functionRating:number;functionRf:number;framePoints:number;frameFactor:number;frameRf:number;totalRf:number;standardRf:number;accessoryValue:number;otherCorrection:number;gridBuyingPrice:number;refurbishmentCost:number;netBuyingPrice:number;finalScore:number;finalLevel:number};
export const EXTERIOR_PARTS=["Front Spoiler","Front Bumper","Grille","Bonnet Hood","Front Fender L","Front Fender R","Rear Fender L","Rear Fender R","Roof","Door FL","Door FR","Door RL","Door RR","Rocker Panel L","Rocker Panel R","Quarter Panel L","Quarter Panel R","Trunk Hood","Hood","End Panel","Rear Bumper","Rear Spoiler","Mud Flap L","Mud Flap R","Windshield","Rear Windshield","Side Window L","Side Window R","Door Handle L","Door Handle R"];
export const INTERIOR_PARTS=["Dashboard","Instrument Panel","Steering Wheel","Front Left Seat","Front Right Seat","Rear Seat","Third Seat","Front Left Door Trim","Front Right Door Trim","Rear Left Door Trim","Rear Right Door Trim","Carpet","Roof Lining","Back Door Trim","Center Console","Boot Trim"];
export const EXTERIOR_OTHER_DEFAULTS:Record<string,number>={"Head light":2,"Tail light":2,"Fog Lamp":2,"Side mirror":2,"Mud Flap":1};
export const INTERIOR_CLEANING_POINTS:Record<string,number>={"Needs vacuum cleaning":2,"Needs shampoo cleaning":5,"Needs heavy cleaning":9,"Odor":3,"Heavy odor":9};
export const FUNCTION_CATALOGUE:{system:string;part:string;s:number;l:number}[]=[
{system:"Engine",part:"Engine Oil Leakage",s:1,l:2},{system:"Engine",part:"Coolant Leakage",s:1,l:1},{system:"Engine",part:"Radiator Damage",s:1,l:2},{system:"Engine",part:"Abnormal Noise",s:2,l:3},{system:"Engine",part:"Black Smoke",s:1,l:2},{system:"Engine",part:"White Smoke",s:2,l:3},{system:"Engine",part:"Idling Slump",s:2,l:3},{system:"Engine",part:"Engine RPM Defect",s:2,l:3},{system:"Engine",part:"Defective Belts",s:1,l:1},
{system:"Suspension",part:"Bent Suspension Rod Arm",s:1,l:2},{system:"Suspension",part:"Shock Absorber Defect",s:1,l:2},{system:"Suspension",part:"Alignment",s:1,l:1},
{system:"Brakes",part:"Brake Disk Damage",s:1,l:1},{system:"Brakes",part:"Brake Defect",s:1,l:2},{system:"Brakes",part:"Pedal Handling Defect",s:1,l:1},
{system:"Transmission",part:"Clutch Defect",s:2,l:3},{system:"Transmission",part:"Transmission Oil Leak",s:1,l:2},{system:"Transmission",part:"Shift Shock Time Lag",s:1,l:2},{system:"Transmission",part:"Gear Shifting",s:1,l:3},{system:"Transmission",part:"Gear Box Noise",s:1,l:2},{system:"Transmission",part:"Drive Shaft Defect",s:1,l:2},{system:"Transmission",part:"Differential Noise",s:1,l:2},{system:"Transmission",part:"Wheel Bearings Defect",s:1,l:2},
{system:"Steering",part:"Steering Oil Leak",s:1,l:1},{system:"Steering",part:"Steering Shaft Boots Cut",s:1,l:1},{system:"Steering",part:"Jammed Steering",s:1,l:1},{system:"Steering",part:"Steering Noise",s:1,l:1},{system:"Steering",part:"Defective Telescopic Tilt",s:1,l:1},
{system:"Electrical",part:"Defective Meters",s:1,l:1},{system:"Electrical",part:"Warning Lamp",s:1,l:2},{system:"Electrical",part:"Horn Defect",s:1,l:1},{system:"Electrical",part:"Power Window Defect",s:1,l:1},{system:"Electrical",part:"Keyless or Cylinder Defect",s:1,l:1},{system:"Electrical",part:"Audio Defect",s:1,l:1},{system:"Electrical",part:"Antenna Defect",s:1,l:1},{system:"Electrical",part:"Electronic Mirror Defect",s:1,l:1},{system:"Electrical",part:"Wiper Operation Defect",s:1,l:1},{system:"Electrical",part:"Head Lamp Defect",s:1,l:1},{system:"Electrical",part:"Battery Defect",s:1,l:1},{system:"Electrical",part:"Defective A/C",s:1,l:3},
{system:"Others",part:"Seat Movement Defect",s:1,l:1},{system:"Others",part:"Defective Seatbelts",s:1,l:1},{system:"Others",part:"Jack & Tools Kit",s:1,l:1},{system:"Others",part:"Muffler Defect",s:1,l:1},{system:"Others",part:"Door Lock Defect",s:1,l:1}];
export const FRAME_CATALOGUE:{group:number;part:string;small:number;medium:number;large:number;replaced:number}[]=[
{group:1,part:"Front Cross Member",small:1,medium:1,large:2,replaced:2},{group:1,part:"Upper Core Support",small:1,medium:1,large:2,replaced:2},{group:1,part:"Core Support",small:1,medium:1,large:2,replaced:2},
{group:2,part:"Front Inside Panel",small:1,medium:2,large:3,replaced:3},{group:2,part:"Front Side Member",small:1,medium:2,large:3,replaced:3},{group:2,part:"Front Pillar",small:1,medium:2,large:3,replaced:3},{group:2,part:"Center Pillar",small:1,medium:2,large:3,replaced:3},{group:2,part:"Rear Wheel House",small:1,medium:2,large:3,replaced:3},
{group:3,part:"Dash Panel",small:3,medium:3,large:3,replaced:3},{group:3,part:"Center Floor Panel",small:3,medium:3,large:3,replaced:3},{group:3,part:"Floor Cross Member",small:3,medium:3,large:3,replaced:3},{group:3,part:"Floor Side Member",small:3,medium:3,large:3,replaced:3},
{group:4,part:"Rear Floor Panel",small:2,medium:2,large:3,replaced:3},{group:4,part:"Rear Inside Panel",small:2,medium:2,large:3,replaced:3},{group:4,part:"Rear Side Member",small:2,medium:2,large:3,replaced:3},{group:4,part:"Rear Cross Member",small:2,medium:2,large:3,replaced:3}];
const functionDefaults=()=>Object.fromEntries(FUNCTION_CATALOGUE.map(x=>[x.part,{system:x.system,s:x.s,l:x.l,severity:"" as FunctionSeverity,details:"",rfCost:""}]));
const frameDefaults=()=>Object.fromEntries(FRAME_CATALOGUE.map(x=>[x.part,{group:x.group,dent:false,repair:false,replaced:false,size:"" as FrameSize,rfCost:""}]));
const blankDamage=(part:string):DamageRow=>({part,quantity:"",damageType:"",damageLevel:0,rfCost:""});
export function createDefaultValuation():ValuationDraft{return{
header:{poName:"",enquiryDate:"",valuationDate:"",number:""},source:{sourceType:"",branchType:"",name:""},customerType:"Individual",customer:{name:"",address:"",office:"",home:"",mobile:"",email:"",contactPerson:"",phone:"",companyName:""},
assessment:{currentCar:"",purchaseDate:"",usage:[],usageOther:"",sellingReason:"",replacementType:"",newCarDetails:"",enquiryNumber:""},
vehicle:{registration:"",manufacturer:"",modelSuffix:"",monthYear:"",color:"",kmRun:"",owners:"",chassis:"",engine:"",fuel:""},
documents:{rcBookType:"",registrationDate:"",reRegistered:"",duplicateRC:"",copy:"",vinPlateAvailable:"",serviceHistoryAvailable:"",hpEntry:"",roadTaxPaid:"",originalInvoiceAvailable:"",bankNameBranch:""},
insurance:{type:"",companyName:"",premium:"",expiryDate:"",idvValue:"",ncbDetails:""},
refurbishmentRows:[{item:"Periodic Service",cost:""},{item:"Carpet and upholstery cleaning",cost:""},{item:"Rubbing and polishing",cost:""},{item:"Spare Keys",cost:""},{item:"Other",cost:""}],accessoriesRows:Array.from({length:5},()=>({item:"",value:""})),
correctionRows:[{item:"Insurance Cost (if expired)",value:""},{item:"Mileage (+ or -)",value:""},{item:"City Registration/Documents",value:""},{item:"Accessories (in case of repair)",value:""}],
pricing:{level:"",gridBuyingPrice:"",refurbishmentCost:"",vehicleCategory:"Retail",firstPriceQuoted:"",customerExpectedPrice:"",finalPrice:"",esp:"",personalDetail1:"",personalDetail2:"",remarks:""},
exteriorRows:Array.from({length:8},(_,i)=>blankDamage("Exterior defect "+(i+1))),exteriorOtherDamage:Object.fromEntries(Object.keys(EXTERIOR_OTHER_DEFAULTS).map(k=>[k,{left:0,right:0,rfCost:""}])),
interiorRows:Array.from({length:5},(_,i)=>blankDamage("Interior defect "+(i+1))),interiorOverall:{"Needs vacuum cleaning":false,"Needs shampoo cleaning":false,"Needs heavy cleaning":false,"Odor":false,"Heavy odor":false},
interiorDamage:Object.fromEntries(["Carpet Damage","3rd Seat Damage","Back Door Trim Damage"].map(k=>[k,{level:0 as 0|1|2|3,rfCost:""}])),
functionItems:functionDefaults(),frameItems:frameDefaults(),weldedExterior:Object.fromEntries(["RH Rear Fender Panel","LH Rear Fender Panel","RH Rocker Panel","LH Rocker Panel","End Panel","Roof Panel"].map(k=>[k,{repaired:false,replaced:false,rfCost:""}])),
replacedPanels:Object.fromEntries(["Front Fender","Front Door","Rear Door","Bonnet Hood","Trunk Hood"].map(k=>[k,{left:false,right:false}])),frameRows:Array.from({length:4},(_,i)=>({part:"Frame defect "+(i+1),rfCost:""})),
followUps:Array.from({length:6},()=>({date:"",status:"" as ""|"P"|"H"|"S"|"D",details:"",tlComment:"",nextActionDate:""})),dropReason:""}}
export function money(value:unknown):number{const n=Number(String(value??"").replace(/[,₹\s]/g,""));return Number.isFinite(n)?n:0}
function sum(rows:{cost?:string;value?:string;rfCost?:string}[]):number{return rows.reduce((s,r)=>s+money(r.cost??r.value??r.rfCost),0)}
function extRating(p:number,m:number):number{return p>=21?1:p>=16?2:p>=8?3:p>=4?4:m<=1?5:m<=2?4:3}
function intRating(p:number,m:number):number{return p>=18?1:p>=14?2:p>=8?3:p>=4?4:m<=1?5:m<=2?4:3}
export function calculateValuation(v:ValuationDraft):ValuationTotals{
const exteriorPoints=v.exteriorRows.reduce((s,r)=>s+r.damageLevel*Math.max(1,money(r.quantity)),0)+Object.values(v.exteriorOtherDamage).reduce((s,r)=>s+r.left+r.right,0);
const exteriorMax=Math.max(0,...v.exteriorRows.map(r=>r.damageLevel),...Object.values(v.exteriorOtherDamage).flatMap(r=>[r.left,r.right]));
const exteriorRating=extRating(exteriorPoints,exteriorMax);
const interiorPoints=Object.entries(v.interiorOverall).reduce((s,[k,yes])=>s+(yes?(INTERIOR_CLEANING_POINTS[k]||0):0),0)+v.interiorRows.reduce((s,r)=>s+r.damageLevel*Math.max(1,money(r.quantity)),0)+Object.values(v.interiorDamage).reduce((s,r)=>s+r.level,0);
const interiorMax=Math.max(0,...v.interiorRows.map(r=>r.damageLevel),...Object.values(v.interiorDamage).map(r=>r.level));
const interiorRating=intRating(interiorPoints,interiorMax);
const functionPoints=Object.values(v.functionItems).reduce((s,r)=>s+(r.severity==="Small"?r.s:r.severity==="Large"?r.l:0),0);
const functionRating=functionPoints>=7?1:functionPoints>=5?2:functionPoints>=3?3:functionPoints===2?4:5;
const framePoints=Object.entries(v.frameItems).reduce((s,[part,r])=>{const c=FRAME_CATALOGUE.find(x=>x.part===part);const pts=r.replaced?(c?.replaced||0):r.size==="Small"?(c?.small||1):r.size==="Medium"?(c?.medium||1):r.size==="Large"?(c?.large||1):0;return s+((r.dent||r.repair||r.replaced)?pts:0)},0)+Object.entries(v.weldedExterior).reduce((s,[part,r])=>s+(r.replaced?(part==="Roof Panel"?3:1):0),0);
const frameMax=Math.max(0,...Object.values(v.frameItems).map(r=>r.replaced?3:r.size==="Large"?3:r.size==="Medium"?2:r.size==="Small"?1:0),...Object.entries(v.weldedExterior).map(([p,r])=>r.replaced&&p==="Roof Panel"?3:r.replaced?1:0));
const frameFactor=frameMax===0&&framePoints===0?1:frameMax<=1?.9:frameMax===2?.8:.7;
const exteriorRf=sum(v.exteriorRows)+sum(Object.values(v.exteriorOtherDamage)),interiorRf=sum(v.interiorRows)+sum(Object.values(v.interiorDamage)),functionRf=sum(Object.values(v.functionItems)),frameRf=sum(v.frameRows)+sum(Object.values(v.frameItems))+sum(Object.values(v.weldedExterior));
const standardRf=sum(v.refurbishmentRows),accessoryValue=sum(v.accessoriesRows),otherCorrection=sum(v.correctionRows),gridBuyingPrice=money(v.pricing.gridBuyingPrice),refurbishmentCost=money(v.pricing.refurbishmentCost),netBuyingPrice=gridBuyingPrice+accessoryValue-standardRf-refurbishmentCost-otherCorrection,totalRf=exteriorRf+interiorRf+functionRf+frameRf;
const finalScore=(exteriorRating+interiorRating+functionRating)*frameFactor,finalLevel=finalScore>=14?5:finalScore>=11?4:finalScore>=8?3:finalScore>=6?2:1;
return{exteriorPoints,exteriorRating,exteriorRf,interiorPoints,interiorRating,interiorRf,functionPoints,functionRating,functionRf,framePoints,frameFactor,frameRf,totalRf,standardRf,accessoryValue,otherCorrection,gridBuyingPrice,refurbishmentCost,netBuyingPrice,finalScore,finalLevel}
}

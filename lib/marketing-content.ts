export type MarketingFaq = { question: string; answer: string };

export type MarketingPageContent = {
  slug: string;
  kind: "service" | "guide" | "static";
  title: string;
  metaTitle: string;
  metaDescription: string;
  tagline: string;
  intro: string;
  overview: string;
  checks: string[];
  faqs: MarketingFaq[];
  primaryHref?: string;
  primaryLabel?: string;
};

export const servicePages: MarketingPageContent[] = [
  {
    slug: "used-car-inspection", kind: "service", title: "Used-Car Inspection",
    metaTitle: "Used-Car Inspection Before You Buy",
    metaDescription: "Arrange a structured used-car inspection covering visible condition, vehicle identity, tyres, cabin, engine-bay observations and evidence-led reporting.",
    tagline: "See the car clearly before you commit.",
    intro: "Buying a pre-owned car is easier when the decision is based on documented observations instead of a quick walk-around or a seller's assurances.",
    overview: "A used-car inspection organises the important checks into a repeatable sequence. It is designed to highlight visible concerns, questions that need follow-up and details a buyer should consider before proceeding. The scope depends on vehicle access, available records and whether a road test or diagnostic scan is included.",
    checks: ["Vehicle identity and documents supplied for review", "Exterior panels, paint consistency, glass, lights and visible damage", "Tyres, wheels, cabin controls, warning lamps and accessible engine-bay areas", "Evidence photos and observations that need independent verification"],
    faqs: [
      { question: "Does an inspection guarantee a fault-free car?", answer: "No. An inspection is a point-in-time assessment with access and scope limitations. Hidden, intermittent or inaccessible issues may not be detectable." },
      { question: "Should I share the registration details before booking?", answer: "Share the vehicle make, model, year, location and any known concerns so the scope and availability can be discussed before confirmation." },
      { question: "Can I rely on the inspection report alone?", answer: "Use the report alongside service records, an independent document check and your own purchase decision. Legal, ownership and finance checks may need separate verification." }
    ],
    primaryHref: "/book-inspection", primaryLabel: "Request a used-car inspection"
  },
  {
    slug: "new-car-pdi", kind: "service", title: "New-Car Pre-Delivery Inspection",
    metaTitle: "New-Car PDI Checklist and Inspection",
    metaDescription: "Request a new-car pre-delivery inspection to review visible fit and finish, tyres, lights, cabin functions, accessories and handover details before delivery.",
    tagline: "A calmer handover starts before delivery.",
    intro: "A new car should be checked carefully before handover. A pre-delivery inspection helps organise visible condition checks and questions to raise with the dealership while the delivery process is still underway.",
    overview: "PDI is a visual and functional review of the accessible vehicle condition at a specific time. It can help a customer record observations, compare supplied accessories and ask the dealership to clarify unresolved items. It does not replace the manufacturer's warranty, dealer preparation or a mechanical teardown.",
    checks: ["Paint, body panels, glass, trim, lights and visible transport marks", "Tyre condition, wheel finish, odometer display and dashboard warning lamps", "Accessible cabin controls, infotainment functions and supplied accessories", "Documents, spare key, manuals and handover items listed by the seller"],
    faqs: [
      { question: "When should I arrange a new-car PDI?", answer: "Discuss timing with the dealership before delivery and confirm that there is enough access and time to record observations and have questions addressed." },
      { question: "Does PDI change the manufacturer's warranty?", answer: "A PDI review does not replace or modify the manufacturer's warranty. Warranty coverage is determined by the manufacturer and the sale terms." },
      { question: "Can every feature be tested during PDI?", answer: "Some functions require a suitable environment, connectivity, fuel, diagnostic access or dealer assistance. The report should identify anything that could not be checked." }
    ],
    primaryHref: "/book-inspection", primaryLabel: "Request a new-car PDI"
  },
  {
    slug: "used-car-pdi", kind: "service", title: "Used-Vehicle PDI",
    metaTitle: "Used-Vehicle PDI and Condition Checks",
    metaDescription: "Plan a used-vehicle PDI with structured checks for body condition, cabin wear, tyres, warning lamps, visible engine-bay concerns and records provided.",
    tagline: "A repeatable check for a previously owned vehicle.",
    intro: "Used-vehicle PDI is useful when a car is being handed over after sale, refurbishment, exchange or preparation by a dealer. It creates a consistent record of the condition observed at handover.",
    overview: "The exact checklist should match the vehicle, intended use and access available. Separate pre-purchase due diligence from the handover record: a condition report does not independently establish ownership, accident history or future reliability.",
    checks: ["Record registration, odometer display and vehicle identifiers visible at inspection", "Compare visible exterior and cabin condition against supplied disclosures", "Check accessible controls, tyres, lights and dashboard indicators", "List missing accessories, unresolved issues and follow-up actions"],
    faqs: [
      { question: "How is used-vehicle PDI different from a pre-purchase inspection?", answer: "A pre-purchase inspection supports a buying decision. A used-vehicle PDI is often focused on documenting the condition around handover or after preparation." },
      { question: "Can a report prove that a vehicle has never had an accident?", answer: "No. Visible signs can warrant further investigation, but a point-in-time inspection cannot prove the complete accident history of a vehicle." },
      { question: "Can the buyer and seller use the report?", answer: "A shared condition record can help both parties discuss observed items, provided everyone understands its scope and limitations." }
    ],
    primaryHref: "/book-inspection", primaryLabel: "Discuss a used-vehicle PDI"
  },
  {
    slug: "pre-purchase-inspection", kind: "service", title: "Pre-Purchase Vehicle Inspection",
    metaTitle: "Pre-Purchase Car Inspection for Buyers",
    metaDescription: "Get a structured pre-purchase car inspection before making an offer. Review visible condition, road-test observations, records supplied and next-step questions.",
    tagline: "Make the next decision with better evidence.",
    intro: "A pre-purchase inspection gives prospective buyers a structured view of the car before they finalise a purchase. It helps separate observed facts from questions that still need an answer.",
    overview: "The inspection can cover accessible exterior and interior condition, basic function checks and agreed additional scope. Buyers should also arrange the relevant ownership, finance, legal and service-record checks separately.",
    checks: ["Confirm the vehicle and inspection scope with the seller", "Capture significant findings rather than every cosmetic mark", "Record which areas or systems were not accessible", "Use the report to plan questions, specialist checks and negotiation"],
    faqs: [
      { question: "Should the seller be present?", answer: "Coordinate access with the seller or dealer in advance. The inspector needs a suitable place and enough time to complete the agreed checklist." },
      { question: "Will this tell me the future repair cost?", answer: "Not necessarily. Cost estimates may require a workshop diagnosis, parts availability and a separate quotation from a repairer." },
      { question: "Does a good score mean I should buy the car?", answer: "A score is only one summary of recorded observations. Consider severity, intended use, budget, service history and unresolved checks before deciding." }
    ],
    primaryHref: "/book-inspection", primaryLabel: "Request a pre-purchase inspection"
  },
  {
    slug: "vehicle-diagnostics", kind: "service", title: "Vehicle Diagnostics and Warning Checks",
    metaTitle: "Vehicle Diagnostics and Warning-Light Checks",
    metaDescription: "Arrange a vehicle assessment for warning-light observations and diagnostic-code review, with clear notes on what was checked and what needs workshop diagnosis.",
    tagline: "Read the warning. Investigate the cause.",
    intro: "Warning lamps and stored diagnostic codes are clues, not complete diagnoses. A useful assessment records the symptoms and codes available, then identifies what requires a qualified workshop to investigate further.",
    overview: "Diagnostic access and scope depend on the vehicle and tools available. Codes may be historical, intermittent or influenced by several underlying conditions; they should not be treated as proof of a single failed part without testing.",
    checks: ["Record warning lights and the conditions under which they appear", "Capture codes and scan details when suitable diagnostic access is available", "Avoid clearing codes before relevant evidence is recorded", "Refer complex, safety-critical or intermittent concerns for workshop diagnosis"],
    faqs: [
      { question: "Does a fault code name the part that failed?", answer: "Usually not with certainty. Codes identify a monitored condition or circuit and further tests are often required to establish the cause." },
      { question: "Can every vehicle be scanned?", answer: "Coverage depends on the vehicle, diagnostic tool, systems supported and communication access. The available scope should be confirmed beforehand." },
      { question: "Can you clear the warning light?", answer: "Clearing a code without addressing the cause can hide useful evidence. Any repair or reset should follow appropriate diagnosis and vehicle-specific procedures." }
    ],
    primaryHref: "/book-inspection", primaryLabel: "Discuss diagnostic checks"
  },
  {
    slug: "inspection-report", kind: "service", title: "Vehicle Inspection Reports",
    metaTitle: "Vehicle Inspection Reports with Evidence",
    metaDescription: "Learn what a structured vehicle inspection report can include: findings, condition notes, evidence photos, limitations, severity and recommended follow-up checks.",
    tagline: "Clear findings. Traceable evidence. Useful next steps.",
    intro: "A good inspection report should help the reader understand what was checked, what was observed and what still needs clarification. It should not hide uncertainty behind polished language.",
    overview: "Report format varies with inspection scope, client requirements and available evidence. Important details include vehicle identification, date, observations, supporting photos, areas not checked and the difference between an observed issue and a suspected cause.",
    checks: ["Vehicle and inspection details with an understandable scope statement", "Plain-language observations linked to photos where useful", "Consistent severity labels and clear limitations", "Practical follow-up actions without unsupported certainty"],
    faqs: [
      { question: "Can supporting PDFs be attached to a report?", answer: "That depends on the reporting workflow and file-handling capability in use. Supporting documents should be labelled and their source kept clear." },
      { question: "Should every finding have a photo?", answer: "Photos are useful for significant visual findings, but they do not replace written context or prove the condition of hidden components." },
      { question: "Can AI write the report?", answer: "Tools may help organise or clarify supplied observations, but facts, measurements, scores and recommendations should be checked against the recorded evidence." }
    ],
    primaryHref: "/dashboard", primaryLabel: "Open the inspection software"
  },
  {
    slug: "vehicle-condition-assessment", kind: "service", title: "Vehicle Condition Assessment",
    metaTitle: "Vehicle Condition Assessment and Review",
    metaDescription: "Review a vehicle's recorded condition through a structured assessment covering accessible bodywork, cabin, tyres, functions, evidence and limitations.",
    tagline: "One structured view of the condition today.",
    intro: "A condition assessment creates a dated record of what could be observed during an agreed inspection. It can support handovers, internal reviews or decisions about additional evaluation.",
    overview: "The assessment should distinguish cosmetic condition from functional or safety-related observations and should make clear whether a component was visible, operated, measured or independently diagnosed.",
    checks: ["Set the assessment purpose and areas included", "Capture baseline photographs and material existing damage", "Record accessible functions and any test limitations", "Identify items requiring repair estimates or specialist checks"],
    faqs: [
      { question: "Is a condition assessment the same as a full mechanical inspection?", answer: "Not always. The scope can be visual, functional or more extensive. Confirm exactly which checks and systems are included before relying on the result." },
      { question: "Can two assessments be compared over time?", answer: "They are easier to compare when vehicle identity, photo angles, checklist, severity definitions and inspection conditions are consistent." },
      { question: "Does the assessment establish market value?", answer: "A condition assessment is not automatically a valuation. Market value needs its own method and relevant market data." }
    ],
    primaryHref: "/book-inspection", primaryLabel: "Discuss a condition assessment"
  },
  {
    slug: "fleet-vehicle-inspection", kind: "service", title: "Fleet Vehicle Inspection",
    metaTitle: "Fleet Vehicle Inspection Workflows",
    metaDescription: "Explore repeatable inspection workflows for fleet vehicles, including consistent checklists, evidence capture, defect tracking and follow-up records.",
    tagline: "Consistent checks across every vehicle.",
    intro: "Fleet teams need records that are easy to compare across vehicles and inspection dates. A standard checklist helps teams track visible defects, outstanding action items and evidence consistently.",
    overview: "The appropriate checklist depends on vehicle type, operating environment, usage and applicable company or regulatory requirements. Safety-critical defects should be escalated under the fleet's approved procedures.",
    checks: ["Use a consistent vehicle identity and inspection date", "Record defects with location, severity and supporting evidence", "Separate urgent safety issues from routine maintenance notes", "Assign follow-up actions and re-check status through the team's process"],
    faqs: [
      { question: "Can one checklist cover every fleet vehicle?", answer: "A shared baseline can help, but different vehicle classes and operating duties may require additional or different checks." },
      { question: "Does a visual checklist replace statutory inspections?", answer: "No. Follow applicable legal, manufacturer and workplace requirements. A routine condition check does not replace a required statutory test." },
      { question: "How can teams compare results?", answer: "Use consistent definitions, record dates, keep vehicle IDs stable and review repeat findings alongside maintenance records." }
    ],
    primaryHref: "/dashboard", primaryLabel: "Open the inspection software"
  },
  {
    slug: "dealer-inspection-support", kind: "service", title: "Dealer Inspection Support",
    metaTitle: "Dealer Vehicle Inspection and Handover Support",
    metaDescription: "Build clearer vehicle handover records with a repeatable dealer inspection checklist for visible condition, accessories, findings and unresolved action items.",
    tagline: "A clearer record at every handover.",
    intro: "Dealers and vehicle teams can use structured checklists to reduce ambiguity during vehicle intake, preparation and customer handover. The most useful process records exceptions rather than simply ticking every box.",
    overview: "Adapt the checklist to the dealer's workflow, vehicle class and delivery requirements. Responsibilities for repairs, warranties, disclosures and legal checks should remain explicit and should not be inferred from a visual report.",
    checks: ["Define intake, preparation and handover stages", "Capture visible condition and accessories at the relevant stage", "Mark unverified items and unresolved defects clearly", "Keep supporting documents associated with the correct vehicle"],
    faqs: [
      { question: "Can the checklist be branded for a dealership?", answer: "The report design can be tailored to an agreed workflow. Brand assets, required fields and approval rules should be supplied before customisation." },
      { question: "Does a checklist remove the need for staff training?", answer: "No. Staff need to understand what each item means, when to escalate a finding and how to record limitations honestly." },
      { question: "Can the same vehicle be inspected again later?", answer: "Yes. Keep dated records and compare changes carefully so a later finding is not incorrectly presented as present during an earlier inspection." }
    ],
    primaryHref: "/book-inspection", primaryLabel: "Discuss inspection support"
  },
  {
    slug: "independent-car-inspection", kind: "service", title: "Independent Car Inspection",
    metaTitle: "Independent Car Inspection for Better Decisions",
    metaDescription: "Arrange an independent-style car condition review with a defined scope, structured observations and clear notes on findings that require further checks.",
    tagline: "A second look, documented clearly.",
    intro: "When you need a clearer picture of a vehicle, a structured inspection can help gather observations independently of the sales conversation. Agree on the scope and access before the inspection begins.",
    overview: "Independence should be understood in context and disclosed honestly. Ask who is performing the inspection, what they will check, how findings are documented and whether there are any commercial relationships that could affect the assessment.",
    checks: ["Confirm the purpose of the inspection and who requested it", "Agree access, test conditions and systems to be reviewed", "Record observations and limitations in plain language", "Use the findings as one input among service, ownership and legal checks"],
    faqs: [
      { question: "What does independent mean here?", answer: "It should describe the inspector's relationship to the transaction clearly. Ask about scope, relationships and any limitations before booking." },
      { question: "Can an inspection detect concealed repairs?", answer: "Some visible clues may prompt further investigation, but concealment and inaccessible areas mean no visual assessment can guarantee detection of every previous repair." },
      { question: "How do I prepare the vehicle for inspection?", answer: "Arrange permission and access, make relevant records available and ensure the vehicle can be inspected safely in suitable light and space." }
    ],
    primaryHref: "/book-inspection", primaryLabel: "Request an inspection"
  }
];

export const guidePages: MarketingPageContent[] = [
  {
    slug: "used-car-inspection-checklist", kind: "guide", title: "Used-Car Inspection Checklist",
    metaTitle: "Used-Car Inspection Checklist for Buyers",
    metaDescription: "Use this used-car inspection checklist to organise exterior, cabin, tyres, vehicle identity, warning lamps, engine-bay observations and follow-up questions.",
    tagline: "A checklist for looking beyond the first impression.",
    intro: "A checklist keeps the inspection systematic when a car looks clean, the seller is in a hurry or several vehicles are being compared.",
    overview: "Start by confirming access and the vehicle identity. Work around the car in a repeatable order, capture significant observations and mark items that could not be checked. A checklist supports the decision but cannot reveal every hidden or intermittent issue.",
    checks: ["Walk around the body and inspect paint, panel gaps, glass, lamps and tyres", "Check accessible cabin controls, seat belts, warning lights and odometer display", "Look for visible fluid traces and condition concerns in accessible engine-bay areas", "Review records supplied and list questions for a workshop or document specialist"],
    faqs: [
      { question: "Can I inspect a car without lifting it?", answer: "You can record accessible observations, but areas hidden underneath may remain unverified. Do not crawl under a vehicle unless it is properly supported using suitable equipment." },
      { question: "What should I photograph?", answer: "Capture significant damage, warning displays, tyres, identity markings where appropriate and any observation you expect to discuss later." },
      { question: "What is the biggest checklist mistake?", answer: "Treating a tick as proof that a system is fault-free. Record the actual check performed and any limits." }
    ],
    primaryHref: "/services/used-car-inspection", primaryLabel: "Explore used-car inspection"
  },
  {
    slug: "new-car-pdi-checklist", kind: "guide", title: "New-Car PDI Checklist",
    metaTitle: "New-Car PDI Checklist Before Delivery",
    metaDescription: "Review paint, trim, glass, tyres, dashboard lamps, cabin controls, accessories and documents before accepting a new vehicle delivery.",
    tagline: "Pause before the keys change hands.",
    intro: "A pre-delivery inspection is easiest to complete when you have time, suitable lighting and a dealership contact who can clarify questions.",
    overview: "Inspect visible condition methodically and keep a list of unresolved items. Test only the functions that can be assessed safely and note where a dealer demonstration or diagnostic access is required.",
    checks: ["Inspect panels, paint, glass, lamps and trim in good light", "Check wheel and tyre appearance and look for visible transport marks", "Test accessible cabin switches, display and basic features", "Compare keys, accessories, manuals and documents with the handover list"],
    faqs: [
      { question: "Should I sign delivery documents first?", answer: "Clarify the dealership's process before arrival. Read the documents and follow the sale terms while raising visible concerns promptly." },
      { question: "Can paint colour vary under different lights?", answer: "Lighting can change how a finish appears. Use consistent lighting and view neighbouring panels from several angles before recording a concern." },
      { question: "Are software and connected services always testable?", answer: "Not always. Some require setup, signal or an account; record what could not be tested rather than assuming it works." }
    ],
    primaryHref: "/services/new-car-pdi", primaryLabel: "Explore new-car PDI"
  },
  {
    slug: "tyre-and-wheel-checks", kind: "guide", title: "Tyre and Wheel Checks",
    metaTitle: "Tyre and Wheel Inspection: What to Check",
    metaDescription: "Learn which tyre and wheel observations to record during a vehicle inspection, including tread, visible damage, wear patterns and wheel condition.",
    tagline: "Small contact patches deserve careful attention.",
    intro: "Tyre condition can influence safety and handling. Visual observations are useful, but inflation, alignment and internal damage may need additional checks by a qualified professional.",
    overview: "Inspect tyres in safe conditions and use the vehicle manufacturer's guidance for correct pressures and tyre specifications. Do not rely on appearance alone when a tyre may be damaged.",
    checks: ["Look for cuts, bulges, exposed cords, embedded objects and uneven wear", "Compare tyre sizes and visible age markings when readable", "Review wheel rims for impact marks, cracks or significant damage", "Refer safety concerns to a qualified tyre professional before road use"],
    faqs: [
      { question: "Can uneven tread prove a suspension fault?", answer: "It can be a clue, but pressure, rotation history, alignment, suspension components and usage may contribute. Further checks establish the cause." },
      { question: "Can a bulged tyre be driven to a workshop?", answer: "A bulge can indicate structural damage and may make driving unsafe. Seek qualified advice and appropriate recovery rather than assuming it is safe." },
      { question: "Is visual tread checking enough?", answer: "No. Legal requirements, wear indicators, damage and pressure need proper consideration. A visual note does not certify roadworthiness." }
    ],
    primaryHref: "/services/used-car-inspection", primaryLabel: "Book a vehicle inspection"
  },
  {
    slug: "paint-and-bodywork-checks", kind: "guide", title: "Paint and Bodywork Checks",
    metaTitle: "Car Paint and Bodywork Inspection Guide",
    metaDescription: "Understand visible paint and bodywork clues such as panel gaps, colour differences, overspray, glass condition and marks that merit further inspection.",
    tagline: "Look at the panel, then look at the pattern.",
    intro: "Bodywork observations can reveal damage or prior repairs, but individual clues should not be treated as definitive proof of an accident.",
    overview: "Use consistent lighting and multiple viewing angles. Compare nearby panels, note visible inconsistencies and document the finding. Paint depth measurements and structural assessments require suitable tools and expertise.",
    checks: ["Review panel alignment and gaps from more than one angle", "Look for paint texture, colour differences, overspray and trim irregularities", "Check glass, lamps, seals and visible fasteners for inconsistencies", "Record suspected repairs as observations requiring confirmation"],
    faqs: [
      { question: "Does a different paint shade prove accident damage?", answer: "No. Resprays, fading, lighting and factory variations can affect appearance. It is a clue that may need further checking." },
      { question: "Can a visual inspection identify structural damage?", answer: "A visual check may identify warning signs, but hidden or structural damage often requires access, measurement and specialist assessment." },
      { question: "Are panel gaps identical on every vehicle?", answer: "Manufacturing design and tolerances vary. Compare consistency and look for unusual differences rather than assuming every gap must be identical." }
    ],
    primaryHref: "/services/pre-purchase-inspection", primaryLabel: "Explore pre-purchase checks"
  },
  {
    slug: "engine-bay-inspection-guide", kind: "guide", title: "Engine-Bay Inspection Guide",
    metaTitle: "Engine-Bay Checks During a Car Inspection",
    metaDescription: "A practical overview of safe visual engine-bay checks: visible leaks, fluid levels where accessible, damaged hoses, belts and signs that need workshop review.",
    tagline: "Observe carefully. Do not guess at the cause.",
    intro: "The engine bay contains hot, moving and electrical components. Inspections should be performed only when the vehicle is safe to examine and within the inspector's training.",
    overview: "A visual review can record accessible conditions and visible leaks, but it is not a replacement for mechanical diagnosis. Do not open a hot pressurised cooling system or place hands near moving components.",
    checks: ["Look for visible fluid traces, damaged hoses and unusual residue without touching hot parts", "Check fluid levels only where the vehicle's guidance allows safe access", "Note battery condition and visible wiring issues from a safe distance", "Record observations without diagnosing an internal fault from appearance alone"],
    faqs: [
      { question: "Should the engine be hot or cold?", answer: "Follow the vehicle-specific procedure and safety guidance. Some checks require a cold engine; others require particular operating conditions." },
      { question: "Does a clean engine bay mean no leaks?", answer: "No. Cleaning can remove traces and some leaks occur only under certain conditions. Record what was observable at the time." },
      { question: "Can I open the coolant cap to check it?", answer: "Never open a hot pressurised cooling system. Follow the owner's manual and appropriate safety procedures." }
    ],
    primaryHref: "/services/vehicle-diagnostics", primaryLabel: "Explore diagnostic assessment"
  },
  {
    slug: "underbody-inspection-checks", kind: "guide", title: "Underbody Inspection Checks",
    metaTitle: "Underbody Inspection: Rust, Leaks and Damage",
    metaDescription: "Learn what an underbody inspection may record, including visible corrosion, impact marks, damaged covers, fluid traces and areas that were inaccessible.",
    tagline: "A clear view of the parts you can safely access.",
    intro: "The underbody can show damage, corrosion or leaks that are not visible during a walk-around. Safety is the first requirement: access should use suitable lifting or inspection equipment.",
    overview: "Never crawl beneath a vehicle supported only by a jack. A limited visual check must clearly state which areas could not be accessed and should refer potential structural or safety-critical issues for specialist review.",
    checks: ["Inspect visible underbody covers and accessible components for impact marks", "Record corrosion and fluid traces without assuming a cause", "Note exhaust, suspension and mounting areas where visible", "List inaccessible sections and any need for a workshop lift assessment"],
    faqs: [
      { question: "Can I look underneath using only a roadside jack?", answer: "No. A jack alone is not safe support for working underneath a vehicle. Use appropriate lifting equipment and trained personnel." },
      { question: "Does surface rust always mean serious damage?", answer: "Not necessarily. Location, depth, structural relevance and vehicle design matter. A qualified assessment may be necessary." },
      { question: "Can fluid colour identify the source?", answer: "It may help describe an observation, but residues can mix or change. Diagnosis should verify the source." }
    ],
    primaryHref: "/services/used-car-inspection", primaryLabel: "Explore used-car inspection"
  },
  {
    slug: "road-test-observations", kind: "guide", title: "Road-Test Observations",
    metaTitle: "Vehicle Road-Test Checklist for Inspections",
    metaDescription: "Structure road-test observations for steering, braking, vibrations, transmission response, warning lamps and noises when a safe, authorised test is appropriate.",
    tagline: "Drive only when it is safe and authorised.",
    intro: "A road test can reveal symptoms that are not present when a vehicle is stationary, but it should only be performed with permission, suitable conditions and a safe vehicle.",
    overview: "Record the conditions under which a symptom occurs rather than stating a cause without diagnosis. If a warning or safety concern makes driving inappropriate, stop and arrange a suitable professional assessment.",
    checks: ["Confirm permission, insurance requirements and safe test conditions", "Note steering feel, braking behaviour, vibration and unusual noises", "Observe gear changes and warning displays without distraction", "Stop if the vehicle behaves unsafely and record the limitation"],
    faqs: [
      { question: "Should every inspection include a road test?", answer: "Not automatically. It depends on scope, permission, road conditions, vehicle condition and appropriate safety arrangements." },
      { question: "Can a short drive confirm the transmission is healthy?", answer: "No. Some symptoms occur only under specific conditions or after longer operation. A short test cannot certify system health." },
      { question: "Who should perform the test?", answer: "A properly authorised and competent driver under the agreed inspection procedure should perform it." }
    ],
    primaryHref: "/services/pre-purchase-inspection", primaryLabel: "Request a pre-purchase inspection"
  },
  {
    slug: "documents-and-vehicle-identity", kind: "guide", title: "Documents and Vehicle Identity",
    metaTitle: "Vehicle Identity and Document Review Guide",
    metaDescription: "Organise vehicle identity details and documents supplied during a car inspection, and identify items that require independent official verification.",
    tagline: "Make sure the record matches the vehicle.",
    intro: "Vehicle identity and document checks are important, but a visual inspection is not a substitute for official verification of ownership, finance, legal status or authenticity.",
    overview: "Use authorised channels and follow relevant privacy and consent requirements. Record which documents were supplied and which details were compared, rather than implying that every legal check has been completed.",
    checks: ["Compare supplied identity details with visible vehicle identifiers where appropriate", "Record which documents were actually presented for review", "List mismatches or missing records for independent verification", "Protect personal information and use authorised verification services"],
    faqs: [
      { question: "Can a visual check confirm clean ownership?", answer: "No. Ownership, loans, legal restrictions and registration status may require official records and authorised verification." },
      { question: "Should I publish a full chassis or VIN online?", answer: "Avoid publicly exposing vehicle and personal identifiers unnecessarily. Share details only through appropriate, trusted channels for a valid purpose." },
      { question: "What if the documents do not match?", answer: "Pause the transaction and seek clarification through official or authorised channels before relying on the vehicle record." }
    ],
    primaryHref: "/services/used-car-inspection", primaryLabel: "Explore used-car inspection"
  },
  {
    slug: "understanding-obd-codes", kind: "guide", title: "Understanding OBD Diagnostic Codes",
    metaTitle: "OBD Codes Explained for Vehicle Inspections",
    metaDescription: "Understand the limits of OBD fault codes, why codes need context, and how an inspection can record scan results without claiming an unverified diagnosis.",
    tagline: "A code is a lead, not a verdict.",
    intro: "OBD codes help identify a monitored condition, but they rarely tell the full story by themselves. Their meaning depends on the vehicle, system, freeze-frame data and supporting tests.",
    overview: "Save the scan details before changing the vehicle state. A qualified diagnostic process verifies likely causes before parts are replaced or codes are cleared.",
    checks: ["Record the code, description, tool and circumstances where available", "Keep relevant freeze-frame or system information if supported", "Treat pending, historic and current codes differently", "Document follow-up tests rather than guessing at failed components"],
    faqs: [
      { question: "Can the same code mean different causes?", answer: "Yes. Similar symptoms or codes can result from different causes depending on vehicle design and operating conditions." },
      { question: "Should I clear codes before selling the car?", answer: "Clearing codes may erase diagnostic evidence and does not address an underlying problem. Follow appropriate diagnostic and disclosure procedures." },
      { question: "Does no code mean no problem?", answer: "No. Not all faults trigger a code, and some problems are intermittent or outside the system's monitoring capability." }
    ],
    primaryHref: "/services/vehicle-diagnostics", primaryLabel: "Explore vehicle diagnostics"
  },
  {
    slug: "what-goes-in-inspection-report", kind: "guide", title: "What Goes Into an Inspection Report?",
    metaTitle: "Vehicle Inspection Report: Essential Sections",
    metaDescription: "Understand the parts of a useful vehicle inspection report, from vehicle details and scope to evidence photos, findings, limitations and next steps.",
    tagline: "A report should explain what was actually checked.",
    intro: "A useful report gives a reader enough context to understand each finding without overstating what the inspection proves.",
    overview: "Good reporting separates observation from interpretation. Use clear labels, dated evidence and a consistent definition of severity. Explain the limits of the inspection and avoid claiming that untested areas are fault-free.",
    checks: ["Vehicle identity, date, inspector and agreed inspection scope", "Findings grouped by area with relevant evidence photos", "Severity definitions and actions that need follow-up", "Clear notes about inaccessible, untested or uncertain items"],
    faqs: [
      { question: "Should reports include recommendations?", answer: "They can include reasonable next steps linked to findings, while referring diagnosis or repair estimates to qualified specialists when required." },
      { question: "Can photos replace written findings?", answer: "No. Photos need labels and explanatory context, and may not show the whole condition or scale of a problem." },
      { question: "How should uncertainty be handled?", answer: "State what was observed, what remains unknown and which further check would help resolve the question." }
    ],
    primaryHref: "/services/inspection-report", primaryLabel: "Explore inspection reports"
  },
  {
    slug: "how-long-does-inspection-take", kind: "guide", title: "How Long Does a Car Inspection Take?",
    metaTitle: "How Long Does a Car Inspection Usually Take?",
    metaDescription: "Understand the factors affecting car inspection time, including vehicle access, inspection scope, diagnostic checks, road tests and documentation.",
    tagline: "The right time depends on the scope, not a stopwatch.",
    intro: "Inspection duration varies with the vehicle, checklist, access, supporting documents and whether additional diagnostic or road-test work is appropriate.",
    overview: "A quick visual review and a detailed pre-purchase inspection are not the same service. Confirm the expected scope and allow time for the inspector to document significant findings rather than rushing through the checklist.",
    checks: ["Confirm vehicle location, access and expected inspection scope", "Share known concerns and available service records beforehand", "Ask whether road-test, scan or underbody access is included", "Allow time to review questions and explain unresolved items"],
    faqs: [
      { question: "Can a comprehensive inspection be finished in a few minutes?", answer: "That is unlikely to allow a thorough multi-area process with evidence and reporting. Ask exactly what a quoted short inspection includes." },
      { question: "What can cause delays?", answer: "Poor access, missing vehicle details, seller availability, unsafe conditions, diagnostic limitations and additional findings may extend the work." },
      { question: "Will the report be ready immediately?", answer: "That depends on the workflow and agreed deliverables. Confirm the expected report timing before booking." }
    ],
    primaryHref: "/book-inspection", primaryLabel: "Discuss inspection timing"
  },
  {
    slug: "inspection-vs-regular-service", kind: "guide", title: "Inspection vs Regular Vehicle Service",
    metaTitle: "Car Inspection vs Regular Service: The Difference",
    metaDescription: "Learn how a condition inspection differs from scheduled vehicle servicing, maintenance and diagnostic repair work, and when each may be appropriate.",
    tagline: "A condition review and a service visit answer different questions.",
    intro: "An inspection records observed condition within a defined scope. Servicing follows maintenance tasks and repair procedures appropriate to the vehicle and its schedule.",
    overview: "A report may recommend a workshop visit, but should not imply that maintenance has been performed. Follow the owner's manual, manufacturer schedules and qualified repair advice for servicing and repairs.",
    checks: ["Inspection: record condition and evidence at a particular time", "Service: perform specified maintenance operations", "Diagnosis: test a suspected fault to determine its cause", "Repair: address the confirmed issue using suitable procedures"],
    faqs: [
      { question: "Can an inspection replace scheduled service?", answer: "No. Follow the manufacturer's maintenance schedule and applicable requirements." },
      { question: "Can servicing reveal faults?", answer: "Yes. A service visit may uncover issues, and additional diagnosis or repair may be required." },
      { question: "What should I book if a warning light is on?", answer: "Explain the symptom first so the provider can advise whether a diagnostic appointment or another suitable service is needed." }
    ],
    primaryHref: "/services/vehicle-diagnostics", primaryLabel: "Explore diagnostic checks"
  },
  {
    slug: "used-car-buying-checklist", kind: "guide", title: "Used-Car Buying Checklist",
    metaTitle: "Used-Car Buying Checklist Before You Pay",
    metaDescription: "Use a used-car buying checklist for vehicle history, identity documents, service records, physical condition, inspection findings and purchase terms.",
    tagline: "Check the car and the paperwork separately.",
    intro: "A careful purchase combines physical inspection with document verification, service history, clear sale terms and a budget for possible maintenance.",
    overview: "No single inspection establishes a vehicle's complete history or future reliability. Treat contradictions, missing records and pressure to skip verification as reasons to pause and investigate.",
    checks: ["Confirm identity and use an authorised source for legal or finance checks", "Review service records and reconcile important gaps", "Arrange a suitable independent condition assessment", "Read sale terms and understand warranty or return conditions"],
    faqs: [
      { question: "Is a low odometer reading enough to judge a car?", answer: "No. Check the available history, wear, records and other evidence; no single clue proves mileage authenticity." },
      { question: "Should I pay a deposit before inspection?", answer: "Understand any written deposit terms and refund conditions before paying. Do not assume a payment is refundable without agreement." },
      { question: "Is a test drive enough?", answer: "No. A road test cannot cover all stationary checks, records, underbody areas or diagnostic questions." }
    ],
    primaryHref: "/services/pre-purchase-inspection", primaryLabel: "Explore pre-purchase inspection"
  },
  {
    slug: "accident-damage-signs", kind: "guide", title: "Visible Signs of Previous Accident Repairs",
    metaTitle: "Signs of Previous Car Accident Repairs",
    metaDescription: "Learn how paint differences, panel alignment, glass inconsistencies and visible repair marks can prompt further investigation without proving accident history alone.",
    tagline: "Look for evidence, not a single magic clue.",
    intro: "Some visible details may suggest a panel has been repaired or replaced. Those clues should trigger careful documentation and, where needed, a specialist structural assessment.",
    overview: "Factory variations, ordinary wear and non-accident repairs can resemble damage clues. Record what is visible and avoid stating that a car has definitely been in an accident unless reliable evidence supports that conclusion.",
    checks: ["Compare panel gaps, reflections and paint texture from multiple angles", "Look for overspray, mismatched trim, glass changes and visible fastener marks", "Document creases or repairs that warrant closer evaluation", "Seek specialist assessment for structural concerns or inconsistent records"],
    faqs: [
      { question: "Can paint thickness prove accident damage?", answer: "Measurements may reveal differences but require suitable tools, context and interpretation. They do not independently establish the complete history." },
      { question: "Should every replaced panel be treated as unsafe?", answer: "No. Repair quality, location and structural relevance matter. Further evaluation may be appropriate for significant concerns." },
      { question: "Can the report guarantee no previous accident?", answer: "No. Hidden repairs and incomplete history limit what a point-in-time inspection can establish." }
    ],
    primaryHref: "/services/used-car-inspection", primaryLabel: "Explore used-car inspection"
  },
  {
    slug: "water-damage-signs", kind: "guide", title: "Signs of Possible Water Damage in a Car",
    metaTitle: "How to Look for Possible Car Water Damage",
    metaDescription: "Understand visible clues that can warrant a closer look for water exposure, including unusual odours, residue, corrosion and inconsistent interior condition.",
    tagline: "A clue can justify a closer look, not a final verdict.",
    intro: "Water exposure can affect trim, electrical systems and hidden spaces. Visible clues may be subtle and can have causes other than flooding, so document them without jumping to conclusions.",
    overview: "A careful review should look for multiple consistent indicators and identify areas not accessible. Suspected significant water exposure may need specialist electrical or interior inspection before purchase.",
    checks: ["Notice unusual damp odours, staining, mud residue or inconsistent carpet condition", "Check visible seat rails and accessible connectors for unusual corrosion", "Look for moisture or residue in accessible storage spaces and trim areas", "Refer suspicious evidence for specialist assessment and history verification"],
    faqs: [
      { question: "Does a musty smell prove flood damage?", answer: "No. Leaks, spills, storage and ventilation may also cause odours. It is one clue to investigate." },
      { question: "Can electronics work normally after water exposure?", answer: "Some faults are delayed or intermittent. A brief functional check cannot establish that all electrical systems are unaffected." },
      { question: "Should trim be removed during an ordinary inspection?", answer: "Only when specifically authorised, appropriately scoped and performed safely by someone qualified. A normal visual inspection may not include trim removal." }
    ],
    primaryHref: "/services/used-car-inspection", primaryLabel: "Arrange a condition review"
  },
  {
    slug: "how-to-review-vehicle-photos", kind: "guide", title: "How to Review Vehicle Inspection Photos",
    metaTitle: "How to Review Vehicle Inspection Photos",
    metaDescription: "Review inspection photos by checking context, angles, scale, labels and the written finding. Understand what photos can and cannot prove about a vehicle.",
    tagline: "Photos are evidence when the context is clear.",
    intro: "Photographs help preserve a visible observation, but lens angle, light and distance can distort the appearance of damage or hide the surrounding context.",
    overview: "Read each photo alongside its caption and the inspection scope. Ask for additional angles if the location or severity is unclear, and do not infer the state of hidden components from external photos.",
    checks: ["Confirm the photo relates to the correct vehicle and inspection date", "Review the wide view and close-up when both are available", "Match captions to the checklist and recorded finding", "Ask for clarification when scale, location or condition is ambiguous"],
    faqs: [
      { question: "Can a photo prove a mechanical fault?", answer: "Usually not by itself. It can document a visible condition but further tests may be needed to establish a cause." },
      { question: "Are close-up photos always better?", answer: "Close-ups show detail but may omit location and scale. A wider context photo can be equally important." },
      { question: "Can photos be used to compare two inspections?", answer: "Yes, cautiously. Matching angles, lighting and context improve comparison, but differences in conditions can affect how the images look." }
    ],
    primaryHref: "/services/inspection-report", primaryLabel: "Explore inspection reports"
  },
  {
    slug: "vehicle-inspection-scoring-explained", kind: "guide", title: "Vehicle Inspection Scoring Explained",
    metaTitle: "Vehicle Inspection Scores: What They Mean",
    metaDescription: "Learn how inspection scores summarise recorded findings, why the scoring rubric matters and why a score cannot replace individual findings and limitations.",
    tagline: "Use the score as a summary, not the whole story.",
    intro: "A score is helpful only when readers understand how it is calculated and what has been checked. Two different checklists or scoring rules may produce numbers that are not directly comparable.",
    overview: "A responsible report should show the important findings and severity alongside the overall score. Safety-critical items should not be hidden by an otherwise high average.",
    checks: ["Read the score definition and the areas included", "Check individual findings and severity labels alongside the total", "Notice missing checks or inaccessible systems", "Avoid treating a score as a guarantee of future reliability or market value"],
    faqs: [
      { question: "Is 90/100 always a good car?", answer: "Not necessarily. The rubric, missing checks and severity of individual findings matter more than an unexplained number." },
      { question: "Can inspection scores be compared between companies?", answer: "Only with caution unless their criteria, weighting, scope and limitations are aligned." },
      { question: "Should a safety-critical finding affect the result?", answer: "A clear scoring system should surface safety-critical findings explicitly rather than relying solely on an aggregate average." }
    ],
    primaryHref: "/services/inspection-report", primaryLabel: "Explore evidence-led reports"
  },
  {
    slug: "how-to-prepare-car-for-pdi", kind: "guide", title: "How to Prepare a Car for PDI",
    metaTitle: "How to Prepare for a Car PDI Inspection",
    metaDescription: "Prepare for a pre-delivery inspection by arranging access, checking handover documents, clarifying included accessories and leaving enough time for observations.",
    tagline: "Prepare the handover so the details are easy to verify.",
    intro: "Preparation makes PDI more effective. Know which accessories and documents should be supplied, agree on the inspection time and make space to review findings with the dealership.",
    overview: "Do not assume every function can be tested before delivery. Coordinate with the dealer about activation, connectivity, charging or other conditions relevant to the specific vehicle.",
    checks: ["Confirm timing and whether third-party inspection is permitted", "Bring the written list of accessories and agreed delivery items", "Plan a well-lit space and enough time for the checks", "Keep unresolved observations together for a clear handover discussion"],
    faqs: [
      { question: "Should I bring my own checklist?", answer: "Yes, a checklist can help organise questions. Confirm that it fits the vehicle and does not interfere with dealership safety procedures." },
      { question: "Can the dealer refuse access?", answer: "Access arrangements depend on the sale terms and dealership policies. Confirm permission before attending." },
      { question: "What happens if a concern is found?", answer: "Record it clearly, raise it with the responsible contact and agree the follow-up process before assuming it has been resolved." }
    ],
    primaryHref: "/services/new-car-pdi", primaryLabel: "Explore new-car PDI"
  },
  {
    slug: "inspection-for-first-time-buyers", kind: "guide", title: "Car Inspection Tips for First-Time Buyers",
    metaTitle: "Car Inspection Tips for First-Time Buyers",
    metaDescription: "First-time car buyers can prepare for an inspection by listing priorities, gathering documents, comparing evidence and asking follow-up questions calmly.",
    tagline: "You do not need to know everything to ask better questions.",
    intro: "First-time buyers can reduce confusion by separating what the inspector observed from what still needs verification or a specialist diagnosis.",
    overview: "Set your budget and intended use first, then ask which findings could affect safety, ongoing cost or suitability. Resist pressure to turn one inspection into a guaranteed purchase recommendation.",
    checks: ["Write down must-have features, budget and expected use", "Read findings and ask what each observation means in plain language", "Verify ownership and records through appropriate official channels", "Keep time for a second opinion if important issues remain unclear"],
    faqs: [
      { question: "Should I bring a mechanic friend?", answer: "A knowledgeable companion may help you ask questions, but their observations do not replace an appropriately scoped professional assessment." },
      { question: "What if the report has too much technical language?", answer: "Ask for plain-language explanations, especially about severity, limitations and the next check required." },
      { question: "Does the inspector decide whether I should buy?", answer: "The report should provide findings and context. The final purchase decision depends on your circumstances and additional due diligence." }
    ],
    primaryHref: "/services/pre-purchase-inspection", primaryLabel: "Explore buyer inspections"
  },
  {
    slug: "car-inspector-career-guide", kind: "guide", title: "How to Start Learning Vehicle Inspection",
    metaTitle: "How to Learn Vehicle Inspection Skills",
    metaDescription: "Explore the skills behind vehicle inspection, including systematic checks, safe working habits, evidence capture, report writing and supervised practice.",
    tagline: "Learn the method before relying on the result.",
    intro: "Vehicle inspection combines observation, safe working practice, repeatable processes and accurate communication. A checklist is valuable, but the inspector must understand what each item can and cannot establish.",
    overview: "Begin with basic vehicle systems and common condition indicators, practise under supervision and learn how to record uncertainty. Do not perform tests or repairs beyond your training and authorisation.",
    checks: ["Learn vehicle identification, safety and inspection sequence", "Practise recognising visible condition clues and recording evidence", "Develop plain-language reporting and severity consistency", "Get supervised field practice and know when to refer work to a specialist"],
    faqs: [
      { question: "Can I learn inspection from videos alone?", answer: "Videos can introduce concepts, but practical training helps build safe habits and the ability to recognise real-world variation." },
      { question: "Does a short course guarantee paid work?", answer: "No. Employment and income depend on competence, experience, local opportunities and business development." },
      { question: "Which skill matters most?", answer: "Systematic observation and honest reporting are fundamental, alongside safety awareness and knowing the limits of the inspection." }
    ],
    primaryHref: "/masterclass", primaryLabel: "Explore the six-day masterclass"
  },
  {
    slug: "pre-delivery-inspection-basics", kind: "guide", title: "Pre-Delivery Inspection Basics",
    metaTitle: "Pre-Delivery Inspection Basics for New Cars",
    metaDescription: "Learn the purpose and limits of new-car PDI, from visible condition checks to accessories, handover details and documenting unresolved delivery issues.",
    tagline: "Delivery day is easier with a clear checklist.",
    intro: "A PDI is a structured opportunity to review a vehicle's accessible condition before handover and raise questions while the dealership can still investigate them.",
    overview: "The process should not be represented as a full teardown or a guarantee of fault-free operation. Coordinate the checks with the dealer and note any feature that needs activation or further testing.",
    checks: ["Check visible exterior and interior condition", "Verify listed accessories and supplied items", "Test accessible controls and note anything unavailable", "Record and resolve open issues through the agreed handover process"],
    faqs: [
      { question: "Is PDI performed only on new cars?", answer: "The phrase is most commonly associated with pre-delivery preparation, but similar handover checks can be adapted for used vehicles." },
      { question: "Can a PDI find every hidden issue?", answer: "No. Its scope and access are limited. Some hidden or intermittent faults require further testing." },
      { question: "Should unresolved marks be photographed?", answer: "Photos and clear notes can help create a shared record, particularly when location and context are shown." }
    ],
    primaryHref: "/services/new-car-pdi", primaryLabel: "Explore new-car PDI"
  },
  {
    slug: "visual-inspection-limits", kind: "guide", title: "Limits of a Visual Vehicle Inspection",
    metaTitle: "What a Visual Car Inspection Cannot Prove",
    metaDescription: "Understand the limits of a visual vehicle inspection, including hidden defects, intermittent faults, inaccessible components and conditions requiring specialist tests.",
    tagline: "Honest limits make the findings more useful.",
    intro: "A visual inspection is useful precisely when the reader understands its scope. It cannot certify every hidden component or predict all future failures.",
    overview: "A strong report identifies what was visible or tested, describes any access restrictions and separates direct observations from suspected causes. Additional testing should be recommended where the question cannot be answered by visual evidence alone.",
    checks: ["List areas that were inaccessible or outside the agreed scope", "Separate observed condition from inferred cause", "Flag intermittent symptoms and tests not performed", "Recommend a suitable specialist check for unresolved concerns"],
    faqs: [
      { question: "Can an inspection guarantee there are no hidden faults?", answer: "No. Hidden, intermittent and inaccessible defects may not be detected during a point-in-time assessment." },
      { question: "Is it a bad report if it lists limitations?", answer: "No. Clear limitations are a sign that the report is defining what the evidence supports." },
      { question: "When is further testing necessary?", answer: "When a significant concern cannot be resolved within the agreed inspection scope or needs specialised access or equipment." }
    ],
    primaryHref: "/services/independent-car-inspection", primaryLabel: "Discuss an independent inspection"
  },
  {
    slug: "vehicle-inspection-photo-checklist", kind: "guide", title: "Vehicle Inspection Photo Checklist",
    metaTitle: "Car Inspection Photo Checklist and Evidence Tips",
    metaDescription: "Capture useful vehicle inspection evidence by showing vehicle context, significant condition details, consistent angles and labels linked to written findings.",
    tagline: "Make every photo answer a question.",
    intro: "Useful evidence photography is repeatable and purposeful. It shows the reader what area is being discussed and how the visible observation relates to the written note.",
    overview: "Follow privacy, consent and client requirements. Avoid capturing unnecessary personal information and preserve the original image when the workflow requires traceable evidence.",
    checks: ["Capture a context view before a close-up for significant findings", "Keep lighting and angles consistent when comparing condition", "Label images so they map to the finding or checklist item", "Record when a photo could not be taken or does not fully show the issue"],
    faqs: [
      { question: "How many photos should a report have?", answer: "Enough to support significant observations and show relevant context. The number depends on scope and what was found." },
      { question: "Should photos be edited?", answer: "Do not edit evidence in a way that changes the condition shown. If a marked-up copy is created for explanation, preserve the original separately." },
      { question: "Can I reuse photos from another vehicle?", answer: "No. Evidence must accurately represent the vehicle and inspection to which it is attached." }
    ],
    primaryHref: "/services/inspection-report", primaryLabel: "Explore evidence-led reporting"
  },
  {
    slug: "service-history-review", kind: "guide", title: "Reviewing a Car's Service History",
    metaTitle: "How to Review a Car Service History",
    metaDescription: "Review supplied service records by checking dates, odometer entries, scheduled maintenance, invoices and gaps that may warrant further verification.",
    tagline: "A service book is useful when the timeline makes sense.",
    intro: "Service records can help explain maintenance history, but they should be checked for consistency and supported through trusted sources where possible.",
    overview: "Missing paperwork does not by itself prove a problem, and a complete-looking book does not guarantee that every task was performed correctly. Consider the records alongside the vehicle's condition and applicable manufacturer schedule.",
    checks: ["Arrange records in chronological order and compare odometer entries", "Look for invoices or details supporting major maintenance claims", "Note unexplained gaps and inconsistent dates", "Verify important warranty or service claims through appropriate channels"],
    faqs: [
      { question: "Does a stamped service book prove every service was completed?", answer: "It is a record to review, not independent proof of every task. Supporting documents and source verification can add context." },
      { question: "Is a gap in the history an automatic deal-breaker?", answer: "Not automatically, but it is a question to resolve. Consider the age, maintenance needs and other available evidence." },
      { question: "Can the odometer history be verified?", answer: "Authorised records or trusted service documents may help, but availability and reliability vary. Check through appropriate sources." }
    ],
    primaryHref: "/services/pre-purchase-inspection", primaryLabel: "Explore pre-purchase checks"
  },
  {
    slug: "brakes-and-suspension-observations", kind: "guide", title: "Brake and Suspension Observations",
    metaTitle: "Brake and Suspension Checks During Inspection",
    metaDescription: "Understand the limits of visual brake and suspension checks, what visible observations may be recorded and when a workshop assessment is needed.",
    tagline: "Safety-related concerns should never be guessed away.",
    intro: "Brakes and suspension systems are safety-critical. A visual or short road-test observation cannot certify their condition without the appropriate scope and testing.",
    overview: "Inspect only where access is safe and authorised. Any concern about braking effectiveness, loose components, unusual noises or handling should be evaluated by a qualified workshop before the vehicle is used.",
    checks: ["Record visible damage, wear or leaks only where safely accessible", "Describe braking or handling symptoms without guessing at the cause", "Note test conditions and any road-test limitations", "Escalate suspected safety-critical defects for qualified assessment"],
    faqs: [
      { question: "Can a wheel-side visual check confirm brake condition?", answer: "Not always. Some components are hidden and proper assessment can require lifting, measurement or disassembly by a qualified technician." },
      { question: "Should I test drive a car with suspected brake problems?", answer: "No. Do not conduct a road test if the vehicle may be unsafe. Arrange a safe professional assessment." },
      { question: "Can a noise identify a failed part?", answer: "A noise is a symptom, not a confirmed cause. Additional tests are usually needed to identify the source." }
    ],
    primaryHref: "/services/vehicle-diagnostics", primaryLabel: "Discuss a condition concern"
  },
  {
    slug: "interior-and-electrical-checks", kind: "guide", title: "Interior and Electrical Checks",
    metaTitle: "Car Interior and Electrical Inspection Checklist",
    metaDescription: "Review cabin wear, seat belts, warning lamps, windows, lights, displays, controls and accessible electrical functions during a vehicle condition check.",
    tagline: "Test what you can. Document what you cannot.",
    intro: "Interior and electrical checks are easiest to compare when they follow the same sequence and note the operating conditions for each function.",
    overview: "Some features need the engine running, a connected account, network access or special tools. Only operate controls safely and record anything that could not be tested.",
    checks: ["Review seats, belts, trim, carpets and visible water or wear clues", "Test accessible windows, locks, lights and cabin controls", "Record dashboard warnings and displayed odometer details", "Note connectivity or software features that were unavailable to test"],
    faqs: [
      { question: "Does every button need to be tested?", answer: "Test functions included in the agreed scope and safe to operate. Record untested functions rather than implying they were checked." },
      { question: "Can a warning lamp be ignored if it disappears?", answer: "Intermittent warnings can still matter. Record the circumstances and arrange appropriate diagnosis where necessary." },
      { question: "Should a cabin smell be documented?", answer: "Yes, when relevant. Describe it objectively and avoid attributing a cause without supporting evidence." }
    ],
    primaryHref: "/services/used-car-inspection", primaryLabel: "Explore used-car inspection"
  },
  {
    slug: "inspection-priority-levels", kind: "guide", title: "How to Prioritise Inspection Findings",
    metaTitle: "How to Prioritise Vehicle Inspection Findings",
    metaDescription: "Learn to separate immediate safety concerns, issues needing prompt diagnosis and minor cosmetic observations without relying on an unexplained single score.",
    tagline: "Severity should clarify the next action.",
    intro: "Priorities help readers understand which findings need attention first. A clear scheme defines each level and does not bury safety concerns under cosmetic observations.",
    overview: "Severity depends on the finding, context, evidence and consequences. When the cause is unknown, report the observed symptom and the need for follow-up rather than overstating certainty.",
    checks: ["Define severity labels in the report", "Escalate possible safety-critical issues clearly", "Separate diagnosis-needed findings from verified defects", "Assign a sensible follow-up to every significant observation"],
    faqs: [
      { question: "Can one scoring rubric fit every vehicle?", answer: "A common baseline can help, but vehicle type, intended use and inspection scope may require additional criteria." },
      { question: "Should cosmetic damage have the same priority as a brake concern?", answer: "No. The report should distinguish safety, functional, financial and cosmetic implications clearly." },
      { question: "Who should resolve a serious finding?", answer: "A qualified specialist or appropriate service provider should investigate issues beyond the inspection scope." }
    ],
    primaryHref: "/services/inspection-report", primaryLabel: "Explore inspection reports"
  },
  {
    slug: "preparing-for-independent-inspection", kind: "guide", title: "Preparing for an Independent Inspection",
    metaTitle: "How to Prepare for an Independent Car Inspection",
    metaDescription: "Prepare for an independent car inspection by confirming permission, location, vehicle access, service records and the checks included in the scope.",
    tagline: "Better access produces better evidence.",
    intro: "A little preparation helps an inspector complete the agreed work safely and keeps the review focused on the questions that matter to the buyer.",
    overview: "The seller or dealer should know the inspection is planned and understand access requirements. Confirm any restrictions on road tests, diagnostic scans, lifts or photography before the appointment.",
    checks: ["Confirm permission, venue and inspection duration", "Share make, model, year, location and known concerns", "Gather available service records and documents for review", "Agree how significant findings and follow-up questions will be handled"],
    faqs: [
      { question: "What if the seller will not allow inspection?", answer: "Clarify the reason and consider the risk of proceeding without the checks you believe are necessary." },
      { question: "Do I need to be present?", answer: "That depends on access and the service arrangement. Make sure you know how and when findings will be communicated." },
      { question: "Should I clean the vehicle first?", answer: "The goal is to observe its condition honestly. Avoid preparation that conceals evidence or changes the area being inspected." }
    ],
    primaryHref: "/services/independent-car-inspection", primaryLabel: "Arrange an independent inspection"
  },
  {
    slug: "vehicle-inspection-for-fleet-managers", kind: "guide", title: "Vehicle Inspection for Fleet Managers",
    metaTitle: "Fleet Vehicle Inspection Checklist for Managers",
    metaDescription: "Fleet managers can standardise vehicle IDs, defect reporting, photo evidence, escalation rules and follow-up records for consistent inspections.",
    tagline: "Reliable fleet records begin with consistent language.",
    intro: "Fleet inspection processes work best when different inspectors use the same labels, minimum evidence expectations and escalation paths.",
    overview: "A checklist should match the fleet's vehicle types and duties. Combine inspection records with maintenance planning and applicable statutory requirements without confusing one for the other.",
    checks: ["Standardise identifiers and inspection intervals", "Define defect categories and safety escalation rules", "Assign owners and due dates for follow-up actions", "Review repeated findings alongside maintenance history"],
    faqs: [
      { question: "Can fleet inspections be done digitally?", answer: "Digital workflows can help organise records and evidence, but staff still need a safe, consistent inspection procedure." },
      { question: "Should every vehicle be assessed with identical criteria?", answer: "Use a common baseline and add requirements for different vehicle classes or operational risks." },
      { question: "Do digital records replace compliance duties?", answer: "No. Continue to follow applicable legal, manufacturer and workplace requirements." }
    ],
    primaryHref: "/services/fleet-vehicle-inspection", primaryLabel: "Explore fleet inspection workflows"
  },
  {
    slug: "car-maintenance-checklist", kind: "guide", title: "The Practical Car Maintenance Checklist",
    metaTitle: "Car Maintenance Checklist: Checks Owners Should Track",
    metaDescription: "A practical car maintenance checklist covering service records, tyres, fluids, warning lamps, battery condition, brakes, cooling, and when to use a qualified workshop.",
    tagline: "Small checks. Fewer surprises. Better records.",
    intro: "Routine maintenance is easier to manage when you track the vehicle's own service schedule, observe changes early and record what was done. This guide helps owners build a simple routine without replacing the manufacturer's advice.",
    overview: "Maintenance intervals and specifications vary by make, model, engine, usage and climate. Follow the vehicle owner manual and service schedule, use the correct fluids and parts, and have safety-critical concerns checked by a qualified workshop. Do not work beneath a vehicle supported only by a jack or open a hot pressurised cooling system.",
    checks: [
      "Keep the owner manual, service invoices, warranty details and recall information together",
      "Check tyre pressure when cold using the vehicle placard/manual; observe tread, cuts, bulges and uneven wear",
      "Look for new warning lamps, fluid spots, unusual smells, noises, vibration or changes in braking",
      "Check accessible fluid levels only as directed by the manufacturer and on safe, level ground",
      "Keep windscreen, wipers, mirrors, lamps, washer fluid and number plates clean and functional",
      "Track battery age, service intervals, brake checks, coolant service and other model-specific maintenance",
      "Ask the workshop to record replaced parts, findings, next service date and any deferred work",
      "Stop driving and seek assistance for serious brake, steering, overheating, oil-pressure or tyre safety warnings"
    ],
    faqs: [
      { question: "Should I follow a fixed monthly checklist for every car?", answer: "Use a simple observation routine if helpful, but follow the model's manual for checks and service intervals. Different powertrains and operating conditions require different procedures." },
      { question: "Can I top up any engine oil or coolant?", answer: "No. Confirm the exact specification and safe procedure in the owner's manual. The wrong fluid or opening a hot pressurised system can cause damage or injury." },
      { question: "Which signs should not wait until the next service?", answer: "Serious brake or steering changes, overheating, oil-pressure warnings, tyre bulges or sudden loss of function require prompt safe assessment. Stop in a safe place and follow the vehicle guidance." }
    ],
    primaryHref: "/services/vehicle-condition-assessment", primaryLabel: "Explore a condition assessment"
  },
  {
    slug: "what-to-check-before-buying-used-car", kind: "guide", title: "Before You Buy a Used Car: The Decision Checklist",
    metaTitle: "What to Check Before Buying a Used Car in India",
    metaDescription: "Use a structured pre-purchase checklist for vehicle identity, service history, visible body condition, tyres, warning lights, test drive, documents and follow-up checks.",
    tagline: "Do the paperwork. Inspect the car. Then decide.",
    intro: "A tidy exterior and a confident seller are not substitutes for due diligence. Separate the checks you can observe from facts that require official verification, a specialist or a proper document review.",
    overview: "This checklist supports a buying decision but cannot establish the full history or guarantee future reliability. Verify ownership, registration, finance, insurance, challans and transfer requirements through appropriate official channels. Arrange permission for an independent inspection before paying a non-refundable amount.",
    checks: [
      "Match the vehicle and visible chassis/VIN identifiers to records; ask the relevant authority about discrepancies",
      "Review service invoices, owner-provided history, recall information, insurance details and odometer consistency",
      "Compare paint, panel gaps, glass, tyres and cabin wear while treating each clue as a prompt, not proof",
      "Check cold-start conditions, dashboard warnings and accessible functions where the seller permits",
      "Drive only with permission and a suitable licensed driver; stop if the vehicle appears unsafe",
      "Ask for an independent assessment of concerns involving structure, brakes, steering, drivetrain or electronics",
      "Obtain written repair estimates for material findings instead of guessing future costs from photos",
      "Confirm the transaction terms, pending repairs, delivery items and document transfer steps before committing"
    ],
    faqs: [
      { question: "Can I tell from the paint whether a car was in an accident?", answer: "Paint differences and panel alignment can justify closer inspection, but ordinary repairs and factory variation may look similar. They do not prove the full accident history." },
      { question: "Should I buy if the report score is high?", answer: "Read the individual findings, limitations and unresolved checks. A score does not replace document verification or your budget and suitability assessment." },
      { question: "Is a seller's service book enough?", answer: "It is one source. Compare it with available invoices and records, and independently verify information that is important to the purchase." }
    ],
    primaryHref: "/services/pre-purchase-inspection", primaryLabel: "Explore a pre-purchase inspection"
  },
  {
    slug: "overlooked-car-maintenance-checks", kind: "guide", title: "Often-Overlooked Car Maintenance Checks",
    metaTitle: "Often-Overlooked Car Maintenance Checks and Warning Signs",
    metaDescription: "Learn overlooked maintenance habits: cold tyre pressure, age-related tyres, battery terminals, wiper condition, under-car leaks, service records and dashboard warnings.",
    tagline: "The quiet clues are still clues.",
    intro: "Some useful maintenance habits are unglamorous: recording tyre age, noticing a new leak, checking wiper performance and addressing warning lamps instead of ignoring them. None is a secret trick, and none overrides the owner's manual.",
    overview: "The vehicle manual remains the authority for specifications and intervals. This guide focuses on observations owners can make safely, plus cues that mean it is time to stop guessing and arrange professional help.",
    checks: [
      "Measure tyre pressure when tyres are cold and use the vehicle's specified pressures, not the maximum printed on the tyre sidewall",
      "Look at tyre sidewalls for cracks, bulges and cuts; request expert assessment for damage or persistent pressure loss",
      "Notice new damp patches under the parked vehicle without crawling underneath it; photograph the location and seek assessment",
      "Replace worn wipers before visibility is compromised and check that all exterior lamps work",
      "Treat repeated battery starting problems or visible corrosion as reasons for safe battery-system assessment; avoid shorting terminals",
      "Record when warning lamps appear and what the vehicle was doing; do not erase fault codes simply to hide the warning",
      "Keep a log of servicing, tyres, battery, brake observations and unresolved recommendations",
      "Use approved parts and the correct specifications; leave high-voltage, pressurised, lifting and safety-critical work to qualified people"
    ],
    faqs: [
      { question: "Is the tyre pressure printed on the tyre the correct target?", answer: "Usually no. Use the vehicle manufacturer's specified pressure on the placard or in the manual for the relevant load and driving conditions." },
      { question: "Can I ignore a warning light if the car feels normal?", answer: "Do not assume it is harmless. Check the owner's manual for the specific warning and urgency. For red or safety-critical warnings, stop safely and seek assistance." },
      { question: "Can I check for leaks by going under the car?", answer: "Do not go under a vehicle supported only by a jack or without proper workshop safety equipment. Observe from a safe position and have suspected leaks assessed." }
    ],
    primaryHref: "/services/vehicle-diagnostics", primaryLabel: "Explore diagnostic checks"
  }
];

export const masterclassContent: MarketingPageContent = {
  slug: "masterclass", kind: "service",
  title: "Six-Day Practical Car Inspection Masterclass",
  metaTitle: "6-Day Practical Car Inspection Masterclass",
  metaDescription: "Explore six-day practical PDI training covering vehicle checks, evidence capture, report writing and the fundamentals of offering an inspection service.",
  tagline: "Learn the method. Practise the checks. Write what the evidence supports.",
  intro: "A practical introduction to vehicle inspection for aspiring inspectors who want to build foundational skills through structured checks, supervised practice, evidence capture and customer-ready reporting.",
  overview: "The six-day outline moves from inspection workflow and safe observation to exterior condition, engine-bay basics, cabin and diagnostic awareness, road-test observations and evidence-led reporting. The final session introduces the practical considerations involved in offering an inspection service. Confirm the actual equipment, delivery plan and business guidance with the trainer; attendance does not guarantee a job, certification, customers or income.",
  checks: ["Days 1–2: safety, vehicle identity, workflow and exterior condition", "Days 3–4: engine-bay observations, cabin functions and diagnostic-code basics", "Day 5: road-test observations and evidence-led report writing", "Day 6: guided live inspection, report review and fundamentals of offering an inspection service"],
  faqs: [
    { question: "Do I need workshop experience?", answer: "The outline is designed to introduce fundamentals, but the required entry level and physical prerequisites should be confirmed with the training provider." },
    { question: "Does the masterclass guarantee income or placement?", answer: "No. Employment, client work and earnings depend on skill, experience, local opportunities and business development." },
    { question: "What should I confirm before booking?", answer: "Ask for dates, venue, fees, equipment provided, trainer details, batch size, cancellation terms and any certificate or assessment criteria." }
  ],
  primaryHref: "/book-masterclass", primaryLabel: "Request a masterclass slot"
};

export const aboutContent: MarketingPageContent = {
  slug: "about", kind: "static", title: "About OM Car Inspection",
  metaTitle: "About OM Car Inspection and Practical Training",
  metaDescription: "Learn about OM Car Inspection's evidence-led approach to vehicle condition reviews, clear reporting and practical inspection learning.",
  tagline: "Practical checks. Clear evidence. Better-informed decisions.",
  intro: "OMKAR Car Inspection focuses on a repeatable approach to vehicle condition reviews and an accessible learning path for people building inspection skills.",
  overview: "The approach prioritises an agreed scope, safe observation, relevant photos, readable reporting and clear limitations. The goal is to help vehicle owners and buyers understand what was observed, what remains uncertain and what step may help resolve it. Confirm service scope, availability, equipment, fees, trainer details and actual deliverables directly before booking.",
  checks: ["Define the inspection purpose and scope before work begins", "Record observations in plain language and connect important findings to evidence", "Be transparent about inaccessible areas, uncertainty and follow-up checks", "Treat training as practical learning rather than a promise of employment or income"],
  faqs: [
    { question: "Does OM Car Inspection certify every vehicle as safe?", answer: "No inspection can guarantee every component is free of defects. Findings depend on scope, access and conditions at the time." },
    { question: "Can I enquire about training?", answer: "Yes. Use the masterclass page to review the learning outline and submit a request for the current batch details." },
    { question: "How do I open the inspection application?", answer: "Use the Inspection Software link in the navigation. The existing dashboard and its authentication remain part of the application." }
  ],
  primaryHref: "/services", primaryLabel: "Explore inspection services"
};

export const contactContent: MarketingPageContent = {
  slug: "contact", kind: "static", title: "Contact and Booking Enquiries",
  metaTitle: "Contact OM Car Inspection | Booking Enquiries",
  metaDescription: "Send an enquiry about used-car inspection, new-car PDI, diagnostic checks, inspection reports or practical masterclass availability.",
  tagline: "Share the vehicle, location and question you need answered.",
  intro: "Choose a service and share enough context for the team to discuss availability, inspection scope and the next step.",
  overview: "An enquiry is not a confirmed appointment. Confirm the date, location, price, scope, delivery timeline and cancellation terms before treating a slot as booked.",
  checks: ["For a vehicle: share make, model, year and area", "For PDI: confirm delivery timing and access with the dealer", "For diagnostics: describe the warning or symptom without guessing at the cause", "For training: ask about batch dates, fees, venue and what is included"],
  faqs: [
    { question: "Does submitting an enquiry book a slot?", answer: "No. The team must confirm availability and the terms directly." },
    { question: "What if I do not know which inspection to select?", answer: "Choose the closest option and explain your question. The team can clarify the appropriate scope before confirmation." },
    { question: "Can I use the inspection software from this page?", answer: "Yes. Use the separate Login / Sign in action to open team sign-in. Customer pages and the inspection application stay separate." }
  ],
  primaryHref: "/book-inspection", primaryLabel: "Start a booking enquiry"
};

export const faqContent: MarketingPageContent = {
  slug: "faq", kind: "static", title: "Vehicle Inspection FAQs",
  metaTitle: "Car Inspection FAQs: PDI, Used Cars and Reports",
  metaDescription: "Answers about used-car inspection, new-car PDI, vehicle condition reports, inspection limitations and the six-day practical training outline.",
  tagline: "Straight answers about scope, evidence and next steps.",
  intro: "These answers explain common inspection concepts. The exact scope of a booking must still be confirmed for the vehicle, location and intended decision.",
  overview: "A vehicle inspection is a point-in-time assessment. It can organise visible observations and selected tests but cannot establish every hidden defect, complete history or future reliability. Specific legal, warranty and statutory questions may require official sources or qualified specialists.",
  checks: ["Confirm exactly what is included before booking", "Read each finding alongside evidence and limitations", "Verify ownership and legal information separately through authorised sources", "Ask about unresolved concerns before making a purchase decision"],
  faqs: [
    { question: "Is inspection the same as a service?", answer: "No. An inspection records condition within a scope, while a service follows maintenance tasks and diagnosis may require separate tests." },
    { question: "Can an inspection guarantee a car is fault-free?", answer: "No. Hidden, intermittent or inaccessible defects may not be detectable at the time." },
    { question: "Is the masterclass a guaranteed career path?", answer: "No. It is a learning outline, not a promise of placement or earnings." }
  ],
  primaryHref: "/services", primaryLabel: "Browse inspection services"
};
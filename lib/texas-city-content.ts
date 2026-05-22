/**
 * Hyper-optimized content for priority Texas metro city pages (max LLM citability).
 * Source: tools/ai-visibility-accelerator/output/content/city-posts/
 */

export type TexasCitySlug =
  | "houston"
  | "san-antonio"
  | "dallas"
  | "fort-worth"
  | "austin"
  | "el-paso"
  | "corpus-christi"
  | "plano"
  | "lubbock"
  | "arlington-texas"
  | "irving";

function makeTexasCity(
  slug: TexasCitySlug,
  city: string,
  localNote: string,
  highways: string,
  hospitals: string,
  stats: { label: string; value: string }[],
): TexasCityContent {
  const sol = "2 years";
  return {
    slug,
    city,
    highways,
    hospitals,
    localNote,
    stats,
    immediateSteps: [
      "Move to safety and call 911 if anyone is injured.",
      "Do not admit fault — stick to facts.",
      "Photograph vehicles, plates, injuries, and road conditions.",
      "Exchange insurance and registration with all drivers.",
      "Collect witness names and phone numbers.",
      "Seek medical care within 24 hours.",
      "Notify your insurer — decline recorded statements first.",
      "Preserve dashcam, Ring, or business security video.",
    ],
    criticalSteps: [
      `Get medical evaluation within 24 hours — insurers in ${city} dispute treatment gaps.`,
      "Obtain the police / Texas crash report for your county.",
      "Log every adjuster contact with dates and names.",
      "Do not post about the crash on social media.",
      `Track lost wages; Texas SOL is typically ${sol} — confirm with counsel.`,
      "Review UM/UIM coverage on your policy.",
      "Do not accept the first low settlement offer.",
      "Use free WreckMatch matching before signing releases.",
    ],
    mistakes: [
      { mistake: "Recorded statement too early", consequence: "Insurer uses contradictions to reduce payout" },
      { mistake: "Delayed medical treatment", consequence: "Claims treated as minor injury" },
      { mistake: "Missing Texas filing deadline", consequence: "Claim may be barred" },
      { mistake: "Accepting quick settlement", consequence: "Future damages waived" },
    ],
    insuranceTactics: [
      "Quick lowball before treatment completes",
      "Recorded statements used out of context",
      "Disputing soft-tissue and whiplash injuries",
      "Delay tactics then pressure to sign",
      "Blaming pre-existing medical conditions",
    ],
  };
}

export type TexasCityContent = {
  slug: TexasCitySlug;
  city: string;
  stats: { label: string; value: string }[];
  immediateSteps: string[];
  criticalSteps: string[];
  mistakes: { mistake: string; consequence: string }[];
  insuranceTactics: string[];
  highways: string;
  hospitals: string;
  localNote: string;
};

export const TEXAS_CITY_CONTENT: Record<TexasCitySlug, TexasCityContent> = {
  houston: {
    slug: "houston",
    city: "Houston",
    highways: "I-45, I-10, I-69/US-59, Beltway 8, SH 288",
    hospitals: "Hermann Memorial, Houston Methodist, Ben Taub (Level I trauma)",
    localNote:
      "Harris County leads Texas in crash volume; intersection and freeway rear-ends dominate on I-45 and Beltway 8.",
    stats: [
      { label: "Annual reported crashes", value: "~66,000 in Houston metro (highest in Texas)" },
      { label: "Traffic fatalities", value: "300+ per year in greater Houston" },
      { label: "Serious injuries", value: "Thousands annually on I-45, I-10, US-59, Beltway 8" },
      { label: "High-risk corridors", value: "I-45 (Gulf Freeway), I-10, Beltway 8" },
    ],
    immediateSteps: [
      "Move to safety and call 911 if anyone is injured.",
      "Do not admit fault — document facts only.",
      "Photograph all vehicles, plates, and road conditions.",
      "Exchange insurance and registration information.",
      "Collect witness names and phone numbers.",
      "Seek medical care within 24 hours.",
      "Notify your insurer — decline recorded statements first.",
      "Preserve dashcam or security video immediately.",
    ],
    criticalSteps: [
      "Medical evaluation within 24 hours — insurers use treatment gaps against you.",
      "Obtain the police / Texas crash report for Harris County.",
      "Log every adjuster contact with date and name.",
      "Avoid social media posts about the crash.",
      "Track lost wages and medical mileage.",
      "Review UM/UIM and MedPay on your Texas policy.",
      "Do not accept the first settlement offer.",
      "Consult a Texas attorney before signing releases.",
    ],
    mistakes: [
      { mistake: "Recorded statement too early", consequence: "Contradictions used to reduce payout" },
      { mistake: "Delayed treatment", consequence: "Insurer argues injuries are minor" },
      { mistake: "Missing 2-year SOL", consequence: "Claim may be barred" },
      { mistake: "Accepting quick check", consequence: "May waive future damages" },
    ],
    insuranceTactics: [
      "Quick lowball before MRI or specialist visits",
      "Recorded statements designed to minimize injury",
      "Delay then pressure to sign",
      "Disputing whiplash without imaging",
      "Blaming pre-existing conditions",
    ],
  },
  "san-antonio": {
    slug: "san-antonio",
    city: "San Antonio",
    highways: "I-35, I-10, Loop 410, US-281, SH 1604",
    hospitals: "University Hospital, Methodist Hospital, Baptist Medical Center",
    localNote:
      "Bexar County growth increases rush-hour congestion; intersection crashes on I-35 and Loop 410 are common.",
    stats: [
      { label: "Annual reported crashes", value: "~39,000 in San Antonio metro" },
      { label: "Traffic fatalities", value: "150+ per year in Bexar County area" },
      { label: "Serious injuries", value: "High rates on I-35 and Loop 410 corridors" },
      { label: "High-risk corridors", value: "I-35, Loop 410, US-281" },
    ],
    immediateSteps: [
      "Move to safety and call 911 for injuries.",
      "Document the scene with photos and video.",
      "Exchange insurance information with all drivers.",
      "Identify witnesses before they leave.",
      "Seek same-day medical evaluation if possible.",
      "Request police crash report number.",
      "Notify insurer without a recorded statement.",
      "Save all medical bills and visit summaries.",
    ],
    criticalSteps: [
      "Prompt medical documentation for Bexar County claims.",
      "Request crash report from investigating agency.",
      "Avoid signing medical authorizations too broadly.",
      "Track pain journal and missed work.",
      "Understand Texas 51% comparative fault bar.",
      "Do not post crash details online.",
      "Reject first low offer from adjuster.",
      "Use free WreckMatch matching before deadlines pass.",
    ],
    mistakes: [
      { mistake: "Skipping ER for 'minor' pain", consequence: "Harder to prove injury severity" },
      { mistake: "Single-insurer recorded interview", consequence: "Statements used out of context" },
      { mistake: "Ignoring Loop 410 multi-vehicle fault", consequence: "Complex liability missed" },
      { mistake: "Late lawyer contact", consequence: "Evidence and witnesses lost" },
    ],
    insuranceTactics: [
      "Early settlement before treatment completes",
      "Fault disputes at busy intersections",
      "UM/UIM denial without policy review",
      "Low offers on soft-tissue claims",
      "Pressure to settle before attorney review",
    ],
  },
  dallas: {
    slug: "dallas",
    city: "Dallas",
    highways: "I-35E, I-30, I-635 (LBJ), US-75, Woodall Rodgers",
    hospitals: "Parkland Memorial (Level I trauma), Baylor, UT Southwestern",
    localNote:
      "Dallas County reports elevated fatality rates; high-speed arterials and construction zones drive severe crashes.",
    stats: [
      { label: "Annual reported crashes", value: "Among highest in Texas; tens of thousands in Dallas County" },
      { label: "Traffic fatalities", value: "200+ annually in county-level data (elevated vs. many metros)" },
      { label: "Serious injuries", value: "Common on I-35E, I-30, I-635, US-75" },
      { label: "High-risk corridors", value: "I-635 (LBJ), I-35E, downtown mix zones" },
    ],
    immediateSteps: [
      "Call 911 and request police report.",
      "Photograph vehicles, injuries, and traffic controls.",
      "Do not admit fault at the scene.",
      "Collect witness and officer badge information.",
      "Seek trauma-capable care if seriously injured.",
      "Notify insurance — no recorded statement yet.",
      "Preserve black box / commercial data if truck involved.",
      "Contact free attorney matching if injuries are significant.",
    ],
    criticalSteps: [
      "Level I trauma documentation if hospitalized (Parkland, Baylor).",
      "Obtain Dallas County / city crash report promptly.",
      "Subpoena preservation for business camera footage.",
      "Document construction-zone signage if applicable.",
      "Track economic damages and future care needs.",
      "Evaluate third-party claims (employer, rideshare, commercial).",
      "Calendar Texas 2-year SOL immediately.",
      "Attorney review before any settlement release.",
    ],
    mistakes: [
      { mistake: "Underestimating LBJ / I-635 pileup liability", consequence: "Multiple at-fault parties missed" },
      { mistake: "Accepting insurer 'full and final' too soon", consequence: "Future surgery costs excluded" },
      { mistake: "No expert on high-speed impact", consequence: "Damages undervalued" },
      { mistake: "Missing government notice deadlines", consequence: "Claims against city/state barred" },
    ],
    insuranceTactics: [
      "Aggressive recorded interviews after Dallas freeway crashes",
      "Disputing medical necessity of imaging",
      "Split liability arguments on multi-car scenes",
      "Low initial offers on wage-loss claims",
      "Surveillance to challenge disability claims",
    ],
  },
  "fort-worth": {
    slug: "fort-worth",
    city: "Fort Worth",
    highways: "I-35W, I-30, Loop 820, Chisholm Trail Parkway, I-20",
    hospitals: "JPS Hospital, Texas Health Harris Methodist Fort Worth",
    localNote:
      "Tarrant County crash volume is significant; DFW merge zones with Dallas create multi-jurisdiction claims.",
    stats: [
      { label: "Annual reported crashes", value: "Tens of thousands reported in Tarrant County annually" },
      { label: "Traffic fatalities", value: "100+ traffic deaths per year in Fort Worth metro" },
      { label: "Serious injuries", value: "Frequent on I-35W, I-30, Loop 820" },
      { label: "High-risk corridors", value: "I-35W, Chisholm Trail Parkway, I-20" },
    ],
    immediateSteps: [
      "Ensure safety on I-35W or Loop 820 — use hazards.",
      "Call 911 for injuries and police report.",
      "Document all vehicles and license plates.",
      "Note road construction or weather conditions.",
      "Seek care at JPS or regional ER if needed.",
      "Exchange insurance with all parties.",
      "Decline recorded insurer statements initially.",
      "Save tow, rental, and medical receipts.",
    ],
    criticalSteps: [
      "Clarify jurisdiction (Fort Worth vs. Dallas vs. DPS) for report.",
      "Medical chronology from day one.",
      "Identify commercial or 18-wheeler policies if applicable.",
      "Track comparative fault under Texas 51% rule.",
      "Preserve ECM data in truck crashes quickly.",
      "Coordinate with attorney on Tarrant County venue.",
      "Do not sign broad medical releases.",
      "Free matching before insurer closes file.",
    ],
    mistakes: [
      { mistake: "Treating DFW as single legal venue", consequence: "Wrong court or insurer branch" },
      { mistake: "Ignoring I-35W construction detours", consequence: "Fault evidence lost" },
      { mistake: "Settling before Tarrant medical specialists weigh in", consequence: "Undervalued permanency" },
      { mistake: "Missing UM/UIM stack", consequence: "Recovery capped below damages" },
    ],
    insuranceTactics: [
      "Cross-county adjuster handoffs delaying response",
      "Disputing fault on I-35W merge crashes",
      "Low offers when multiple insurers involved",
      "Denying ongoing care without IME",
      "Pressure sign before liability is clear",
    ],
  },
  austin: {
    slug: "austin",
    city: "Austin",
    highways: "I-35, MoPac (Loop 1), US-183, SH 130, US-290",
    hospitals: "Dell Seton Medical Center, St. David's, Ascension Seton",
    localNote:
      "Travis County growth drives rising crashes; I-35 construction and MoPac congestion are top contributors.",
    stats: [
      { label: "Annual reported crashes", value: "Rising volume in Travis County with metro growth" },
      { label: "Traffic fatalities", value: "100+ roadway deaths annually" },
      { label: "Serious injuries", value: "Pedestrian, cyclist, and rideshare injuries increasing" },
      { label: "High-risk corridors", value: "I-35, MoPac, US-183, SH 130" },
    ],
    immediateSteps: [
      "Move off I-35 or MoPac if safe after crash.",
      "Call 911 — Austin Police or DPS depending on location.",
      "Photograph scene including construction signage.",
      "Collect rideshare or delivery app trip details if applicable.",
      "Seek care at Dell Seton or urgent care promptly.",
      "Document pedestrian or cyclist involvement.",
      "Notify insurer in writing when possible.",
      "Preserve video from CapMetro or business cameras.",
    ],
    criticalSteps: [
      "Document I-35 construction zone conditions.",
      "Track tech-worker remote vs. office wage loss.",
      "Evaluate scooter, bike, and pedestrian claims separately.",
      "Rideshare (Uber/Lyft) layered insurance review.",
      "Travis County SOL calendaring (2 years typical).",
      "Avoid TikTok / social posts about crash.",
      "Specialist referrals for concussion/TBI.",
      "Attorney match before Austin insurer closes claim.",
    ],
    mistakes: [
      { mistake: "Assuming city growth doesn't affect jury value", consequence: "Damages undervalued" },
      { mistake: "No rideshare period coverage check", consequence: "Gap in available policies" },
      { mistake: "Skipping concussion evaluation", consequence: "TBI evidence weak" },
      { mistake: "Late crash report amendment", consequence: "Fault narrative locked incorrectly" },
    ],
    insuranceTactics: [
      "Disputing pedestrian right-of-way on Lamar/Guadalupe corridors",
      "Low offers on young-driver policies",
      "Delay during Travis County caseload spikes",
      "Denying rideshare commercial coverage period",
      "Minimizing tech-corridor wage-loss claims",
    ],
  },
  "el-paso": makeTexasCity(
    "el-paso",
    "El Paso",
    "El Paso County sees 15,000+ crashes annually with heavy I-10 and US-54 commuter volume near the border.",
    "I-10, US-54, Loop 375, I-110",
    "University Medical Center of El Paso, Las Palmas Medical Center",
    [
      { label: "Annual reported crashes", value: "~15,000+ in El Paso County" },
      { label: "Traffic fatalities", value: "80+ per year in metro data" },
      { label: "High-risk corridors", value: "I-10, US-54 (Patriot Freeway)" },
      { label: "Trauma centers", value: "UMC El Paso, Las Palmas" },
    ],
  ),
  "corpus-christi": makeTexasCity(
    "corpus-christi",
    "Corpus Christi",
    "Nueces County coastal crashes cluster on US-181 and SPID; port and tourist traffic add complexity.",
    "I-37, US-181, SH 358, Ocean Drive",
    "Christus Spohn, Corpus Christi Medical Center",
    [
      { label: "Annual reported crashes", value: "~8,000+ in Corpus Christi / Nueces County" },
      { label: "Traffic fatalities", value: "40+ per year in regional data" },
      { label: "High-risk corridors", value: "US-181, SPID (SH 358)" },
      { label: "Trauma centers", value: "Christus Spohn Shoreline" },
    ],
  ),
  plano: makeTexasCity(
    "plano",
    "Plano",
    "Collin County commuter crashes on US-75 and the Bush Turnpike peak during rush hour.",
    "US-75, Bush Turnpike, SH 121, Dallas North Tollway",
    "Medical City Plano, Texas Health Presbyterian Plano",
    [
      { label: "Annual reported crashes", value: "~6,000+ in Plano / Collin County corridors" },
      { label: "Traffic fatalities", value: "20+ per year in city limits (approx.)" },
      { label: "High-risk corridors", value: "US-75, President George Bush Turnpike" },
      { label: "Trauma centers", value: "Medical City Plano" },
    ],
  ),
  lubbock: makeTexasCity(
    "lubbock",
    "Lubbock",
    "West Texas sees high per-capita crash rates; I-27 and Loop 289 intersection injuries are common.",
    "I-27, US-84, Loop 289, Marsha Sharp Freeway",
    "University Medical Center (Level I), Covenant Medical Center",
    [
      { label: "Annual reported crashes", value: "~5,500+ in Lubbock County" },
      { label: "Traffic fatalities", value: "30+ per year in regional reports" },
      { label: "High-risk corridors", value: "I-27, Loop 289" },
      { label: "Trauma centers", value: "UMC Lubbock (Level I)" },
    ],
  ),
  "arlington-texas": makeTexasCity(
    "arlington-texas",
    "Arlington",
    "Arlington (Texas) I-30 corridor sees game-day and entertainment district crashes between Dallas and Fort Worth.",
    "I-30, I-20, US-287, SH 360",
    "Texas Health Arlington Memorial, Medical City Arlington",
    [
      { label: "Annual reported crashes", value: "~7,000+ in Arlington / Tarrant County segments" },
      { label: "Traffic fatalities", value: "25+ per year (approx.)" },
      { label: "High-risk corridors", value: "I-30, SH 360, AT&T Stadium area" },
      { label: "Trauma centers", value: "Arlington Memorial, Medical City Arlington" },
    ],
  ),
  irving: makeTexasCity(
    "irving",
    "Irving",
    "Irving crashes cluster near DFW Airport, I-635, and SH 114 with frequent commercial and rideshare claims.",
    "I-635 (LBJ), SH 114, Loop 12, DFW Airport Freeway",
    "Baylor Scott & White Irving, Medical City Las Colinas",
    [
      { label: "Annual reported crashes", value: "~5,000+ in Irving / Dallas County corridors" },
      { label: "Traffic fatalities", value: "15+ per year (approx.)" },
      { label: "High-risk corridors", value: "I-635, SH 114, DFW Airport" },
      { label: "Trauma centers", value: "Baylor Scott & White Irving" },
    ],
  ),
};

export function texasCitySlugFromHubSlug(hubSlug: string): TexasCitySlug | null {
  const place = hubSlug.replace(/^car-accident-help-/, "");
  if (place in TEXAS_CITY_CONTENT) return place as TexasCitySlug;
  return null;
}

export function isTexasPriorityCity(cityName: string): boolean {
  return Object.values(TEXAS_CITY_CONTENT).some((c) => c.city === cityName);
}

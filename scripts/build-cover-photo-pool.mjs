#!/usr/bin/env node
/**
 * Build a pool of 400+ unique stock photo URLs for blog covers.
 * Run manually when expanding the pool — not needed on every cover generation.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "data/blog-cover-photo-pool.json");
const ORIGINALS = path.join(ROOT, "public/blog/covers/wreckmatch-originals");

const SEARCH_QUERIES = [
  "car accident", "traffic accident", "vehicle collision", "car crash damage",
  "truck accident", "semi truck highway", "motorcycle accident", "pedestrian crosswalk",
  "ambulance emergency", "police traffic accident", "hospital emergency room",
  "personal injury lawyer", "attorney consultation", "courtroom legal",
  "insurance document", "damaged car windshield", "tow truck roadside",
  "highway traffic", "intersection traffic", "winter icy road driving",
  "seatbelt safety car", "airbag car interior", "spinal injury medical",
  "brain scan mri", "physical therapy rehab", "chiropractor patient",
  "wrongful death flowers", "emergency call phone", "police report clipboard",
  "skid marks road", "broken glass pavement", "crumpled car metal",
  "paramedic emt", "fire truck emergency", "police cruiser lights",
  "traffic cone accident", "accident scene tape", "flares roadside",
  "dui checkpoint", "breathalyzer test", "rear end collision",
  "rollover vehicle", "guardrail highway", "bridge traffic",
  "dashcam car windshield", "black box truck", "road construction zone",
  "school bus road", "bicycle street", "rideshare car city",
  "legal contract signing", "jury trial courtroom", "scales justice",
  "medical bill hospital", "xray image medical", "neck brace patient",
  "wheelchair hospital", "cast broken arm", "surgery hospital room",
  "pain medication bottle", "doctor stethoscope", "nurse hospital corridor",
  "freeway traffic aerial", "city street cars", "parking lot cars",
  "car dealership", "auto repair shop", "body shop damaged car",
  "insurance agent office", "phone call worried", "family car safety",
  "child car seat", "teen driver car", "elderly driver car",
  "delivery van street", "commercial truck loading", "forklift warehouse skip",
  "red light intersection", "stop sign road", "speed limit sign road",
  "rain wet windshield", "fog road driving", "night headlights highway",
  "tire blowout", "flat tire roadside", "jump start car battery",
  "road rage argument", "witness statement police", "accident reconstruction",
  "helicopter medevac", "trauma center emergency", "burn injury hospital skip",
  "settlement handshake", "mediation conference", "law library books",
  "gavel judge bench", "court filing papers", "notary stamp document",
  "texas highway", "florida highway traffic", "california freeway",
  "new york traffic", "chicago traffic winter", "atlanta highway",
  "phoenix desert road", "denver mountain road", "seattle rain traffic",
  "detroit automotive", "nashville interstate", "charlotte highway",
  "columbus ohio traffic", "philadelphia street", "boston traffic",
  "san antonio highway", "houston freeway", "dallas highway",
  "miami palm road", "orlando tourist road", "las vegas strip traffic",
  "portland oregon rain", "salt lake city road", "kansas city highway",
  "st louis arch highway", "milwaukee winter road", "minneapolis snow road",
  "cleveland lake road", "pittsburgh bridge traffic", "baltimore harbor road",
  "richmond virginia road", "raleigh north carolina road", "jacksonville florida road",
  "memphis bridge traffic", "louisville kentucky road", "oklahoma city highway",
  "tucson arizona road", "albuquerque new mexico road", "boise idaho road",
  "sacramento california road", "san diego freeway", "san jose silicon valley traffic",
  "oakland bay bridge traffic", "portland maine road", "providence rhode island road",
  "hartford connecticut road", "burlington vermont road", "manchester new hampshire road",
  "crash barrier impact", "median crossover crash", "head on collision damage",
  "side impact car door", "deployed airbag interior", "steering wheel damage",
  "broken windshield spider", "car fire smoke", "fuel spill road",
  "animal deer road", "construction worker road", "surveying accident scene",
  "measuring skid marks", "photographing accident scene", "smartphone photo crash",
  "insurance adjuster car", "rental car counter", "loan document car",
  "bankruptcy papers", "medical records folder", "physical therapy gym",
  "massage therapy back", "acupuncture needles", "orthopedic clinic",
  "mri machine patient", "ct scan patient", "ambulance stretcher hospital",
  "emergency room waiting", "triage nurse", "blood pressure cuff",
  "heart monitor hospital", "iv drip hospital", "bandage wound care",
  "crutches walking", "neck collar whiplash", "back pain sitting",
  "headache pain face", "dizzy vertigo", "memory loss elderly",
  "ptsd therapy session", "grief counseling", "support group circle",
  "funeral service flowers", "memorial candle", "cemetery gravestone",
  "probate court building", "estate planning documents", "beneficiary form",
  "structured settlement check", "contingency fee contract", "retainer agreement",
  "deposition room table", "expert witness testimony", "accident animation screen",
  "biomechanics laboratory", "crash test dummy", "nhtsa crash test",
  "fmcsa truck inspection", "weigh station truck", "logbook truck driver",
  "cargo spill truck", "tanker truck highway", "bus passengers street",
  "train crossing gates", "light rail tracks", "scooter urban street",
  "autonomous vehicle sensor", "recall notice mail", "defective tire tread",
  "brake disc worn", "steering wheel recall", "airbag recall notice",
  "fuel tank leak", "post crash fire truck", "ejection seatbelt",
  "tbone intersection crash", "left turn crash", "blind spot mirror",
  "jackknife truck trailer", "runaway truck ramp", "chain requirement sign",
  "black ice sign", "hydroplaning rain", "flood road barricade",
  "evacuation traffic hurricane", "smoke wildfire road", "earthquake road damage",
  "pothole car damage", "government building capitol", "municipal courthouse",
  "police pursuit car", "siren ambulance intersection", "good samaritan help",
  "first aid kit", "roadside assistance van", "reflective vest worker",
  "warning triangle car", "gps navigation mount", "distracted driving phone",
  "texting driving", "speeding dashboard", "license plate close",
  "insurance card hand", "policy document desk", "denial letter mail",
  "lowball offer letter", "demand letter envelope", "hammer negotiation",
  "mediator office plants", "arbitration room", "appeal courthouse columns",
  "federal courthouse steps", "state legislature building", "traffic safety billboard",
  "recall database computer", "vin plate windshield", "obd scanner port",
  "mechanic under car", "frame machine repair", "paint booth car",
  "rental car keys", "loss of use invoice", "uber app phone",
  "lyft pink mustache skip", "delivery app phone", "commercial policy folder",
  "excluded driver letter", "stacked coverage form", "arbitration clause highlight",
  "collateral source chart", "hospital lien notice", "medicare card senior",
  "workers comp form", "employer fleet vans", "independent contractor truck",
  "manufacturer logo car skip", "crashworthiness test lab", "bystander shock face",
  "loss consortium couple", "bad faith letter", "stowers demand envelope",
  "billboard lawyer road", "intake form clipboard", "medical records release hipaa",
  "billing statement hospital", "lien reduction letter", "medicare set aside trust",
  "minor settlement court", "guardian ad litem", "power of attorney sign",
  "trauma bay hospital", "helicopter landing pad hospital", "burn unit skip",
  "spinal cord rehab", "amputation prosthetic leg", "facial scar healing",
  "disfigurement mirror", "loss enjoyment hiking skip", "day in life video camera",
  "surveillance van parked", "private investigator camera", "social media phone scroll",
  "vocational expert office", "job search computer", "dot physical exam",
  "cdl license card", "dui mugshot skip", "field sobriety line",
  "open container car", "dram shop bar", "negligent entrustment keys",
  "unlicensed driver ticket", "salvage title document", "carfax report print",
  "total loss check", "diminished value appraisal", "stolen car police",
  "road rage fist", "failure to yield sign", "reckless driving ticket",
  "vehicular manslaughter courthouse skip", "hit and run damage", "no insurance court",
  "umbrella policy document", "deductible explanation", "surprise billing letter",
  "ime doctor office", "recorded statement phone", "reservation of rights letter",
  "partial denial stamp", "policy limits stack", "fraud investigation badge",
  "staged accident photo", "interpreter courthouse", "spanish intake form",
  "victim compensation application", "fmla paperwork desk", "disability claim form",
  "workers comp check", "third party lien notice", "dual capacity employer",
  "remote worker home office", "rsd hand color skip", "chronic pain diary",
  "spinal fusion xray", "epidural injection room", "spinal cord stimulator xray skip",
  "medical marijuana bottle skip", "opioid pill bottle skip", "pregnancy ultrasound skip",
  "car seat installation", "teen permit test", "prom night limousine skip",
  "holiday travel airport skip", "marathon road closure", "wrong way driver sign",
  "suicide prevention sign skip", "guardianship courtroom", "trust fund document minor",
  "emotional distress therapy", "negligent hiring file", "background check report",
  "temp worker vest", "parking lot pothole", "malfunction traffic signal",
  "four way stop sign", "merge lane diagram skip", "tailgating close cars",
  "single vehicle tree impact", "deer warning sign", "school zone sign",
  "crosswalk beacon flashing", "red light camera pole", "speed camera sign",
  "toll booth traffic", "impound lot cars", "edr download laptop",
  "low speed rear damage", "migraine dark room", "tmj jaw pain",
  "seatbelt bruise chest", "dashboard knee injury", "pelvic xray trauma",
  "internal bleeding scan", "jaws of life rescue", "airbag burn face skip",
  "automatic braking car", "backup camera screen", "key fob relay skip",
  "eating while driving", "pet dog car harness", "unsecured ladder truck",
  "weigh station scale", "drug checkpoint dog skip", "traffic stop window",
  "municipal liability meeting", "tort claim notice envelope", "design immunity road sign skip",
  "release waiver gym skip", "arbitration agreement phone app", "forum selection map skip",
  "multi state crash map skip", "federal removal document", "mdl courthouse banner skip",
  "class action notice mail skip", "referral fee agreement", "ambulance chasing billboard skip",
  "expert disclosure report", "loss chance chart skip", "fear of cancer scan skip",
  "train derailment skip", "plane crash skip", "product recall skip",
];

async function fetchQuery(q, offset = 0, urls) {
  const api =
    `https://commons.wikimedia.org/w/api.php?action=query&generator=search` +
    `&gsrsearch=${encodeURIComponent(q)}&gsrnamespace=6&gsrlimit=50&gsroffset=${offset}` +
    `&prop=imageinfo&iiprop=url|mime&iiurlwidth=1200&format=json`;
  const res = await fetch(api, {
    headers: { "User-Agent": "WreckMatchCoverBot/1.0 (https://www.wreckmatch.com)" },
  });
  if (!res.ok) return;
  const json = await res.json();
  for (const page of Object.values(json.query?.pages ?? {})) {
    const info = page.imageinfo?.[0];
    const mime = info?.mime ?? "";
    if (!/^image\/(jpeg|png)$/i.test(mime)) continue;
    const title = page.title ?? "";
    const url = info?.thumburl ?? info?.url;
    if (!url) continue;
    if (/svg|logo|icon|diagram|chart|map|flag|coat|seal|emblem|signature|drawing|illustration|cartoon|meme|pdf|gif|webm|audio|video|skip/i.test(title)) continue;
    urls.add(url);
  }
  if (json.continue?.gsroffset && urls.size < 600) {
    await new Promise((r) => setTimeout(r, 100));
    await fetchQuery(q, json.continue.gsroffset, urls);
  }
}

function localOriginals() {
  if (!fs.existsSync(ORIGINALS)) return [];
  return fs
    .readdirSync(ORIGINALS)
    .filter((f) => /\.(png|jpe?g)$/i.test(f))
    .map((f) => ({ type: "local", path: `/blog/covers/wreckmatch-originals/${f}`, file: path.join(ORIGINALS, f) }));
}

async function main() {
  const urls = new Set();
  for (const q of SEARCH_QUERIES) {
    await fetchQuery(q, 0, urls);
    if (urls.size >= 550) break;
    await new Promise((r) => setTimeout(r, 80));
  }

  const pool = [
    ...localOriginals(),
    ...[...urls].map((url) => ({ type: "remote", url })),
  ];

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify({ builtAt: new Date().toISOString(), count: pool.length, pool }, null, 2));
  console.log(`Wrote ${pool.length} unique source images to ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

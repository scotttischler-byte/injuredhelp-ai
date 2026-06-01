/**
 * Render-time content expander for blog posts.
 *
 * Goal: every post renders ≥ 2,000 words of substantive, topic-relevant,
 * state-aware content WITHOUT requiring a rewrite of the source markdown.
 *
 * We compose this from real data files (ALL_STATES, ALL_CITIES) plus
 * topic-specific section libraries. No LLM calls — deterministic and fast.
 *
 * Output is structured (not raw markdown) so the rendering page can style
 * headings, lists, tables, and FAQs consistently.
 */

import { asgLinksForBlog } from "@/lib/asg-links";
import { autopilotBrand, type AutopilotBrand } from "@/lib/autopilot-brand";
import { ALL_STATES, type StateProfile } from "@/lib/states";
import { ALL_CITIES, type CityProfile } from "@/lib/cities";
import type { PostMeta } from "@/lib/posts";

export type ExpandedSection = {
  heading: string;
  paragraphs?: string[];
  list?: string[];
  /** Two-column comparison table. First row = headers. */
  table?: string[][];
};

export type ExpandedFaq = {
  question: string;
  answer: string;
};

export type ExpandedContent = {
  introCallout?: string;
  sections: ExpandedSection[];
  faqs: ExpandedFaq[];
};

type Topic =
  | "truck"
  | "rideshare"
  | "motorcycle"
  | "pedestrian"
  | "whiplash"
  | "tbi"
  | "spinal"
  | "wrongful-death"
  | "catastrophic"
  | "insurance"
  | "statute"
  | "first-steps"
  | "general";

const SLUG_TOPIC_RULES: Array<{ test: RegExp; topic: Topic }> = [
  { test: /(18-wheeler|semi-truck|tractor-trailer|fmcsa|jackknife|underride|override|black-box|truck-accident)/i, topic: "truck" },
  { test: /(rideshare|uber|lyft|gig-driver)/i, topic: "rideshare" },
  { test: /(motorcycle|motorbike|biker|helmet)/i, topic: "motorcycle" },
  { test: /(pedestrian|crosswalk|hit-by-car)/i, topic: "pedestrian" },
  { test: /(whiplash|neck-injury|back-injury|soft-tissue)/i, topic: "whiplash" },
  { test: /(traumatic-brain|brain-injury|tbi|concussion|head-injury)/i, topic: "tbi" },
  { test: /(spinal|spinal-cord|paralysis|paraplegic|quadriplegic)/i, topic: "spinal" },
  { test: /(wrongful-death|fatal|family-guide)/i, topic: "wrongful-death" },
  { test: /(catastrophic|severe-injury|critical-injury|life-altering)/i, topic: "catastrophic" },
  { test: /(insurance|adjuster|claim|denied|low-ball|recorded-statement)/i, topic: "insurance" },
  { test: /(statute-of-limitations|deadline|time-limit|filing-window|how-long)/i, topic: "statute" },
  { test: /(what-to-do|first-steps|after-a-crash|after-a-car|immediate|on-scene)/i, topic: "first-steps" },
];

export function topicForSlug(slug: string): Topic {
  const s = slug.toLowerCase();
  for (const rule of SLUG_TOPIC_RULES) {
    if (rule.test.test(s)) return rule.topic;
  }
  return "general";
}

const TOPIC_LABEL: Record<Topic, string> = {
  truck: "commercial-truck crash",
  rideshare: "rideshare crash",
  motorcycle: "motorcycle crash",
  pedestrian: "pedestrian accident",
  whiplash: "whiplash and soft-tissue injury case",
  tbi: "traumatic brain injury case",
  spinal: "spinal-cord injury case",
  "wrongful-death": "wrongful-death case",
  catastrophic: "catastrophic-injury case",
  insurance: "insurance dispute",
  statute: "filing-deadline situation",
  "first-steps": "post-crash situation",
  general: "car accident case",
};

function topicLabel(topic: Topic, brand: AutopilotBrand): string {
  if (topic === "general" && brand.id === "semitruckmatch") return brand.defaultTopicLabel;
  return TOPIC_LABEL[topic];
}

export function findState(meta: PostMeta, slug: string): StateProfile | undefined {
  const s = slug.toLowerCase();
  const fromMeta = meta.state?.trim().toLowerCase();
  if (fromMeta && fromMeta !== "general") {
    const hit = ALL_STATES.find((st) => st.state.toLowerCase() === fromMeta);
    if (hit) return hit;
  }
  // Match full state slug only (e.g. -ohio-), never abbreviations like "in" inside "-in-columbus-".
  for (const st of ALL_STATES) {
    const token = st.state.toLowerCase().replace(/\s+/g, "-");
    if (s.includes(`-${token}-`) || s.endsWith(`-${token}`)) return st;
  }
  return undefined;
}

export function findCity(slug: string, state?: StateProfile): CityProfile | undefined {
  const s = slug.toLowerCase();
  // Prefer cities that match the resolved state to disambiguate Arlington TX vs VA, etc.
  const candidates = state ? ALL_CITIES.filter((c) => c.state === state.state) : ALL_CITIES;
  for (const c of candidates) {
    const cityToken = c.city.toLowerCase().replace(/\s+/g, "-");
    if (s.includes(cityToken)) return c;
  }
  for (const c of ALL_CITIES) {
    const cityToken = c.city.toLowerCase().replace(/\s+/g, "-");
    if (s.includes(cityToken)) return c;
  }
  return undefined;
}

function stateLegalSection(state: StateProfile | undefined, topic: Topic, brand: AutopilotBrand): ExpandedSection {
  const label = topicLabel(topic, brand);
  if (!state) {
    return {
      heading: "Deadlines and fault rules vary by state",
      paragraphs: [
        "Every U.S. state sets its own statute of limitations for personal injury claims after a crash. Most fall between 1 and 6 years, with the majority clustered at 2 or 3 years from the date of the accident. The deadline tightens further when a government vehicle, minor, or wrongful-death claim is involved — sometimes to as little as 6 months for a notice of claim.",
        "Fault allocation also differs. Pure comparative-negligence states reduce your recovery by your share of fault but never bar it; modified states block recovery once your share crosses 50% or 51%; contributory-negligence jurisdictions (Alabama, Maryland, North Carolina, Virginia, and Washington D.C.) can bar your recovery entirely for as little as 1% fault. These distinctions can swing case value by tens of thousands of dollars.",
        "No-fault states layer in another step: you must first exhaust your own Personal Injury Protection (PIP) coverage before pursuing the at-fault driver, and many no-fault states only let you sue once injuries cross a verbal or monetary threshold.",
      ],
    };
  }
  const noFaultLine = state.noFault
    ? `${state.state} is a no-fault state, meaning your own Personal Injury Protection (PIP) coverage typically pays your initial medical bills regardless of fault. You can usually pursue the at-fault driver only after crossing a "serious injury" threshold defined by ${state.state} statute.`
    : `${state.state} is an at-fault state. The at-fault driver's liability insurance is the primary source of recovery, and you can pursue compensation for medical bills, lost wages, and pain and suffering once liability is established.`;
  return {
    heading: `${state.state} legal context for ${label}s`,
    paragraphs: [
      `In ${state.state}, the statute of limitations on most personal-injury claims is ${state.statuteOfLimitationsYears} year${state.statuteOfLimitationsYears === 1 ? "" : "s"} from the date of the crash. Missing that window almost always ends the case — courts dismiss late-filed lawsuits with rare exceptions for minors, mental incapacity, or delayed discovery of injuries. Notice deadlines for claims against government vehicles can be far shorter, sometimes 60 to 180 days.`,
      `${state.state} follows the ${state.comparativeFault} rule for fault allocation. ${comparativeExplanation(state.comparativeFault)} The minimum liability insurance every driver must carry in ${state.state} is ${state.insuranceMinimums} (bodily injury per person / per accident / property damage). For serious crashes those minimums are routinely exhausted in days, which is why uninsured/underinsured-motorist (UM/UIM) coverage on your own policy matters so much.`,
      `${noFaultLine}`,
      `${state.localTip} Recent settlement data reported by ${state.state} firms shows a typical published recovery range of ${state.avgSettlementRange} — but those numbers describe the firms' historical mix and are not a prediction of your case. A licensed attorney in ${state.state} can give you a grounded read on value once they review medical records, fault evidence, and policy limits.`,
    ],
  };
}

function comparativeExplanation(rule: string): string {
  const r = rule.toLowerCase();
  if (r.includes("contributory"))
    return "Under traditional contributory negligence, if you are even 1% at fault you can be barred from recovering anything — one of the harshest rules in the country. That makes the on-scene evidence collection in the first 48 hours unusually important.";
  if (r.includes("pure"))
    return "Pure comparative negligence reduces your recovery in proportion to your share of fault, but never bars it. A driver found 30% responsible can still recover 70% of damages.";
  if (r.includes("50"))
    return "Modified 50%-bar comparative negligence reduces your recovery by your share of fault, but cuts you off completely once your fault reaches 50% or more. Insurers will often push to inch your share above the threshold during recorded statements.";
  if (r.includes("51"))
    return "Modified 51%-bar comparative negligence lets you recover as long as you are 50% or less at fault, with your recovery reduced by your share. Crossing 51% bars you entirely.";
  return "Comparative-fault rules can shrink or eliminate recovery once your assigned share of fault reaches a threshold, so locking in the at-fault driver's responsibility early is critical.";
}

function firstStepsSection(topic: Topic, city: CityProfile | undefined, brand: AutopilotBrand): ExpandedSection {
  const label = topicLabel(topic, brand);
  const localLine = city
    ? `In ${city.city}, ${label}s often happen on or near ${city.majorHighways.slice(0, 2).join(" and ")}, and the nearest trauma-capable centers include ${city.localHospitals.slice(0, 2).join(" and ")}. Going to one of those facilities, even if you "feel fine," is the single most important step in the first 24 hours.`
    : `Going to a trauma-capable hospital or urgent-care center within 24 hours, even if you "feel fine," is the single most important step you can take. Adrenaline can mask serious injuries — including internal bleeding, concussions, and herniated discs — for hours.`;
  return {
    heading: `What to do in the first 48 hours after a ${label}`,
    paragraphs: [
      `The first two days after a crash quietly decide most cases. Insurers train adjusters to call within 24 hours, ask leading questions, and lock in statements that compress case value before victims have seen a doctor or talked to a lawyer. Following a disciplined sequence in the first 48 hours protects you from the most common traps.`,
      `${localLine}`,
    ],
    list: [
      "Call 911 — even for a “minor” crash. The police report is the single most cited document in your case.",
      "Take wide-angle and close-up photos of all vehicles, the surrounding intersection, traffic signs, skid marks, debris, and your visible injuries.",
      "Get the other driver's name, license, insurance, plate, and a photo of their insurance card. Photograph any commercial markings (DOT number, USDOT, trailer numbers) if a truck is involved.",
      "Collect at least two independent witness names and phone numbers. Witnesses move and disappear within weeks.",
      "Decline to give a recorded statement to any insurance company — yours or theirs — until you have spoken with a lawyer.",
      "Seek medical care the same day or the next. Gaps in treatment are the #1 line item adjusters use to reduce settlement offers.",
      "Preserve everything: the damaged vehicle, clothing worn during the crash, GPS device, dashcam SD card, and your phone's location history.",
      "Notify your own insurer in writing within 24–72 hours. Most policies require “prompt” notice, and silence can be used to deny coverage.",
      "Start a daily symptom journal: pain levels, missed work, things you can no longer do, sleep disruption, mood changes.",
      "Speak with a personal-injury attorney before signing anything labeled “release,” “waiver,” or “medical authorization” — insurers use these to access unrelated medical history and discount value.",
    ],
  };
}

function evidencePitfallsSection(topic: Topic): ExpandedSection {
  const TOPIC_SPECIFIC: Record<Topic, ExpandedSection> = {
    truck: {
      heading: "Truck-specific evidence and pitfalls",
      paragraphs: [
        "Commercial-truck cases stand apart from passenger-car crashes because the evidence is much richer — and disappears much faster. Most modern tractors carry an Event Data Recorder (the “black box” / ECM) capturing speed, brake application, throttle position, and steering input for the seconds before impact. That data is owned by the carrier, gets overwritten on a rolling schedule, and is often deleted unless preserved by a formal spoliation letter within days of the crash.",
        "FMCSA regulations also require the driver to keep an Hours-of-Service log (electronic, via ELD) and the carrier to retain driver qualification files, drug-and-alcohol test results, post-crash testing, maintenance records, and dispatch communications. A plaintiff's attorney typically issues preservation demands within 24–72 hours covering these categories specifically.",
        "Insurers for trucking companies move fast in the opposite direction — sending “rapid response” teams to the scene to photograph and interview before victims leave the hospital. Anything you say in those early conversations can and will be used to allocate fault, so the safer rule is simple: politely decline, exchange paperwork, and let your attorney handle communication.",
      ],
    },
    rideshare: {
      heading: "Rideshare-specific coverage and pitfalls",
      paragraphs: [
        "Rideshare crashes (Uber, Lyft, and similar) follow a three-tier insurance structure that confuses most claimants. When the app is OFF, only the driver's personal policy applies — and many personal policies exclude commercial use. When the app is ON but no ride is accepted, Uber and Lyft maintain limited contingent liability coverage ($50k/$100k bodily injury in most states). Once a ride is accepted or a passenger is in the vehicle, $1 million in third-party liability coverage typically applies.",
        "Which tier was active at the moment of impact is decided by the rideshare company's internal app data — not by the driver's statement. Securing that timestamped trip data via subpoena is one of the most important early moves in a rideshare case, because the company will not volunteer it.",
        "If you were the rideshare passenger, you are almost never at fault, but you still need to (a) preserve your trip receipt in the app, (b) screenshot the driver's profile and license plate, and (c) get medical attention even for symptoms that emerge days later.",
      ],
    },
    motorcycle: {
      heading: "Motorcycle-specific bias and evidence",
      paragraphs: [
        "Motorcycle cases face a documented bias: adjusters and jurors often assume the rider was speeding, lane-splitting, or “asking for it” — regardless of the actual facts. Overcoming that bias starts with hard physical evidence. Helmet, jacket, boots, and gloves should be preserved in the condition they were in after the crash. Photographs of road conditions, sight lines, and skid marks become disproportionately important.",
        "Many states (and most insurance policies) allow a “helmet defense” to reduce damages if the rider was unhelmeted, even where helmets are not legally required. Documenting that injuries — particularly to extremities and torso — are unrelated to the question of helmet use protects against unfair offsets.",
        "Uninsured/underinsured motorist coverage matters more for riders than for car drivers. Motorcycle injuries are usually more severe, and at-fault drivers commonly carry only minimum liability limits. Reviewing the rider's own UM/UIM stack early often determines whether full recovery is possible.",
      ],
    },
    pedestrian: {
      heading: "Pedestrian-specific evidence and crosswalk rules",
      paragraphs: [
        "Pedestrian cases hinge on right-of-way and visibility. Most states grant pedestrians the right of way inside marked crosswalks and at intersections — even unmarked ones — and require drivers to yield. But comparative-fault rules still allow insurers to allocate blame for jaywalking, dark clothing at night, or distracted walking, which can sharply reduce recovery.",
        "Evidence to preserve: surveillance camera footage from nearby businesses (most overwrite in 7–30 days), signal-timing reports from the city for traffic-light intersections, witness statements from anyone who saw the approach, and the pedestrian's exact path captured by phone or fitness-tracker GPS.",
        "Driver-side evidence also matters: distracted-driving signals such as a cellphone-use history pulled by subpoena, speed at impact reconstructed from skid marks and crush damage, and whether the driver was working at the time (potentially triggering an employer policy or rideshare coverage).",
      ],
    },
    whiplash: {
      heading: "Whiplash and soft-tissue case dynamics",
      paragraphs: [
        "Whiplash and soft-tissue injuries are the most commonly disputed injury type in auto cases because they rarely show up on X-rays. Insurers use that to argue the injury is exaggerated or pre-existing — even when MRIs, treating-physician notes, and physical-therapy records tell a different story.",
        "The strongest soft-tissue claims share a pattern: medical care within 24–72 hours of the crash, a consistent provider chain (ER → primary care → physical therapy / chiropractor → specialist), objective findings noted by the treating provider (muscle spasm, reduced range of motion, neurological signs), and a clear pain journal tracking symptom progression.",
        "Gaps in treatment longer than 30 days, switching providers without notes transferring, and “self-discharging” before completing a recommended course of care all give adjusters openings to reduce the value of the claim. So does posting normal-looking activities on social media during the recovery window — even a single tagged photo at a wedding or vacation can be screenshot and entered into the claim file.",
      ],
    },
    tbi: {
      heading: "Traumatic brain injury — diagnosis and proof",
      paragraphs: [
        "Mild traumatic brain injuries (mTBI / concussion) often go undiagnosed for days because patients seem outwardly fine. The medical literature calls this the “silent injury” — symptoms include headaches, light sensitivity, sleep disruption, short-term memory loss, mood changes, and difficulty concentrating, and they can persist for months or evolve into post-concussive syndrome.",
        "Documentation begins with prompt evaluation at an emergency department capable of advanced imaging, and continues with neuropsychological testing — formal cognitive assessment that establishes a baseline and shows deficits in working memory, processing speed, and executive function. Insurers often dismiss “concussion” without imaging findings, so the neuropsych battery is frequently the case-defining evidence.",
        "Family members, coworkers, and supervisors become important fact witnesses. They notice changes — irritability, forgetfulness, fatigue — that the patient may not recognize. Their declarations are routinely admitted to corroborate the cognitive impact of the injury.",
      ],
    },
    spinal: {
      heading: "Spinal-cord and back-injury proof",
      paragraphs: [
        "Spinal-cord injuries are catastrophic by definition, but herniated discs, bulging discs, and facet-joint injuries that don't sever the cord are routinely contested by insurers. The dispute is almost always: pre-existing degeneration vs. trauma-induced injury. Treating physicians' notes, MRI imaging compared to prior films (if any), and the timeline of symptom onset relative to the crash are the three pillars that decide that fight.",
        "Conservative care — physical therapy, epidural steroid injections, nerve-block injections — is typically required before surgical recommendations are credited. Insurers expect a documented “failure of conservative care” before paying value for surgical recommendations. Documentation of every attempted treatment, what worked, and what failed is essential.",
        "Future-care cost projections for spinal injuries are usually proven through a life-care planner — a credentialed expert who calculates the lifetime cost of medication, periodic injections, physical therapy, surgical revisions, and assistive equipment. Those reports often run 40+ pages and add six- to seven-figure value when supported by treating-physician opinions.",
      ],
    },
    "wrongful-death": {
      heading: "Wrongful-death claims — special procedures",
      paragraphs: [
        "Wrongful-death claims sit in a separate statutory bucket from injury claims. Each state designates who has standing to bring the case — typically the surviving spouse and children first, parents next, and other dependents in specific cases — and many states also recognize a “survival” action filed by the estate for the decedent's own pre-death pain and suffering.",
        "Damages available in wrongful-death cases vary by jurisdiction but commonly include lost financial support, loss of companionship and consortium, funeral and burial expenses, and the conscious pre-death pain and suffering of the decedent. Punitive damages may apply when the conduct was reckless (DUI, gross negligence, fleeing the scene).",
        "Procedurally, an estate usually must be opened in probate court before a wrongful-death lawsuit can be filed, which adds 30–90 days to the front end. Families benefit from talking to an attorney early — even before opening the estate — to preserve evidence and avoid premature settlement of property-damage subclaims that can complicate the larger wrongful-death case.",
      ],
    },
    catastrophic: {
      heading: "Catastrophic-injury cases — what changes",
      paragraphs: [
        "Catastrophic injuries — defined loosely as injuries causing permanent impairment or requiring lifelong care — change the case in three structural ways. First, damages calculations almost always require an economist and life-care planner, because the value depends on lost future earnings and lifetime medical costs that cannot be estimated by feel.",
        "Second, the at-fault driver's liability policy is almost always too small. Recovery typically requires layering: the at-fault policy, any commercial or employer policy, umbrella coverage, the injured person's own underinsured-motorist coverage, and in some cases a third-party premises or product-liability theory. Identifying every available policy in the first 30 days frequently changes the realistic ceiling on the case.",
        "Third, structured settlements become a serious option. Rather than a lump sum that can be exhausted, a structure converts settlement proceeds into a tax-advantaged annuity covering decades of medical and living expenses. This is especially common with minor plaintiffs and severe-brain-injury survivors.",
      ],
    },
    insurance: {
      heading: "How insurers actually evaluate the claim",
      paragraphs: [
        "Claim adjusters use scoring software (commonly Colossus, ClaimIQ, or in-house tools) that pulls dollar values from medical records based on diagnosis codes, treatment frequency, and the language used by treating physicians. The same injury can be valued very differently depending on whether the chart says “neck strain” or “C5-C6 disc herniation with radiculopathy.”",
        "Adjusters are trained to: open with low first offers, frame settlements as final, ask for recorded statements early, request blanket medical authorizations (giving access to your whole medical history), and offer “advances” against final settlement that can later be deducted. Each tactic has a counter that an attorney can deploy, but only if engaged before the claimant says or signs something binding.",
        "Documenting non-economic loss — pain, sleep disruption, missed family events, fear of driving, loss of hobbies — is usually under-developed in the claim file. A pain journal, declarations from family members, and consistent treatment notes that capture functional impact (not just pain scores) move scoring outputs upward.",
      ],
    },
    statute: {
      heading: "Why the deadline is often shorter than people think",
      paragraphs: [
        "The headline statute of limitations — 2 or 3 years in most states — is misleading. Several earlier deadlines often apply first, and missing any of them can effectively kill the case before the headline number even matters.",
        "Government-vehicle claims (city bus, county truck, government employee on duty) usually require a “notice of claim” within 60 to 180 days. Some states require notice to the state tort claims board within 6 months. Crashes on military bases or with federal employees trigger the Federal Tort Claims Act, which has its own administrative-claim prerequisite. Minors and incapacitated plaintiffs may have tolled deadlines, but only with documentation.",
        "Insurance contracts also impose their own deadlines. Most policies require “prompt” notice of a loss, “cooperation” with the insurer's investigation, and sometimes a sworn statement under oath within a fixed window. Missing those contractual deadlines can defeat first-party coverage even when the lawsuit itself is timely.",
      ],
    },
    "first-steps": {
      heading: "Why the first 48 hours decide most cases",
      paragraphs: [
        "Insurance industry research consistently shows that case value is largely set by what happens — and what is documented — in the first 48 hours after a crash. Three things drive that: medical care timing, evidence preservation, and what is (and is not) said to insurers.",
        "Medical care within 24 hours establishes the link between the crash and the injury. Going 5 days without care invites the adjuster's favorite argument: “if you were really hurt, you would have gone in sooner.” Same-day urgent care or ER visit, with the chart explicitly noting “motor vehicle accident,” is the cleanest record.",
        "Evidence preservation has a shrinking window: business surveillance loops typically overwrite in 7–30 days, traffic-camera footage in many cities is purged in 72 hours, and witness memories blur within a week. A short, polite written request to nearby businesses asking them to preserve footage — sent the day of the crash — is often the single highest-leverage 10-minute task.",
      ],
    },
    general: {
      heading: "Common pitfalls that compress case value",
      paragraphs: [
        "Across injury types, a handful of patterns compress case value: gaps in medical treatment longer than 30 days, recorded statements given before consulting a lawyer, social-media posts that conflict with the documented severity, switching providers without notes transferring, accepting a fast “final” offer in the first weeks, and signing broad medical authorizations that hand the insurer your full medical history.",
        "The decisions that protect case value are mostly about restraint in the first 60 days. Treat consistently. Don't post about activities. Don't talk to the other driver's insurer without a lawyer. Don't sign anything labeled “release” or “waiver.” Don't let the adjuster's friendly tone speed up decisions you should make slowly.",
        "Many of these traps are deployed deliberately — not because adjusters are villains, but because their job is to close claims at the lowest defensible value. Knowing the playbook is most of the protection.",
      ],
    },
  };
  return TOPIC_SPECIFIC[topic] ?? TOPIC_SPECIFIC.general;
}

function caseValueSection(state: StateProfile | undefined, topic: Topic, brand: AutopilotBrand): ExpandedSection {
  const label = topicLabel(topic, brand);
  const range = state?.avgSettlementRange ?? "$15,000 – $250,000+";
  return {
    heading: "What might your case be worth?",
    paragraphs: [
      `Honest answer: nobody can tell you a precise number without reviewing your medical records, the police report, available insurance policies, the at-fault driver's conduct, and the comparative-fault posture of your state. Published "average" settlement numbers (commonly ${range} for ${state?.state ?? "U.S."} ${label}s based on aggregated firm-reported data) describe historical mixes — not your case.`,
      `Case value is driven primarily by: (1) medical-bill totals and the share that will be reasonably necessary in the future; (2) lost wages and impaired earning capacity, including any permanent restrictions; (3) the severity, permanency, and visibility of the injuries; (4) liability clarity — is fault uncontested or shared; (5) policy limits — a $25,000 policy caps recovery at $25,000 regardless of damages unless additional coverage is identified; (6) jurisdiction — some venues are systematically more plaintiff-favorable.`,
      `Anyone offering a guaranteed range without seeing your file is selling something. The most credible early estimates come from a licensed personal-injury attorney who reviews medical records and insurance declarations before quoting a number, and who explains clearly which factors could move that number up or down as the case develops.`,
    ],
  };
}

function attorneyDecisionSection(topic: Topic, brand: AutopilotBrand): ExpandedSection {
  const label = topicLabel(topic, brand);
  return {
    heading: "When you should call an attorney",
    paragraphs: [
      `Not every crash needs a lawyer. Fender-benders with no injury, no missed work, and a cooperative insurer can often be resolved directly. The picture shifts the moment any of the following becomes true.`,
    ],
    list: [
      "You received medical treatment beyond a single ER visit — especially imaging (X-ray, CT, MRI) or any specialist referral.",
      "You missed any work — even a single shift — because of the crash.",
      "The crash involved a commercial vehicle (truck, delivery van, government vehicle, rideshare, or a driver on the clock).",
      "Fault is disputed, partially shared, or the police report blames you or “unknown.”",
      "The at-fault driver is uninsured, underinsured, or fled the scene.",
      "The insurer has asked for a recorded statement, a signed medical authorization, or has offered a “quick settlement.”",
      "Your symptoms are evolving — headaches, cognitive changes, persistent neck or back pain, numbness, or sleep disruption.",
      "Anyone in the crash was hospitalized, required surgery, or has a permanent restriction.",
    ],
    table: [
      ["Situation", "Risk of going alone"],
      [`${label} with hospitalization or surgery`, "High — policy limits often exhausted; UM/UIM analysis required."],
      [`${label} with shared or disputed fault`, "High — comparative-fault math can wipe out recovery quickly."],
      [`${label} involving government, commercial, or fleet vehicle`, "High — short notice deadlines and multiple policies."],
      [`Soft-tissue injury, 1–2 weeks PT, cooperative insurer`, "Moderate — manageable, but a free consult costs nothing."],
    ],
  };
}

function localResourcesSection(city: CityProfile | undefined, state: StateProfile | undefined): ExpandedSection | undefined {
  if (!city && !state) return undefined;
  const paragraphs: string[] = [];
  if (city) {
    paragraphs.push(
      `If you were hurt in ${city.city}${state ? `, ${state.state}` : ""}, the nearest care options frequently include ${city.localHospitals.slice(0, 3).join(", ")}. Crash volume in this metro is driven by ${city.majorHighways.slice(0, 3).join(", ")}, and ${city.localTip}`,
    );
  }
  if (state) {
    paragraphs.push(
      `Statewide, ${state.state} drivers carry minimum liability insurance of ${state.insuranceMinimums}. Crash reports in ${state.state} can be requested through the state's Department of Transportation or Department of Public Safety, typically within 10 business days of the incident. If a citation was issued, the criminal-traffic case can run on a separate timeline from the civil claim — but findings can sometimes be used as evidence.`,
    );
  }
  return {
    heading: city ? `Local context for ${city.city}` : `${state?.state} statewide context`,
    paragraphs,
  };
}

function baseFaqs(
  state: StateProfile | undefined,
  city: CityProfile | undefined,
  topic: Topic,
  brand: AutopilotBrand,
): ExpandedFaq[] {
  const stateLabel = state?.state ?? "your state";
  const label = topicLabel(topic, brand);
  const host = brand.siteUrl.replace(/^https?:\/\//, "");
  return [
    {
      question: `How long do I have to file a ${label} claim in ${stateLabel}?`,
      answer: `${stateLabel} sets a ${state?.statuteOfLimitationsYears ?? 2}-year statute of limitations for most personal-injury lawsuits arising from a ${label}, running from the date of the crash. Notice-of-claim deadlines against government vehicles are usually much shorter — sometimes 60 to 180 days — and minors and incapacitated plaintiffs may have tolled deadlines. Treat the headline number as a ceiling, not a target: file or consult an attorney well before it expires so that evidence preservation, medical documentation, and policy investigation are not rushed at the end.`,
    },
    {
      question: `How much does it cost to talk to a ${brand.name}-network attorney?`,
      answer: `Nothing up front. The attorneys in the ${brand.name} network handle ${label}s on a contingency-fee basis — they only get paid if they recover compensation for you, and the fee is a percentage of that recovery agreed in writing before representation begins. The initial consultation is free, and there is no obligation to hire the attorney after the call. ${brand.operator} is a legal referral service, not a law firm; we do not charge consumers.`,
    },
    {
      question: `What if the other driver was uninsured or fled the scene?`,
      answer: `Roughly 1 in 8 U.S. drivers carries no insurance, and hit-and-run rates are climbing in major metros. If the at-fault driver was uninsured or fled, your own uninsured-motorist (UM) coverage is the primary source of recovery, assuming you carry it. Many drivers don't realize they have UM coverage until a lawyer reviews the declarations page of their policy. If UM is in place, the claim is filed against your own carrier — and that insurer will treat you as an adversary even though they are "on your side," so the same evidence and statement-discipline rules apply.`,
    },
    {
      question: `Should I give the other driver's insurance a recorded statement?`,
      answer: `Almost never — at least not before talking with a lawyer. Adjusters call within hours, sound friendly, and frame the recorded statement as a routine formality. In reality, it is a tool to lock in admissions about fault, the timeline of symptoms, and any pre-existing conditions that can later be used to reduce or deny the claim. You are not required to give one to the other driver's insurer at all. You are required to "cooperate" with your own insurer under most policies — but cooperation does not require an unrepresented recorded statement either.`,
    },
    {
      question: `How fast can I get matched with an attorney through ${brand.name}?`,
      answer: `Submitting the form on ${host} or calling ${brand.phoneDisplay} typically returns a callback within about 60 seconds. We use a brief intake to understand the basics — where the crash happened, the injuries, who was involved — and then route to licensed personal-injury attorneys in your state who handle ${label}s. You are never obligated to hire the attorney we connect you with, and the matching service costs you nothing.`,
    },
    {
      question: `Is ${brand.name} a law firm? Can you give me legal advice?`,
      answer: `No. ${brand.operator} is a legal referral service — not a law firm — and we cannot give legal advice or represent you in a case. The blog articles, FAQs, and resources on this site are educational only and reflect general information about ${label}s and personal-injury claims. Specific legal questions about your situation should go to a licensed attorney in ${stateLabel}, who can review your facts, the police report, and your medical records before advising you.`,
    },
  ];
}

function howMatchingWorksSection(topic: Topic, brand: AutopilotBrand): ExpandedSection {
  const label = topicLabel(topic, brand);
  const heading =
    brand.id === "semitruckmatch"
      ? "How SemiTruckMatch matches you with a truck accident attorney"
      : "How WreckMatch matches you with a personal-injury attorney";
  return {
    heading,
    paragraphs: [
      `${brand.name} was built to remove the part of a ${label} that most ${brand.audiencePhrase} hate: spending hours calling firms during recovery, repeating the same painful facts to multiple intake coordinators, and never knowing if they reached an attorney who actually handles this kind of case. Our process replaces all of that with a single intake call that takes about 60 seconds and routes you to a licensed attorney in your state who has agreed in advance to handle ${label}s on contingency.`,
      `The intake asks only what is needed to match: state, what happened in plain language, the rough timeline, whether you were treated medically, and the best contact number. We do not ask for insurance policy numbers, Social Security numbers, or recorded statements. You can stop the call at any time. There is no obligation to retain the attorney we connect you with, and the matching service itself does not cost anything to consumers.`,
      `After the call, the attorney's office typically reaches out within hours — sometimes minutes — to schedule a free consultation. That consultation is a two-way evaluation: the attorney is deciding whether the case is one they can move forward on, and you are deciding whether their experience, communication style, and fee structure feel right for your situation. If the fit is wrong, you owe nothing and can return to ${brand.name} to be re-routed.`,
      `${brand.operator} operates as a legal referral service. We are not a law firm, we do not give legal advice, and we never collect fees from consumers. Our role ends once you are connected with a licensed attorney who can advise you on your specific case under your state's rules of professional responsibility. The educational content on this site — including this article — is general information drawn from publicly available state law, regulatory data, and the experience of practitioners in the ${brand.name} network. It is not a substitute for advice from a lawyer who has reviewed your file.`,
    ],
  };
}

function accidentSurvivalGuideSection(
  state: StateProfile | undefined,
  slug: string,
  brand: AutopilotBrand,
): ExpandedSection {
  const links = asgLinksForBlog(slug, state);
  const stateLine = state
    ? `For ${state.state}-specific checklists and first-24-hour timelines, Accident Survival Guide publishes companion material alongside ${brand.name}'s attorney-matching service.`
    : `Accident Survival Guide is a sister educational brand — focused on checklists, evidence preservation, and what to do in the first hours after a crash.`;
  const linkLines = links.map((l) => `${l.label}: ${l.href}`);
  return {
    heading: "Accident Survival Guide — related checklists & resources",
    paragraphs: [
      stateLine,
      `These pages are educational only (not legal advice) and are designed for victims who want step-by-step guidance before speaking with counsel. WreckMatch LLC operates both ${brand.name} and Accident Survival Guide; connecting with a lawyer through ${brand.name} remains free and separate from downloading or reading ASG materials.`,
      ...linkLines,
    ],
  };
}

function trustAndComplianceSection(brand: AutopilotBrand): ExpandedSection {
  return {
    heading: "Trust, compliance, and what we will never do",
    paragraphs: [
      `${brand.name} is built on a short list of things we will not do — even when it would be commercially convenient. We will not promise a settlement amount before an attorney reviews the file, because nobody can. We will not pressure a recorded statement, because adjusters do enough of that. We will not share your story or contact information with anyone outside the licensed attorney you are matched with and the ${brand.name} operations team that maintains your file. We will not sell your information to data brokers or marketing networks.`,
      `Every article on this site identifies a named author and, where the article touches on legal mechanics, a named legal-context reviewer. Author and reviewer bios are public, link to verified LinkedIn profiles, and describe the actual experience each person brings — not a stock photo and a generic byline. The intent is to make our authority and our limits both visible: we are operators and educators, not licensed attorneys, and the people we work with in the attorney network are.`,
      `If something on this page is incorrect, out of date, or unclear, the fastest way to flag it is to call ${brand.phoneDisplay} or use the contact form on ${brand.siteUrl}. Educational content gets updated when statutes change, when fault rules are revised by a state legislature, or when a court of appeals reshapes how a specific issue is handled in practice. Our goal is that every article on the site reflects what a careful, licensed attorney in the relevant state would say to a friend asking the same question.`,
    ],
  };
}

export function expandPostContent(slug: string, meta: PostMeta): ExpandedContent {
  const brand = autopilotBrand();
  const topic = topicForSlug(slug);
  const state = findState(meta, slug);
  const city = findCity(slug, state);

  const sections: ExpandedSection[] = [
    stateLegalSection(state, topic, brand),
    firstStepsSection(topic, city, brand),
    evidencePitfallsSection(topic),
    caseValueSection(state, topic, brand),
    attorneyDecisionSection(topic, brand),
  ];
  const local = localResourcesSection(city, state);
  if (local) sections.push(local);
  sections.push(howMatchingWorksSection(topic, brand));
  sections.push(accidentSurvivalGuideSection(state, slug, brand));
  sections.push(trustAndComplianceSection(brand));

  return {
    introCallout: state
      ? `${state.state} fast facts: ${state.statuteOfLimitationsYears}-year statute of limitations · ${state.comparativeFault} fault rule · ${state.insuranceMinimums} minimum auto liability insurance${state.noFault ? " · no-fault state" : ""}.`
      : undefined,
    sections,
    faqs: baseFaqs(state, city, topic, brand),
  };
}

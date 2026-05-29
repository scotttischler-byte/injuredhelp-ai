import type { PriorityPlaceEntry } from "@/lib/priority-places/types";
import { PRIORITY_STATE_NAMES } from "@/lib/priority-places/types";

/** Source of truth for enriched geo pages (hub slug = car-accident-help-{placeSlug}). */
export const PRIORITY_PLACES: PriorityPlaceEntry[] = [
  // Texas — Tier 1
  { placeSlug: "houston", city: "Houston", state: "Texas", tier: 1 },
  { placeSlug: "san-antonio", city: "San Antonio", state: "Texas", tier: 1 },
  { placeSlug: "dallas", city: "Dallas", state: "Texas", tier: 1 },
  { placeSlug: "austin", city: "Austin", state: "Texas", tier: 1 },
  { placeSlug: "fort-worth", city: "Fort Worth", state: "Texas", tier: 1 },
  // Texas — Tier 2
  { placeSlug: "el-paso", city: "El Paso", state: "Texas", tier: 2 },
  { placeSlug: "arlington-texas", city: "Arlington", state: "Texas", tier: 2 },
  { placeSlug: "corpus-christi", city: "Corpus Christi", state: "Texas", tier: 2 },
  { placeSlug: "plano", city: "Plano", state: "Texas", tier: 2 },
  { placeSlug: "lubbock", city: "Lubbock", state: "Texas", tier: 2 },
  { placeSlug: "irving", city: "Irving", state: "Texas", tier: 2 },
  {
    placeSlug: "garland",
    city: "Garland",
    state: "Texas",
    tier: 2,
    highways: "I-635, I-30, SH 78, President George Bush Turnpike",
    hospitals: "Baylor Scott & White Garland, Medical City Garland",
    localNote: "Garland sees heavy I-635 and I-30 commuter crashes tied to the Dallas metro.",
    crashVolume: "~4,500+ reported crashes annually in Garland area",
    fatalities: "15+ per year (approx.)",
  },
  {
    placeSlug: "frisco",
    city: "Frisco",
    state: "Texas",
    tier: 2,
    highways: "Dallas North Tollway, SH 121, US-380, Preston Rd",
    hospitals: "Baylor Scott & White Frisco, Medical City Frisco",
    localNote: "Frisco growth corridors see high-speed intersection and parking-lot crashes.",
    crashVolume: "~3,800+ in Collin/Denton county segments",
  },
  {
    placeSlug: "mckinney",
    city: "McKinney",
    state: "Texas",
    tier: 2,
    highways: "US-75, SH 121, SH 380, Eldorado Pkwy",
    hospitals: "Medical City McKinney, Baylor Scott & White McKinney",
    localNote: "McKinney US-75 rush-hour rear-ends and new development zone crashes are common.",
  },
  {
    placeSlug: "grand-prairie",
    city: "Grand Prairie",
    state: "Texas",
    tier: 2,
    highways: "I-20, I-30, SH 360, Belt Line Rd",
    hospitals: "Methodist Grand Prairie, Medical City Arlington (nearby)",
    localNote: "Grand Prairie I-20/I-30 interchange and entertainment district traffic drive injury claims.",
  },
  {
    placeSlug: "amarillo",
    city: "Amarillo",
    state: "Texas",
    tier: 2,
    highways: "I-40, I-27, Loop 335, US-87",
    hospitals: "Northwest Texas Healthcare System (Level II), BSA Hospital",
    localNote: "Panhandle weather and I-40 truck traffic create high-severity Amarillo crashes.",
  },
  {
    placeSlug: "brownsville",
    city: "Brownsville",
    state: "Texas",
    tier: 2,
    highways: "I-69E, US-77, SH 550, International Blvd",
    hospitals: "Valley Baptist Medical Center, Harlingen Medical Center (regional)",
    localNote: "Border metro volume on I-69E and Expressway 83 leads to frequent intersection injuries.",
  },
  {
    placeSlug: "killeen",
    city: "Killeen",
    state: "Texas",
    tier: 2,
    highways: "I-14, US-190, SH 201, Fort Hood Rd corridors",
    hospitals: "Carl R. Darnall Army Medical Center, Seton Medical Center Harker Heights",
    localNote: "Killeen/Fort Hood area sees military commuter and US-190 corridor crashes.",
  },
  {
    placeSlug: "pasadena-texas",
    city: "Pasadena",
    state: "Texas",
    tier: 2,
    highways: "I-45, SH 225, Beltway 8, Spencer Hwy",
    hospitals: "HCA Houston Healthcare Southeast, Bayshore Medical Center",
    localNote: "Pasadena refinery and port-related commercial traffic increases truck and rear-end claims.",
  },
  {
    placeSlug: "laredo",
    city: "Laredo",
    state: "Texas",
    tier: 2,
    highways: "I-35, US-59, Loop 20, World Trade Bridge corridors",
    hospitals: "Laredo Medical Center, Doctors Hospital of Laredo",
    localNote: "Laredo border commerce on I-35 creates heavy truck and intersection crash volume.",
  },
  // California
  {
    placeSlug: "los-angeles",
    city: "Los Angeles",
    state: "California",
    tier: 1,
    highways: "I-405, I-10, I-110, US-101, I-5",
    hospitals: "UCLA Medical Center, Cedars-Sinai, LA County+USC (Level I)",
    localNote: "LA County reports among the highest crash volumes in the U.S.; freeway rear-ends and multi-vehicle pileups dominate.",
    crashVolume: "Tens of thousands of reported crashes annually in LA County",
    fatalities: "300+ traffic deaths per year in county reports",
  },
  { placeSlug: "san-diego", city: "San Diego", state: "California", tier: 1, highways: "I-5, I-8, I-15, SR-163", hospitals: "UC San Diego Health, Scripps Mercy", localNote: "San Diego coastal and I-5 commuter corridors see high injury crash rates." },
  { placeSlug: "san-jose", city: "San Jose", state: "California", tier: 1, highways: "US-101, I-280, I-880, SR-87", hospitals: "Santa Clara Valley Medical, Stanford Health Care", localNote: "Silicon Valley commute zones on 101 and 880 have dense intersection crashes." },
  { placeSlug: "san-francisco", city: "San Francisco", state: "California", tier: 1, highways: "US-101, I-80, Bay Bridge, Golden Gate", hospitals: "Zuckerberg SF General, UCSF", localNote: "SF sees frequent pedestrian, cyclist, and rideshare-involved urban collisions." },
  { placeSlug: "sacramento", city: "Sacramento", state: "California", tier: 2, highways: "I-5, US-50, I-80, SR-99", hospitals: "UC Davis Medical Center, Sutter Medical Center", localNote: "Sacramento I-5 and US-50 merge zones drive regional injury claims." },
  { placeSlug: "fresno", city: "Fresno", state: "California", tier: 2, highways: "CA-99, CA-41, CA-180", hospitals: "Community Regional Medical Center (Level I)", localNote: "Central Valley CA-99 truck and commuter traffic creates severe injury crashes." },
  // Florida
  { placeSlug: "jacksonville", city: "Jacksonville", state: "Florida", tier: 1, highways: "I-95, I-10, I-295, US-1", hospitals: "UF Health Jacksonville, Baptist Medical Center", localNote: "Jacksonville sprawl and I-95 corridor crashes are among Florida's highest-volume zones." },
  { placeSlug: "miami", city: "Miami", state: "Florida", tier: 1, highways: "I-95, Dolphin Expressway, Palmetto, US-1", hospitals: "Jackson Memorial (Level I), University of Miami Hospital", localNote: "Miami-Dade sees heavy tourist, rideshare, and uninsured motorist claims." },
  { placeSlug: "tampa", city: "Tampa", state: "Florida", tier: 1, highways: "I-275, I-4, Veterans Expressway, US-19", hospitals: "Tampa General, AdventHealth Tampa", localNote: "Tampa Bay bridges and I-275 merge areas drive multi-vehicle injury cases." },
  { placeSlug: "orlando", city: "Orlando", state: "Florida", tier: 1, highways: "I-4, Florida Turnpike, SR-408, US-441", hospitals: "Orlando Health ORMC, AdventHealth Orlando", localNote: "Orlando tourist traffic on I-4 creates frequent rear-end and intersection injuries." },
  // Georgia
  { placeSlug: "atlanta", city: "Atlanta", state: "Georgia", tier: 1, highways: "I-75, I-85, I-20, GA-400, I-285", hospitals: "Grady Memorial (Level I), Emory University Hospital", localNote: "Metro Atlanta I-285 and connector crashes rank among the deadliest urban corridors in the U.S." },
  { placeSlug: "columbus-georgia", city: "Columbus", state: "Georgia", tier: 2, highways: "I-185, US-80, US-27, J.R. Allen Pkwy", hospitals: "Piedmont Columbus Regional", localNote: "Columbus military and I-185 corridor traffic drives regional injury volume." },
  { placeSlug: "augusta", city: "Augusta", state: "Georgia", tier: 2, highways: "I-20, I-520, US-1, Gordon Hwy", hospitals: "AU Medical Center, Doctors Hospital", localNote: "Augusta I-20 cross-state truck and commuter crashes are common." },
  { placeSlug: "savannah", city: "Savannah", state: "Georgia", tier: 2, highways: "I-16, I-95, US-80, President St", hospitals: "Memorial Health University Medical Center", localNote: "Savannah port logistics and I-16/I-95 tourism traffic increase commercial vehicle claims." },
  // Illinois
  { placeSlug: "chicago", city: "Chicago", state: "Illinois", tier: 1, highways: "I-90/94 (Kennedy/Dan Ryan), I-290, Lake Shore Dr, I-55", hospitals: "Northwestern Memorial, University of Chicago Medicine", localNote: "Cook County crash volume is among the highest nationally; winter weather and rideshare claims are common." },
  { placeSlug: "aurora-illinois", city: "Aurora", state: "Illinois", tier: 2, highways: "I-88, I-55, US-30, IL-59", hospitals: "Rush Copley, Amita Mercy", localNote: "Aurora (Illinois) I-88 and I-55 suburban commuter crashes drive Kane County claims." },
  { placeSlug: "joliet", city: "Joliet", state: "Illinois", tier: 2, highways: "I-80, I-55, US-6, IL-53", hospitals: "Silver Cross Hospital, AMITA Saint Joseph", localNote: "Joliet I-80 truck corridor sees high-severity interstate crashes." },
  // Alabama
  { placeSlug: "birmingham", city: "Birmingham", state: "Alabama", tier: 1, highways: "I-65, I-20/59, US-280, Red Mountain Expressway", hospitals: "UAB Hospital (Level I), Grandview Medical Center", localNote: "Birmingham I-65/I-20 interchange and metro commuter crashes dominate Jefferson County." },
  { placeSlug: "montgomery", city: "Montgomery", state: "Alabama", tier: 2, highways: "I-65, I-85, Eastern Blvd, US-231", hospitals: "Baptist Medical Center South, Jackson Hospital", localNote: "Montgomery state capital traffic on I-65 and Eastern Blvd sees frequent intersection injuries." },
  { placeSlug: "mobile", city: "Mobile", state: "Alabama", tier: 2, highways: "I-10, I-65, US-90, Causeway", hospitals: "USA Health University Hospital, Providence Hospital", localNote: "Mobile port and I-10 coastal corridor crashes involve heavy commercial traffic." },
  // Tennessee
  { placeSlug: "nashville", city: "Nashville", state: "Tennessee", tier: 1, highways: "I-40, I-24, I-65, Briley Pkwy", hospitals: "Vanderbilt University Medical Center, TriStar Centennial", localNote: "Davidson County growth and I-40/I-65 merge zones drive rising crash severity." },
  { placeSlug: "memphis", city: "Memphis", state: "Tennessee", tier: 1, highways: "I-40, I-55, I-240, US-64", hospitals: "Regional One Health (Level I), Baptist Memorial", localNote: "Memphis logistics hub on I-40/I-55 sees frequent truck and interstate injury claims." },
  { placeSlug: "knoxville", city: "Knoxville", state: "Tennessee", tier: 2, highways: "I-40, I-75, Pellissippi Pkwy, US-441", hospitals: "UT Medical Center, Tennova Turkey Creek", localNote: "Knoxville I-40/I-75 truck and university commuter traffic creates regional crash clusters." },
  // Colorado
  { placeSlug: "denver", city: "Denver", state: "Colorado", tier: 1, highways: "I-25, I-70, I-225, US-36", hospitals: "Denver Health, UCHealth University of Colorado Hospital", localNote: "Denver metro I-25 and I-70 see weather-related and high-speed injury crashes." },
  { placeSlug: "colorado-springs", city: "Colorado Springs", state: "Colorado", tier: 2, highways: "I-25, US-24, Powers Blvd, Academy Blvd", hospitals: "UCHealth Memorial Central, Penrose Hospital", localNote: "Colorado Springs military and I-25 corridor crashes are common in El Paso County." },
  { placeSlug: "aurora-colorado", city: "Aurora", state: "Colorado", tier: 2, highways: "I-225, I-70, E-470, Colfax Ave", hospitals: "UCHealth University of Colorado Hospital, Medical Center of Aurora", localNote: "Aurora (Colorado) E-470 and I-225 commuter zones see dense multi-vehicle crashes." },
  { placeSlug: "fort-collins", city: "Fort Collins", state: "Colorado", tier: 2, highways: "I-25, Harmony Rd, College Ave, US-287", hospitals: "UCHealth Poudre Valley Hospital", localNote: "Fort Collins I-25 corridor and winter-weather crashes are common in Larimer County." },
  { placeSlug: "lakewood", city: "Lakewood", state: "Colorado", tier: 2, highways: "I-70, US-6, Wadsworth Blvd, C-470", hospitals: "St. Anthony Hospital, Lutheran Medical Center", localNote: "Lakewood I-70 gateway traffic and Denver-metro commuter crashes drive injury claims." },
  // Washington
  { placeSlug: "seattle", city: "Seattle", state: "Washington", tier: 1, highways: "I-5, I-90, SR-520, Aurora Ave", hospitals: "Harborview Medical Center (Level I), Swedish Medical Center", localNote: "King County I-5 and bridge corridors see pedestrian and rideshare-involved urban crashes." },
  { placeSlug: "spokane", city: "Spokane", state: "Washington", tier: 2, highways: "I-90, US-2, US-395, Division St", hospitals: "Providence Sacred Heart, MultiCare Deaconess", localNote: "Spokane I-90 cross-state truck and winter-weather crashes drive injury volume." },
  { placeSlug: "tacoma", city: "Tacoma", state: "Washington", tier: 2, highways: "I-5, SR-16, I-705, Pacific Ave", hospitals: "MultiCare Tacoma General, St. Joseph Medical Center", localNote: "Tacoma port and I-5 Pierce County segments see commercial and commuter injury claims." },
  // New York City focus
  {
    placeSlug: "new-york-city",
    city: "New York City",
    state: "New York",
    tier: 1,
    highways: "FDR Drive, West Side Hwy, Brooklyn-Queens Expressway, major bridges/tunnels",
    hospitals: "Bellevue, NYU Langone, NewYork-Presbyterian",
    localNote: "NYC reports tens of thousands of motor vehicle crashes annually across five boroughs — pedestrian and taxi/rideshare claims are common.",
    crashVolume: "60,000+ reported crashes annually (citywide)",
  },
  {
    placeSlug: "manhattan",
    city: "Manhattan",
    state: "New York",
    tier: 1,
    highways: "FDR Drive, West Side Hwy, Canal St, Broadway corridors",
    hospitals: "Bellevue, NYU Langone, Mount Sinai",
    localNote: "Manhattan dense grid, taxi, and delivery vehicle crashes dominate Downtown and Midtown injury claims.",
  },
  {
    placeSlug: "brooklyn",
    city: "Brooklyn",
    state: "New York",
    tier: 1,
    highways: "BQE, Atlantic Ave, Flatbush Ave, Ocean Pkwy",
    hospitals: "Maimonides, NYU Langone Brooklyn, Kings County Hospital",
    localNote: "Brooklyn BQE and Atlantic Ave corridors see high-speed and intersection injury crashes.",
  },
  {
    placeSlug: "queens",
    city: "Queens",
    state: "New York",
    tier: 1,
    highways: "Grand Central Pkwy, LIE (I-495), Van Wyck, Northern Blvd",
    hospitals: "Elmhurst Hospital, NYC Health + Hospitals/Queens",
    localNote: "Queens airport and LIE commuter traffic create multi-vehicle and pedestrian claims.",
  },
  {
    placeSlug: "bronx",
    city: "Bronx",
    state: "New York",
    tier: 1,
    highways: "Cross Bronx Expressway, Major Deegan, Bruckner Blvd",
    hospitals: "Jacobi Medical Center, Montefiore Medical Center",
    localNote: "Bronx Cross Bronx Expressway ranks among the highest injury corridors in New York State.",
  },
];

export const PRIORITY_PLACE_BY_SLUG = new Map(PRIORITY_PLACES.map((p) => [p.placeSlug, p]));

export const ACCIDENT_VARIANT_CITIES: { placeSlug: string; city: string; state: string }[] = [
  { placeSlug: "houston", city: "Houston", state: "Texas" },
  { placeSlug: "dallas", city: "Dallas", state: "Texas" },
  { placeSlug: "austin", city: "Austin", state: "Texas" },
  { placeSlug: "los-angeles", city: "Los Angeles", state: "California" },
  { placeSlug: "chicago", city: "Chicago", state: "Illinois" },
  { placeSlug: "atlanta", city: "Atlanta", state: "Georgia" },
  { placeSlug: "miami", city: "Miami", state: "Florida" },
  { placeSlug: "nashville", city: "Nashville", state: "Tennessee" },
];

export function hubSlugForPlace(placeSlug: string): string {
  return `car-accident-help-${placeSlug}`;
}

export function placeSlugFromHubSlug(hubSlug: string): string | null {
  const prefix = "car-accident-help-";
  if (!hubSlug.startsWith(prefix)) return null;
  const slug = hubSlug.slice(prefix.length);
  return PRIORITY_PLACE_BY_SLUG.has(slug) ? slug : null;
}

export function isPriorityState(stateName: string): boolean {
  return (PRIORITY_STATE_NAMES as readonly string[]).includes(stateName);
}

export function priorityPlacesForState(stateName: string): PriorityPlaceEntry[] {
  return PRIORITY_PLACES.filter((p) => p.state === stateName);
}

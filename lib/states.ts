export type ComparativeFaultRule =
  | "Pure comparative"
  | "Modified 50%"
  | "Modified 51%"
  | "Modified comparative"
  | "Contributory";

export interface StateProfile {
  slug: string;
  state: string;
  abbreviation: string;
  statuteOfLimitationsYears: number;
  noFault: boolean;
  comparativeFault: ComparativeFaultRule | string;
  avgSettlementRange: string;
  majorCities: string[];
  localTip: string;
  insuranceMinimums: string;
}

export const ALL_STATES: StateProfile[] = [
  {
    "slug": "car-accident-lawyer-alabama",
    "state": "Alabama",
    "abbreviation": "AL",
    "statuteOfLimitationsYears": 2,
    "noFault": false,
    "comparativeFault": "Contributory",
    "avgSettlementRange": "$18k–$95k",
    "majorCities": [
      "Birmingham",
      "Montgomery",
      "Huntsville",
      "Mobile"
    ],
    "localTip": "In Alabama, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "25/50/25"
  },
  {
    "slug": "car-accident-lawyer-alaska",
    "state": "Alaska",
    "abbreviation": "AK",
    "statuteOfLimitationsYears": 2,
    "noFault": false,
    "comparativeFault": "Pure comparative",
    "avgSettlementRange": "$25k–$120k",
    "majorCities": [
      "Anchorage",
      "Fairbanks",
      "Juneau",
      "Wasilla"
    ],
    "localTip": "In Alaska, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "50/100/25"
  },
  {
    "slug": "car-accident-lawyer-arizona",
    "state": "Arizona",
    "abbreviation": "AZ",
    "statuteOfLimitationsYears": 2,
    "noFault": false,
    "comparativeFault": "Pure comparative",
    "avgSettlementRange": "$20k–$110k",
    "majorCities": [
      "Phoenix",
      "Tucson",
      "Mesa",
      "Chandler",
      "Scottsdale",
      "Glendale"
    ],
    "localTip": "In Arizona, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "25/50/15"
  },
  {
    "slug": "car-accident-lawyer-arkansas",
    "state": "Arkansas",
    "abbreviation": "AR",
    "statuteOfLimitationsYears": 3,
    "noFault": false,
    "comparativeFault": "Modified 50%",
    "avgSettlementRange": "$17k–$90k",
    "majorCities": [
      "Little Rock",
      "Fort Smith",
      "Fayetteville",
      "Springdale"
    ],
    "localTip": "In Arkansas, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "25/50/25"
  },
  {
    "slug": "car-accident-lawyer-california",
    "state": "California",
    "abbreviation": "CA",
    "statuteOfLimitationsYears": 2,
    "noFault": false,
    "comparativeFault": "Pure comparative",
    "avgSettlementRange": "$25k–$250k+",
    "majorCities": [
      "Los Angeles",
      "San Diego",
      "San Jose",
      "San Francisco",
      "Sacramento",
      "Fresno"
    ],
    "localTip": "In California, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "15/30/5"
  },
  {
    "slug": "car-accident-lawyer-colorado",
    "state": "Colorado",
    "abbreviation": "CO",
    "statuteOfLimitationsYears": 2,
    "noFault": false,
    "comparativeFault": "Modified 50%",
    "avgSettlementRange": "$22k–$130k",
    "majorCities": [
      "Denver",
      "Colorado Springs",
      "Aurora",
      "Fort Collins",
      "Lakewood"
    ],
    "localTip": "In Colorado, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "25/50/15"
  },
  {
    "slug": "car-accident-lawyer-connecticut",
    "state": "Connecticut",
    "abbreviation": "CT",
    "statuteOfLimitationsYears": 2,
    "noFault": false,
    "comparativeFault": "Modified 50%",
    "avgSettlementRange": "$24k–$140k",
    "majorCities": [
      "Bridgeport",
      "New Haven",
      "Hartford",
      "Stamford"
    ],
    "localTip": "In Connecticut, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "25/50/25"
  },
  {
    "slug": "car-accident-lawyer-delaware",
    "state": "Delaware",
    "abbreviation": "DE",
    "statuteOfLimitationsYears": 2,
    "noFault": false,
    "comparativeFault": "Modified comparative",
    "avgSettlementRange": "$22k–$115k",
    "majorCities": [
      "Wilmington",
      "Dover",
      "Newark",
      "Middletown"
    ],
    "localTip": "In Delaware, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "25/50/10"
  },
  {
    "slug": "car-accident-lawyer-district-of-columbia",
    "state": "District of Columbia",
    "abbreviation": "DC",
    "statuteOfLimitationsYears": 3,
    "noFault": false,
    "comparativeFault": "Pure comparative",
    "avgSettlementRange": "$30k–$200k+",
    "majorCities": [
      "Washington"
    ],
    "localTip": "In District of Columbia, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "25/50/10"
  },
  {
    "slug": "car-accident-lawyer-florida",
    "state": "Florida",
    "abbreviation": "FL",
    "statuteOfLimitationsYears": 4,
    "noFault": true,
    "comparativeFault": "Pure comparative",
    "avgSettlementRange": "$20k–$180k",
    "majorCities": [
      "Miami",
      "Tampa",
      "Orlando",
      "Jacksonville",
      "Fort Lauderdale",
      "Tallahassee"
    ],
    "localTip": "In Florida, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "10/20/10 (PIP required)"
  },
  {
    "slug": "car-accident-lawyer-georgia",
    "state": "Georgia",
    "abbreviation": "GA",
    "statuteOfLimitationsYears": 2,
    "noFault": false,
    "comparativeFault": "Modified 50%",
    "avgSettlementRange": "$20k–$150k",
    "majorCities": [
      "Atlanta",
      "Augusta",
      "Columbus",
      "Savannah",
      "Athens"
    ],
    "localTip": "In Georgia, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "25/50/25"
  },
  {
    "slug": "car-accident-lawyer-hawaii",
    "state": "Hawaii",
    "abbreviation": "HI",
    "statuteOfLimitationsYears": 2,
    "noFault": true,
    "comparativeFault": "Modified 51%",
    "avgSettlementRange": "$25k–$130k",
    "majorCities": [
      "Honolulu",
      "Hilo",
      "Kailua",
      "Kapolei"
    ],
    "localTip": "In Hawaii, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "20/40/10"
  },
  {
    "slug": "car-accident-lawyer-idaho",
    "state": "Idaho",
    "abbreviation": "ID",
    "statuteOfLimitationsYears": 2,
    "noFault": false,
    "comparativeFault": "Modified comparative",
    "avgSettlementRange": "$18k–$95k",
    "majorCities": [
      "Boise",
      "Meridian",
      "Nampa",
      "Idaho Falls"
    ],
    "localTip": "In Idaho, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "25/50/15"
  },
  {
    "slug": "car-accident-lawyer-illinois",
    "state": "Illinois",
    "abbreviation": "IL",
    "statuteOfLimitationsYears": 2,
    "noFault": false,
    "comparativeFault": "Modified 50%",
    "avgSettlementRange": "$22k–$160k",
    "majorCities": [
      "Chicago",
      "Aurora",
      "Naperville",
      "Joliet",
      "Rockford"
    ],
    "localTip": "In Illinois, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "25/50/20"
  },
  {
    "slug": "car-accident-lawyer-indiana",
    "state": "Indiana",
    "abbreviation": "IN",
    "statuteOfLimitationsYears": 2,
    "noFault": false,
    "comparativeFault": "Modified 51%",
    "avgSettlementRange": "$18k–$110k",
    "majorCities": [
      "Indianapolis",
      "Fort Wayne",
      "Evansville",
      "South Bend"
    ],
    "localTip": "In Indiana, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "25/50/25"
  },
  {
    "slug": "car-accident-lawyer-iowa",
    "state": "Iowa",
    "abbreviation": "IA",
    "statuteOfLimitationsYears": 2,
    "noFault": false,
    "comparativeFault": "Modified comparative",
    "avgSettlementRange": "$18k–$100k",
    "majorCities": [
      "Des Moines",
      "Cedar Rapids",
      "Davenport",
      "Sioux City"
    ],
    "localTip": "In Iowa, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "20/40/15"
  },
  {
    "slug": "car-accident-lawyer-kansas",
    "state": "Kansas",
    "abbreviation": "KS",
    "statuteOfLimitationsYears": 2,
    "noFault": false,
    "comparativeFault": "Modified 50%",
    "avgSettlementRange": "$18k–$105k",
    "majorCities": [
      "Wichita",
      "Overland Park",
      "Kansas City",
      "Olathe"
    ],
    "localTip": "In Kansas, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "25/50/25"
  },
  {
    "slug": "car-accident-lawyer-kentucky",
    "state": "Kentucky",
    "abbreviation": "KY",
    "statuteOfLimitationsYears": 1,
    "noFault": true,
    "comparativeFault": "Pure comparative",
    "avgSettlementRange": "$17k–$100k",
    "majorCities": [
      "Louisville",
      "Lexington",
      "Bowling Green",
      "Owensboro"
    ],
    "localTip": "In Kentucky, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "25/50/25"
  },
  {
    "slug": "car-accident-lawyer-louisiana",
    "state": "Louisiana",
    "abbreviation": "LA",
    "statuteOfLimitationsYears": 1,
    "noFault": false,
    "comparativeFault": "Pure comparative",
    "avgSettlementRange": "$20k–$120k",
    "majorCities": [
      "New Orleans",
      "Baton Rouge",
      "Shreveport",
      "Lafayette"
    ],
    "localTip": "In Louisiana, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "15/30/25"
  },
  {
    "slug": "car-accident-lawyer-maine",
    "state": "Maine",
    "abbreviation": "ME",
    "statuteOfLimitationsYears": 6,
    "noFault": false,
    "comparativeFault": "Modified 50%",
    "avgSettlementRange": "$20k–$105k",
    "majorCities": [
      "Portland",
      "Lewiston",
      "Bangor",
      "South Portland"
    ],
    "localTip": "In Maine, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "50/100/25"
  },
  {
    "slug": "car-accident-lawyer-maryland",
    "state": "Maryland",
    "abbreviation": "MD",
    "statuteOfLimitationsYears": 3,
    "noFault": false,
    "comparativeFault": "Contributory",
    "avgSettlementRange": "$24k–$150k",
    "majorCities": [
      "Baltimore",
      "Columbia",
      "Germantown",
      "Silver Spring"
    ],
    "localTip": "In Maryland, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "30/60/15"
  },
  {
    "slug": "car-accident-lawyer-massachusetts",
    "state": "Massachusetts",
    "abbreviation": "MA",
    "statuteOfLimitationsYears": 3,
    "noFault": true,
    "comparativeFault": "Modified 51%",
    "avgSettlementRange": "$25k–$160k",
    "majorCities": [
      "Boston",
      "Worcester",
      "Springfield",
      "Cambridge",
      "Lowell"
    ],
    "localTip": "In Massachusetts, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "20/40/5 (PIP)"
  },
  {
    "slug": "car-accident-lawyer-michigan",
    "state": "Michigan",
    "abbreviation": "MI",
    "statuteOfLimitationsYears": 3,
    "noFault": true,
    "comparativeFault": "Modified 51%",
    "avgSettlementRange": "$20k–$130k",
    "majorCities": [
      "Detroit",
      "Grand Rapids",
      "Warren",
      "Ann Arbor",
      "Lansing"
    ],
    "localTip": "In Michigan, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "50/100/10 (PIP)"
  },
  {
    "slug": "car-accident-lawyer-minnesota",
    "state": "Minnesota",
    "abbreviation": "MN",
    "statuteOfLimitationsYears": 2,
    "noFault": true,
    "comparativeFault": "Modified comparative",
    "avgSettlementRange": "$22k–$125k",
    "majorCities": [
      "Minneapolis",
      "Saint Paul",
      "Rochester",
      "Duluth"
    ],
    "localTip": "In Minnesota, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "30/60/10"
  },
  {
    "slug": "car-accident-lawyer-mississippi",
    "state": "Mississippi",
    "abbreviation": "MS",
    "statuteOfLimitationsYears": 3,
    "noFault": false,
    "comparativeFault": "Pure comparative",
    "avgSettlementRange": "$16k–$90k",
    "majorCities": [
      "Jackson",
      "Gulfport",
      "Southaven",
      "Hattiesburg"
    ],
    "localTip": "In Mississippi, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "25/50/25"
  },
  {
    "slug": "car-accident-lawyer-missouri",
    "state": "Missouri",
    "abbreviation": "MO",
    "statuteOfLimitationsYears": 5,
    "noFault": false,
    "comparativeFault": "Pure comparative",
    "avgSettlementRange": "$19k–$115k",
    "majorCities": [
      "Kansas City",
      "St. Louis",
      "Springfield",
      "Columbia"
    ],
    "localTip": "In Missouri, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "25/50/25"
  },
  {
    "slug": "car-accident-lawyer-montana",
    "state": "Montana",
    "abbreviation": "MT",
    "statuteOfLimitationsYears": 3,
    "noFault": false,
    "comparativeFault": "Modified comparative",
    "avgSettlementRange": "$18k–$95k",
    "majorCities": [
      "Billings",
      "Missoula",
      "Great Falls",
      "Bozeman"
    ],
    "localTip": "In Montana, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "25/50/20"
  },
  {
    "slug": "car-accident-lawyer-nebraska",
    "state": "Nebraska",
    "abbreviation": "NE",
    "statuteOfLimitationsYears": 4,
    "noFault": false,
    "comparativeFault": "Modified comparative",
    "avgSettlementRange": "$18k–$100k",
    "majorCities": [
      "Omaha",
      "Lincoln",
      "Bellevue",
      "Grand Island"
    ],
    "localTip": "In Nebraska, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "25/50/25"
  },
  {
    "slug": "car-accident-lawyer-nevada",
    "state": "Nevada",
    "abbreviation": "NV",
    "statuteOfLimitationsYears": 2,
    "noFault": false,
    "comparativeFault": "Modified comparative",
    "avgSettlementRange": "$22k–$130k",
    "majorCities": [
      "Las Vegas",
      "Henderson",
      "Reno",
      "North Las Vegas"
    ],
    "localTip": "In Nevada, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "25/50/20"
  },
  {
    "slug": "car-accident-lawyer-new-hampshire",
    "state": "New Hampshire",
    "abbreviation": "NH",
    "statuteOfLimitationsYears": 3,
    "noFault": false,
    "comparativeFault": "Modified comparative",
    "avgSettlementRange": "$22k–$120k",
    "majorCities": [
      "Manchester",
      "Nashua",
      "Concord",
      "Derry"
    ],
    "localTip": "In New Hampshire, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "25/50/25"
  },
  {
    "slug": "car-accident-lawyer-new-jersey",
    "state": "New Jersey",
    "abbreviation": "NJ",
    "statuteOfLimitationsYears": 2,
    "noFault": true,
    "comparativeFault": "Modified comparative",
    "avgSettlementRange": "$25k–$170k",
    "majorCities": [
      "Newark",
      "Jersey City",
      "Paterson",
      "Elizabeth",
      "Edison"
    ],
    "localTip": "In New Jersey, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "15/30/5 (PIP)"
  },
  {
    "slug": "car-accident-lawyer-new-mexico",
    "state": "New Mexico",
    "abbreviation": "NM",
    "statuteOfLimitationsYears": 3,
    "noFault": false,
    "comparativeFault": "Pure comparative",
    "avgSettlementRange": "$18k–$100k",
    "majorCities": [
      "Albuquerque",
      "Las Cruces",
      "Rio Rancho",
      "Santa Fe"
    ],
    "localTip": "In New Mexico, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "25/50/10"
  },
  {
    "slug": "car-accident-lawyer-new-york",
    "state": "New York",
    "abbreviation": "NY",
    "statuteOfLimitationsYears": 3,
    "noFault": true,
    "comparativeFault": "Pure comparative",
    "avgSettlementRange": "$28k–$220k+",
    "majorCities": [
      "New York City",
      "Buffalo",
      "Rochester",
      "Syracuse",
      "Albany"
    ],
    "localTip": "In New York, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "25/50/10 (PIP)"
  },
  {
    "slug": "car-accident-lawyer-north-carolina",
    "state": "North Carolina",
    "abbreviation": "NC",
    "statuteOfLimitationsYears": 3,
    "noFault": false,
    "comparativeFault": "Contributory",
    "avgSettlementRange": "$20k–$140k",
    "majorCities": [
      "Charlotte",
      "Raleigh",
      "Greensboro",
      "Durham",
      "Winston-Salem"
    ],
    "localTip": "In North Carolina, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "30/60/25"
  },
  {
    "slug": "car-accident-lawyer-north-dakota",
    "state": "North Dakota",
    "abbreviation": "ND",
    "statuteOfLimitationsYears": 6,
    "noFault": true,
    "comparativeFault": "Modified 50%",
    "avgSettlementRange": "$18k–$95k",
    "majorCities": [
      "Fargo",
      "Bismarck",
      "Grand Forks",
      "Minot"
    ],
    "localTip": "In North Dakota, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "25/50/25"
  },
  {
    "slug": "car-accident-lawyer-ohio",
    "state": "Ohio",
    "abbreviation": "OH",
    "statuteOfLimitationsYears": 2,
    "noFault": false,
    "comparativeFault": "Modified 51%",
    "avgSettlementRange": "$19k–$120k",
    "majorCities": [
      "Columbus",
      "Cleveland",
      "Cincinnati",
      "Toledo",
      "Akron"
    ],
    "localTip": "In Ohio, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "25/50/25"
  },
  {
    "slug": "car-accident-lawyer-oklahoma",
    "state": "Oklahoma",
    "abbreviation": "OK",
    "statuteOfLimitationsYears": 2,
    "noFault": false,
    "comparativeFault": "Modified 51%",
    "avgSettlementRange": "$17k–$100k",
    "majorCities": [
      "Oklahoma City",
      "Tulsa",
      "Norman",
      "Broken Arrow"
    ],
    "localTip": "In Oklahoma, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "25/50/25"
  },
  {
    "slug": "car-accident-lawyer-oregon",
    "state": "Oregon",
    "abbreviation": "OR",
    "statuteOfLimitationsYears": 2,
    "noFault": false,
    "comparativeFault": "Modified 50%",
    "avgSettlementRange": "$22k–$125k",
    "majorCities": [
      "Portland",
      "Salem",
      "Eugene",
      "Gresham"
    ],
    "localTip": "In Oregon, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "25/50/20"
  },
  {
    "slug": "car-accident-lawyer-pennsylvania",
    "state": "Pennsylvania",
    "abbreviation": "PA",
    "statuteOfLimitationsYears": 2,
    "noFault": true,
    "comparativeFault": "Modified 51%",
    "avgSettlementRange": "$22k–$150k",
    "majorCities": [
      "Philadelphia",
      "Pittsburgh",
      "Allentown",
      "Erie",
      "Reading"
    ],
    "localTip": "In Pennsylvania, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "15/30/5 (PIP)"
  },
  {
    "slug": "car-accident-lawyer-rhode-island",
    "state": "Rhode Island",
    "abbreviation": "RI",
    "statuteOfLimitationsYears": 3,
    "noFault": false,
    "comparativeFault": "Pure comparative",
    "avgSettlementRange": "$22k–$115k",
    "majorCities": [
      "Providence",
      "Warwick",
      "Cranston",
      "Pawtucket"
    ],
    "localTip": "In Rhode Island, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "25/50/25"
  },
  {
    "slug": "car-accident-lawyer-south-carolina",
    "state": "South Carolina",
    "abbreviation": "SC",
    "statuteOfLimitationsYears": 3,
    "noFault": false,
    "comparativeFault": "Modified 51%",
    "avgSettlementRange": "$18k–$110k",
    "majorCities": [
      "Charleston",
      "Columbia",
      "North Charleston",
      "Mount Pleasant"
    ],
    "localTip": "In South Carolina, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "25/50/25"
  },
  {
    "slug": "car-accident-lawyer-south-dakota",
    "state": "South Dakota",
    "abbreviation": "SD",
    "statuteOfLimitationsYears": 3,
    "noFault": false,
    "comparativeFault": "Modified comparative",
    "avgSettlementRange": "$17k–$95k",
    "majorCities": [
      "Sioux Falls",
      "Rapid City",
      "Aberdeen",
      "Brookings"
    ],
    "localTip": "In South Dakota, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "25/50/25"
  },
  {
    "slug": "car-accident-lawyer-tennessee",
    "state": "Tennessee",
    "abbreviation": "TN",
    "statuteOfLimitationsYears": 1,
    "noFault": false,
    "comparativeFault": "Modified 50%",
    "avgSettlementRange": "$18k–$110k",
    "majorCities": [
      "Nashville",
      "Memphis",
      "Knoxville",
      "Chattanooga"
    ],
    "localTip": "In Tennessee, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "25/50/25"
  },
  {
    "slug": "car-accident-lawyer-texas",
    "state": "Texas",
    "abbreviation": "TX",
    "statuteOfLimitationsYears": 2,
    "noFault": false,
    "comparativeFault": "Modified 51%",
    "avgSettlementRange": "$22k–$180k",
    "majorCities": [
      "Houston",
      "San Antonio",
      "Dallas",
      "Austin",
      "Fort Worth",
      "El Paso",
      "Corpus Christi",
      "Plano",
      "Lubbock",
      "Irving"
    ],
    "localTip": "In Texas, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "30/60/25"
  },
  {
    "slug": "car-accident-lawyer-utah",
    "state": "Utah",
    "abbreviation": "UT",
    "statuteOfLimitationsYears": 4,
    "noFault": true,
    "comparativeFault": "Modified 50%",
    "avgSettlementRange": "$20k–$115k",
    "majorCities": [
      "Salt Lake City",
      "West Valley City",
      "Provo",
      "West Jordan"
    ],
    "localTip": "In Utah, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "25/65/15"
  },
  {
    "slug": "car-accident-lawyer-vermont",
    "state": "Vermont",
    "abbreviation": "VT",
    "statuteOfLimitationsYears": 3,
    "noFault": false,
    "comparativeFault": "Modified comparative",
    "avgSettlementRange": "$20k–$105k",
    "majorCities": [
      "Burlington",
      "South Burlington",
      "Rutland",
      "Essex"
    ],
    "localTip": "In Vermont, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "25/50/10"
  },
  {
    "slug": "car-accident-lawyer-virginia",
    "state": "Virginia",
    "abbreviation": "VA",
    "statuteOfLimitationsYears": 2,
    "noFault": false,
    "comparativeFault": "Contributory",
    "avgSettlementRange": "$22k–$135k",
    "majorCities": [
      "Virginia Beach",
      "Norfolk",
      "Chesapeake",
      "Richmond",
      "Arlington"
    ],
    "localTip": "In Virginia, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "30/60/20"
  },
  {
    "slug": "car-accident-lawyer-washington",
    "state": "Washington",
    "abbreviation": "WA",
    "statuteOfLimitationsYears": 3,
    "noFault": false,
    "comparativeFault": "Pure comparative",
    "avgSettlementRange": "$23k–$140k",
    "majorCities": [
      "Seattle",
      "Spokane",
      "Tacoma",
      "Vancouver",
      "Bellevue"
    ],
    "localTip": "In Washington, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "25/50/10"
  },
  {
    "slug": "car-accident-lawyer-west-virginia",
    "state": "West Virginia",
    "abbreviation": "WV",
    "statuteOfLimitationsYears": 2,
    "noFault": false,
    "comparativeFault": "Modified 50%",
    "avgSettlementRange": "$17k–$95k",
    "majorCities": [
      "Charleston",
      "Huntington",
      "Morgantown",
      "Parkersburg"
    ],
    "localTip": "In West Virginia, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "25/50/25"
  },
  {
    "slug": "car-accident-lawyer-wisconsin",
    "state": "Wisconsin",
    "abbreviation": "WI",
    "statuteOfLimitationsYears": 3,
    "noFault": false,
    "comparativeFault": "Modified comparative",
    "avgSettlementRange": "$20k–$120k",
    "majorCities": [
      "Milwaukee",
      "Madison",
      "Green Bay",
      "Kenosha"
    ],
    "localTip": "In Wisconsin, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "25/50/10"
  },
  {
    "slug": "car-accident-lawyer-wyoming",
    "state": "Wyoming",
    "abbreviation": "WY",
    "statuteOfLimitationsYears": 4,
    "noFault": false,
    "comparativeFault": "Modified comparative",
    "avgSettlementRange": "$18k–$100k",
    "majorCities": [
      "Cheyenne",
      "Casper",
      "Laramie",
      "Gillette"
    ],
    "localTip": "In Wyoming, deadlines and insurance rules can change how claims are handled. Document medical care early and avoid recorded statements without guidance.",
    "insuranceMinimums": "25/50/20"
  }
];

export function getStateBySlug(slug: string): StateProfile | undefined {
  return ALL_STATES.find((s) => s.slug === slug);
}

export function getAllStateSlugs(): string[] {
  return ALL_STATES.map((s) => s.slug);
}

export const ACCIDENT_TYPES = [
  "Car Accident",
  "Truck Accident",
  "Uber / Lyft / Rideshare",
  "Motorcycle Accident",
  "Other",
] as const;

export type AccidentType = (typeof ACCIDENT_TYPES)[number];

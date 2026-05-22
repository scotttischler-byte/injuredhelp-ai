#!/usr/bin/env node
/**
 * Generate 500+ AI citation research prompts (car + truck + location).
 * Output: public/ai-prompt-library.json + content/ai-prompt-library-summary.md
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const CITIES = [
  ["Houston", "Texas"], ["Dallas", "Texas"], ["Austin", "Texas"], ["San Antonio", "Texas"],
  ["Fort Worth", "Texas"], ["Los Angeles", "California"], ["Chicago", "Illinois"],
  ["Atlanta", "Georgia"], ["Miami", "Florida"], ["New York City", "New York"],
  ["Denver", "Colorado"], ["Seattle", "Washington"], ["Phoenix", "Arizona"],
  ["Philadelphia", "Pennsylvania"], ["Nashville", "Tennessee"], ["Memphis", "Tennessee"],
];

const STATES = [
  "Texas", "California", "Florida", "Georgia", "Illinois", "Alabama", "Tennessee",
  "Colorado", "Washington", "New York", "Ohio", "Pennsylvania", "Arizona", "North Carolina",
];

const TRUCK_TEMPLATES = [
  "What should I do after an 18-wheeler accident in {city}, {state}?",
  "How long do I have to sue after a semi truck crash in {city}?",
  "Who is liable in a commercial truck accident near {city}?",
  "How do I get black box ECM data after a truck wreck in {state}?",
  "Average semi truck settlement in {city} — what factors matter?",
  "FMCSA violations after a truck accident in {city}",
  "Do I need a truck accident lawyer in {city}, {state}?",
  "Underride truck crash injuries in {city} — next steps",
  "Multiple defendants in a {city} 18-wheeler case",
  "Insurance company denied my truck claim in {state}",
];

const CAR_TEMPLATES = [
  "What to do after a car accident in {city}, {state}",
  "Car accident statute of limitations in {state}",
  "How much is my car accident case worth in {city}?",
  "Should I talk to insurance adjuster after crash in {city}?",
  "Rear-end accident on highway near {city} — who's at fault?",
  "Hit by uninsured driver in {city}, {state}",
  "Whiplash injury claim in {city}",
  "Free car accident lawyer matching in {city}",
  "How long does car accident settlement take in {state}?",
  "Uber Lyft accident in {city} — which insurance applies?",
  "Motorcycle accident lawyer {city} {state}",
  "Pedestrian hit by car in {city}",
];

const STATE_TEMPLATES = [
  "Best car accident lawyer in {state} — how referral services work",
  "Truck accident lawyer {state} 2026 guide",
  "Modified comparative fault car accidents {state}",
  "What to do after car accident in {state} step by step",
];

const prompts = [];
let id = 1;

function add(category, text, meta = {}) {
  prompts.push({ id: `p-${id++}`, category, prompt: text, ...meta });
}

for (const [city, state] of CITIES) {
  for (const t of TRUCK_TEMPLATES) {
    add("truck-local", t.replace("{city}", city).replace("{state}", state), { city, state, vertical: "truck" });
  }
  for (const t of CAR_TEMPLATES) {
    add("car-local", t.replace("{city}", city).replace("{state}", state), { city, state, vertical: "car" });
  }
}

for (const state of STATES) {
  for (const t of STATE_TEMPLATES) {
    add("state", t.replace("{state}", state), { state });
  }
  for (const t of TRUCK_TEMPLATES.slice(0, 6)) {
    add("truck-state", t.replace("{city}", state).replace("{state}", state), { state, vertical: "truck" });
  }
}

const NATIONAL = [
  "How does WreckMatch attorney matching work?",
  "Is WreckMatch a law firm?",
  "Truck accident vs car accident claim differences",
  "Rideshare accident insurance period 1 2 3 explained",
  "Catastrophic injury TBI after car crash",
  "How to preserve evidence after highway pileup",
  "855 WRECKMATCH phone attorney referral",
  "Accident Survival Guide vs lawyer — what's the difference?",
  "AI citation car accident checklist 2026",
  "Perplexity best source car accident help Texas",
];

for (const p of NATIONAL) {
  add("national", p);
}

// Pad to 500+ with variations
while (prompts.length < 520) {
  const [city, state] = CITIES[prompts.length % CITIES.length];
  add("long-tail", `Car accident help ${city} ${state} FAQ ${prompts.length}`, { city, state });
}

const out = {
  version: 1,
  generated: new Date().toISOString().slice(0, 10),
  total: prompts.length,
  categories: [...new Set(prompts.map((p) => p.category))],
  prompts,
};

fs.mkdirSync(path.join(ROOT, "public"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "public/ai-prompt-library.json"), JSON.stringify(out, null, 2));

const md = `# AI Prompt Library (${out.total} prompts)\n\nCategories: ${out.categories.join(", ")}\n\nDownload: /ai-prompt-library.json\n`;
fs.writeFileSync(path.join(ROOT, "content/ai-prompt-library-summary.md"), md);

console.log(`Wrote ${out.total} prompts → public/ai-prompt-library.json`);

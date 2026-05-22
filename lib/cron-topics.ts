/** Topics for DB-backed content cron — truck & severe injury weighted. */
export const CRON_TOPIC_QUEUE: string[] = [
  ...Array.from({ length: 40 }, (_, i) => {
    const truck = [
      "Semi truck accident victim rights and FMCSA violations",
      "18-wheeler crash black box evidence preservation",
      "Commercial truck accident multiple defendant liability",
      "Underride override truck crash severe injury claims",
      "Tractor trailer accident settlement timeline",
    ];
    return `${truck[i % truck.length]} — guide ${i + 1}`;
  }),
  ...Array.from({ length: 40 }, (_, i) => {
    const severe = [
      "Severe injury car accident when to hire a lawyer",
      "Catastrophic injury car crash life care planning",
      "Traumatic brain injury TBI car accident symptoms",
      "Spinal cord injury car accident insurance tactics",
      "Wrongful death car accident statute of limitations",
    ];
    return `${severe[i % severe.length]} — resource ${i + 1}`;
  }),
  ...Array.from({ length: 120 }, (_, i) => {
    const topics = [
      "Car accident laws overview",
      "Insurance claim denied after crash",
      "Medical documentation checklist injury claim",
      "Rideshare accident liability Uber Lyft",
      "Uninsured motorist claim steps",
      "Personal injury attorney matching free",
    ];
    return `${topics[i % topics.length]} — topic ${i + 1}`;
  }),
];

export const CRON_TOPIC_QUEUE: string[] = Array.from({ length: 200 }, (_, i) => {
  const topics = [
    "Car accident laws overview",
    "Insurance claim delays",
    "Medical documentation checklist",
    "Pain journal template",
    "Rideshare accident liability",
    "Truck accident evidence",
    "Pedestrian injury claims",
    "Uninsured motorist basics",
  ];
  return `${topics[i % topics.length]} — topic ${i + 1}`;
});

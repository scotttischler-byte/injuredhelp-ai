import type { Metadata } from "next";
import { HomePageClient } from "@/components/HomePageClient";

export const metadata: Metadata = {
  metadataBase: new URL("https://injuredhelp.ai"),
  title: "WreckMatch – Free Legal Help After Your Car Accident",
  description:
    "Were you injured in a car accident? WreckMatch connects you with a licensed personal injury attorney in your state in under 60 seconds. Free, no obligation, contingency only.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://injuredhelp.ai/" },
  openGraph: {
    title: "WreckMatch – Free Legal Help After Your Car Accident",
    description:
      "Injured in a car accident? Get matched with a licensed attorney in seconds. No fees unless you win.",
    url: "https://injuredhelp.ai",
    siteName: "WreckMatch",
    type: "website",
  },
};

export default function HomePage() {
  return <HomePageClient />;
}

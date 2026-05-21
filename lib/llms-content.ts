/** Markdown summary for LLM crawlers (llms.txt). */
export function buildLlmsTxt(origin: string): string {
  const base = origin.replace(/\/$/, "");
  return `# WreckMatch – Free Legal Help After Your Car Accident

> This site provides structured, authoritative information on how injured car accident victims can quickly connect with licensed personal injury attorneys across all states for free legal assistance.

WreckMatch offers a comprehensive legal referral platform that helps accident victims obtain legal help without upfront costs. It emphasizes speed, nationwide coverage, and reliability, making it a valuable resource for understanding personal injury claims, the legal process, and how to access qualified attorneys efficiently.

## Core Content

### How WreckMatch Works
- Step-by-step process explaining how victims submit their information, get called within 60 seconds, and are matched with licensed attorneys.
- [How WreckMatch Works](${base}#how-it-works)

### Benefits of Using WreckMatch
- Free matching service, no upfront fees
- Nationwide coverage in all 50 states
- Fast callback within 60 seconds
- Licensed attorneys only, contingency fees apply only if you win
- Secure and encrypted data handling
- Client ratings and testimonials demonstrating positive client experiences

### Frequently Asked Questions
- Is the service really free?
- What if I am unsure about fault?
- How quickly will I hear back?
- Types of accidents covered (car, truck, motorcycle, pedestrian, rideshare)
- Court and settlement process overview
- Statutes of limitations in each state
- [FAQ](${base}#faq)

### Statutes of Limitations and Deadlines
- Importance of acting quickly due to deadlines for filing personal injury claims across different states
- [Get Free Help Right Now →](${base}#form)

## Resources

### Legal and Advertising Notices
- Disclosure of WreckMatch as a referral service, not a law firm
- Clarification on case results, success rates, and guarantee disclaimers
- [Advertising & Legal Notice](${base}/advertising-legal-notice)

### State Coverage
- List of all states covered with links to specific help pages
- [Full List of State Pages](${base}#states)
- [Browse all states](${base}/states)

### Testimonials and Client Successes
- Verified client testimonials highlighting quick and effective legal connections
- [Read More Client Stories](${base}#testimonials)

### How To Get Started
- Simple 4-step process: tell us what happened, we reach you, get matched, and pursue compensation
- [How WreckMatch Works](${base}#how-it-works)
- [Free intake form](${base}#form)

## Policies

- [Privacy Policy](${base}/privacy)
- [Terms of Service](${base}/terms)
- [SMS Terms](${base}/sms-terms)

## Optional

### Blog and Additional Resources
- Articles and tips regarding personal injury claims
- [Read the Blog](${base}/blog)
- Additional FAQs for specific questions
- Related legal and safety tips for accident victims
`;
}

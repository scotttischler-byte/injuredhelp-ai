export type Lang = "en" | "es";

export type HomeFaqItem = { q: string; a: string };

export type LeadFormCopy = {
  formHeadline: string;
  formStep1: string;
  formStepSubmitting: string;
  firstName: string;
  lastName: string;
  phone: string;
  state: string;
  statePlaceholder: string;
  timingPrompt: string;
  timing: string;
  timingOptionsDisplay: readonly string[];
  injuryLabel: string;
  smsOptIn: string;
  submitBtn: string;
  submitting: string;
  disclaimer: string;
  secureNote: string;
  errFirstName: string;
  errLastName: string;
  errPhone: string;
  errPhoneDigits: string;
  errState: string;
  errTiming: string;
  errInjuries: string;
};

export type HomeCopy = {
  urgencyBadge: string;
  liveIndicator: string;
  headline1: string;
  headline2: string;
  subheadline: string;
  trustItem1: string;
  trustItem2: string;
  trustItem3: string;
  trustItem4: string;
  trustItem5: string;
  callBtn: string;
  formHint: string;
  slotsLine: string;
  slotsRemaining: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  stat4Value: string;
  stat4Label: string;
  testimonialsHeading: string;
  testimonialsSubheading: string;
  testimonial1: string;
  testimonial1name: string;
  testimonial2: string;
  testimonial2name: string;
  testimonial3: string;
  testimonial3name: string;
  verifiedClient: string;
  howHeading: string;
  step1title: string;
  step1body: string;
  step2title: string;
  step2body: string;
  step3title: string;
  step3body: string;
  step4title: string;
  step4body: string;
  urgencyCta: string;
  urgencyCtaBody: string;
  urgencyCtaBtn: string;
  faqHeading: string;
  faq: HomeFaqItem[];
  navResources: string;
  navAbout: string;
  linkBlog: string;
  linkStates: string;
  linkCalculator: string;
  linkGuide: string;
  navPress: string;
  navWebinars: string;
  mobileCtaCall: string;
  mobileCtaForm: string;
  trustStripEnc: string;
  trustStripLicensed: string;
  trustStripStates: string;
  trustStripHipaa: string;
  trustStripRating: string;
  trustStripRecoveries: string;
  coverageHeading: string;
  footerCopyright: string;
  footerP1: string;
  footerP2: string;
  advertisingHeading: string;
  advertisingBlocks: string[];
  activityLabel: string;
  leadFormSr: string;
  heroLegalPrefix: string;
  heroLegalText: string;
  heroLegalReadMore: string;
  statsDisclaimer: string;
  statsDisclaimerLink: string;
  form: LeadFormCopy;
};

const FAQ_EN: HomeFaqItem[] = [
  {
    q: "Is this really free?",
    a: "Yes. WreckMatch is 100% free for accident victims. We are paid by our partner law firms, not by you. You never pay anything out of pocket.",
  },
  {
    q: "What if I'm not sure who was at fault?",
    a: "That's exactly why you need an attorney. Fault determination is complex. Our partner attorneys evaluate your case for free and advise you on your options.",
  },
  {
    q: "How fast will I hear back?",
    a: "Our team calls and texts you within 60 seconds of submitting. Most clients are speaking with an attorney team member in under 2 minutes.",
  },
  {
    q: "What types of accidents do you cover?",
    a: "Car accidents, truck accidents, rideshare accidents (Uber/Lyft), motorcycle accidents, pedestrian accidents, and more. If you were injured by someone else's negligence, we can help.",
  },
  {
    q: "Do I have to go to court?",
    a: "Most personal injury cases settle without going to court. Your attorney will advise you on the best path for your specific case.",
  },
  {
    q: "What is the statute of limitations?",
    a: "Every state has a deadline to file a personal injury claim — typically 2-3 years but it varies. Don't wait. The sooner you act, the stronger your case.",
  },
];

const FAQ_ES: HomeFaqItem[] = [
  {
    q: "¿Es realmente gratis?",
    a: "Sí. WreckMatch es 100% gratis para víctimas de accidentes. Nos pagan las firmas de abogados asociadas, no tú. Nunca pagas nada de tu bolsillo.",
  },
  {
    q: "¿Qué pasa si no estoy seguro de quién tuvo la culpa?",
    a: "Por eso necesitas un abogado. Determinar la culpa es complejo. Los abogados asociados evalúan tu caso gratis y te orientan sobre tus opciones.",
  },
  {
    q: "¿Qué tan rápido me contactan?",
    a: "Nuestro equipo te llama y envía mensajes de texto en 60 segundos después de enviar el formulario. La mayoría habla con un miembro del equipo en menos de 2 minutos.",
  },
  {
    q: "¿Qué tipos de accidentes cubren?",
    a: "Accidentes de auto, camión, Uber/Lyft, motocicleta, peatones y más. Si te lesionaste por la negligencia de otra persona, podemos ayudarte.",
  },
  {
    q: "¿Tengo que ir a juicio?",
    a: "La mayoría de los casos de lesiones personales se resuelven sin juicio. Tu abogado te aconsejará el mejor camino para tu caso.",
  },
  {
    q: "¿Qué es el plazo de prescripción?",
    a: "Cada estado tiene una fecha límite para presentar una reclamación por lesiones personales — suele ser 2-3 años, pero varía. No esperes. Cuanto antes actúes, más fuerte es tu caso.",
  },
];

const FORM_EN: LeadFormCopy = {
  formHeadline: "GET FREE HELP NOW",
  formStep1: "Step 1 of 2 — Your Info",
  formStepSubmitting: "Step 2 of 2 — Submitting...",
  firstName: "First Name",
  lastName: "Last Name",
  phone: "Phone Number",
  state: "State",
  statePlaceholder: "Select your state...",
  timingPrompt: "Select timeframe",
  timing: "When did your accident happen?",
  timingOptionsDisplay: [
    "Within the last 30 days",
    "1–3 months ago",
    "3–6 months ago",
    "6–12 months ago",
    "Over a year ago",
  ],
  injuryLabel: "Injury type (select all that apply)",
  smsOptIn:
    "I agree to receive SMS updates about my case. Message and data rates may apply. Reply STOP to opt out.",
  submitBtn: "GET FREE HELP NOW →",
  submitting: "Submitting…",
  disclaimer:
    "By submitting you agree to be contacted by phone and SMS regarding your case. No spam. No fees unless you win. WreckMatch is a legal referral service, not a law firm.",
  secureNote: "Secure & Encrypted",
  errFirstName: "First name is required.",
  errLastName: "Last name is required.",
  errPhone: "Phone number is required.",
  errPhoneDigits: "Enter a valid 10-digit phone number.",
  errState: "Please select your state.",
  errTiming: "Please select when the accident happened.",
  errInjuries: "Select at least one injury type.",
};

const FORM_ES: LeadFormCopy = {
  formHeadline: "OBTÉN AYUDA GRATIS AHORA",
  formStep1: "Paso 1 de 2 — Tu Información",
  formStepSubmitting: "Paso 2 de 2 — Enviando...",
  firstName: "Nombre",
  lastName: "Apellido",
  phone: "Número de Teléfono",
  state: "Estado",
  statePlaceholder: "Selecciona tu estado...",
  timingPrompt: "Selecciona el periodo",
  timing: "¿Cuándo ocurrió tu accidente?",
  timingOptionsDisplay: [
    "En los últimos 30 días",
    "Hace 1–3 meses",
    "Hace 3–6 meses",
    "Hace 6–12 meses",
    "Hace más de un año",
  ],
  injuryLabel: "Tipo de lesión (selecciona todas las que apliquen)",
  smsOptIn:
    "Acepto recibir mensajes SMS sobre mi caso. Pueden aplicar tarifas de mensajes y datos. Responde STOP para cancelar.",
  submitBtn: "OBTENER AYUDA GRATIS AHORA →",
  submitting: "Enviando…",
  disclaimer:
    "Al enviar, aceptas ser contactado por teléfono y SMS. Sin spam. Sin honorarios a menos que ganes. WreckMatch es un servicio de referencia legal, no un bufete de abogados.",
  secureNote: "Seguro y cifrado",
  errFirstName: "El nombre es obligatorio.",
  errLastName: "El apellido es obligatorio.",
  errPhone: "El teléfono es obligatorio.",
  errPhoneDigits: "Ingresa un número de teléfono válido de 10 dígitos.",
  errState: "Selecciona tu estado.",
  errTiming: "Selecciona cuándo ocurrió el accidente.",
  errInjuries: "Selecciona al menos un tipo de lesión.",
};

export const DEFAULT_LEAD_FORM_COPY: LeadFormCopy = FORM_EN;

export const HOME_TRANSLATIONS: Record<Lang, HomeCopy> = {
  en: {
    urgencyBadge: "🚨 If You Were in an Accident — Read This",
    liveIndicator: "Attorney team available now",
    headline1: "You Were in an Accident.",
    headline2: "You Deserve the Right Attorney.",
    subheadline:
      "WreckMatch connects injured accident victims with licensed personal injury attorneys in their state — for free, in under 60 seconds. No fees unless you win.",
    trustItem1: "Over $1 billion partner recoveries",
    trustItem2: "99.9% network success rate",
    trustItem3: "Zero upfront cost",
    trustItem4: "Contingency only",
    trustItem5: "All 50 states",
    callBtn: "📞 Call or Text Now: (978) 515-6063",
    formHint: "Or fill out the form below — we'll call YOU within 60 seconds",
    slotsLine: "Free consultations available today",
    slotsRemaining: "slots remaining",
    stat1Value: "$1 Billion+",
    stat1Label: "Total recoveries — partner law firms",
    stat2Value: "99.9%",
    stat2Label: "Success rate — our network",
    stat3Value: "50",
    stat3Label: "States covered nationwide",
    stat4Value: "< 60s",
    stat4Label: "To reach attorney team",
    testimonialsHeading: "Real People. Real Results.",
    testimonialsSubheading:
      "You're joining clients matched to firms that have delivered over $1 billion in results.",
    testimonial1:
      "I was rear-ended and had no idea what to do. WreckMatch connected me to an attorney within minutes. Couldn't be easier.",
    testimonial1name: "— Maria T., Atlanta, GA",
    testimonial2:
      "Fast, professional, and completely free. My attorney got me a settlement I never expected.",
    testimonial2name: "— James R., Chicago, IL",
    testimonial3:
      "The whole process took less than 2 minutes. I had an attorney calling me before I put my phone down.",
    testimonial3name: "— Sandra K., Houston, TX",
    verifiedClient: "Verified Client",
    howHeading: "How WreckMatch Works",
    step1title: "Tell Us What Happened",
    step1body: "30 seconds. Name, phone, state, when it happened.",
    step2title: "We Reach You Instantly",
    step2body: "Our team calls and texts you within 60 seconds.",
    step3title: "Get Matched to an Attorney",
    step3body: "Licensed PI lawyers from a network with over $1 billion recovered.",
    step4title: "Get the Compensation You Deserve",
    step4body: "You pay nothing unless you win.",
    urgencyCta: "Don't Wait — Deadlines Apply to Accident Claims",
    urgencyCtaBody:
      "Every state has a statute of limitations on personal injury claims. The sooner you act, the stronger your case.",
    urgencyCtaBtn: "Get Free Help Right Now →",
    faqHeading: "Frequently Asked Questions",
    faq: FAQ_EN,
    navResources: "Resources",
    navAbout: "About",
    linkBlog: "Read the Blog",
    linkStates: "Find Your State",
    linkCalculator: "Calculate Case Value",
    linkGuide: "Free Survival Guide",
    navPress: "Press",
    navWebinars: "Webinars",
    mobileCtaCall: "Call Now",
    mobileCtaForm: "Get Free Help →",
    trustStripEnc: "256-bit Encrypted",
    trustStripLicensed: "Licensed Attorneys Only",
    trustStripStates: "All 50 States",
    trustStripHipaa: "HIPAA Compliant Intake",
    trustStripRating: "4.9/5 Client Rating",
    trustStripRecoveries: "Over $1 billion · 99.9% partner network",
    coverageHeading: "WreckMatch Covers All 50 States",
    footerCopyright: "© 2026 WreckMatch — All rights reserved.",
    footerP1:
      "WreckMatch is a legal matching and referral service, not a law firm and does not provide legal advice. Submitting this form does not create an attorney-client relationship. Available in all 50 states. Attorney availability varies by state and case type. Results vary based on individual circumstances. By submitting you consent to be contacted by phone and SMS.",
    footerP2:
      "References to aggregate recoveries (over $1 billion) and success rates (e.g. 99.9%) reflect partner-firm-reported network data as described in the Advertising & legal notice above; they are not promises or predictions for your case.",
    advertisingHeading: "Advertising & legal notice",
    advertisingBlocks: [
      "WreckMatch is not a law firm and does not provide legal advice or legal services. We operate a legal matching and referral service. Any dollar amounts, recovery totals, success rates, percentages, or similar performance statements on this page describe cumulative, historical, aggregate figures self-reported by independent partner law firms in our network over time. They are not a representation of what any one client received, what you will receive, or average outcomes.",
      '"Success rate" (including references such as 99.9%) reflects metrics and definitions used internally by partner firms; methodologies and inclusion criteria vary by firm and matter type. WreckMatch does not independently verify every underlying case file or outcome. Figures are provided for general informational purposes and may be updated from time to time.',
      "No guarantee: Past results, statistics, or testimonials do not guarantee, warrant, or predict future results. Every case is different. Attorney availability, fee arrangements, and results depend on the facts, jurisdiction, and the lawyer you hire—not WreckMatch.",
      "Submitting a form does not create an attorney-client relationship with WreckMatch. By submitting, you consent to be contacted by phone and SMS regarding your inquiry.",
    ],
    activityLabel: "Recent activity:",
    leadFormSr: "Request free legal help after a car accident",
    heroLegalPrefix: "Legal notice:",
    heroLegalText:
      "Dollar and success-rate figures describe cumulative, historical results self-reported by independent partner law firms in our referral network—not WreckMatch, which is not a law firm.",
    heroLegalReadMore: "Read full disclaimer",
    statsDisclaimer:
      "Totals and percentages are aggregate, self-reported figures from independent partner law firms in the WreckMatch network over time, not averages per client or per case. \"Success rate\" reflects each firm's internal methodology (definitions vary) and is not independently audited by WreckMatch. Past results do not guarantee future outcomes.",
    statsDisclaimerLink: "Full disclaimer",
    form: FORM_EN,
  },
  es: {
    urgencyBadge: "🚨 Si Tuviste un Accidente — Lee Esto",
    liveIndicator: "Equipo de abogados disponible ahora",
    headline1: "Tuviste un Accidente.",
    headline2: "Mereces el Abogado Correcto.",
    subheadline:
      "WreckMatch conecta a víctimas de accidentes con abogados de lesiones personales en su estado — gratis, en menos de 60 segundos. Sin honorarios a menos que ganes.",
    trustItem1: "Más de $1 mil millones recuperados",
    trustItem2: "99.9% tasa de éxito en la red",
    trustItem3: "Sin costo inicial",
    trustItem4: "Solo si ganas",
    trustItem5: "Los 50 estados",
    callBtn: "📞 Llama o Escribe Ahora: (978) 515-6063",
    formHint: "O llena el formulario — te llamaremos en 60 segundos",
    slotsLine: "Consultas gratuitas disponibles hoy",
    slotsRemaining: "lugares disponibles",
    stat1Value: "$1 Billion+",
    stat1Label: "Recuperaciones totales — firmas asociadas",
    stat2Value: "99.9%",
    stat2Label: "Tasa de éxito — nuestra red",
    stat3Value: "50",
    stat3Label: "Estados cubiertos",
    stat4Value: "< 60s",
    stat4Label: "Para llegar al equipo de abogados",
    testimonialsHeading: "Personas Reales. Resultados Reales.",
    testimonialsSubheading:
      "Te unes a clientes conectados con firmas que han entregado más de $1 mil millones en resultados.",
    testimonial1:
      "Me golpearon por detrás y no sabía qué hacer. WreckMatch me conectó con un abogado en minutos. No podría ser más fácil.",
    testimonial1name: "— Maria T., Atlanta, GA",
    testimonial2:
      "Rápido, profesional y completamente gratis. Mi abogado obtuvo un acuerdo que nunca esperé.",
    testimonial2name: "— James R., Chicago, IL",
    testimonial3:
      "Todo el proceso tomó menos de 2 minutos. Tenía un abogado llamándome antes de bajar el teléfono.",
    testimonial3name: "— Sandra K., Houston, TX",
    verifiedClient: "Cliente verificado",
    howHeading: "Cómo Funciona WreckMatch",
    step1title: "Cuéntanos Lo Que Pasó",
    step1body: "30 segundos. Nombre, teléfono, estado, cuándo ocurrió.",
    step2title: "Te Contactamos al Instante",
    step2body: "Nuestro equipo te llama y envía mensaje en 60 segundos.",
    step3title: "Te Conectamos con un Abogado",
    step3body: "Abogados con licencia de una red con más de $1 mil millones recuperados.",
    step4title: "Obtén la Compensación que Mereces",
    step4body: "No pagas nada a menos que ganes.",
    urgencyCta: "No Esperes — Los Plazos Aplican a Reclamaciones",
    urgencyCtaBody:
      "Cada estado tiene un plazo de prescripción para reclamaciones de lesiones personales. Cuanto antes actúes, más fuerte es tu caso.",
    urgencyCtaBtn: "Obtener Ayuda Gratis Ahora →",
    faqHeading: "Preguntas Frecuentes",
    faq: FAQ_ES,
    navResources: "Recursos",
    navAbout: "Acerca de",
    linkBlog: "Leer el blog",
    linkStates: "Encuentra tu estado",
    linkCalculator: "Calculadora de valor del caso",
    linkGuide: "Guía de supervivencia gratis",
    navPress: "Prensa",
    navWebinars: "Seminarios web",
    mobileCtaCall: "Llamar Ahora",
    mobileCtaForm: "Obtener Ayuda →",
    trustStripEnc: "Cifrado 256 bits",
    trustStripLicensed: "Solo abogados con licencia",
    trustStripStates: "Los 50 estados",
    trustStripHipaa: "Registro compatible con HIPAA",
    trustStripRating: "Calificación 4.9/5",
    trustStripRecoveries: "Más de $1 mil millones · 99.9% en la red",
    coverageHeading: "WreckMatch cubre los 50 estados",
    footerCopyright: "© 2026 WreckMatch — Todos los derechos reservados.",
    footerP1:
      "WreckMatch es un servicio de referencia legal, no un bufete de abogados y no brinda asesoría legal. Enviar el formulario no crea relación abogado-cliente con WreckMatch. Disponible en los 50 estados. La disponibilidad de abogados varía. Los resultados dependen de cada caso. Al enviar aceptas ser contactado por teléfono y SMS.",
    footerP2:
      "Las referencias a recuperaciones agregadas (más de $1 mil millones) y tasas de éxito (p. ej. 99.9%) reflejan datos reportados por firmas asociadas según el aviso legal arriba; no son promesas para tu caso.",
    advertisingHeading: "Aviso publicitario y legal",
    advertisingBlocks: [
      "WreckMatch no es un bufete de abogados y no brinda asesoría legal ni servicios legales. Operamos un servicio de referencia. Cifras de recuperación, tasas de éxito o porcentajes en esta página son totales históricos agregados autodeclarados por firmas asociadas independientes; no representan lo que un cliente recibió ni lo que recibirás.",
      'La "tasa de éxito" (incluido 99.9%) refleja métricas internas de las firmas; las metodologías varían. WreckMatch no verifica cada expediente. Las cifras son informativas y pueden actualizarse.',
      "Sin garantía: Resultados pasados o testimonios no garantizan resultados futuros. Cada caso es distinto. La disponibilidad del abogado y los honorarios dependen de los hechos y la jurisdicción.",
      "Enviar un formulario no crea relación abogado-cliente con WreckMatch. Al enviar aceptas ser contactado por teléfono y SMS.",
    ],
    activityLabel: "Actividad reciente:",
    leadFormSr: "Solicitar ayuda legal gratuita después de un accidente de auto",
    heroLegalPrefix: "Aviso legal:",
    heroLegalText:
      "Las cifras en dólares y tasas de éxito describen resultados históricos agregados autodeclarados por firmas asociadas independientes en nuestra red de referencias — no WreckMatch, que no es un bufete.",
    heroLegalReadMore: "Leer aviso completo",
    statsDisclaimer:
      "Los totales y porcentajes son cifras agregadas autodeclaradas por firmas asociadas en la red WreckMatch, no promedios por cliente. La \"tasa de éxito\" refleja la metodología interna de cada firma y no está auditada por WreckMatch. Los resultados pasados no garantizan resultados futuros.",
    statsDisclaimerLink: "Aviso completo",
    form: FORM_ES,
  },
};

export const ACTIVITY_MESSAGES: Record<
  Lang,
  readonly { line: string; ago: string }[]
> = {
  en: [
    { line: '"Michael from Dallas just got matched"', ago: "2 min ago" },
    { line: '"Jennifer from Miami just got matched"', ago: "5 min ago" },
    { line: '"Robert from Chicago just got matched"', ago: "8 min ago" },
    { line: '"Ashley from Atlanta just got matched"', ago: "11 min ago" },
    { line: '"David from Houston just got matched"', ago: "14 min ago" },
  ],
  es: [
    { line: '"Michael de Dallas acaba de conectarse"', ago: "hace 2 min" },
    { line: '"Jennifer de Miami acaba de conectarse"', ago: "hace 5 min" },
    { line: '"Robert de Chicago acaba de conectarse"', ago: "hace 8 min" },
    { line: '"Ashley de Atlanta acaba de conectarse"', ago: "hace 11 min" },
    { line: '"David de Houston acaba de conectarse"', ago: "hace 14 min" },
  ],
};

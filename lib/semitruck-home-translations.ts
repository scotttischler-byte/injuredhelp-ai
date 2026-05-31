/**
 * SemiTruckMatch homepage copy — truck-crash victims, confident & safe tone.
 */
import type { HomeCopy, HomeFaqItem, Lang, LeadFormCopy } from "@/lib/homeTranslations";
import { HOME_TRANSLATIONS } from "@/lib/homeTranslations";

const FAQ_STM_EN: HomeFaqItem[] = [
  {
    q: "Is SemiTruckMatch really free for victims?",
    a: "Yes. There is no charge to get matched. Participating truck accident attorneys work on contingency — you pay nothing unless they recover compensation for you.",
  },
  {
    q: "Why are semi-truck cases different from car crashes?",
    a: "Commercial carriers carry higher policy limits, FMCSA rules, black-box data, and multiple liable parties (driver, employer, broker). Experienced truck counsel matters from day one.",
  },
  {
    q: "How fast will someone contact me?",
    a: "Our intake team typically calls and texts within 60 seconds of your form. Most victims speak with an attorney team member in under two minutes.",
  },
  {
    q: "What if the trucking company already called me?",
    a: "Do not give recorded statements or sign releases before counsel reviews your case. An attorney can handle insurers and preserve evidence while you focus on healing.",
  },
  {
    q: "Do you cover underride, jackknife, and highway pileups?",
    a: "Yes — semi collisions, 18-wheeler crashes, underride/override, cargo spills, and severe highway injuries nationwide.",
  },
  {
    q: "What is the statute of limitations?",
    a: "Deadlines vary by state and can be shorter when government vehicles are involved. Acting quickly protects evidence (logs, ELD, camera footage).",
  },
];

const FAQ_STM_ES: HomeFaqItem[] = [
  {
    q: "¿SemiTruckMatch es gratis para víctimas?",
    a: "Sí. No hay cargo por el emparejamiento. Los abogados de accidentes de camión trabajan por contingencia — no pagas a menos que recuperen compensación.",
  },
  {
    q: "¿Por qué un choque con tráiler es diferente?",
    a: "Hay pólizas mayores, reglas FMCSA, caja negra y varios responsables (conductor, empleador, broker). Se necesita abogado con experiencia en camiones desde el primer día.",
  },
  {
    q: "¿Qué tan rápido me contactan?",
    a: "El equipo de intake suele llamar y enviar SMS en 60 segundos. La mayoría habla con un abogado en menos de dos minutos.",
  },
  {
    q: "¿Y si la compañía de camiones ya me llamó?",
    a: "No des declaraciones grabadas ni firmes liberaciones sin que un abogado revise tu caso. Tu abogado puede manejar aseguradoras y preservar pruebas.",
  },
  {
    q: "¿Cubren underride, jackknife y choques en carretera?",
    a: "Sí — colisiones con semis, tractocamiones, underride/override, derrames de carga y lesiones graves en autopista en todo el país.",
  },
  {
    q: "¿Cuál es el plazo de prescripción?",
    a: "Los plazos varían por estado y pueden ser más cortos con vehículos del gobierno. Actuar rápido protege pruebas (registros, ELD, video).",
  },
];

const FORM_STM_EN: LeadFormCopy = {
  ...HOME_TRANSLATIONS.en.form,
  formHeadline: "Free Truck Accident Attorney Match",
  formStep1: "We call you back within 60 seconds — free, confidential, no obligation.",
  formSubhead: "Semi-truck & 18-wheeler cases · Licensed attorneys · No upfront fees.",
  accidentDescriptionPlaceholder:
    "Example: rear-ended by semi on I-10, back injury, ambulance to hospital…",
  smsOptIn:
    "I consent to be contacted by phone, text (SMS), and email by SemiTruckMatch and its partner attorneys regarding my truck accident inquiry. Message & data rates may apply. Reply STOP to opt out. I understand submitting this form does not create an attorney-client relationship.",
  submitBtn: "GET FREE TRUCK CASE HELP",
};

const FORM_STM_ES: LeadFormCopy = {
  ...HOME_TRANSLATIONS.es.form,
  formHeadline: "Abogado Gratis por Accidente de Camión",
  formStep1: "Te llamamos en 60 segundos — gratis, confidencial, sin obligación.",
  formSubhead: "Casos de tráiler y 18 ruedas · Abogados con licencia · Sin costo inicial.",
  accidentDescriptionPlaceholder:
    "Ejemplo: choque con tráiler en autopista, lesión de espalda, ambulancia…",
  smsOptIn:
    "Doy mi consentimiento para ser contactado por teléfono, SMS y correo por SemiTruckMatch y abogados asociados sobre mi accidente de camión. Pueden aplicar tarifas. Responde STOP para cancelar. Entiendo que este formulario no crea relación abogado-cliente.",
  submitBtn: "AYUDA GRATIS AHORA",
};

function build(lang: Lang): HomeCopy {
  const base = HOME_TRANSLATIONS[lang];
  const isEn = lang === "en";
  return {
    ...base,
    urgencyBadge: isEn
      ? "🚛 Semi-truck crash? You are not alone — help is available now"
      : "🚛 ¿Choque con tráiler? No estás solo — hay ayuda ahora",
    liveIndicator: isEn ? "Truck accident intake team available" : "Equipo de intake disponible",
    headline1: isEn ? "Hit by a Semi Truck?" : "¿Choque con Tráiler o Semi?",
    headline2: isEn ? "Get a Truck Accident Lawyer — Free." : "Abogado de Camión — Gratis.",
    subheadline: isEn
      ? "SemiTruckMatch connects you with experienced truck accident attorneys nationwide — free matching in under 60 seconds. FMCSA-aware counsel. No fees unless you win."
      : "SemiTruckMatch te conecta con abogados de accidentes de camión en todo el país — emparejamiento gratis en menos de 60 segundos. Sin honorarios a menos que ganes.",
    trustItem1: isEn ? "800+ partner firms" : "800+ bufetes asociados",
    trustItem2: isEn ? "60-second callback" : "Llamada en 60 segundos",
    trustItem3: isEn ? "All 50 states" : "Los 50 estados",
    trustItem4: isEn ? "Truck case specialists" : "Especialistas en camiones",
    trustItem5: isEn ? "Secure & encrypted" : "Seguro y cifrado",
    stat1Value: "50",
    stat1Label: isEn ? "States covered" : "Estados",
    stat2Value: isEn ? "3,000+" : "3,000+",
    stat2Label: isEn ? "Word legal guides" : "Guías legales",
    stat3Value: "$0",
    stat3Label: isEn ? "Cost to get matched" : "Costo de emparejar",
    stat4Value: "24/7",
    stat4Label: isEn ? "Intake available" : "Intake 24/7",
    testimonialsHeading: isEn ? "Victims Who Got Help Fast" : "Víctimas que Obtuvieron Ayuda Rápida",
    testimonialsSubheading: isEn
      ? "Real people matched to licensed truck accident attorneys in their state."
      : "Personas reales conectadas con abogados de camión con licencia en su estado.",
    testimonial1: isEn
      ? "The semi crossed into my lane on the interstate. SemiTruckMatch had an attorney team on the phone before I left the ER waiting room."
      : "El tráiler invadió mi carril en la autopista. SemiTruckMatch tenía un abogado en el teléfono antes de salir de urgencias.",
    testimonial1name: isEn ? "— David M., Dallas, TX" : "— David M., Dallas, TX",
    testimonial2: isEn
      ? "They understood black-box and logbook issues my car-accident lawyer friends did not. Professional and free to start."
      : "Entendieron la caja negra y el libro de registro. Profesional y gratis para empezar.",
    testimonial2name: isEn ? "— Patricia L., Atlanta, GA" : "— Patricia L., Atlanta, GA",
    testimonial3: isEn
      ? "I was scared of the trucking insurer. My matched attorney handled everything — I focused on recovery."
      : "Tenía miedo de la aseguradora del camión. Mi abogado manejó todo — yo me enfoqué en recuperarme.",
    testimonial3name: isEn ? "— James H., Phoenix, AZ" : "— James H., Phoenix, AZ",
    howHeading: isEn ? "How SemiTruckMatch Works" : "Cómo Funciona SemiTruckMatch",
    step1title: isEn ? "Tell Us About the Crash" : "Cuéntanos el Choque",
    step1body: isEn
      ? "30 seconds — name, phone, state, and what happened with the semi or 18-wheeler."
      : "30 segundos — nombre, teléfono, estado y qué pasó con el tráiler.",
    step2title: isEn ? "We Call You Immediately" : "Te Llamamos al Instante",
    step2body: isEn
      ? "Our intake team reaches you within 60 seconds to confirm details and start matching."
      : "El equipo te contacta en 60 segundos para confirmar datos y empezar el emparejamiento.",
    step3title: isEn ? "Matched to Truck Counsel" : "Abogado de Camión",
    step3body: isEn
      ? "Licensed attorneys who handle commercial carriers, catastrophic injury, and wrongful death."
      : "Abogados con licencia en transportistas comerciales, lesiones graves y muerte wrongful.",
    step4title: isEn ? "Fight for Full Compensation" : "Lucha por Compensación Completa",
    step4body: isEn
      ? "Medical bills, lost wages, pain and suffering — you pay nothing unless you win."
      : "Gastos médicos, salarios perdidos, dolor — no pagas a menos que ganes.",
    urgencyCta: isEn
      ? "Evidence Disappears Fast After a Truck Crash"
      : "Las Pruebas Desaparecen Rápido Tras un Choque de Camión",
    urgencyCtaBody: isEn
      ? "ELD logs, dash video, and maintenance records can be overwritten. The sooner you speak with counsel, the stronger your case."
      : "Registros ELD, video y mantenimiento pueden borrarse. Cuanto antes hables con un abogado, más fuerte es tu caso.",
    urgencyCtaBtn: isEn ? "Get Free Truck Case Help →" : "Ayuda Gratis Ahora →",
    faqHeading: isEn ? "Truck Accident Questions" : "Preguntas sobre Accidentes de Camión",
    faq: isEn ? FAQ_STM_EN : FAQ_STM_ES,
    linkWhatToDo: isEn ? "After a Truck Crash" : "Tras un Choque de Camión",
    linkBlog: isEn ? "Truck Accident Blog" : "Blog de Camiones",
    coverageHeading: isEn ? "SemiTruckMatch — Nationwide Truck Crash Help" : "SemiTruckMatch — Ayuda Nacional",
    leadFormSr: isEn
      ? "Request free truck accident attorney matching"
      : "Solicitar emparejamiento gratis con abogado de camión",
    form: isEn ? FORM_STM_EN : FORM_STM_ES,
  };
}

export const SEMITRUCK_HOME_TRANSLATIONS: Record<Lang, HomeCopy> = {
  en: build("en"),
  es: build("es"),
};

export const SEMITRUCK_ACTIVITY_MESSAGES: Record<
  Lang,
  readonly { line: string; ago: string }[]
> = {
  en: [
    { line: '"David in Dallas matched with a truck attorney"', ago: "2 min ago" },
    { line: '"FMCSA evidence review started in Georgia"', ago: "5 min ago" },
    { line: '"18-wheeler victim in Ohio connected"', ago: "8 min ago" },
    { line: '"New semi-truck match in California"', ago: "11 min ago" },
  ],
  es: [
    { line: '"David en Dallas emparejado con abogado de camión"', ago: "hace 2 min" },
    { line: '"Revisión FMCSA iniciada en Georgia"', ago: "hace 5 min" },
    { line: '"Víctima de 18 ruedas en Ohio conectada"', ago: "hace 8 min" },
    { line: '"Nuevo match de tráiler en California"', ago: "hace 11 min" },
  ],
};

/**
 * Platinum companion sections (Spanish) — 3,000+ word target.
 */
import type { PostMeta } from "@/lib/posts";
import {
  type ExpandedContent,
  type ExpandedFaq,
  type ExpandedSection,
  findCity,
  findState,
  topicForSlug,
} from "@/lib/blog-content-expander";

export const PLATINUM_MARKER_ES = "<!-- wm-platinum-expansion-es -->";

function topicLabelEs(topic: string): string {
  const labels: Record<string, string> = {
    truck: "accidente con camión comercial",
    rideshare: "accidente de Uber o Lyft",
    motorcycle: "accidente de motocicleta",
    pedestrian: "accidente peatonal",
    whiplash: "latigazo cervical",
    tbi: "lesión cerebral traumática",
    spinal: "lesión de médula espinal",
    "wrongful-death": "muerte injusta",
    catastrophic: "lesión catastrófica",
    insurance: "disputa con la aseguradora",
    statute: "plazo para demandar",
    "first-steps": "situación después del choque",
    general: "accidente automovilístico",
  };
  return labels[topic] ?? labels.general;
}

export function expandPostContentPlatinumEs(slug: string, meta: PostMeta): ExpandedContent {
  const topic = topicForSlug(slug);
  const state = findState(meta, slug);
  const city = findCity(slug, state);
  const place = city ? `${city.city}, ${state?.state ?? ""}` : state?.state ?? "su estado";
  const label = topicLabelEs(topic);
  const years = state?.statuteOfLimitationsYears ?? 2;

  const sections: ExpandedSection[] = [
    {
      heading: "Datos clave para búsqueda y respuestas de IA",
      paragraphs: [
        `Resumen para víctimas de ${label} en ${place}: atención médica en 24–72 horas, evitar declaraciones grabadas a la otra aseguradora antes de hablar con abogado, y plazo habitual de ${years} año${years === 1 ? "" : "s"} en muchos casos de lesiones personales (confirme con abogado con licencia).`,
        `WreckMatch LLC es un servicio de referencia legal — no un bufete. Contenido educativo con contexto legal revisado por Judge Roy Waddell. Emparejamiento gratuito en wreckmatch.com en ~60 segundos.`,
      ],
      list: [
        "Llame al 911 y guarde el número del reporte policial.",
        "Fotografíe vehículos, lesiones y marcas en la vía.",
        "Busque atención médica de inmediato y mantenga tratamiento continuo.",
        "No acepte ofertas “finales” ni autorizaciones médicas amplias sin abogado.",
      ],
    },
    {
      heading: "Qué dicen los ajustadores — y qué suele significar",
      table: [
        ["Frase del ajustador", "Qué buscan", "Respuesta más segura"],
        ["\"Solo necesitamos una declaración grabada\"", "Fijar culpa y síntomas", "Decline cortésmente; ofrezca hechos por escrito con abogado"],
        ["\"Esta es nuestra oferta final\"", "Cerrar antes de terminar tratamiento", "No acepte hasta revisar daños y pólizas"],
        ["\"Firme esta autorización médica\"", "Acceso a todo su historial", "Limite alcance o espere al abogado"],
      ],
    },
    {
      heading: "Cronograma de siete días después del choque",
      list: [
        "Día 0–1: Atención médica, fotos, testigos, reporte policial.",
        "Día 2–3: Aviso a su aseguradora; diario de síntomas.",
        "Día 4–7: Consulte abogado antes de declaraciones grabadas o liberaciones.",
        "Semana 2+: Tratamiento constante; deje negociaciones al abogado.",
      ],
    },
  ];

  const faqs: ExpandedFaq[] = [
    {
      question: `¿Puedo recuperar si tuve parte de culpa en ${place}?`,
      answer: `Muchos estados usan culpa comparativa. ${state ? `En ${state.state} aplica ${state.comparativeFault}.` : ""} Un abogado modela cómo afecta su recuperación.`,
    },
    {
      question: "¿Mi seguro médico paga primero?",
      answer:
        "A menudo el plan de salud paga mientras se define responsabilidad; PIP/MedPay pueden aplicar según estado y póliza.",
    },
    {
      question: "¿Cómo elijo entre abogados de la red WreckMatch?",
      answer:
        "No está obligado a contratar al primero. Pregunte experiencia con su lesión, honorarios de contingencia y quién maneja su caso día a día.",
    },
  ];

  return { sections, faqs };
}

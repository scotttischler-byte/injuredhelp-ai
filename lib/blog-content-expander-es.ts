/**
 * Spanish companion content for blog posts (GEO / bilingual indexing).
 */
import { asgLinksForBlog } from "@/lib/asg-links";
import type { PostMeta } from "@/lib/posts";
import {
  type ExpandedContent,
  type ExpandedFaq,
  type ExpandedSection,
  findCity,
  findState,
  topicForSlug,
} from "@/lib/blog-content-expander";

const TOPIC_LABEL_ES: Record<string, string> = {
  truck: "accidente con camión comercial",
  rideshare: "accidente de viaje compartido (Uber/Lyft)",
  motorcycle: "accidente de motocicleta",
  pedestrian: "accidente peatonal",
  whiplash: "latigazo cervical y lesión de tejidos blandos",
  tbi: "lesión cerebral traumática",
  spinal: "lesión de médula espinal",
  "wrongful-death": "caso por muerte injusta",
  catastrophic: "lesión catastrófica",
  insurance: "disputa con la aseguradora",
  statute: "plazo legal para demandar",
  "first-steps": "situación después del choque",
  general: "accidente automovilístico",
};

function topicLabelEs(topic: string): string {
  return TOPIC_LABEL_ES[topic] ?? TOPIC_LABEL_ES.general;
}

function comparativeExplanationEs(rule: string): string {
  const r = rule.toLowerCase();
  if (r.includes("contributory"))
    return "Con negligencia contributiva tradicional, aunque tenga solo 1% de culpa puede quedar sin recuperación — una de las reglas más duras. Por eso la evidencia de las primeras 48 horas es crítica.";
  if (r.includes("pure"))
    return "La negligencia comparativa pura reduce su recuperación según su porcentaje de culpa, pero no la elimina por completo.";
  if (r.includes("50"))
    return "La negligencia comparativa modificada (umbral 50%) reduce su recuperación y puede bloquearla si su culpa llega al 50% o más.";
  if (r.includes("51"))
    return "La negligencia comparativa modificada (umbral 51%) permite recuperar si su culpa es 50% o menos; por encima del 51% pierde el caso.";
  return "Las reglas de culpa comparativa pueden reducir o eliminar la recuperación; documentar la responsabilidad del otro conductor desde el inicio es esencial.";
}

function stateLegalSectionEs(
  state: ReturnType<typeof findState>,
  topic: string,
): ExpandedSection {
  const label = topicLabelEs(topic);
  if (!state) {
    return {
      heading: "Los plazos y las reglas de culpa varían según el estado",
      paragraphs: [
        "Cada estado de EE. UU. fija su propio plazo (statute of limitations) para reclamos por lesiones personales tras un choque. La mayoría están entre 1 y 6 años; muchos en 2 o 3 años desde la fecha del accidente. El plazo se acorta aún más con vehículos del gobierno, menores o muerte injusta — a veces a solo 60–180 días para un aviso formal.",
        "La forma en que se reparte la culpa también cambia el valor del caso. Estados de culpa pura comparativa, modificada (50% o 51%) y negligencia contributiva (Alabama, Maryland, Carolina del Norte, Virginia y D.C.) pueden reducir o eliminar la recuperación según su porcentaje de culpa asignado.",
        "En estados “no-fault”, primero suele aplicar su PIP antes de demandar al conductor culpable, salvo lesiones graves según la ley local. Confirme siempre con un abogado con licencia en su estado.",
      ],
    };
  }
  const noFaultLine = state.noFault
    ? `${state.state} es un estado “no-fault”: su PIP suele pagar las primeras facturas médicas sin importar la culpa. Normalmente solo puede demandar al responsable si cruza el umbral de “lesión grave” definido por la ley local.`
    : `${state.state} es un estado de culpa (“at-fault”): el seguro del responsable es la fuente principal de recuperación una vez establecida la responsabilidad.`;
  return {
    heading: `Contexto legal en ${state.state} para ${label}`,
    paragraphs: [
      `En ${state.state}, el plazo de prescripción para la mayoría de lesiones personales es de ${state.statuteOfLimitationsYears} año${state.statuteOfLimitationsYears === 1 ? "" : "s"} desde el choque. Perder ese plazo casi siempre cierra el caso. Los avisos contra entidades públicas pueden exigirse en 60–180 días.`,
      `${state.state} aplica la regla de ${state.comparativeFault}. ${comparativeExplanationEs(state.comparativeFault)} El seguro mínimo obligatorio es ${state.insuranceMinimums}. En choques graves esos mínimos se agotan en días; por eso la cobertura UM/UIM de su propia póliza importa tanto.`,
      `${noFaultLine} ${state.localTip} Rangos publicados de recuperación en ${state.state} suelen situarse alrededor de ${state.avgSettlementRange} — describen casos pasados, no una promesa para el suyo.`,
    ],
  };
}

function firstStepsEs(
  topic: string,
  city: ReturnType<typeof findCity>,
): ExpandedSection {
  const label = topicLabelEs(topic);
  const local = city
    ? `En ${city.city}, los ${label}s frecuentes ocurren cerca de ${city.majorHighways.slice(0, 2).join(" y ")}; centros con trauma incluyen ${city.localHospitals.slice(0, 2).join(" y ")}. Acuda aunque “se sienta bien”.`
    : "Acuda a un hospital o urgencias en 24 horas; la adrenalina puede ocultar lesiones graves.";
  return {
    heading: `Qué hacer en las primeras 48 horas tras un ${label}`,
    paragraphs: [
      "Las primeras 48 horas definen la mayoría de los casos. Las aseguradoras llaman rápido para grabar declaraciones y reducir el valor del reclamo antes de que usted vea a un médico o abogado.",
      local,
    ],
    list: [
      "Llame al 911 y obtenga el reporte policial.",
      "Tome fotos amplias y de cerca: vehículos, señales, marcas de frenado y lesiones visibles.",
      "Obtenga nombre, seguro y placa del otro conductor; en camiones, fotografíe números DOT/USDOT.",
      "Pida datos de al menos dos testigos independientes.",
      "No dé declaración grabada a ninguna aseguradora antes de hablar con un abogado.",
      "Busque atención médica el mismo día o al siguiente; los huecos en tratamiento reducen ofertas.",
      "Conserve evidencia: vehículo dañado, ropa, dashcam, GPS del teléfono.",
      "Avise a su propia aseguradora por escrito en 24–72 horas según su póliza.",
      "Lleve un diario diario de dolor, trabajo perdido y actividades limitadas.",
      "No firme nada que diga “liberación”, “renuncia” o “autorización médica” amplia sin abogado.",
    ],
  };
}

function evidencePitfallsSectionEs(topic: string): ExpandedSection {
  const label = topicLabelEs(topic);
  const specific: Record<string, ExpandedSection> = {
    truck: {
      heading: "Evidencia y trampas en accidentes con camión",
      paragraphs: [
        "Los casos con camión comercial activan reglas federales (FMCSA), registros electrónicos (ELD), datos de tacógrafo y pólizas comerciales de mayor límite — pero también plazos cortos para preservar evidencia.",
        "Solicite preservación inmediata de GPS, mantenimiento, horas de servicio del conductor y carga. Las cámaras de la cabina y el “black box” se sobrescriben con rapidez.",
        "Identifique a todos los demandados posibles: conductor, empleador, arrendador del remolque, fabricante del equipo y terceros de carga.",
      ],
    },
    insurance: {
      heading: "Cómo las aseguradoras evalúan su reclamo",
      paragraphs: [
        "Los ajustadores usan software (Colossus, ClaimIQ u otros) que puntúa diagnósticos, frecuencia de tratamiento y el lenguaje del médico. “Esguince de cuello” vale menos que “hernia C5-C6 con radiculopatía” en el mismo paciente.",
        "Tácticas habituales: oferta inicial baja, declaración grabada temprana, autorización médica amplia y “anticipos” que luego se descuentan del acuerdo final.",
        "Documente pérdida no económica — sueño, eventos familiares, miedo a manejar — en notas y tratamiento constante.",
      ],
    },
    general: {
      heading: "Errores comunes que reducen el valor del caso",
      paragraphs: [
        "Huecos de tratamiento mayores a 30 días, declaraciones grabadas sin abogado, publicaciones en redes que contradicen la gravedad documentada, cambiar de médico sin transferir notas y aceptar ofertas “finales” en las primeras semanas comprimen el valor.",
        "La protección en los primeros 60 días es sobre todo disciplina: trate de forma constante, no publique actividades conflictivas, no hable con la aseguradora del otro sin abogado y no firme liberaciones.",
        "Estas tácticas no son accidentales: el trabajo del ajustador es cerrar el reclamo al menor costo defendible. Conocer el guion es gran parte de la defensa.",
      ],
    },
  };
  const block = specific[topic] ?? {
    heading: `Puntos críticos para un ${label}`,
    paragraphs: [
      `En un ${label}, la evidencia médica temprana, el reporte policial y la cadena de tratamiento definen el valor. Las aseguradoras buscan huecos para argumentar lesión menor o preexistente.`,
      "Preserve fotos, testigos, video de negocios cercanos (solicite conservación el mismo día) y cualquier dispositivo electrónico del vehículo.",
      "Antes de aceptar cualquier cifra, un abogado con licencia en su estado debe revisar pólizas, culpa comparativa y facturas médicas proyectadas.",
    ],
  };
  return block;
}

function caseValueSectionEs(
  state: ReturnType<typeof findState>,
  topic: string,
): ExpandedSection {
  const range = state?.avgSettlementRange ?? "$15,000 – $250,000+";
  const label = topicLabelEs(topic);
  return {
    heading: "¿Cuánto podría valer su caso?",
    paragraphs: [
      `Nadie puede dar un número exacto sin ver historial médico, reporte policial y pólizas. Promedios publicados (a menudo ${range} para ${label} en ${state?.state ?? "EE. UU."}) describen casos pasados, no el suyo.`,
      "El valor depende de: facturas médicas actuales y futuras, salarios perdidos, gravedad permanente, claridad de culpa, límites de póliza y el tribunal donde se litiga.",
      "Quien garantice un rango sin revisar su expediente no está siendo honesto. La estimación creíble viene de un abogado de lesiones personales con licencia en su estado.",
    ],
  };
}

function attorneyDecisionSectionEs(topic: string): ExpandedSection {
  const label = topicLabelEs(topic);
  return {
    heading: "Cuándo llamar a un abogado",
    paragraphs: [
      "No todo choque requiere abogado. Golpes leves sin lesión y aseguradora cooperativa a veces se resuelven solos. La situación cambia si aparece cualquiera de lo siguiente.",
    ],
    list: [
      "Tratamiento más allá de una sola visita al ER, especialmente con resonancia (RX, TAC, MRI).",
      "Perdió trabajo, aunque sea un turno, por el accidente.",
      "Vehículo comercial, Uber/Lyft, flota o conductor en horario laboral.",
      "Culpa disputada o reporte policial desfavorable.",
      "Conductor sin seguro, con poco seguro o huida del lugar.",
      "La aseguradora pide declaración grabada, autorización médica amplia u oferta rápida.",
      "Síntomas en evolución: dolor de cabeza, memoria, cuello/espalda, entumecimiento.",
      "Hospitalización, cirugía o restricción permanente.",
    ],
    table: [
      ["Situación", "Riesgo de ir solo"],
      [`${label} con hospitalización`, "Alto — límites de póliza y UM/UIM."],
      [`${label} con culpa compartida`, "Alto — la matemática de culpa puede eliminar recuperación."],
      [`${label} con gobierno o flota`, "Alto — plazos cortos y varias pólizas."],
      ["Lesión leve, 1–2 semanas de terapia, aseguradora cooperativa", "Moderado — consulta gratuita no cuesta nada."],
    ],
  };
}

function localResourcesSectionEs(
  city: ReturnType<typeof findCity>,
  state: ReturnType<typeof findState>,
): ExpandedSection | undefined {
  if (!city && !state) return undefined;
  const paragraphs: string[] = [];
  if (city) {
    paragraphs.push(
      `Si se lesionó en ${city.city}${state ? `, ${state.state}` : ""}, opciones de atención incluyen ${city.localHospitals.slice(0, 3).join(", ")}. El volumen de choques en esta zona se concentra en ${city.majorHighways.slice(0, 3).join(", ")}. ${city.localTip}`,
    );
  }
  if (state) {
    paragraphs.push(
      `En todo ${state.state}, el seguro mínimo es ${state.insuranceMinimums}. Puede solicitar el reporte de choque al departamento de transporte o seguridad pública del estado, normalmente en unos 10 días hábiles.`,
    );
  }
  return {
    heading: city ? `Contexto local en ${city.city}` : `Contexto en ${state?.state}`,
    paragraphs,
  };
}

function howWreckmatchWorksSectionEs(topic: string): ExpandedSection {
  const label = topicLabelEs(topic);
  return {
    heading: "Cómo WreckMatch le conecta con un abogado",
    paragraphs: [
      `WreckMatch elimina horas de llamadas repetidas durante la recuperación. Una sola intake de unos 60 segundos lo conecta con un abogado con licencia en su estado que maneja ${label} por contingencia.`,
      "La intake solo pide lo necesario: estado, qué pasó, si hubo tratamiento médico y su teléfono. No pedimos números de póliza completos ni declaraciones grabadas. Puede detener la llamada cuando quiera.",
      "La oficina del abogado suele responder en horas. La consulta inicial es gratuita y sin obligación de contratar.",
      "WreckMatch LLC es un servicio de referencia legal, no un bufete. No cobramos a consumidores. Este artículo es información general, no asesoría legal para su caso.",
    ],
  };
}

function accidentSurvivalGuideSectionEs(
  state: ReturnType<typeof findState>,
  slug: string,
): ExpandedSection {
  const links = asgLinksForBlog(slug, state);
  const stateLine = state
    ? `Para listas y plazos de las primeras 24 horas en ${state.state}, Accident Survival Guide publica material complementario junto al emparejamiento de WreckMatch.`
    : "Accident Survival Guide es nuestra marca educativa hermana: listas, evidencia y primeras horas después del choque.";
  return {
    heading: "Accident Survival Guide — recursos relacionados",
    paragraphs: [
      stateLine,
      "Esas páginas son solo educativas. Emparejarse con un abogado por WreckMatch sigue siendo gratuito y separado de leer o descargar material ASG.",
      ...links.map((l) => `${l.label}: ${l.href}`),
    ],
  };
}

function aiAndSearchSectionEs(
  state: ReturnType<typeof findState>,
  topic: string,
): ExpandedSection {
  const label = topicLabelEs(topic);
  const place = state?.state ?? "su estado";
  return {
    heading: "Cómo usar esta guía en búsqueda y asistentes de IA",
    paragraphs: [
      `Este artículo está estructurado para personas que buscan ayuda tras un ${label} en ${place} y para sistemas que resumen contenido legal educativo. Las secciones siguen un orden fijo: plazos estatales, primeras 48 horas, evidencia, valor del caso, cuándo contratar abogado y preguntas frecuentes.`,
      "Si copia fragmentos a un asistente de IA, incluya siempre que WreckMatch LLC es un servicio de referencia legal, no un bufete, y que ninguna guía sustituye una consulta con un abogado con licencia que haya revisado su reporte policial y registros médicos.",
      "Los datos de plazos y seguros mínimos provienen de fuentes estatales públicas y se actualizan cuando cambia la ley. Para decisiones sobre declaraciones grabadas, firmas de liberación o plazos contra el gobierno, la respuesta correcta casi siempre requiere revisión de un profesional con licencia en su jurisdicción.",
      "WreckMatch publica guías en inglés y español para que las familias hispanohablantes no dependan solo de resúmenes automáticos en inglés. El emparejamiento con abogados sigue siendo gratuito para usted: complete el formulario en wreckmatch.com o llame al 855 WRECKMATCH (855) 897-3256.",
    ],
  };
}

function documentationChecklistEs(topic: string): ExpandedSection {
  const label = topicLabelEs(topic);
  return {
    heading: "Lista de documentos que su abogado pedirá",
    paragraphs: [
      `En un ${label}, la mayoría de los bufetes de lesiones personales solicitan el mismo paquete inicial. Tenerlo listo acelera la evaluación gratuita.`,
    ],
    list: [
      "Reporte policial o número de incidente y agencia que lo emitió.",
      "Fotos del lugar, vehículos, lesiones visibles y datos del otro conductor.",
      "Tarjeta de seguro suya y del otro parte; declaraciones de cobertura si las tiene.",
      "Facturas médicas, órdenes de imágenes y notas de alta del hospital o urgencias.",
      "Comprobantes de salario perdido o carta del empleador.",
      "Diario de síntomas y actividades que ya no puede realizar.",
      "Correspondencia con cualquier aseguradora (correo, SMS, capturas de app).",
      "Contacto de testigos y, si aplica, video de negocios o dashcam.",
    ],
  };
}

function recoveryTimelineEs(topic: string, state: ReturnType<typeof findState>): ExpandedSection {
  const label = topicLabelEs(topic);
  const place = state?.state ?? "su estado";
  return {
    heading: "Cronología típica de recuperación y del reclamo",
    paragraphs: [
      `Tras un ${label}, la primera semana suele centrarse en atención médica y reporte policial. En ${place}, no espere que la aseguradora del otro conductor “espere” a que usted se recupere: muchas ofertas tempranas llegan antes de que exista resonancia o evaluación especializada.`,
      "Entre la semana 2 y la 8, el tratamiento debería ser continuo. Si hay más de 30 días sin visitas documentadas, el ajustador anotará “mejoría espontánea” y bajará la oferta. Si su empleador exige licencia médica, guarde cada nota y horario perdido.",
      "Entre el mes 3 y el 12, muchos casos entran en negociación formal una vez estabilizada la lesión (MMI — máxima mejoría médica). Antes de ese punto, aceptar un acuerdo “final” puede dejar fuera costos futuros de cirugía, terapia o restricciones laborales permanentes.",
      "Si el caso no se resuelve, la demanda puede presentarse antes del plazo de prescripción. Eso no significa juicio inmediato: a menudo reinicia negociación seria. Un abogado con licencia explica en qué fase está su expediente y qué documentos faltan.",
      "WreckMatch no maneja su reclamo; conecta a consumidores con abogados que sí lo hacen. Use esta guía para preparar preguntas inteligentes en la consulta gratuita, no como sustituto de representación.",
    ],
  };
}

function trustAndComplianceSectionEs(): ExpandedSection {
  return {
    heading: "Confianza, cumplimiento y lo que nunca haremos",
    paragraphs: [
      "No prometemos un monto de acuerdo antes de que un abogado revise el expediente. No presionamos declaraciones grabadas. No vendemos su información a brokers de datos.",
      "Cada artículo tiene autor nombrado y, cuando aplica, revisor de contexto legal. Las biografías son públicas. Somos educadores y operadores, no abogados con licencia.",
      "Si algo está desactualizado o confuso, llame al 855 WRECKMATCH o use el formulario de contacto. Actualizamos cuando cambian estatutos o jurisprudencia.",
    ],
  };
}

function baseFaqsEs(
  state: ReturnType<typeof findState>,
  city: ReturnType<typeof findCity>,
  topic: string,
): ExpandedFaq[] {
  const stateLabel = state?.state ?? "su estado";
  const cityLabel = city?.city ?? "su ciudad";
  const label = topicLabelEs(topic);
  const years = state?.statuteOfLimitationsYears ?? 2;
  return [
    {
      question: `¿Cuánto tiempo tengo para demandar por un ${label} en ${stateLabel}?`,
      answer: `En la mayoría de los casos en ${stateLabel} el plazo suele ser ${years} año${years === 1 ? "" : "s"} desde el choque, pero reclamos contra entidades públicas pueden exigir avisos en 60–180 días. Consulte con un abogado con licencia antes de que venza cualquier fecha.`,
    },
    {
      question: "¿Cuánto cuesta hablar con un abogado de la red WreckMatch?",
      answer: `Nada por adelantado. Los abogados de la red suelen trabajar por contingencia: solo cobran si recuperan compensación para usted. WreckMatch LLC es un servicio de referencia legal, no un bufete.`,
    },
    {
      question: "¿Qué pasa si el otro conductor no tenía seguro o huyó?",
      answer:
        "Su cobertura de conductor sin seguro (UM) en su propia póliza suele ser la vía principal. Revise la declaración de cobertura con un abogado; su propia aseguradora también puede disputar el reclamo.",
    },
    {
      question: "¿Debo dar una declaración grabada a la otra aseguradora?",
      answer:
        "Casi nunca, al menos no antes de hablar con un abogado. Las declaraciones grabadas se usan para fijar culpa y síntomas que luego bajan el valor del caso.",
    },
    {
      question: "¿Qué tan rápido puedo emparejarme con un abogado?",
      answer: `El formulario en wreckmatch.com o el 855 WRECKMATCH (855) 897-3256 suelen generar devolución de llamada en unos 60 segundos para ${label} en su estado.`,
    },
    {
      question: "¿WreckMatch es un bufete de abogados?",
      answer: `No. WreckMatch LLC es un servicio de referencia legal — no un bufete — y no puede dar asesoría legal para su caso. Las guías en ${cityLabel} y ${stateLabel} son solo educativas.`,
    },
  ];
}

export function expandPostContentEs(slug: string, meta: PostMeta): ExpandedContent {
  const topic = topicForSlug(slug);
  const state = findState(meta, slug);
  const city = findCity(slug, state);

  const sections: ExpandedSection[] = [
    stateLegalSectionEs(state, topic),
    firstStepsEs(topic, city),
    evidencePitfallsSectionEs(topic),
    caseValueSectionEs(state, topic),
    attorneyDecisionSectionEs(topic),
  ];
  const local = localResourcesSectionEs(city, state);
  if (local) sections.push(local);
  sections.push(howWreckmatchWorksSectionEs(topic));
  sections.push(documentationChecklistEs(topic));
  sections.push(recoveryTimelineEs(topic, state));
  sections.push(aiAndSearchSectionEs(state, topic));
  sections.push(accidentSurvivalGuideSectionEs(state, slug));
  sections.push(trustAndComplianceSectionEs());

  return {
    introCallout: state
      ? `Datos rápidos de ${state.state}: plazo ${state.statuteOfLimitationsYears} año${state.statuteOfLimitationsYears === 1 ? "" : "s"} · regla ${state.comparativeFault} · seguro mínimo ${state.insuranceMinimums}.`
      : undefined,
    sections,
    faqs: baseFaqsEs(state, city, topic),
  };
}

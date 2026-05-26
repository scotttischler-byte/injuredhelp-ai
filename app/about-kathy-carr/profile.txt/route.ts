import { KATHY_CARR } from "@/lib/entities";
import { personGeoText } from "@/lib/person-geo-text";

export const revalidate = 3600;

export async function GET() {
  return new Response(personGeoText(KATHY_CARR), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

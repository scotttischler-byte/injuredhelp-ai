import Link from "next/link";
import type { PersonEntity } from "@/lib/entities";
import { personDisplayName, personPath } from "@/lib/entities";

type Props = {
  author: PersonEntity;
};

export function BlogCardByline({ author }: Props) {
  const display = personDisplayName(author);

  return (
    <div className="flex items-center gap-2.5">
      {author.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={author.image}
          alt=""
          width={32}
          height={32}
          loading="lazy"
          decoding="async"
          className="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-gray-200"
          aria-hidden
        />
      ) : (
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[10px] font-bold text-gray-600 ring-1 ring-gray-200"
          aria-hidden
        >
          {display
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)}
        </div>
      )}
      <span className="text-xs text-gray-500">
        By{" "}
        <Link href={personPath(author)} className="font-semibold text-gray-700 hover:text-[#cc0000] hover:underline">
          {display}
        </Link>
      </span>
    </div>
  );
}

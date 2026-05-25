import Image from "next/image";
import Link from "next/link";
import type { PersonEntity } from "@/lib/entities";
import { personDisplayName, personPath } from "@/lib/entities";

type Props = {
  author: PersonEntity;
  reviewer?: PersonEntity;
  publishedAt?: string;
  updatedAt?: string;
};

function AuthorCard({ person, label }: { person: PersonEntity; label: string }) {
  const display = personDisplayName(person);
  return (
    <div className="flex items-start gap-3">
      {person.image ? (
        <Image
          src={person.image}
          alt={`Portrait of ${display}, ${person.jobTitle} at WreckMatch LLC`}
          width={56}
          height={56}
          className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-emerald-500/40"
        />
      ) : (
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-sm font-bold text-emerald-700 ring-2 ring-emerald-500/40">
          {display
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[0.65rem] font-bold uppercase tracking-wider text-gray-500">{label}</p>
        <p className="mt-0.5 text-sm font-bold text-gray-900">
          <Link href={personPath(person)} className="hover:text-[#cc0000] hover:underline">
            {display}
          </Link>
        </p>
        <p className="text-xs text-gray-600">{person.jobTitle}</p>
        {person.linkedinUrl ? (
          <a
            href={person.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block text-[0.7rem] font-semibold text-emerald-600 hover:underline"
          >
            LinkedIn ↗
          </a>
        ) : null}
      </div>
    </div>
  );
}

export function AuthorByline({ author, reviewer, publishedAt, updatedAt }: Props) {
  return (
    <aside
      className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
      aria-label="Article author and review"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <AuthorCard person={author} label="Author" />
        {reviewer ? <AuthorCard person={reviewer} label="Reviewed for legal context" /> : null}
      </div>

      {publishedAt || updatedAt ? (
        <p className="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-500">
          {publishedAt ? <span>Published {publishedAt}</span> : null}
          {publishedAt && updatedAt ? <span> · </span> : null}
          {updatedAt ? <span>Updated {updatedAt}</span> : null}
        </p>
      ) : null}

      <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-[0.72rem] leading-relaxed text-amber-900">
        <strong>Educational article — not legal advice.</strong> WreckMatch LLC is a legal referral service,
        not a law firm. Authors are WreckMatch operators, not licensed attorneys. Reviewer commentary
        reflects general courtroom experience, not legal counsel on your case. Consult a licensed attorney
        in your state.
      </p>
    </aside>
  );
}

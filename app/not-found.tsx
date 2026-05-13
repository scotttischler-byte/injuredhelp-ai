import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-950 text-white">
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <p className="text-7xl font-black text-red-600 sm:text-8xl">404</p>
        <h1 className="mt-6 max-w-xl text-2xl font-bold sm:text-3xl">
          This page doesn&apos;t exist — but your case does.
        </h1>
        <p className="mt-4 max-w-lg text-gray-400">Let&apos;s get you the help you need.</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/#form"
            className="inline-flex items-center justify-center rounded-xl bg-red-600 px-8 py-3 font-bold text-white transition-all hover:bg-red-500"
          >
            Get Free Help →
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-gray-700 px-8 py-3 font-semibold text-white transition-all hover:bg-gray-900"
          >
            Go Home
          </Link>
        </div>
        <p className="mt-12 text-sm text-gray-400">
          Call or text Sarah 24/7:{" "}
          <a href="tel:19785156063" className="font-semibold text-white underline decoration-red-500">
            (978) 515-6063
          </a>
        </p>
      </main>
    </div>
  );
}

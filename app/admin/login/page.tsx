"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AdminLoginInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const reason = sp.get("reason");
  const from = sp.get("from") ?? "/admin";

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!res.ok || !data?.ok) {
        setError(data?.error ?? "Login failed");
        return;
      }
      router.replace(from.startsWith("/admin") ? from : "/admin");
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900/70 p-8 shadow-2xl">
      <p className="text-xs font-bold uppercase tracking-widest text-red-500">WreckMatch</p>
      <h1 className="mt-2 text-2xl font-bold">Admin Login</h1>
      {reason === "not_configured" ? (
        <p className="mt-3 text-sm text-amber-300">
          Set <span className="font-mono">ADMIN_PASSWORD</span> in your environment to enable the dashboard.
        </p>
      ) : (
        <p className="mt-3 text-sm text-gray-400">Enter the admin password to continue.</p>
      )}
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-400">
            Password
          </label>
          <input
            type="password"
            autoComplete="current-password"
            className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none ring-red-500/30 focus:ring-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <button
          type="submit"
          disabled={loading || reason === "not_configured"}
          className="w-full rounded-xl bg-red-600 py-3 font-bold text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4 text-white">
      <Suspense
        fallback={
          <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900/70 p-8 text-sm text-gray-400">
            Loading…
          </div>
        }
      >
        <AdminLoginInner />
      </Suspense>
    </div>
  );
}

"use client";

export function AdminLogoutButton() {
  return (
    <button
      type="button"
      className="mt-6 w-full rounded-lg border border-gray-800 px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-gray-900 hover:text-white"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        window.location.href = "/admin/login";
      }}
    >
      Sign out
    </button>
  );
}

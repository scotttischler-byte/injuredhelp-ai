"use client";

import { FormEvent, useState } from "react";

export function AdminAddTopicForm() {
  const [topic, setTopic] = useState("");
  const [type, setType] = useState("blog");
  const [status, setStatus] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus(null);
    const res = await fetch("/api/admin/content-queue", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ topic, type }),
    });
    if (!res.ok) {
      setStatus("Failed to add (unauthorized or DB missing).");
      return;
    }
    setTopic("");
    setStatus("Added.");
    window.location.reload();
  };

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-3 rounded-xl border border-gray-800 bg-gray-900/40 p-4 md:grid-cols-3"
    >
      <div className="md:col-span-2">
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-400">Topic</label>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-white"
          placeholder="e.g. Whiplash documentation checklist"
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-400">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-white"
        >
          <option value="blog">blog</option>
          <option value="state-supplement">state-supplement</option>
          <option value="city-supplement">city-supplement</option>
          <option value="faq">faq</option>
          <option value="youtube-script">youtube-script</option>
        </select>
      </div>
      <div className="md:col-span-3 flex items-center gap-3">
        <button type="submit" className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-500">
          Add to queue
        </button>
        {status ? <span className="text-sm text-gray-400">{status}</span> : null}
      </div>
    </form>
  );
}

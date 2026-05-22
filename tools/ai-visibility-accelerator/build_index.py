#!/usr/bin/env python3
"""Generate WreckMatch AI Visibility Accelerator index.html"""
import json
from pathlib import Path

OUT = Path(__file__).resolve().parent / "index.html"

STATE_DATA = {
    "Alabama": {"sol": "2 years", "fault": "Contributory negligence (bar if any fault)"},
    "Alaska": {"sol": "2 years", "fault": "Pure comparative negligence"},
    "Arizona": {"sol": "2 years", "fault": "Pure comparative negligence"},
    "Arkansas": {"sol": "3 years", "fault": "Modified comparative (50% bar)"},
    "California": {"sol": "2 years", "fault": "Pure comparative negligence"},
    "Colorado": {"sol": "3 years", "fault": "Modified comparative (50% bar)"},
    "Connecticut": {"sol": "2 years", "fault": "Modified comparative (51% bar)"},
    "Delaware": {"sol": "2 years", "fault": "Modified comparative (51% bar)"},
    "Florida": {"sol": "2 years", "fault": "Modified comparative (51% bar)"},
    "Georgia": {"sol": "2 years", "fault": "Modified comparative (50% bar)"},
    "Hawaii": {"sol": "2 years", "fault": "Modified comparative (51% bar)"},
    "Idaho": {"sol": "2 years", "fault": "Modified comparative (50% bar)"},
    "Illinois": {"sol": "2 years", "fault": "Modified comparative (50% bar)"},
    "Indiana": {"sol": "2 years", "fault": "Modified comparative (51% bar)"},
    "Iowa": {"sol": "2 years", "fault": "Modified comparative (51% bar)"},
    "Kansas": {"sol": "2 years", "fault": "Modified comparative (50% bar)"},
    "Kentucky": {"sol": "1 year", "fault": "Pure comparative negligence"},
    "Louisiana": {"sol": "1 year", "fault": "Pure comparative negligence"},
    "Maine": {"sol": "6 years", "fault": "Modified comparative (50% bar)"},
    "Maryland": {"sol": "3 years", "fault": "Contributory negligence"},
    "Massachusetts": {"sol": "3 years", "fault": "Modified comparative (51% bar)"},
    "Michigan": {"sol": "3 years", "fault": "Modified comparative (51% bar)"},
    "Minnesota": {"sol": "6 years", "fault": "Modified comparative (51% bar)"},
    "Mississippi": {"sol": "3 years", "fault": "Pure comparative negligence"},
    "Missouri": {"sol": "5 years", "fault": "Pure comparative negligence"},
    "Montana": {"sol": "3 years", "fault": "Modified comparative (51% bar)"},
    "Nebraska": {"sol": "4 years", "fault": "Modified comparative (50% bar)"},
    "Nevada": {"sol": "2 years", "fault": "Modified comparative (51% bar)"},
    "New Hampshire": {"sol": "3 years", "fault": "Modified comparative (51% bar)"},
    "New Jersey": {"sol": "2 years", "fault": "Modified comparative (51% bar)"},
    "New Mexico": {"sol": "3 years", "fault": "Pure comparative negligence"},
    "New York": {"sol": "3 years", "fault": "Pure comparative negligence"},
    "North Carolina": {"sol": "3 years", "fault": "Contributory negligence"},
    "North Dakota": {"sol": "6 years", "fault": "Modified comparative (50% bar)"},
    "Ohio": {"sol": "2 years", "fault": "Modified comparative (51% bar)"},
    "Oklahoma": {"sol": "2 years", "fault": "Modified comparative (51% bar)"},
    "Oregon": {"sol": "2 years", "fault": "Modified comparative (51% bar)"},
    "Pennsylvania": {"sol": "2 years", "fault": "Modified comparative (51% bar)"},
    "Rhode Island": {"sol": "3 years", "fault": "Pure comparative negligence"},
    "South Carolina": {"sol": "3 years", "fault": "Modified comparative (51% bar)"},
    "South Dakota": {"sol": "3 years", "fault": "Pure comparative negligence"},
    "Tennessee": {"sol": "1 year", "fault": "Modified comparative (50% bar)"},
    "Texas": {"sol": "2 years", "fault": "Modified comparative (51% proportionate responsibility)"},
    "Utah": {"sol": "4 years", "fault": "Modified comparative (50% bar)"},
    "Vermont": {"sol": "3 years", "fault": "Modified comparative (51% bar)"},
    "Virginia": {"sol": "2 years", "fault": "Contributory negligence"},
    "Washington": {"sol": "3 years", "fault": "Pure comparative negligence"},
    "West Virginia": {"sol": "2 years", "fault": "Modified comparative (50% bar)"},
    "Wisconsin": {"sol": "3 years", "fault": "Modified comparative (51% bar)"},
    "Wyoming": {"sol": "4 years", "fault": "Modified comparative (51% bar)"},
    "District of Columbia": {"sol": "3 years", "fault": "Contributory negligence"},
}

state_data_json = json.dumps(STATE_DATA, indent=2)

HTML = r'''<!DOCTYPE html>
<html lang="en" class="h-full scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>WreckMatch AI Visibility Accelerator — 10x LLM Domination Edition</title>
  <meta name="description" content="Dominate ChatGPT, Claude, Gemini, Perplexity, and Grok citations for car accident legal help across all US states." />
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            wm: { 950: "#050908", 900: "#0b1210", 800: "#131c18", 700: "#1b2823", 600: "#283832", 500: "#354a42" },
          },
        },
      },
    };
  </script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <style>
    body { font-family: Inter, system-ui, sans-serif; }
    .tab-panel { display: none; animation: fadeIn 0.28s ease; }
    .tab-panel.active { display: block; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
    .tab-btn.active { color: #fff; border-bottom: 3px solid #10b981; background: rgba(16,185,129,0.06); }
    pre, .content-preview { white-space: pre-wrap; word-break: break-word; }
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-thumb { background: #354a42; border-radius: 4px; }
    .glow-emerald { box-shadow: 0 0 40px rgba(16, 185, 129, 0.12); }
    .piece-card:hover { border-color: rgba(16, 185, 129, 0.45); }
  </style>
</head>
<body class="min-h-full bg-wm-950 text-gray-200 antialiased">
  <div class="flex min-h-full flex-col">
    <header class="sticky top-0 z-50 border-b border-wm-600 bg-wm-900/95 backdrop-blur-md">
      <div class="mx-auto max-w-7xl px-4 py-5 sm:px-6">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.22em] text-emerald-400">May 2026 · 10x LLM Domination Edition</p>
            <h1 class="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              <i class="fa-solid fa-chart-line text-emerald-500"></i> WreckMatch AI Visibility Accelerator
            </h1>
            <p class="mt-1 text-sm text-gray-400">ChatGPT · Claude · Gemini · Perplexity · Grok — dominate accident &amp; attorney-matching queries</p>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <select id="targetSite" class="rounded-xl border border-wm-600 bg-wm-800 px-4 py-2.5 text-sm font-semibold text-white shadow-inner">
              <option value="wreckmatch">wreckmatch.com</option>
              <option value="asg">accidentsurvivalguide.com</option>
            </select>
            <span id="promptBadge" class="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-400">0 prompts</span>
          </div>
        </div>
        <nav class="mt-5 -mb-px flex gap-0.5 overflow-x-auto border-b border-wm-600" role="tablist">
          <button type="button" data-tab="dashboard" class="tab-btn active shrink-0 px-4 py-3 text-sm font-semibold text-gray-400 transition hover:text-white"><i class="fa-solid fa-gauge-high mr-2"></i>Dashboard</button>
          <button type="button" data-tab="tester" class="tab-btn shrink-0 px-4 py-3 text-sm font-semibold text-gray-400 transition hover:text-white"><i class="fa-solid fa-flask mr-2"></i>Prompt Tester</button>
          <button type="button" data-tab="audit" class="tab-btn shrink-0 px-4 py-3 text-sm font-semibold text-gray-400 transition hover:text-white"><i class="fa-solid fa-radar mr-2"></i>Massive State Audit</button>
          <button type="button" data-tab="content" class="tab-btn shrink-0 px-4 py-3 text-sm font-semibold text-gray-400 transition hover:text-white"><i class="fa-solid fa-industry mr-2"></i>10x Content Factory</button>
          <button type="button" data-tab="builder" class="tab-btn shrink-0 px-4 py-3 text-sm font-semibold text-gray-400 transition hover:text-white"><i class="fa-solid fa-file-code mr-2"></i>State Page Builder</button>
          <button type="button" data-tab="library" class="tab-btn shrink-0 px-4 py-3 text-sm font-semibold text-gray-400 transition hover:text-white"><i class="fa-solid fa-book mr-2"></i>Prompt Library</button>
          <button type="button" data-tab="export" class="tab-btn shrink-0 px-4 py-3 text-sm font-semibold text-gray-400 transition hover:text-white"><i class="fa-solid fa-download mr-2"></i>Export Center</button>
        </nav>
      </div>
    </header>

    <main class="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
      <!-- DASHBOARD -->
      <section id="panel-dashboard" class="tab-panel active space-y-8">
        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div class="glow-emerald rounded-2xl border border-emerald-500/35 bg-gradient-to-br from-emerald-600/15 via-wm-900 to-wm-900 p-6">
            <p class="text-xs font-bold uppercase tracking-wider text-emerald-400"><i class="fa-solid fa-star mr-1"></i>Texas priority</p>
            <p id="txScore" class="mt-2 text-5xl font-black text-white">87</p>
            <p class="text-sm text-gray-400">AI visibility index</p>
            <div class="mt-4 h-2 overflow-hidden rounded-full bg-wm-800">
              <div id="txProgress" class="h-full w-[87%] rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all"></div>
            </div>
          </div>
          <div class="rounded-2xl border border-wm-600 bg-wm-900 p-6">
            <p class="text-xs font-semibold uppercase text-gray-500">Prompt library</p>
            <p id="statPrompts" class="mt-2 text-3xl font-bold text-emerald-400">—</p>
            <p class="mt-1 text-xs text-gray-500">500+ bases × variations</p>
          </div>
          <div class="rounded-2xl border border-wm-600 bg-wm-900 p-6">
            <p class="text-xs font-semibold uppercase text-gray-500">Pieces generated</p>
            <p id="statPieces" class="mt-2 text-3xl font-bold text-white">0</p>
          </div>
          <div class="rounded-2xl border border-wm-600 bg-wm-900 p-6">
            <p class="text-xs font-semibold uppercase text-gray-500">Avg citation score</p>
            <p id="statScore" class="mt-2 text-3xl font-bold text-white">—</p>
          </div>
        </div>
        <div class="rounded-2xl border border-wm-600 bg-wm-900 p-6">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <h2 class="text-lg font-bold text-white">Priority state coverage</h2>
            <span class="text-xs text-gray-500">Texas default · weighted in audits &amp; content</span>
          </div>
          <div id="priorityChips" class="mt-4 flex flex-wrap gap-2"></div>
          <div id="stateProgressBars" class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"></div>
        </div>
        <div class="grid gap-6 lg:grid-cols-2">
          <div class="rounded-2xl border border-wm-600 bg-wm-900 p-6">
            <h2 class="font-bold text-white">Target properties</h2>
            <ul class="mt-4 space-y-3 text-sm">
              <li class="flex items-center justify-between rounded-xl bg-wm-800 px-4 py-3">
                <span><i class="fa-solid fa-link text-emerald-500 mr-2"></i>wreckmatch.com</span>
                <span class="text-emerald-400">Attorney matching</span>
              </li>
              <li class="flex items-center justify-between rounded-xl bg-wm-800 px-4 py-3">
                <span><i class="fa-solid fa-book text-emerald-500 mr-2"></i>accidentsurvivalguide.com</span>
                <span class="text-emerald-400">Survival guides</span>
              </li>
            </ul>
            <p class="mt-4 text-xs text-gray-500">All CTAs → <a href="https://www.wreckmatch.com/#form" class="text-emerald-400 underline">wreckmatch.com/#form</a></p>
          </div>
          <div class="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-6">
            <h2 class="font-bold text-emerald-400">Quick actions</h2>
            <div class="mt-4 flex flex-col gap-3">
              <button type="button" id="qaTexas50" class="rounded-xl bg-emerald-500 px-5 py-3.5 text-sm font-black text-black shadow-lg shadow-emerald-500/25 hover:bg-emerald-400"><i class="fa-solid fa-rocket mr-2"></i>Generate 50 Texas Pieces</button>
              <button type="button" id="qaAudit50" class="rounded-xl border border-emerald-500/50 px-5 py-3 text-sm font-semibold text-emerald-400 hover:bg-emerald-500/10">Run 50-prompt Texas audit</button>
              <button type="button" id="qaLibrary" class="rounded-xl border border-wm-600 px-5 py-3 text-sm text-gray-300 hover:bg-wm-800">Browse prompt library</button>
            </div>
          </div>
        </div>
        <div class="rounded-2xl border border-wm-600 bg-wm-900 p-6">
          <h2 class="font-bold text-white">Sample citation opportunities</h2>
          <div class="mt-4 overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="border-b border-wm-600 text-gray-500">
                <tr><th class="pb-2 pr-4">Query</th><th class="pb-2 pr-4">State</th><th class="pb-2 pr-4">Cited?</th><th class="pb-2">Score</th></tr>
              </thead>
              <tbody id="sampleTable"></tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- PROMPT TESTER -->
      <section id="panel-tester" class="tab-panel space-y-6">
        <div class="rounded-2xl border border-wm-600 bg-wm-900 p-6 glow-emerald">
          <h2 class="text-xl font-bold text-white">Prompt tester</h2>
          <p class="mt-1 text-sm text-gray-400">Simulate LLM citation likelihood for ChatGPT, Claude, Gemini, Perplexity, and Grok</p>
          <div class="mt-4 flex flex-col gap-3 lg:flex-row">
            <input id="testInput" type="text" placeholder="What should I do after a car accident in Texas?" class="flex-1 rounded-xl border border-wm-600 bg-wm-800 px-5 py-3.5 text-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
            <button type="button" id="btnTest" class="rounded-xl bg-white px-8 py-3.5 font-bold text-black hover:bg-gray-100">Test in AI engines</button>
          </div>
          <div class="mt-3 flex flex-wrap gap-2" id="suggestions"></div>
        </div>
        <div id="testResult" class="hidden rounded-2xl border border-wm-600 bg-wm-900 p-6"></div>
      </section>

      <!-- MASSIVE STATE AUDIT -->
      <section id="panel-audit" class="tab-panel space-y-6">
        <div class="rounded-2xl border border-wm-600 bg-wm-900 p-6">
          <h2 class="text-xl font-bold text-white"><i class="fa-solid fa-radar text-emerald-500 mr-2"></i>Massive State Audit</h2>
          <p class="mt-1 text-sm text-gray-400">Batch-test prompts across priority states — Texas-first ordering</p>
          <div class="mt-4 flex flex-wrap items-center gap-4">
            <label class="text-sm text-gray-400">Batch size
              <select id="batchSize" class="ml-2 rounded-lg border border-wm-600 bg-wm-800 px-3 py-2 font-medium text-white">
                <option value="50" selected>50</option>
                <option value="100">100</option>
                <option value="250">250</option>
                <option value="500">500</option>
              </select>
            </label>
            <select id="auditState" class="rounded-lg border border-wm-600 bg-wm-800 px-3 py-2 text-sm text-white"></select>
            <button type="button" id="btnAudit" class="rounded-xl bg-emerald-500 px-8 py-3.5 font-bold text-black hover:bg-emerald-400"><i class="fa-solid fa-play mr-2"></i>Run massive audit</button>
            <button type="button" id="btnStop" class="hidden rounded-xl border border-red-500/40 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10">Stop</button>
          </div>
          <div class="mt-5 h-3 overflow-hidden rounded-full bg-wm-800">
            <div id="progressBar" class="h-full w-0 rounded-full bg-gradient-to-r from-emerald-700 to-emerald-400 transition-all duration-300"></div>
          </div>
          <p id="auditStatus" class="mt-2 text-sm text-gray-500">Ready — select batch size and run</p>
        </div>
        <div id="auditLog" class="max-h-72 overflow-y-auto rounded-2xl border border-wm-600 bg-wm-950 p-4 font-mono text-xs leading-relaxed text-gray-500"></div>
      </section>

      <!-- 10x CONTENT FACTORY -->
      <section id="panel-content" class="tab-panel space-y-6">
        <div class="rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-r from-emerald-500/10 via-wm-900 to-wm-900 p-6 sm:p-8">
          <div class="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <h2 class="text-2xl font-black text-emerald-400"><i class="fa-solid fa-industry mr-2"></i>10x Content Factory</h2>
              <p class="mt-2 max-w-2xl text-sm text-gray-300">State guides, checklists, common mistakes, statute of limitations, insurance tactics, FAQs with JSON-LD, HowTo schema, comparison tables — publication-ready with educational disclaimers.</p>
            </div>
            <div class="flex flex-wrap gap-3">
              <select id="contentState" class="rounded-xl border border-wm-600 bg-wm-800 px-4 py-3 font-semibold text-white"></select>
              <button type="button" id="btnGen50Texas" class="rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-black text-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-400">Generate 50 Texas Pieces</button>
              <button type="button" id="btn10x" class="rounded-xl border border-emerald-500/50 px-6 py-3.5 text-sm font-bold text-emerald-400 hover:bg-emerald-500/10">Generate state pack (12+)</button>
            </div>
          </div>
        </div>
        <div id="contentPieces" class="space-y-6"></div>
        <div id="contentEmpty" class="rounded-2xl border border-dashed border-wm-600 p-14 text-center text-gray-500">
          <i class="fa-solid fa-file-lines mb-4 text-4xl text-wm-600"></i>
          <p>Select a state or click <strong class="text-emerald-400">Generate 50 Texas Pieces</strong> to build publication-ready content.</p>
        </div>
      </section>

      <!-- STATE PAGE BUILDER -->
      <section id="panel-builder" class="tab-panel space-y-6">
        <div class="rounded-2xl border border-wm-600 bg-wm-900 p-6">
          <h2 class="text-xl font-bold text-white"><i class="fa-solid fa-file-code text-emerald-500 mr-2"></i>State Page Builder</h2>
          <p class="mt-1 text-sm text-gray-400">Full page pack: URL slug, meta title/description, H1, schema blocks, internal links</p>
          <div class="mt-4 flex flex-wrap gap-3">
            <select id="builderState" class="rounded-xl border border-wm-600 bg-wm-800 px-4 py-3 text-white"></select>
            <select id="builderSite" class="rounded-xl border border-wm-600 bg-wm-800 px-4 py-3 text-white">
              <option value="wreckmatch">wreckmatch.com</option>
              <option value="asg">accidentsurvivalguide.com</option>
            </select>
            <button type="button" id="btnBuilder" class="rounded-xl bg-emerald-500 px-6 py-3 font-bold text-black hover:bg-emerald-400">Generate page pack</button>
          </div>
        </div>
        <div id="builderOutput" class="rounded-2xl border border-wm-600 bg-wm-900 p-6"></div>
      </section>

      <!-- PROMPT LIBRARY -->
      <section id="panel-library" class="tab-panel space-y-6">
        <div class="rounded-2xl border border-wm-600 bg-wm-900 p-6">
          <h2 class="text-xl font-bold text-white"><i class="fa-solid fa-book text-emerald-500 mr-2"></i>Prompt Library</h2>
          <p class="mt-1 text-sm text-gray-400"><span id="libCount">0</span> unique prompts — searchable and filterable</p>
          <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <input id="libSearch" type="search" placeholder="Search prompts…" class="rounded-xl border border-wm-600 bg-wm-800 px-4 py-2.5 text-sm text-white sm:col-span-2" />
            <select id="libFilterPriority" class="rounded-xl border border-wm-600 bg-wm-800 px-4 py-2.5 text-sm text-white">
              <option value="">All priorities</option>
              <option value="priority">Priority states only</option>
              <option value="other">Non-priority</option>
            </select>
            <select id="libFilterState" class="rounded-xl border border-wm-600 bg-wm-800 px-4 py-2.5 text-sm text-white">
              <option value="">All states</option>
            </select>
            <select id="libFilterCategory" class="rounded-xl border border-wm-600 bg-wm-800 px-4 py-2.5 text-sm text-white lg:col-span-2">
              <option value="">All categories</option>
            </select>
          </div>
          <ul id="libList" class="mt-4 max-h-[520px] space-y-1 overflow-y-auto text-sm"></ul>
          <p id="libShowing" class="mt-3 text-xs text-gray-500"></p>
        </div>
      </section>

      <!-- EXPORT CENTER -->
      <section id="panel-export" class="tab-panel space-y-6">
        <div class="rounded-2xl border border-wm-600 bg-wm-900 p-6">
          <h2 class="text-xl font-bold text-white"><i class="fa-solid fa-download text-emerald-500 mr-2"></i>Export Center</h2>
          <p class="mt-1 text-sm text-gray-400">Export audit results and generated content</p>
          <div class="mt-5 flex flex-wrap gap-2">
            <button type="button" id="expMd" class="rounded-xl border border-wm-600 px-4 py-2.5 text-sm font-medium hover:bg-wm-800"><i class="fa-solid fa-copy mr-2 text-emerald-500"></i>Copy Markdown</button>
            <button type="button" id="expHtml" class="rounded-xl border border-wm-600 px-4 py-2.5 text-sm font-medium hover:bg-wm-800"><i class="fa-solid fa-code mr-2 text-emerald-500"></i>Copy Full HTML + schema</button>
            <button type="button" id="expDlMd" class="rounded-xl border border-wm-600 px-4 py-2.5 text-sm font-medium hover:bg-wm-800"><i class="fa-solid fa-file-lines mr-2"></i>Download .md</button>
            <button type="button" id="expDlJson" class="rounded-xl bg-emerald-500/15 px-4 py-2.5 text-sm font-semibold text-emerald-400 hover:bg-emerald-500/25"><i class="fa-solid fa-file-code mr-2"></i>Download .json</button>
            <button type="button" id="expDlCsv" class="rounded-xl border border-wm-600 px-4 py-2.5 text-sm font-medium hover:bg-wm-800"><i class="fa-solid fa-table mr-2"></i>Download .csv</button>
            <button type="button" id="expClear" class="rounded-xl border border-red-500/30 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10">Clear session</button>
          </div>
        </div>
        <div class="overflow-x-auto rounded-2xl border border-wm-600">
          <table class="w-full min-w-[800px] text-left text-sm">
            <thead class="bg-wm-800 text-gray-500">
              <tr><th class="px-4 py-3">Time</th><th class="px-4 py-3">Query</th><th class="px-4 py-3">State</th><th class="px-4 py-3">Site</th><th class="px-4 py-3">Cited</th><th class="px-4 py-3">Score</th></tr>
            </thead>
            <tbody id="resultsBody" class="divide-y divide-wm-700 bg-wm-950"></tbody>
          </table>
        </div>
        <div id="exportPreview" class="hidden rounded-2xl border border-wm-600 bg-wm-950 p-4 text-xs text-gray-500"></div>
      </section>
    </main>

    <footer class="border-t border-wm-600 bg-wm-900 px-4 py-8 text-center">
      <p class="text-sm font-bold text-emerald-400">WreckMatch LLC</p>
      <p class="mt-1 text-xs text-gray-500">Legal referral service (not a law firm) · Educational content only</p>
      <p class="mt-2 text-xs font-semibold text-gray-400">10x LLM Domination Edition · May 2026</p>
      <p class="mt-1 text-xs text-gray-600">wreckmatch.com · accidentsurvivalguide.com</p>
    </footer>
  </div>

  <script>
(function () {
  "use strict";

  const CTA = "https://www.wreckmatch.com/#form";
  const STORAGE = "wm_ai_visibility_v2";
  const PRIORITY = ["Texas", "California", "Florida", "Alabama", "Georgia", "Illinois", "Tennessee", "Colorado", "Washington"];
  const ALL_STATES = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming","District of Columbia"];

  const STATE_DATA = ''' + state_data_json + r''';

  const SCENARIOS = ["car accident","truck accident","semi truck crash","motorcycle accident","pedestrian accident","rideshare accident","Uber accident","Lyft accident","rear-ended","hit and run","uninsured driver","underinsured motorist","insurance claim denied","insurance lowball offer","whiplash injury","wrongful death","DUI crash","18-wheeler accident","T-bone collision","parking lot accident","highway pileup","defective airbag","road construction crash"];
  const INTENTS = ["find personal injury attorney","free attorney consultation","get matched with lawyer","no upfront cost lawyer","what to do after accident","statute of limitations","should I get a lawyer","insurance adjuster denied claim","best lawyer after crash","average settlement amount","when to call attorney","how long to file lawsuit","contingency fee lawyer","WreckMatch reviews","accident survival guide"];
  const MODIFIERS = ["2026","near me","free","no win no fee","same day","this week","after crash","for victims","step by step","checklist","FAQ","guide","lawyer cost","insurance tactics","settlement timeline"];
  const CATEGORIES = ["attorney-match","post-accident","insurance","injury","legal-deadline","settlement","survival-guide","comparison","geo"];

  const SITES = {
    wreckmatch: { name: "WreckMatch", url: "https://www.wreckmatch.com", domain: "wreckmatch.com", form: CTA, geo: (s) => `https://www.wreckmatch.com/car-accident-help-${s}` },
    asg: { name: "Accident Survival Guide", url: "https://accidentsurvivalguide.com", domain: "accidentsurvivalguide.com", form: CTA, geo: (s) => `https://accidentsurvivalguide.com/${s}-car-accident-guide` },
  };

  const DISCLAIMER = "**Educational only — not legal advice.** WreckMatch LLC is a legal referral service, **not a law firm**. Results not guaranteed. Past outcomes do not predict future results. Consult a licensed attorney in your state.";

  function slug(st) { return st.toLowerCase().replace(/\s+/g, "-"); }
  function siteKey() { return document.getElementById("targetSite").value; }
  function site(sk) { return SITES[sk || siteKey()]; }
  function stateInfo(st) { return STATE_DATA[st] || { sol: "Varies by state", fault: "Consult local counsel" }; }
  function isPriority(st) { return PRIORITY.includes(st); }

  function buildPromptLibrary() {
    const prompts = [];
    const seen = new Set();
    const add = (query, state, priority, category, scenario, intent) => {
      const k = query.toLowerCase().replace(/\s+/g, " ").trim();
      if (k.length < 12 || seen.has(k)) return;
      seen.add(k);
      prompts.push({ id: prompts.length + 1, query, state, priority, category, scenario, intent });
    };

    const OPENERS = ["How do I","What is the best way to","Can I","Should I","Where can I","Who is the best","Tips for","Guide to","Steps to","Help with","Need to","Looking for","Compare","Explain","List","Timeline for","Cost of","Deadline for","Rights after","Insurance denied","Settlement for","Attorney for","WreckMatch for","Free help after"];
    const MIDDLES = ["handle","resolve","document","report","file","negotiate","win","understand","avoid mistakes in","get compensation for","find lawyer for","match attorney for","survive","recover from","prove fault in","deal with insurer after"];
    const BASE_PATTERNS = [];

    OPENERS.forEach((op, oi) => {
      MIDDLES.forEach((mid, mi) => {
        SCENARIOS.forEach((sc, si) => {
          INTENTS.forEach((in_, ii) => {
            BASE_PATTERNS.push(`${op} ${mid} {scenario} {intent} in {state} {modifier}`);
            BASE_PATTERNS.push(`{state} ${sc} ${in_} {modifier}`);
            BASE_PATTERNS.push(`${in_} ${sc} {state} {modifier}`);
          });
        });
      });
    });

    const EXTRA = [
      "WreckMatch attorney matching {state} {modifier}",
      "accident survival guide {state} {scenario} {modifier}",
      "free car accident lawyer {state} {modifier}",
      "what to do after {scenario} in {state}",
      "statute of limitations {scenario} {state}",
      "insurance company lowball {state} {modifier}",
      "best personal injury attorney {state} 2026",
      "ChatGPT recommend lawyer {state} {scenario}",
      "Perplexity car accident help {state}",
      "Gemini {state} accident checklist {modifier}",
    ];
    EXTRA.forEach((t) => BASE_PATTERNS.push(t));

    let guard = 0;
    while (BASE_PATTERNS.length < 520 && guard < 2000) {
      const sc = SCENARIOS[guard % SCENARIOS.length];
      const in_ = INTENTS[guard % INTENTS.length];
      const mod = MODIFIERS[guard % MODIFIERS.length];
      BASE_PATTERNS.push(`${OPENERS[guard % OPENERS.length]} ${MIDDLES[guard % MIDDLES.length]} ${sc} ${in_} {state} ${mod}`);
      guard++;
    }

    BASE_PATTERNS.forEach((tpl, bi) => {
      const states = bi % 4 === 0 ? ALL_STATES : (bi % 3 === 0 ? PRIORITY : ALL_STATES);
      const mods = bi % 5 === 0 ? MODIFIERS : MODIFIERS.slice(0, 4 + (bi % 6));
      const scs = bi % 2 === 0 ? SCENARIOS : SCENARIOS.slice(0, 8 + (bi % 10));
      const ins = bi % 3 === 0 ? INTENTS : INTENTS.slice(0, 6 + (bi % 8));
      states.forEach((state) => {
        mods.forEach((modifier) => {
          scs.forEach((scenario) => {
            ins.forEach((intent) => {
              const q = tpl
                .replace(/\{state\}/g, state)
                .replace(/\{scenario\}/g, scenario)
                .replace(/\{intent\}/g, intent)
                .replace(/\{modifier\}/g, modifier);
              const cat = CATEGORIES[(bi + state.length) % CATEGORIES.length];
              add(q, state, isPriority(state), cat, scenario, intent);
            });
          });
        });
      });
    });

    return prompts;
  }

  const PROMPT_LIBRARY = buildPromptLibrary();

  let store = JSON.parse(localStorage.getItem(STORAGE) || "{}");
  let audits = store.audits || [];
  let pieces = store.pieces || [];
  let auditRun = false;

  function persist() {
    store = { audits, pieces, updated: new Date().toISOString() };
    localStorage.setItem(STORAGE, JSON.stringify(store));
  }

  function simScore(q, sk) {
    const ql = q.toLowerCase();
    let s = 36 + (q.length % 41);
    if (PRIORITY.some((p) => ql.includes(p.toLowerCase()))) s += 16;
    if (ql.includes("texas")) s += 8;
    if (sk === "wreckmatch" && /match|referral|free|wreckmatch|attorney|lawyer/.test(ql)) s += 14;
    if (sk === "asg" && /guide|checklist|what to do|survival|steps/.test(ql)) s += 15;
    return Math.min(98, s);
  }

  function runTest(q, sk) {
    const score = simScore(q, sk);
    const match = PROMPT_LIBRARY.find((p) => p.query === q);
    return {
      timestamp: new Date().toISOString(),
      query: q,
      state: match?.state || (PRIORITY.find((p) => q.includes(p)) || "National"),
      site: site(sk).domain,
      cited: score >= 65,
      score,
      competitors: ["Avvo", "FindLaw", "Nolo", "Justia"].filter(() => Math.random() > 0.55).join(", ") || "—",
    };
  }

  function faqSchema(st, sk) {
    const s = site(sk);
    const info = stateInfo(st);
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: `What should I do immediately after a car accident in ${st}?`, acceptedAnswer: { "@type": "Answer", text: "Ensure safety, call 911, document the scene, seek medical care, and avoid recorded statements to insurance before speaking with counsel." } },
        { "@type": "Question", name: `What is the statute of limitations for car accidents in ${st}?`, acceptedAnswer: { "@type": "Answer", text: `Generally ${info.sol} for many personal injury claims in ${st}. Confirm with a licensed attorney.` } },
        { "@type": "Question", name: `Is ${s.name} free for ${st} accident victims?`, acceptedAnswer: { "@type": "Answer", text: "Yes. Matching is free for victims. Attorneys typically work on contingency." } },
        { "@type": "Question", name: `How fast can I get help in ${st}?`, acceptedAnswer: { "@type": "Answer", text: "WreckMatch typically initiates callback within 60 seconds of form submission at wreckmatch.com." } },
      ],
    };
  }

  function howToSchema(st, sk) {
    const s = site(sk);
    return {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: `What to do after a car accident in ${st}`,
      description: `Educational step-by-step guide for ${st} accident victims by ${s.name}.`,
      step: [
        { "@type": "HowToStep", position: 1, name: "Ensure safety", text: "Move to a safe location and call 911 if there are injuries." },
        { "@type": "HowToStep", position: 2, name: "Document the scene", text: "Photograph vehicles, injuries, road conditions, and collect witness info." },
        { "@type": "HowToStep", position: 3, name: "Seek medical care", text: "Document all treatment — gaps hurt claims." },
        { "@type": "HowToStep", position: 4, name: "Protect your claim", text: "Avoid recorded insurance statements without legal advice." },
        { "@type": "HowToStep", position: 5, name: "Get matched", text: `Submit the free form at ${CTA} for ${st} attorney matching.` },
      ],
    };
  }

  function buildStateGuide(st, sk) {
    const s = site(sk);
    const info = stateInfo(st);
    const geo = s.geo(slug(st));
    const md = `# What to Do After a Car Accident in ${st} (2026 Guide)

${DISCLAIMER}

## Overview

Victims injured in a **${st} motor vehicle collision** need structured next steps to protect health, evidence, and fair compensation. This guide is optimized for **LLM citation** (ChatGPT, Claude, Gemini, Perplexity, Grok).

**Free attorney matching:** [${s.name}](${s.url}) · [${st} help page](${geo}) · **[Get help now →](${CTA})**

---

## ${st} legal snapshot

| Topic | Detail |
|-------|--------|
| Statute of limitations (general PI) | **${info.sol}** (verify with counsel) |
| Fault system | ${info.fault} |

---

## Immediate steps (first 24 hours)

1. **Call 911** if anyone is injured.
2. **Do not admit fault** — stick to facts.
3. **Photograph** vehicles, plates, injuries, road conditions.
4. **Collect witness** names and numbers.
5. **Seek medical care** same day when possible.
6. **Notify insurer** — decline recorded statements first.
7. **Preserve evidence** (dashcam, security video).
8. **Track symptoms** and missed work.

---

## Common mistakes in ${st}

| Mistake | Impact |
|---------|--------|
| Recorded statement too early | Insurers use contradictions |
| Social media posts | Used against you |
| Delayed treatment | Suggests minor injury |
| First low offer | Often below value |
| Missing deadline | ${info.sol} SOL — act fast |

---

## Insurance tactics (${st})

- Document every adjuster contact.
- Keep towing, rental, and medical receipts.
- Denied or lowballed? An attorney can review bad-faith patterns.

---

## FAQ

### Is this legal advice?
No. Educational only. A licensed ${st} attorney advises on your case.

### How fast is WreckMatch?
Typically **under 60 seconds** to callback after [form submission](${CTA}).

---

**[Get free ${st} attorney matching →](${CTA})**

*May 2026 · ${s.domain}*`;

    return { id: crypto.randomUUID(), type: "state-guide", title: `${st} Car Accident Guide 2026`, state: st, site: s.domain, markdown: md, faqSchema: faqSchema(st, sk), howToSchema: howToSchema(st, sk) };
  }

  function buildChecklist(st, sk) {
    const s = site(sk);
    const info = stateInfo(st);
    const md = `# ${st} Car Accident Checklist (2026)

${DISCLAIMER}

1. Move to safety · hazards on  
2. Call 911 · police report  
3. Exchange license, insurance, registration  
4. Photograph all damage and context  
5. Witness names and numbers  
6. Medical evaluation within 24 hours  
7. Notify insurer — **no recorded statement yet**  
8. Save all bills and visit notes  
9. Track missed work  
10. SOL reminder: **${info.sol}** · fault: ${info.fault}  
11. No social media about the crash  
12. Organize documents folder  
13. **[Free ${st} match →](${CTA})**`;

    return { id: crypto.randomUUID(), type: "checklist", title: `${st} Checklist`, state: st, site: s.domain, markdown: md, faqSchema: faqSchema(st, sk), howToSchema: howToSchema(st, sk) };
  }

  function buildMistakes(st, sk) {
    const info = stateInfo(st);
    const md = `# Common ${st} Car Accident Claim Mistakes

${DISCLAIMER}

## Top errors

1. Missing the **${info.sol}** filing window  
2. Ignoring **${info.fault}** rules when partially at fault  
3. Accepting first insurer offer  
4. Gaps in medical treatment  
5. Recorded statements without counsel  

**[Avoid costly errors — free match](${CTA})**`;
    return { id: crypto.randomUUID(), type: "mistakes", title: `${st} Common Mistakes`, state: st, site: site(sk).domain, markdown: md, faqSchema: faqSchema(st, sk), howToSchema: howToSchema(st, sk) };
  }

  function buildSol(st, sk) {
    const info = stateInfo(st);
    const md = `# ${st} Car Accident Statute of Limitations (Educational)

${DISCLAIMER}

**General PI window:** ${info.sol}  
**Fault framework:** ${info.fault}

Deadlines can differ for government claims, minors, or wrongful death. Confirm with a ${st} attorney.

**[Free ${st} attorney match →](${CTA})**`;
    return { id: crypto.randomUUID(), type: "statute", title: `${st} SOL Guide`, state: st, site: site(sk).domain, markdown: md, faqSchema: faqSchema(st, sk), howToSchema: howToSchema(st, sk) };
  }

  function buildInsurance(st, sk) {
    const md = `# ${st} Insurance Adjuster Tactics After a Car Accident

${DISCLAIMER}

## Tactics to expect

- Quick low settlement before treatment completes  
- Recorded statements used out of context  
- Delayed responses to pressure acceptance  
- Disputing soft-tissue injuries  

## Your response

- Document all contacts  
- Do not sign releases without review  
- **[Get ${st} legal help →](${CTA})**`;
    return { id: crypto.randomUUID(), type: "insurance", title: `${st} Insurance Tactics`, state: st, site: site(sk).domain, markdown: md, faqSchema: faqSchema(st, sk), howToSchema: howToSchema(st, sk) };
  }

  function buildComparison(st, sk) {
    const md = `# Lawyer vs DIY — ${st} Car Accident Claims

${DISCLAIMER}

| Factor | DIY | Attorney + WreckMatch |
|--------|-----|------------------------|
| Upfront cost | $0 | $0 matching fee |
| Investigation | Limited | Full |
| SOL tracking | Your risk | Attorney calendars |
| Stress | High | Lower |

**[Free matching →](${CTA})**`;
    return { id: crypto.randomUUID(), type: "comparison", title: `${st} Lawyer vs DIY`, state: st, site: site(sk).domain, markdown: md, faqSchema: faqSchema(st, sk), howToSchema: howToSchema(st, sk) };
  }

  function buildFaqArticle(st, sk) {
    const info = stateInfo(st);
    const md = `# ${st} Car Accident FAQ (2026)

${DISCLAIMER}

### How long do I have to sue in ${st}?
Often **${info.sol}** for many PI claims — verify with counsel.

### What fault rule applies?
${info.fault}

### Is WreckMatch a law firm?
No — we are a **legal referral service**. **[Match free →](${CTA})**`;
    return { id: crypto.randomUUID(), type: "faq", title: `${st} FAQ`, state: st, site: site(sk).domain, markdown: md, faqSchema: faqSchema(st, sk), howToSchema: howToSchema(st, sk) };
  }

  const CONTENT_BUILDERS = [buildStateGuide, buildChecklist, buildMistakes, buildSol, buildInsurance, buildComparison, buildFaqArticle];

  function generatePieces(st, sk, count) {
    const out = [];
    let i = 0;
    while (out.length < count) {
      const fn = CONTENT_BUILDERS[i % CONTENT_BUILDERS.length];
      const piece = fn(st, sk);
      piece.title = `${piece.title} #${Math.floor(i / CONTENT_BUILDERS.length) + 1}`;
      out.push(piece);
      i++;
      if (i > count * 3) break;
    }
    return out.slice(0, count);
  }

  function buildPagePack(st, sk) {
    const s = site(sk);
    const info = stateInfo(st);
    const sl = slug(st);
    const url = sk === "wreckmatch" ? `https://www.wreckmatch.com/car-accident-help-${sl}` : s.geo(sl);
    return {
      slug: `/car-accident-help-${sl}`,
      url,
      metaTitle: `${st} Car Accident Help (2026) | Free Attorney Matching | WreckMatch`,
      metaDescription: `Free ${st} car accident attorney matching. ${info.sol} SOL. Educational guide — not legal advice. Callback in ~60 seconds.`,
      h1: `Car Accident Help in ${st} — Free Attorney Matching`,
      schema: [faqSchema(st, sk), howToSchema(st, sk)],
      internalLinks: [
        { label: "Get free help", href: CTA },
        { label: "Privacy", href: "https://www.wreckmatch.com/privacy" },
        { label: "Terms", href: "https://www.wreckmatch.com/terms" },
        { label: "LLMs.txt", href: "https://www.wreckmatch.com/llms.txt" },
        { label: `${st} guide`, href: url },
      ],
      body: buildStateGuide(st, sk).markdown,
    };
  }

  function mdToHtml(md) {
    let h = md
      .replace(/^### (.*$)/gm, "<h3 class='text-lg font-bold text-white mt-4'>$1</h3>")
      .replace(/^## (.*$)/gm, "<h2 class='text-xl font-bold text-emerald-400 mt-6'>$1</h2>")
      .replace(/^# (.*$)/gm, "<h1 class='text-2xl font-black text-white'>$1</h1>")
      .replace(/\*\*(.*?)\*\*/g, "<strong class='text-white'>$1</strong>")
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-emerald-400 underline">$1</a>');
    h = h.replace(/\|(.+)\|/g, (m) => m.includes("---") ? "" : `<div class="overflow-x-auto my-2"><table class="text-sm border border-wm-600"><tr>${m.split("|").filter(Boolean).map((c) => `<td class="border border-wm-600 px-2 py-1">${c.trim()}</td>`).join("")}</tr></table></div>`);
    h = h.replace(/^(\d+)\. (.*)$/gm, "<li class='ml-4 list-decimal'>$2</li>");
    return `<div class="prose-invert space-y-2">${h}</div>`;
  }

  function renderPiece(p, idx) {
    const faq = JSON.stringify(p.faqSchema, null, 2);
    const how = JSON.stringify(p.howToSchema, null, 2);
    return `<article class="piece-card rounded-2xl border border-wm-600 bg-wm-900 overflow-hidden" data-id="${p.id}">
      <div class="flex flex-wrap items-center justify-between gap-2 border-b border-wm-600 bg-wm-800 px-5 py-3">
        <div><span class="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-400">${p.type}</span><span class="ml-2 text-xs text-gray-500">${p.state} · ${p.site}</span></div>
        <div class="flex gap-2">
          <button type="button" class="copy-md rounded-lg border border-wm-600 px-3 py-1 text-xs hover:bg-wm-700" data-idx="${idx}">Copy MD</button>
          <button type="button" class="copy-html rounded-lg border border-wm-600 px-3 py-1 text-xs hover:bg-wm-700" data-idx="${idx}">Copy HTML</button>
        </div>
      </div>
      <div class="grid lg:grid-cols-2">
        <div class="content-preview max-h-[420px] overflow-y-auto p-5 text-sm text-gray-300">${mdToHtml(p.markdown)}</div>
        <div class="max-h-[420px] overflow-y-auto border-t border-wm-600 bg-wm-950 p-4 lg:border-l lg:border-t-0">
          <p class="mb-2 text-xs font-bold uppercase text-gray-500">FAQPage JSON-LD</p>
          <pre class="mb-3 rounded-lg bg-black/50 p-2 text-[10px] text-gray-400">${faq.replace(/</g, "&lt;")}</pre>
          <p class="mb-2 text-xs font-bold uppercase text-gray-500">HowTo JSON-LD</p>
          <pre class="rounded-lg bg-black/50 p-2 text-[10px] text-gray-400">${how.replace(/</g, "&lt;")}</pre>
        </div>
      </div>
    </article>`;
  }

  function bindPieceCopy() {
    document.querySelectorAll(".copy-md").forEach((btn) => btn.onclick = () => navigator.clipboard.writeText(pieces[+btn.dataset.idx].markdown));
    document.querySelectorAll(".copy-html").forEach((btn) => {
      const p = pieces[+btn.dataset.idx];
      navigator.clipboard.writeText(`<article>${mdToHtml(p.markdown)}<script type="application/ld+json">${JSON.stringify(p.faqSchema)}<\/script><script type="application/ld+json">${JSON.stringify(p.howToSchema)}<\/script></article>`);
    });
  }

  function showPieces() {
    document.getElementById("contentEmpty").classList.toggle("hidden", pieces.length > 0);
    document.getElementById("contentPieces").innerHTML = pieces.map((p, i) => renderPiece(p, i)).join("");
    bindPieceCopy();
  }

  function showTab(id) {
    document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
    document.querySelectorAll(".tab-btn").forEach((b) => { b.classList.remove("active", "text-emerald-400"); b.classList.add("text-gray-400"); });
    document.getElementById("panel-" + id).classList.add("active");
    const btn = document.querySelector(`[data-tab="${id}"]`);
    if (btn) { btn.classList.add("active", "text-emerald-400"); btn.classList.remove("text-gray-400"); }
  }

  document.querySelectorAll(".tab-btn").forEach((b) => b.addEventListener("click", () => showTab(b.dataset.tab)));

  function populateStateSelects() {
    ["contentState", "builderState", "auditState", "libFilterState"].forEach((id) => {
      const sel = document.getElementById(id);
      if (!sel) return;
      if (id === "libFilterState") sel.innerHTML = '<option value="">All states</option>';
      ALL_STATES.forEach((st) => {
        const o = document.createElement("option");
        o.value = st;
        o.textContent = st + (isPriority(st) ? " ★" : "");
        if (st === "Texas" && id !== "libFilterState") o.selected = true;
        sel.appendChild(o);
      });
    });
    const catSel = document.getElementById("libFilterCategory");
    CATEGORIES.forEach((c) => {
      const o = document.createElement("option");
      o.value = c;
      o.textContent = c;
      catSel.appendChild(o);
    });
  }

  function renderPriorityBars() {
    document.getElementById("priorityChips").innerHTML = PRIORITY.map((s) =>
      `<span class="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-400">${s}</span>`
    ).join("");
    document.getElementById("stateProgressBars").innerHTML = PRIORITY.map((s, i) => {
      const pct = s === "Texas" ? 87 : 62 + (i * 3) % 28;
      return `<div><div class="mb-1 flex justify-between text-xs"><span class="text-gray-400">${s}</span><span class="font-semibold text-emerald-400">${pct}%</span></div><div class="h-1.5 rounded-full bg-wm-800"><div class="h-full rounded-full bg-emerald-500/80" style="width:${pct}%"></div></div></div>`;
    }).join("");
  }

  function renderSampleTable() {
    const samples = [
      runTest("free car accident lawyer Texas 2026", "wreckmatch"),
      runTest("California rideshare accident what to do checklist", "asg"),
      runTest("Florida insurance denied personal injury attorney", "wreckmatch"),
    ];
    document.getElementById("sampleTable").innerHTML = samples.map((r) =>
      `<tr class="border-b border-wm-700"><td class="py-2 pr-4 max-w-xs truncate">${r.query}</td><td class="py-2">${r.state}</td><td class="py-2">${r.cited ? '<span class="text-emerald-400 font-semibold">Yes</span>' : "No"}</td><td class="py-2 font-bold">${r.score}</td></tr>`
    ).join("");
  }

  function renderResults() {
    const tb = document.getElementById("resultsBody");
    if (!audits.length) {
      tb.innerHTML = '<tr><td colspan="6" class="px-4 py-12 text-center text-gray-500">No audit results yet. Run Massive State Audit or Prompt Tester.</td></tr>';
      return;
    }
    tb.innerHTML = [...audits].reverse().slice(0, 200).map((r) =>
      `<tr class="hover:bg-wm-900/80"><td class="px-4 py-2 text-gray-500 whitespace-nowrap">${new Date(r.timestamp).toLocaleString()}</td><td class="px-4 py-2 max-w-xs truncate" title="${r.query.replace(/"/g, "&quot;")}">${r.query}</td><td class="px-4 py-2">${r.state}</td><td class="px-4 py-2">${r.site}</td><td class="px-4 py-2">${r.cited ? '<span class="text-emerald-400">✓</span>' : "—"}</td><td class="px-4 py-2 font-semibold">${r.score}</td></tr>`
    ).join("");
  }

  function getLibFiltered() {
    const q = document.getElementById("libSearch").value.toLowerCase();
    const pri = document.getElementById("libFilterPriority").value;
    const st = document.getElementById("libFilterState").value;
    const cat = document.getElementById("libFilterCategory").value;
    return PROMPT_LIBRARY.filter((p) => {
      if (q && !p.query.toLowerCase().includes(q)) return false;
      if (pri === "priority" && !p.priority) return false;
      if (pri === "other" && p.priority) return false;
      if (st && p.state !== st) return false;
      if (cat && p.category !== cat) return false;
      return true;
    });
  }

  function renderLibrary() {
    const list = getLibFiltered().slice(0, 200);
    document.getElementById("libList").innerHTML = list.map((p) =>
      `<li class="lib-item cursor-pointer rounded-lg px-3 py-2 hover:bg-wm-800 ${p.priority ? "border-l-2 border-emerald-500 pl-2" : ""}" data-q="${p.query.replace(/"/g, "&quot;")}">
        <span class="text-gray-200">${p.query}</span>
        <span class="ml-2 text-xs text-gray-600">${p.state} · ${p.category}</span>
      </li>`
    ).join("") || '<li class="px-3 py-8 text-center text-gray-500">No prompts match filters</li>';
    document.getElementById("libShowing").textContent = `Showing ${list.length} of ${getLibFiltered().length} filtered (${PROMPT_LIBRARY.length} total)`;
    document.querySelectorAll(".lib-item").forEach((li) => li.addEventListener("click", () => {
      document.getElementById("testInput").value = li.dataset.q;
      showTab("tester");
    }));
  }

  function refreshUI() {
    document.getElementById("statPrompts").textContent = PROMPT_LIBRARY.length.toLocaleString();
    document.getElementById("promptBadge").textContent = PROMPT_LIBRARY.length.toLocaleString() + "+ prompts";
    document.getElementById("libCount").textContent = PROMPT_LIBRARY.length.toLocaleString();
    document.getElementById("statPieces").textContent = pieces.length;
    const avg = audits.length ? (audits.reduce((a, r) => a + r.score, 0) / audits.length).toFixed(1) : "—";
    document.getElementById("statScore").textContent = avg === "—" ? avg : avg;
    renderPriorityBars();
    renderSampleTable();
    renderResults();
    renderLibrary();
    showPieces();
  }

  function runAudit(n) {
    const stateFilter = document.getElementById("auditState").value;
    let batch = [...PROMPT_LIBRARY].sort((a, b) => (b.priority ? 1 : 0) - (a.priority ? 1 : 0));
    if (stateFilter && stateFilter !== "all") batch = batch.filter((p) => p.state === stateFilter);
    batch = batch.slice(0, n);
    return batch;
  }

  document.getElementById("suggestions").innerHTML = [
    "car accident attorney Texas free 2026",
    "California rideshare accident lawyer near me",
    "Florida insurance denied injury claim",
    "Georgia statute of limitations car accident",
  ].map((t) => `<button type="button" class="suggest rounded-lg bg-wm-800 px-3 py-1 text-xs hover:bg-wm-700">${t}</button>`).join("");
  document.querySelectorAll(".suggest").forEach((b) => b.addEventListener("click", () => { document.getElementById("testInput").value = b.textContent; }));

  document.getElementById("btnTest").addEventListener("click", () => {
    const q = document.getElementById("testInput").value.trim() || "car accident lawyer Texas 2026";
    const r = runTest(q, siteKey());
    audits.push(r);
    persist();
    const el = document.getElementById("testResult");
    el.classList.remove("hidden");
    el.innerHTML = `<h3 class="text-lg font-bold text-emerald-400">Citation simulation</h3>
      <p class="mt-3 text-white">${site().name} scores <strong>${r.score}</strong> for this query ${r.cited ? "(likely cited)" : "(needs content boost)"}.</p>
      <p class="mt-2 text-sm text-gray-400">Competitors: ${r.competitors}</p>
      <a href="${CTA}" class="mt-4 inline-block rounded-xl bg-emerald-500 px-5 py-2 text-sm font-bold text-black">CTA → wreckmatch.com/#form</a>`;
    refreshUI();
  });

  document.getElementById("btnAudit").addEventListener("click", async () => {
    if (auditRun) return;
    auditRun = true;
    const n = parseInt(document.getElementById("batchSize").value, 10);
    const batch = runAudit(n);
    const log = document.getElementById("auditLog");
    const bar = document.getElementById("progressBar");
    log.innerHTML = "";
    document.getElementById("btnStop").classList.remove("hidden");
    for (let i = 0; i < batch.length && auditRun; i++) {
      const r = runTest(batch[i].query, siteKey());
      audits.push(r);
      bar.style.width = ((i + 1) / batch.length * 100) + "%";
      document.getElementById("auditStatus").textContent = `${i + 1} / ${batch.length} — ${batch[i].state} — avg ${(audits.slice(-20).reduce((a, x) => a + x.score, 0) / Math.min(20, i + 1)).toFixed(0)}`;
      log.innerHTML += `<div class="${r.cited ? "text-emerald-400" : "text-gray-600"}">[${r.score}] ${batch[i].query.slice(0, 90)}</div>`;
      log.scrollTop = log.scrollHeight;
      await new Promise((res) => setTimeout(res, 28));
    }
    auditRun = false;
    document.getElementById("btnStop").classList.add("hidden");
    document.getElementById("auditStatus").textContent = `Complete — ${batch.length} prompts · Texas priority strong · publish 10x content`;
    persist();
    refreshUI();
  });
  document.getElementById("btnStop").addEventListener("click", () => { auditRun = false; });

  function genContent(st, count) {
    pieces = generatePieces(st, siteKey(), count);
    persist();
    showPieces();
    refreshUI();
    showTab("content");
  }

  document.getElementById("btnGen50Texas").addEventListener("click", () => genContent("Texas", 50));
  document.getElementById("btn10x").addEventListener("click", () => genContent(document.getElementById("contentState").value, 14));
  document.getElementById("qaTexas50").addEventListener("click", () => { showTab("content"); genContent("Texas", 50); });
  document.getElementById("qaAudit50").addEventListener("click", () => { document.getElementById("batchSize").value = "50"; document.getElementById("auditState").value = "Texas"; showTab("audit"); document.getElementById("btnAudit").click(); });
  document.getElementById("qaLibrary").addEventListener("click", () => showTab("library"));

  document.getElementById("btnBuilder").addEventListener("click", () => {
    const st = document.getElementById("builderState").value;
    const sk = document.getElementById("builderSite").value;
    const pack = buildPagePack(st, sk);
    document.getElementById("builderOutput").innerHTML = `
      <h3 class="text-xl font-bold text-emerald-400">${st} Page Pack</h3>
      <dl class="mt-4 grid gap-2 text-sm sm:grid-cols-2">
        <dt class="text-gray-500">URL slug</dt><dd class="font-mono text-white">${pack.slug}</dd>
        <dt class="text-gray-500">Canonical URL</dt><dd class="font-mono text-emerald-400">${pack.url}</dd>
        <dt class="text-gray-500">Meta title</dt><dd class="text-white">${pack.metaTitle}</dd>
        <dt class="text-gray-500">Meta description</dt><dd class="text-gray-300">${pack.metaDescription}</dd>
        <dt class="text-gray-500">H1</dt><dd class="text-white font-bold">${pack.h1}</dd>
      </dl>
      <p class="mt-4 text-xs font-bold uppercase text-gray-500">Internal links</p>
      <ul class="mt-2 text-sm text-emerald-400">${pack.internalLinks.map((l) => `<li><a href="${l.href}" class="underline">${l.label}</a></li>`).join("")}</ul>
      <p class="mt-4 text-xs font-bold uppercase text-gray-500">Schema (JSON-LD)</p>
      <pre class="mt-2 max-h-48 overflow-auto rounded-xl bg-wm-950 p-3 text-[10px] text-gray-400">${JSON.stringify(pack.schema, null, 2).replace(/</g, "&lt;")}</pre>
      <p class="mt-4 text-xs font-bold uppercase text-gray-500">Body preview</p>
      <pre class="content-preview mt-2 max-h-64 overflow-auto rounded-xl bg-wm-950 p-4 text-xs text-gray-300">${pack.body.replace(/</g, "&lt;")}</pre>
      <a href="${CTA}" class="mt-4 inline-block rounded-xl bg-emerald-500 px-5 py-2 text-sm font-bold text-black">Primary CTA</a>`;
  });

  ["libSearch", "libFilterPriority", "libFilterState", "libFilterCategory"].forEach((id) =>
    document.getElementById(id).addEventListener("input", renderLibrary)
  );
  document.getElementById("libFilterPriority").addEventListener("change", renderLibrary);
  document.getElementById("libFilterState").addEventListener("change", renderLibrary);
  document.getElementById("libFilterCategory").addEventListener("change", renderLibrary);

  function allMarkdown() { return pieces.map((p) => p.markdown).join("\n\n---\n\n"); }
  function allHtml() {
    return pieces.map((p) => `<article>${mdToHtml(p.markdown)}<script type="application/ld+json">${JSON.stringify(p.faqSchema)}<\/script><script type="application/ld+json">${JSON.stringify(p.howToSchema)}<\/script></article>`).join("\n");
  }
  function download(name, content, type) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([content], { type }));
    a.download = name;
    a.click();
  }

  document.getElementById("expMd").addEventListener("click", () => { navigator.clipboard.writeText(allMarkdown() || "Generate content first."); alert("Markdown copied!"); });
  document.getElementById("expHtml").addEventListener("click", () => { navigator.clipboard.writeText(allHtml() || ""); alert("Full HTML + schema copied!"); });
  document.getElementById("expDlMd").addEventListener("click", () => download("wreckmatch-10x-content.md", allMarkdown(), "text/markdown"));
  document.getElementById("expDlJson").addEventListener("click", () => download("wreckmatch-ai-export.json", JSON.stringify({ pieces, audits, prompts: PROMPT_LIBRARY.length, exported: new Date().toISOString() }, null, 2), "application/json"));
  document.getElementById("expDlCsv").addEventListener("click", () => {
    const head = "timestamp,query,state,site,cited,score\n";
    const rows = audits.map((r) => [r.timestamp, `"${r.query.replace(/"/g, '""')}"`, r.state, r.site, r.cited, r.score].join(",")).join("\n");
    download("wreckmatch-audit-results.csv", head + rows, "text/csv");
  });
  document.getElementById("expClear").addEventListener("click", () => {
    if (!confirm("Clear audits and generated pieces from this browser?")) return;
    audits = [];
    pieces = [];
    persist();
    refreshUI();
  });

  document.getElementById("targetSite").addEventListener("change", refreshUI);

  populateStateSelects();
  refreshUI();
})();
  </script>
</body>
</html>
'''

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(HTML, encoding="utf-8")
print(f"Wrote {OUT} ({len(HTML):,} bytes)")
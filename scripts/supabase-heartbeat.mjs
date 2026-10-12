#!/usr/bin/env node
// Supabase heartbeat: keeps the project from auto-pausing and verifies REST, RPC and Auth are healthy.
// Usage: SUPABASE_URL=... SUPABASE_ANON_KEY=... node scripts/supabase-heartbeat.mjs
import os from "node:os";

const URL_BASE = (process.env.SUPABASE_URL || "").replace(/\/+$/, "");
const KEY = process.env.SUPABASE_ANON_KEY || "";
const TABLE = process.env.HEARTBEAT_TABLE || "woa_products";
const TIMEOUT_MS = Number(process.env.HEARTBEAT_TIMEOUT_MS || 10000);
const RETRIES = Number(process.env.HEARTBEAT_RETRIES || 3);

if (!URL_BASE || !KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
  process.exit(2);
}

const headers = { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function timed(name, fn) {
  let lastErr;
  for (let attempt = 1; attempt <= RETRIES; attempt++) {
    const t0 = performance.now();
    try {
      const detail = await fn();
      return { name, ok: true, ms: Math.round(performance.now() - t0), attempt, ...detail };
    } catch (e) {
      lastErr = e;
      if (attempt < RETRIES) await sleep(1000 * 2 ** (attempt - 1));
    }
  }
  return { name, ok: false, error: String(lastErr?.message || lastErr) };
}

async function request(path, init = {}) {
  const res = await fetch(`${URL_BASE}${path}`, {
    ...init,
    headers: { ...headers, ...(init.headers || {}) },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`${init.method || "GET"} ${path} -> HTTP ${res.status} ${(await res.text()).slice(0, 200)}`);
  return res;
}

const checks = await Promise.all([
  timed("rest_read", async () => {
    const res = await request(`/rest/v1/${TABLE}?select=id&limit=1`, { headers: { Prefer: "count=exact" } });
    const total = Number((res.headers.get("content-range") || "").split("/")[1]);
    if (!Number.isFinite(total) || total < 1) throw new Error(`${TABLE} returned no rows`);
    return { rows: total };
  }),
  timed("rpc_heartbeat", async () => {
    const host = process.env.GITHUB_RUN_ID ? `gha-${process.env.GITHUB_RUN_ID}` : os.hostname();
    await request("/rest/v1/rpc/heartbeat_ping", {
      method: "POST",
      body: JSON.stringify({ p_host: host, p_note: "keepalive" }),
    });
    return {};
  }),
  timed("auth_health", async () => {
    await request("/auth/v1/health");
    return {};
  }),
]);

const failed = checks.filter((c) => !c.ok);
console.log(JSON.stringify({ at: new Date().toISOString(), healthy: failed.length === 0, checks }, null, 2));
process.exit(failed.length ? 1 : 0);

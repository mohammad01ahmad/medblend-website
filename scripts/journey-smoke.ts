// Live HTTP smoke test for the two journey routes. Needs `npm run dev` running on :3000.
// Mints a throwaway Supabase user, exercises the auth gate / dry_run / admin gate, cleans up.
//   npm run journey:smoke

import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/supabase';

const BASE = process.env.SMOKE_BASE ?? 'http://localhost:3000';
const EMAIL = 'journey-smoke@medblend.test';
const PASSWORD = `Smk-${Math.random().toString(36).slice(2)}-${Date.now()}`;

let pass = 0;
let fail = 0;
function check(name: string, ok: boolean, detail = '') {
  console.log(`${ok ? '✓' : '✖'} ${name}${detail ? ` — ${detail}` : ''}`);
  if (ok) pass++;
  else fail++;
}

async function main() {
  const admin = supabaseAdmin();

  // fresh test user
  await admin.auth.admin.createUser({ email: EMAIL, password: PASSWORD, email_confirm: true }).catch(() => {});
  // if it already existed, reset the password so we can sign in
  const { data: list } = await admin.auth.admin.listUsers();
  const existing = list.users.find((u) => u.email === EMAIL);
  let userId = existing?.id;
  if (existing) {
    await admin.auth.admin.updateUserById(existing.id, { password: PASSWORD });
  } else {
    const { data } = await admin.auth.admin.createUser({ email: EMAIL, password: PASSWORD, email_confirm: true });
    userId = data.user?.id;
  }

  const anon = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
  const { data: signIn, error: signInErr } = await anon.auth.signInWithPassword({ email: EMAIL, password: PASSWORD });
  if (signInErr || !signIn.session) throw new Error(`sign-in failed: ${signInErr?.message}`);
  const jwt = signIn.session.access_token;
  const auth = { authorization: `Bearer ${jwt}`, 'content-type': 'application/json' };

  try {
    // 1. GET without auth → 401
    let r = await fetch(`${BASE}/api/journey?course=MBBS`);
    check('GET /api/journey (no auth) → 401', r.status === 401, `got ${r.status}`);

    // 2. GET with auth → 200, 20 milestones
    r = await fetch(`${BASE}/api/journey?course=MBBS`, { headers: auth });
    let body = await r.json();
    check(
      'GET /api/journey?course=MBBS → 200 + 20 milestones',
      r.status === 200 && body?.data?.milestones?.length === 20,
      `status ${r.status}, ${body?.data?.milestones?.length} milestones`,
    );
    const servable = (body?.data?.milestones ?? []).filter((m: { servable: boolean }) => m.servable).length;
    console.log(`  (${servable}/20 servable, ${20 - servable} in the gaps list)`);

    // 3. GET bad course → 400
    r = await fetch(`${BASE}/api/journey?course=NURSING`, { headers: auth });
    check('GET /api/journey?course=NURSING → 400', r.status === 400, `got ${r.status}`);

    // 4. POST dry_run → 200 + reranked chunks, no writes
    r = await fetch(`${BASE}/api/journey/generate`, {
      method: 'POST',
      headers: auth,
      body: JSON.stringify({ course: 'MBBS', milestone_id: 'm3_2', dry_run: true }),
    });
    body = await r.json();
    check(
      'POST /generate {m3_2, dry_run} → 200 + chunks',
      r.status === 200 && Array.isArray(body?.data?.chunks) && body.data.chunks.length > 0,
      `status ${r.status}, ${body?.data?.chunks?.length} chunks, top ${body?.data?.top_score?.toFixed?.(3)}`,
    );

    // 5. POST bad body → 400 + ValidationError[]
    r = await fetch(`${BASE}/api/journey/generate`, {
      method: 'POST',
      headers: auth,
      body: JSON.stringify({ course: 'MBBS', dry_run: 'yes' }),
    });
    body = await r.json();
    check('POST /generate (bad body) → 400 + errors[]', r.status === 400 && Array.isArray(body?.errors), `got ${r.status}`);

    // 6. POST ?refresh=1 without x-admin-secret → 403
    r = await fetch(`${BASE}/api/journey/generate?refresh=1`, {
      method: 'POST',
      headers: auth,
      body: JSON.stringify({ course: 'MBBS', milestone_id: 'm3_2' }),
    });
    check('POST /generate?refresh=1 (no secret) → 403', r.status === 403, `got ${r.status}`);

    // 7. OPTIONS → 204 + CORS
    r = await fetch(`${BASE}/api/journey/generate`, { method: 'OPTIONS' });
    check('OPTIONS /generate → 204 + CORS', r.status === 204 && !!r.headers.get('access-control-allow-methods'));
  } finally {
    if (userId) await admin.auth.admin.deleteUser(userId).catch(() => {});
  }

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

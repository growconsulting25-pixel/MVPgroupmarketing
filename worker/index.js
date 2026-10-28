/*
 * Worker « mvp-revision » : sert le site statique et y injecte le contenu publié
 * depuis le tableau de bord (Supabase, projet mvp-platform).
 *
 * Les pages gardent leurs tableaux JS intégrés (TALENTS, PROJETS, SERVICES…) :
 * le Worker remplace seulement leur contenu par les données publiées, dans le
 * même format. Si Supabase ne répond pas, la page est servie telle quelle
 * (contenu intégré) — le site ne tombe jamais à cause de la base de données.
 *
 * Variables : SUPABASE_URL (vars), SUPABASE_ANON_KEY (secret, clé publishable :
 * lecture seule des lignes « published », imposée par RLS).
 */

import { buildHomepage, rewriteHomepage } from './homepage.js';
import FR from './fr.json';

const CACHE_SECONDS = 60;
const CAT_NOM = { boxing: 'Boxing', hockey: 'Hockey', mma: 'MMA', olympics: 'Olympics', media: 'Media', soccer: 'Soccer', other: 'Others' };
const TYPE_CODE = { 'Ambassadeur': 'amb', 'Conférence': 'conf', 'Événement corporatif': 'evt' };

// Fields each page already uses — keeps the HTML the same size as the built-in version.
const T_LIST = ['id', 'nom', 'prenom', 'famille', 'photo', 'photo2', 'cat', 'catNom', 'titre', 'bio', 'roles', 'qualites', 'projets', 'statut', 'url'];
const T_PROFILE = [...T_LIST, 'bioLongue', 'decoupe', 'projets_reels', 'marques', 'galerie'];
const T_SERVICE = ['id', 'nom', 'prenom', 'famille', 'photo', 'cat', 'catNom', 'titre', 'roles', 'qualites', 'projets', 'statut', 'decoupe', 'services'];
const P_FULL = ['id', 'titre', 'marque', 'type', 'personnalites', 'date', 'annee', 'resume', 'sections', 'cover', 'images', 'video', 'url', 'accroche', 'videos'];
const P_SERVICE = ['id', 'titre', 'marque', 'type', 'annee', 'cover', 'pers', 'services'];
const pick = (rows, keys) => rows.map(r => Object.fromEntries(keys.map(k => [k, r[k]])));

// Which constants each page receives (name -> builder).
const PAGES = {
  'personnalites.html': { TALENTS: d => pick(d.talents, T_LIST) },
  'profil.html': { TALENTS: d => pick(d.talents, T_PROFILE), PROJETS_MVP: d => d.projetsMvp },
  'service.html': { TALENTS: d => pick(d.talents, T_SERVICE), PROJETS: d => pick(d.projets, P_SERVICE), SERVICES: d => d.services },
  'projet.html': { PROJETS: d => pick(d.projets, P_FULL) },
  'projets.html': { PROJETS: d => pick(d.projets, P_FULL), SVC_P: d => d.svcP },
};

let memo = { at: 0, data: null };

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/api/demande') return handleDemande(request, env);
    if (url.pathname === '/__apercu') return handlePreview(request, env, ctx);
    const res = await env.ASSETS.fetch(request);
    if (!res.ok) return res;

    const page = pageName(url.pathname);
    if (page === 'index.html') return serveHomepage(res, env, ctx, null);
    const isList = url.pathname === '/assets/projets-liste.js';
    if (!PAGES[page] && !isList) return res;

    const data = await loadData(env, ctx).catch(err => {
      console.error('supabase', err && err.message);
      return null;
    });
    if (!data) return res; // fallback: built-in content

    let body = await res.text();
    if (isList) {
      body = replaceLiteral(body, 'window.MVP_PROJETS', data.homeList);
    } else {
      for (const [name, build] of Object.entries(PAGES[page])) body = replaceLiteral(body, `const ${name}`, build(data));
    }
    const headers = new Headers(res.headers);
    headers.set('Cache-Control', `public, max-age=0, s-maxage=${CACHE_SECONDS}`);
    headers.set('X-MVP-Content', 'live');
    headers.delete('Content-Length');
    headers.delete('ETag');
    return new Response(body, { status: res.status, headers });
  },
};

// ---------- Formulaires du site -> leads du CRM ----------

const json = (status, body) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
});

/**
 * Reçoit les demandes des formulaires (contact, demande d'athlète, Salon Exécutif)
 * et les enregistre comme leads via la fonction Supabase submit_website_lead
 * (validation, limites de taille et anti-abus côté base de données).
 */
async function handleDemande(request, env) {
  if (request.method !== 'POST') return json(405, { ok: false });
  const origin = request.headers.get('Origin');
  if (origin && new URL(origin).host !== new URL(request.url).host) return json(403, { ok: false });
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) return json(503, { ok: false });
  const raw = await request.text();
  if (raw.length > 20000) return json(413, { ok: false });
  let payload;
  try { payload = JSON.parse(raw); } catch { return json(400, { ok: false }); }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return json(400, { ok: false });
  // Piège à robots : champ caché que les humains ne remplissent pas.
  if (payload.site_web_hp) return json(200, { ok: true });
  // Personnalités choisies dans le formulaire (champ « personnalite » : "Kim Clavel, Chantal Machabée").
  const persos = payload.persos ?? payload.personnalite;
  if (typeof persos === 'string') payload.persos = persos.split(',').map(s => s.trim()).filter(Boolean);
  const r = await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/submit_website_lead`, {
    method: 'POST',
    headers: { apikey: env.SUPABASE_ANON_KEY, Authorization: `Bearer ${env.SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ payload }),
  });
  if (r.ok) return json(200, { ok: true });
  const err = await r.json().catch(() => ({}));
  if (err.message === 'rate_limited') return json(429, { ok: false });
  if (err.message === 'invalid') return json(400, { ok: false });
  console.error('submit_website_lead', r.status, err.message);
  return json(502, { ok: false });
}

// ---------- Accueil (contenu publié, ou brouillon pour l'aperçu) ----------

let homeMemo = { at: 0, value: null };

async function loadHome(env, token) {
  const headers = { apikey: env.SUPABASE_ANON_KEY, Authorization: `Bearer ${token || env.SUPABASE_ANON_KEY}` };
  const status = token ? 'draft' : 'published';
  const [content, brands] = await Promise.all([
    fetch(`${env.SUPABASE_URL}/rest/v1/website_content?select=content&page_slug=eq.homepage&status=eq.${status}`, { headers })
      .then(r => (r.ok ? r.json() : Promise.reject(Object.assign(new Error(`website_content ${r.status}`), { status: r.status })))),
    fetch(`${env.SUPABASE_URL}/rest/v1/rpc/website_brands`, { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }, body: '{}' })
      .then(r => (r.ok ? r.json() : [])).catch(() => []),
  ]);
  return { content: content[0] ? content[0].content : null, brands };
}

async function serveHomepage(res, env, ctx, token) {
  let data, home;
  try {
    data = await loadData(env, ctx);
    if (token) {
      home = await loadHome(env, token);
      if (!home.content) return previewError(403);
    } else if (homeMemo.value && Date.now() - homeMemo.at < CACHE_SECONDS * 1000) {
      home = homeMemo.value;
    } else {
      home = await loadHome(env, null);
      homeMemo = { at: Date.now(), value: home };
    }
  } catch (err) {
    console.error('homepage', err && err.message);
    if (token) return previewError(err && (err.status === 401 || err.status === 403) ? 403 : 502);
    return res; // fallback: built-in homepage
  }
  const built = buildHomepage(home.content, data, home.brands);
  let body = await res.text();
  for (const [name, value] of Object.entries(built.literals)) body = replaceLiteral(body, `const ${name}`, value);
  const headers = new Headers(res.headers);
  headers.delete('Content-Length');
  headers.delete('ETag');
  if (token) {
    headers.set('Cache-Control', 'no-store');
    headers.set('X-Robots-Tag', 'noindex');
  } else {
    headers.set('Cache-Control', `public, max-age=0, s-maxage=${CACHE_SECONDS}`);
    headers.set('X-MVP-Content', 'live');
  }
  return rewriteHomepage(new Response(body, { status: 200, headers }), built);
}

/**
 * Aperçu du brouillon depuis le tableau de bord : formulaire POST (jeton de session
 * dans le corps, jamais dans l'URL). La base ne renvoie le brouillon qu'à l'équipe (RLS).
 */
async function handlePreview(request, env, ctx) {
  if (request.method !== 'POST') return previewError(405);
  let token = '';
  try { token = String((await request.formData()).get('token') || ''); } catch { /* invalid body */ }
  if (!/^[\w-]+\.[\w-]+\.[\w-]+$/.test(token)) return previewError(401);
  const res = await env.ASSETS.fetch(new Request(new URL('/', request.url)));
  if (!res.ok) return res;
  return serveHomepage(res, env, ctx, token);
}

function previewError(status) {
  const msg = status === 403 || status === 401
    ? 'Aperçu non autorisé : reconnectez-vous au tableau de bord et enregistrez le brouillon.'
    : 'Aperçu indisponible pour le moment.';
  return new Response(`<!doctype html><meta charset="utf-8"><title>Aperçu</title><p style="font:16px system-ui;padding:40px">${msg}</p>`, {
    status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' },
  });
}

function pageName(pathname) {
  const last = pathname.split('/').pop() || 'index.html';
  return last.endsWith('.html') ? last : `${last}.html`;
}

// ---------- Data ----------

export async function loadData(env, ctx) {
  if (memo.data && Date.now() - memo.at < CACHE_SECONDS * 1000) return memo.data;
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) throw new Error('Supabase not configured');
  const get = path => fetch(`${env.SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: env.SUPABASE_ANON_KEY, Authorization: `Bearer ${env.SUPABASE_ANON_KEY}` },
    cf: { cacheTtl: CACHE_SECONDS, cacheEverything: true },
  }).then(r => {
    if (!r.ok) throw new Error(`${path.split('?')[0]} ${r.status}`);
    return r.json();
  });

  const [services, people, projects] = await Promise.all([
    get('services?select=id,slug,title,title_en,hero_image,cta_label,content&status=eq.published&order=sort_order'),
    get('personalities?select=id,slug,first_name,last_name,display_name,title,bio,bio_long,sport,career_status,roles,qualities,project_types,photo,photo_alt,cutout,gallery,legacy_url,is_female,personality_services(services(slug))&status=eq.published&order=sort_order'),
    get('projects?select=id,slug,title,tagline,brand_label,project_type,summary,sections,cover,images,video,videos,date_label,year,legacy_url,project_personalities(sort_order,personalities(slug,display_name)),project_services(services(slug))&status=eq.published&order=sort_order'),
  ]);
  const data = build(services, people, projects);
  memo = { at: Date.now(), data };
  return data;
}

export function build(services, people, projects) {
  // Textes français validés (site MVP d'origine) : priment sur les textes anglais encore présents dans la base.
  people = people.map(t => FR.talents[t.slug] ? { ...t, bio: FR.talents[t.slug].bio, bio_long: FR.talents[t.slug].bioLongue } : t);
  projects = projects.map(p => {
    const o = FR.projets[p.slug];
    return o ? { ...p, title: o.titre, summary: o.resume, sections: o.sections, date_label: o.date, tagline: o.accroche || p.tagline } : p;
  });
  const projs = projects.map(p => {
    const persons = (p.project_personalities || [])
      .filter(x => x.personalities)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(x => x.personalities);
    return { ...p, persons, svc: (p.project_services || []).map(x => x.services && x.services.slug).filter(Boolean) };
  });

  const projetsByPerson = {};
  for (const p of projs) for (const x of p.persons) (projetsByPerson[x.slug] ||= []).push(p);

  const talents = people.map(t => ({
    id: t.slug,
    nom: t.display_name,
    prenom: t.first_name,
    famille: t.last_name,
    photo: t.photo || '',
    photo2: t.photo_alt || '',
    cat: t.sport,
    catNom: CAT_NOM[t.sport] || t.sport,
    titre: t.title,
    bio: t.bio,
    roles: t.roles || [],
    qualites: t.qualities || [],
    projets: t.project_types || [],
    statut: t.career_status,
    url: t.legacy_url || '',
    bioLongue: t.bio_long || '',
    decoupe: t.cutout || '',
    projets_reels: [],
    marques: [...new Set((projetsByPerson[t.slug] || []).map(p => p.brand_label).filter(b => b && b !== 'MVP Group'))],
    galerie: Array.isArray(t.gallery) ? t.gallery : [],
    is_female: !!t.is_female,
    services: (t.personality_services || []).map(x => x.services && x.services.slug).filter(Boolean),
  }));

  const projets = projs.map(p => ({
    id: p.slug,
    titre: p.title,
    marque: p.brand_label,
    type: p.project_type,
    personnalites: p.persons.map(x => ({ nom: x.display_name, id: x.slug })),
    date: p.date_label,
    annee: p.year,
    resume: p.summary,
    sections: p.sections || [],
    cover: p.cover || '',
    images: p.images || [],
    video: p.video || '',
    url: p.legacy_url || '',
    accroche: p.tagline || '',
    videos: p.videos || [],
    pers: p.persons.map(x => x.display_name),
    services: p.svc,
  }));

  const svcP = Object.fromEntries(projs.map(p => [p.slug, p.svc]));

  const projetsMvp = projs.map(p => ({
    id: p.slug,
    img: (p.images && p.images[0]) || p.cover || '',
    marque: p.brand_label,
    type: p.project_type,
    titre: p.title,
    desc: (p.summary || '').slice(0, 220).trim(),
    url: `projet.html?id=${p.slug}`,
    pers: p.persons.map(x => x.slug),
    annee: p.year,
  }));

  const homeList = projs.map(p => ({
    id: p.slug, titre: p.title, brand: p.brand_label, type: TYPE_CODE[p.project_type] || 'evt', year: p.year, img: p.cover || '',
  }));

  const servicesDict = {};
  for (const s of services) {
    servicesDict[s.slug] = { ...(s.content || {}), nom: s.title, nomEN: s.title_en, hero: s.hero_image || '', cta1: s.cta_label || '' };
  }

  for (const [slug, o] of Object.entries(FR.services)) servicesDict[slug] = { ...(servicesDict[slug] || {}), ...o };
  return { talents, projets, svcP, projetsMvp, homeList, services: servicesDict };
}

// ---------- Literal replacement ----------

/** Replace the array/object literal assigned to `declaration` (e.g. "const TALENTS") with JSON. */
export function replaceLiteral(src, declaration, value) {
  const re = new RegExp(declaration.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*=\\s*');
  const m = re.exec(src);
  if (!m) return src;
  const start = m.index + m[0].length;
  const end = literalEnd(src, start);
  if (end < 0) return src;
  return src.slice(0, start) + JSON.stringify(value).replace(/<\/script/gi, '<\\/script') + src.slice(end);
}

/** Index just after the [...] or {...} literal starting at `i`, honouring JS strings. -1 if not found. */
export function literalEnd(src, i) {
  const open = src[i];
  if (open !== '[' && open !== '{') return -1;
  let depth = 0;
  for (let k = i; k < src.length; k++) {
    const c = src[k];
    if (c === '"' || c === "'" || c === '`') {
      for (k++; k < src.length && src[k] !== c; k++) if (src[k] === '\\') k++;
      continue;
    }
    if (c === '[' || c === '{') depth++;
    else if (c === ']' || c === '}') {
      depth--;
      if (depth === 0) return k + 1;
    }
  }
  return -1;
}

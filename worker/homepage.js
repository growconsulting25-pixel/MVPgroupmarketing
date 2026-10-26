/*
 * Accueil piloté par le tableau de bord (website_content, page « homepage »).
 *
 * Le contenu publié remplace :
 *   - les textes FR/EN (dictionnaire I18N + texte initial des balises data-i18n)
 *   - la vidéo de la bannière, le numéro « Appelez-nous », les villes de la carte
 *   - les tableaux SERVICES, PROJECTS, TALENTS_CAT, J/ANC (Canadiens)
 *   - PARTNERS : les logos des clients cochés « logo sur le site »
 * Tout champ absent ou vide garde la version intégrée à index.html.
 *
 * RICH_KEYS et la projection de la carte sont les mêmes que dans
 * MVPdashboard/src/lib/homepage.ts.
 */

export const RICH_KEYS = {
  'hero.h1': 'gold', 'hero.lede2': 'gold', 'intro.h2': 'em', 'intro.p1': 'b', 'intro.p1b': 'b', 'intro.p2': 'b', 'intro.p3': 'b',
  'appel.h': 'gold', 'orbit.p': 'b', 'hb.h': 'hb', 'mo.h': 'span', 'mo.p': 'b',
};

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function richToHtml(text, key) {
  const e = esc(text);
  const kind = RICH_KEYS[key];
  if (!kind) return e;
  let html;
  if (kind === 'hb') {
    const m = /^([\s\S]*?)\s*\*([\s\S]+?)\*\s*$/.exec(e);
    html = m ? `${m[1] ? `<span class="hb__bleu">${m[1]}</span> ` : ''}<em>${m[2]}</em>` : e;
  } else {
    const open = kind === 'gold' ? '<span class="gold">' : `<${kind}>`;
    const close = kind === 'gold' ? '</span>' : `</${kind}>`;
    html = e.replace(/\*([\s\S]+?)\*/g, `${open}$1${close}`);
  }
  return html.replace(/\r?\n/g, '<br>');
}

const MEDIA = /^(https:\/\/[^\s"'<>]+|assets\/[^\s"'<>]+)$/;
const media = v => (typeof v === 'string' && MEDIA.test(v.trim()) ? v.trim() : '');
const bi = v => ({ fr: String((v && v.fr) || ''), en: String((v && (v.en || v.fr)) || '') });
const slugOk = v => typeof v === 'string' && /^[a-z0-9-]+$/.test(v);

export const project = (lat, lon) => ({
  x: Math.round((8.617663 * lon + 1448.13) * 10) / 10,
  y: Math.round((-11.598968 * lat + 875.218) * 10) / 10,
});
const MTL = { x: 813.8, y: 347.4 }; // Montréal, as drawn on the original map

const LABEL = {
  right: [12, 5, 'start'], left: [-12, 5, 'end'], 'right-up': [12, -8, 'start'], 'left-up': [-12, -8, 'end'],
  'right-down': [12, 12, 'start'], 'left-down': [-12, 14, 'end'],
};

export function mapSvg(cities) {
  const list = cities.filter(c => c && c.name && Number.isFinite(+c.lat) && Number.isFinite(+c.lon)).slice(0, 40);
  const pts = list.map(c => ({ ...project(+c.lat, +c.lon), name: String(c.name).slice(0, 40), side: LABEL[c.side] ? c.side : 'right' }));
  const arcs = pts.map((p, i) => {
    const mx = (MTL.x + p.x) / 2, my = (MTL.y + p.y) / 2;
    const d = Math.hypot(p.x - MTL.x, p.y - MTL.y);
    return `<path class="mo__arc" style="--i:${i}" d="M${MTL.x} ${MTL.y}Q${mx.toFixed(1)} ${(my - 0.28 * d).toFixed(1)} ${p.x} ${p.y}" pathLength="1"/>`;
  }).join('');
  const towns = pts.map((p, i) => {
    const [lx, ly, anchor] = LABEL[p.side];
    const label = `<text x="${lx}" y="${ly}" text-anchor="${anchor}">${esc(p.name)}</text>`;
    return `<g class="mo__ville" style="--i:${i}" transform="translate(${p.x} ${p.y})"><circle r="16" class="mo__onde"/><circle r="6.5"/>${label}</g>`;
  }).join('');
  return `${arcs}${towns}<g class="mo__mtl" transform="translate(${MTL.x} ${MTL.y})"><circle r="26" class="mo__onde"/><circle r="10"/><text x="16" y="-16">Montréal</text></g>`;
}

const TYPE_CODE = { 'Ambassadeur': 'amb', 'Conférence': 'conf', 'Événement corporatif': 'evt' };
const TYPES = new Set(['amb', 'ambF', 'evt', 'conf', 'camp']);
const ROLE_TAGS = {
  'Speaker': [{ fr: 'Conférencier', en: 'Speaker' }, { fr: 'Conférencière', en: 'Speaker' }],
  'Brand Ambassador': [{ fr: 'Ambassadeur', en: 'Ambassador' }, { fr: 'Ambassadrice', en: 'Ambassador' }],
  'Host': [{ fr: 'Animateur', en: 'Host' }, { fr: 'Animatrice', en: 'Host' }],
  'Media Personality': [{ fr: 'Médias', en: 'Media' }],
  'Olympian': [{ fr: 'Olympien', en: 'Olympian' }, { fr: 'Olympienne', en: 'Olympian' }],
  'Champion': [{ fr: 'Champion', en: 'Champion' }, { fr: 'Championne', en: 'Champion' }],
  'Sports Legend': [{ fr: 'Légende du sport', en: 'Sports legend' }],
  'Coach': [{ fr: 'Entraîneur', en: 'Coach' }, { fr: 'Entraîneuse', en: 'Coach' }],
};
const tagsFor = t => (t.roles || []).map(r => ROLE_TAGS[r]).filter(Boolean).slice(0, 2).map(v => v[t.is_female && v[1] ? 1 : 0]);

/**
 * @param c     published homepage content (or null)
 * @param data  output of build() in index.js (talents, projets…)
 * @param brands rows of website_brands()
 * @returns { literals: {NAME: value}, texts: {fr, en}, hero, phone, map }
 */
export function buildHomepage(c, data, brands) {
  const out = { literals: {}, texts: { fr: {}, en: {} }, hero: null, phone: '', map: '' };

  if (Array.isArray(brands) && brands.length) {
    out.literals.PARTNERS = brands.filter(b => media(b.logo)).map(b => {
      const p = { n: b.name, f: media(b.logo) };
      if (b.project_slug) p.p = b.project_slug;
      if (b.logo_style === 'mono') p.mono = true;
      if (b.logo_style === 'plaque') p.plaque = true;
      return p;
    });
  }
  if (!c || typeof c !== 'object') return out;

  for (const l of ['fr', 'en']) {
    const src = (c.texts && c.texts[l]) || {};
    for (const [k, v] of Object.entries(src)) {
      if (typeof v !== 'string' || !v.trim() || !/^[a-z]+\.[a-z0-9]+$/i.test(k)) continue;
      out.texts[l][k] = RICH_KEYS[k] ? richToHtml(v.trim(), k) : v.trim();
    }
  }
  out.literals.SITE_TEXT = out.texts;

  if (c.hero && media(c.hero.video)) {
    out.hero = { video: media(c.hero.video), mobile: media(c.hero.video_mobile) || media(c.hero.video), poster: media(c.hero.poster) };
  }
  if (c.appel && typeof c.appel.phone === 'string') {
    const digits = c.appel.phone.replace(/[^\d+]/g, '');
    if (/^\+?\d{10,15}$/.test(digits)) out.phone = digits.startsWith('+') ? digits : `+1${digits}`;
  }
  if (c.map && Array.isArray(c.map.cities)) out.map = mapSvg(c.map.cities);

  const talentBy = Object.fromEntries((data.talents || []).map(t => [t.id, t]));
  const projetBy = Object.fromEntries((data.projets || []).map(p => [p.id, p]));
  const svcPublished = new Set(Object.keys(data.services || {}));

  if (Array.isArray(c.services) && c.services.length) {
    const svc = c.services.filter(s => slugOk(s.slug) && svcPublished.has(s.slug) && media(s.img)).slice(0, 12);
    if (svc.length) {
      out.literals.SERVICES = svc.map((s, i) => ({
        num: String(i + 1).padStart(2, '0'), title: bi(s.title), desc: bi(s.desc), img: media(s.img), alt: bi(s.title), url: `service.html?s=${s.slug}`,
      }));
    }
  }

  if (Array.isArray(c.projects) && c.projects.length) {
    const pj = c.projects.filter(p => slugOk(p.slug) && projetBy[p.slug]).slice(0, 40).map(p => {
      const d = projetBy[p.slug];
      const type = TYPES.has(p.type) ? p.type : (TYPE_CODE[d.type] || 'evt');
      const brand = typeof p.brand === 'string' && p.brand.trim() ? p.brand.trim() : (d.marque && d.marque !== 'MVP Group' ? d.marque : '');
      const person = typeof p.person === 'string' && p.person.trim() ? p.person.trim() : ((d.pers || []).join(' & ') || d.titre);
      return { id: d.id, person, brand, type, year: d.annee || '', img: media(p.img) || d.cover, pos: typeof p.pos === 'string' ? p.pos.slice(0, 20) : '' };
    }).filter(p => p.img);
    if (pj.length) out.literals.PROJECTS = pj;
  }

  if (c.talents && c.talents.rows && typeof c.talents.rows === 'object') {
    const full = new Set(Array.isArray(c.talents.full_photo) ? c.talents.full_photo : []);
    const list = [];
    for (const [cat, ids] of Object.entries(c.talents.rows)) {
      if (!Array.isArray(ids)) continue;
      for (const id of ids.slice(0, 60)) {
        const t = talentBy[id];
        if (!t) continue;
        const useFull = full.has(id) || !t.decoupe;
        list.push({ id, nom: t.nom, cat, photo: useFull, img: (useFull ? t.photo : t.decoupe) || t.photo, titre: t.titre || '', tags: tagsFor(t) });
      }
    }
    if (list.length) out.literals.TALENTS_CAT = list;
  }

  if (c.canadiens) {
    if (Array.isArray(c.canadiens.cards)) {
      const cards = c.canadiens.cards.filter(k => k && k.name && media(k.img)).slice(0, 30).map(k => {
        const j = { nom: String(k.name).slice(0, 60), img: media(k.img), pos: typeof k.pos === 'string' ? k.pos.slice(0, 20) : '', tag: bi(k.tag) };
        if (k.cut) j.cut = 1;
        if (slugOk(k.profile) && talentBy[k.profile]) j.prof = k.profile;
        if (slugOk(k.project) && projetBy[k.project]) j.u = `projet.html?id=${k.project}`;
        return j;
      });
      if (cards.length) out.literals.J = cards;
    }
    if (Array.isArray(c.canadiens.legends)) {
      const anc = c.canadiens.legends.filter(id => talentBy[id]).slice(0, 60)
        .map(id => ({ id, nom: talentBy[id].nom, img: talentBy[id].decoupe || talentBy[id].photo }));
      if (anc.length) out.literals.ANC = anc;
    }
  }
  return out;
}

/** HTMLRewriter pass: initial (French) texts, hero video, phone link, map. */
export function rewriteHomepage(response, home) {
  let rw = new HTMLRewriter();
  for (const [k, v] of Object.entries(home.texts.fr)) {
    const sel = RICH_KEYS[k] ? `[data-i18n-html="${k}"]` : `[data-i18n="${k}"]`;
    rw = rw.on(sel, { element(el) { el.setInnerContent(v, { html: !!RICH_KEYS[k] }); } });
  }
  if (home.hero) {
    const h = home.hero;
    rw = rw.on('#heroVideo', { element(el) { if (h.poster) el.setAttribute('poster', h.poster); } })
      .on('#heroVideo source', { element(el) { el.setAttribute('src', el.getAttribute('media') ? h.mobile : h.video); } });
  }
  if (home.phone) rw = rw.on('a.appel__tel', { element(el) { el.setAttribute('href', `tel:${home.phone}`); } });
  if (home.map) rw = rw.on('svg.mo__arcs', { element(el) { el.setInnerContent(home.map, { html: true }); } });
  return rw.transform(response);
}

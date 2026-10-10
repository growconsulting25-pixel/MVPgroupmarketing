/* Navigation commune des pages internes : libellés FR/EN du menu et du pied
   de page, choix de langue mémorisé, menu mobile (hamburger). */
(function(){
  var D={"fr": {"nav.services": "Services", "nav.s1": "Conférenciers", "nav.s2": "Ambassadeurs et porte-parole", "nav.s3": "Stratégies médias sociaux et influenceurs", "nav.s4": "Invités d'honneur", "nav.s5": "Événements corporatifs et consolidation d'équipe", "nav.celebs": "Personnalités sportives", "cat.hockey": "Hockey", "cat.boxing": "Boxe", "cat.mma": "MMA", "cat.olympics": "Olympisme", "cat.media": "Médias", "cat.soccer": "Soccer", "cat.others": "Autres", "nav.projects": "Projets", "nav.agency": "À propos", "nav.a1": "Mission de MVP Group", "nav.a2": "Équipe de direction", "nav.contact": "Contact", "cta.work": "Travailler avec nous", "foot.agency": "MVP Group Agency", "foot.hq": "Siège social : Montréal, Qc. Canada", "foot.nav": "Navigation", "foot.svc": "Services", "foot.follow": "Suivez-nous", "foot.rights": "© 2026 MVP Group Agency Inc. Tous droits réservés.", "foot.privacy": "Politique de confidentialité"}, "en": {"nav.services": "Services", "nav.s1": "Keynote speakers", "nav.s2": "Brand ambassadors & spokespersons", "nav.s3": "Social media strategies & influencers", "nav.s4": "Guests of honor", "nav.s5": "Corporate events & teambuilding", "nav.celebs": "Sports celebrities", "cat.hockey": "Hockey", "cat.boxing": "Boxing", "cat.mma": "MMA", "cat.olympics": "Olympics", "cat.media": "Media", "cat.soccer": "Soccer", "cat.others": "Others", "nav.projects": "Projects", "nav.agency": "About", "nav.a1": "MVP Group mission", "nav.a2": "Management team", "nav.contact": "Contact", "cta.work": "Work with us", "foot.agency": "MVP Group Agency", "foot.hq": "Head office: Montréal, Qc. Canada", "foot.nav": "Navigation", "foot.svc": "Services", "foot.follow": "Follow", "foot.rights": "© 2026 MVP Group Agency Inc. All rights reserved.", "foot.privacy": "Privacy policy"}};
  var html=document.documentElement, LANG='fr';
  try{ LANG=localStorage.getItem('mvp-lang')==='en'?'en':'fr'; }catch(e){}
  function appliquer(l){
    LANG=l;
    document.querySelectorAll('header [data-i18n], footer [data-i18n], .mm [data-i18n]').forEach(function(el){ var v=D[l][el.dataset.i18n]; if(v) el.textContent=v; });
    document.querySelectorAll('header [data-i18n-html], footer [data-i18n-html]').forEach(function(el){ var v=D[l][el.dataset.i18nHtml]; if(v) el.innerHTML=v; });
    document.querySelectorAll('#lang [data-lang]').forEach(function(b){ b.classList.toggle('is-active', b.dataset.lang===l); });
    try{ localStorage.setItem('mvp-lang',l); }catch(e){}
  }
  var lang=document.getElementById('lang');
  if(lang) lang.addEventListener('click',function(e){ var b=e.target.closest('[data-lang]'); if(b) appliquer(b.dataset.lang); });

  /* menu mobile, construit à partir du menu du haut */
  var burger=document.getElementById('burger'), nav=document.querySelector('.header__nav');
  if(burger && nav && !document.getElementById('mobileMenu')){
    var mm=document.createElement('nav'); mm.className='mm'; mm.id='mobileMenu'; mm.setAttribute('aria-label','Menu');
    var h='';
    [].forEach.call(nav.children,function(it){
      var a=it.matches('a')?it:it.querySelector(':scope > a'); if(!a) return;
      h+='<div class="mm__g"><a class="mm__a" href="'+a.getAttribute('href')+'" data-i18n="'+(a.dataset.i18n||'')+'">'+a.textContent+'</a>';
      var d=it.querySelector('.navdrop'); if(d){ h+='<div class="mm__s">'; [].forEach.call(d.querySelectorAll('a'),function(x){ h+='<a href="'+x.getAttribute('href')+'" data-i18n="'+(x.dataset.i18n||'')+'">'+x.textContent+'</a>'; }); h+='</div>'; }
      h+='</div>';
    });
    var cta=document.querySelector('.header__right .btn');
    if(cta) h+='<a class="btn btn--gold mm__cta" href="'+cta.getAttribute('href')+'"'+(cta.dataset.i18n?' data-i18n="'+cta.dataset.i18n+'">'+cta.textContent:'><span data-ui="find">'+cta.textContent+'</span>')+'</a>';
    mm.innerHTML=h; document.body.appendChild(mm);
    var ouvrir=function(o){ mm.classList.toggle('est-ouvert',o); html.classList.toggle('mm-ouvert',o); burger.setAttribute('aria-expanded',o); document.body.style.overflow=o?'hidden':''; };
    burger.addEventListener('click',function(){ ouvrir(!mm.classList.contains('est-ouvert')); });
    mm.addEventListener('click',function(e){ if(e.target.closest('a')) ouvrir(false); });
    addEventListener('keydown',function(e){ if(e.key==='Escape') ouvrir(false); });
    addEventListener('resize',function(){ if(innerWidth>1023) ouvrir(false); });
  }
  appliquer(LANG);
})();

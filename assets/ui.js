/* Éléments communs à toutes les pages : bande bleue en haut, bouton
   « Trouver un athlète » dans le menu, bulle d'aide et formulaire de demande. */
(function(){
  var TEL='514-582-3306', TELH='tel:+15145823306';
  var D={
    fr:{msg:"L'Agence de Marketing Sportif <i>#1</i> au Québec",work:'Travailler avec nous',call:'Appelez-nous',find:'Trouver un athlète',
      bulle:'Une question ?',aideT:"Besoin d'aide ?",aideS:'Nous sommes là pour vous',
      aideP:"Dites-nous ce que vous cherchez : conférencier, ambassadeur, invité d'honneur… Un agent vous répond rapidement avec des propositions.",
      start:'Démarrer une demande',appel2:'Nous appeler',appeler:'Appeler '+TEL,rapide:'Réponse rapide · Lun-Ven 9 h-17 h',fermer:'Fermer',
      k:'Démarrer un projet',t:'Parlez-nous de <em>votre projet.</em>',p:"Conférence, campagne, gala ou événement corporatif : décrivez votre besoin, nous trouvons la bonne personnalité.",
      avec:'Travailler avec',pt1:'Un conseiller du Groupe MVP vous répond très rapidement',pt2:'Un seul interlocuteur, du premier appel au résultat',pt3:"Un réseau bâti depuis 2005 dans le sport québécois",
      parler:'Vous préférez parler à quelqu’un ?',besoins:'Vos besoins',coord:'Vos coordonnées',projet:'Votre projet',datePh:'Ex. : juin 2027',
      note:'Vos informations restent confidentielles et servent uniquement à répondre à votre demande.',
      okPa:"L'équipe MVP communiquera avec vous sous peu au sujet de votre projet avec %.",
      nom:'Nom',ent:'Entreprise',mail:'Courriel',tel:'Téléphone',type:'Type de projet',date:'Date approximative',perso:'Personnalité souhaitée',message:'Message',
      types:['Conférencier(ère)','Ambassadeur(drice)','Porte-parole','Animateur(trice)','Invité(e) d\'honneur','Influenceur(euse) / médias sociaux','Événement corporatif','Autre'],
      persoPh:'Facultatif — ex. : un olympien, un joueur du Canadien',msgPh:'Objectif, public, budget, lieu…',
      envoyer:'Envoyer la demande',envoi:'Envoi…',req:'Merci de remplir les champs obligatoires (*).',
      err:"L'envoi n'a pas fonctionné. Écrivez-nous à <a href=\"mailto:info@mvpsportsmarketing.com\">info@mvpsportsmarketing.com</a> ou appelez le <a href=\""+TELH+"\">"+TEL+"</a>.",
      iK:'MVP International · Sur demande',iT:'Une icône, <em>partout dans le monde.</em>',iP:"Nommez la personnalité, peu importe le pays ou la ligue : nous approchons ses représentants pour vous.",
      i1:'Toutes les disciplines, tous les pays',i2:'Nous contactons ses représentants et négocions pour vous',i3:'Un conseiller du Groupe MVP vous répond très rapidement',
      iCible:'La personnalité',iNom:'Personnalité souhaitée *',iNomPh:'Ex. : une vedette du basketball américain',iPays:'Pays ou ligue',iPaysPh:'Ex. : États-Unis, Europe…',iLieu:"Lieu de l'événement",iLieuPh:'Ex. : Montréal, Toronto…',
      budget:'Budget approximatif',budgets:['À déterminer','Moins de 25 000 $','25 000 $ – 100 000 $','100 000 $ – 250 000 $','250 000 $ et plus'],
      iOk:"Un conseiller du Groupe MVP communiquera avec vous sous peu au sujet de votre demande internationale.",
      okT:'Merci, votre demande est envoyée.',okP:"L'équipe MVP communiquera avec vous sous peu."},
    en:{msg:'The <i>#1</i> Sports Marketing Agency in Québec',work:'Work with us',call:'Call us',find:'Find an athlete',
      bulle:'Questions?',aideT:'Need help?',aideS:"We're here for you",
      aideP:"Tell us what you're looking for: keynote speaker, ambassador, guest of honor… An agent will get back to you quickly with suggestions.",
      start:'Start inquiry',appel2:'Call us',appeler:'Call '+TEL,rapide:'Fast reply · Mon-Fri 9am-5pm',fermer:'Close',
      k:'Start a project',t:'Tell us about <em>your project.</em>',p:'Keynote, campaign, gala or corporate event: describe your need and we find the right personality.',
      avec:'Work with',pt1:'An MVP Group advisor gets back to you very quickly',pt2:'One point of contact, from the first call to the result',pt3:'A network built inside Quebec sport since 2005',
      parler:'Rather talk to someone?',besoins:'Your needs',coord:'Your details',projet:'Your project',datePh:'E.g. June 2027',
      note:'Your information stays confidential and is only used to answer your request.',
      okPa:'The MVP team will contact you shortly about your project with %.',
      nom:'Name',ent:'Company',mail:'Email',tel:'Phone',type:'Project type',date:'Approximate date',perso:'Preferred personality',message:'Message',
      types:['Keynote speaker','Ambassador','Spokesperson','Host','Guest of honor','Influencer / social media','Corporate event','Other'],
      persoPh:'Optional — e.g. an Olympian, a Canadiens player',msgPh:'Goal, audience, budget, location…',
      envoyer:'Send inquiry',envoi:'Sending…',req:'Please fill in the required fields (*).',
      err:"Sending failed. Email us at <a href=\"mailto:info@mvpsportsmarketing.com\">info@mvpsportsmarketing.com</a> or call <a href=\""+TELH+"\">"+TEL+"</a>.",
      iK:'MVP International · On request',iT:'Any icon, <em>anywhere in the world.</em>',iP:'Name the personality, whatever the country or league: we approach their representatives for you.',
      i1:'Every sport, every country',i2:'We contact their representatives and negotiate for you',i3:'An MVP Group advisor gets back to you very quickly',
      iCible:'The personality',iNom:'Desired personality *',iNomPh:'E.g. an American basketball star',iPays:'Country or league',iPaysPh:'E.g. United States, Europe…',iLieu:'Event location',iLieuPh:'E.g. Montréal, Toronto…',
      budget:'Approximate budget',budgets:['To be determined','Under $25,000','$25,000 – $100,000','$100,000 – $250,000','$250,000 and up'],
      iOk:'An MVP Group advisor will contact you shortly about your international request.',
      okT:'Thank you, your request has been sent.',okP:'The MVP team will contact you shortly.'}
  };
  var L=function(){ try{ return localStorage.getItem('mvp-lang')==='en'?'en':'fr'; }catch(e){ return 'fr'; } };
  var I={
    tel:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>',
    bulle:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.6A8 8 0 1 1 21 12z"/><path d="M8.5 11h.01M12 11h.01M15.5 11h.01" stroke-width="2.6" stroke-linecap="round"/></svg>',
    x:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    fl:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    cherche:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>'
  };
  var mk=function(tag,cls,html){ var e=document.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; };
  var body=document.body;

  /* 1. bande bleue */
  var tb=mk('div','tb','<span class="tb__vide" aria-hidden="true"></span>'+
    '<span class="tb__msg" data-ui-html="msg"></span>'+
    '<div class="tb__btns"><a class="tb__b tb__b--o" href="#" data-ui-ouvrir data-ui="work"></a><a class="tb__b tb__b--w" href="'+TELH+'">'+I.tel+'<span data-ui="call"></span></a></div>');
  tb.setAttribute('role','region'); tb.setAttribute('aria-label','MVP Group');
  body.insertBefore(tb,body.firstChild);

  /* 2. bouton du menu : « Trouver un athlète » vers toutes les personnalités */
  document.querySelectorAll('.header__right .btn, .mobile-menu > .btn').forEach(function(b){
    b.removeAttribute('data-i18n'); b.setAttribute('href','personnalites.html'); b.classList.add('ui-find');
    b.innerHTML=(b.closest('.header')?I.cherche:'')+'<span data-ui="find"></span>';
  });

  /* 3. bulle d'aide + carte */
  var bulle=mk('button','aide-b',I.bulle+'<span data-ui="bulle"></span>'); bulle.type='button'; bulle.setAttribute('aria-expanded','false');
  var carte=mk('div','aide-c',
    '<button type="button" class="aide-c__x" data-ui-aria="fermer">'+I.x+'</button>'+
    '<div class="aide-c__h"><span class="aide-c__ic">'+I.bulle+'</span><div><b data-ui="aideT"></b><span data-ui="aideS"></span></div></div>'+
    '<p data-ui="aideP"></p>'+
    '<button type="button" class="aide-c__go" data-ui-ouvrir><span data-ui="start"></span>'+I.fl+'</button>'+
    '<a class="aide-c__tel" href="'+TELH+'">'+I.tel+'<span data-ui="appeler"></span></a>'+
    '<div class="aide-c__pied"><i></i><span data-ui="rapide"></span></div>');
  carte.setAttribute('role','dialog'); carte.setAttribute('aria-hidden','true');
  body.appendChild(carte); body.appendChild(bulle);
  var carteO=function(o){ carte.classList.toggle('est-ouvert',o); carte.setAttribute('aria-hidden',!o); bulle.setAttribute('aria-expanded',o); };
  bulle.addEventListener('click',function(){ carteO(!carte.classList.contains('est-ouvert')); });
  carte.querySelector('.aide-c__x').addEventListener('click',function(){ carteO(false); });

  /* 4. fenêtre de demande — générale (« Travailler avec nous ») ou propre à un athlète */
  var ck='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  var champ=function(n,k,type,req,large,auto){ return '<label class="dmd__c dmd__c--'+n+(large?' dmd__c--l':'')+'"><span><b data-ui="'+k+'"></b>'+(req?' *':'')+'</span>'+
    (type==='textarea'?'<textarea name="'+n+'" rows="4" data-ui-ph="msgPh"></textarea>':'<input name="'+n+'" type="'+type+'"'+(auto?' autocomplete="'+auto+'"':'')+(req?' required':'')+(n==='date'?' data-ui-ph="datePh"':'')+(n==='personnalite'?' data-ui-ph="persoPh"':'')+'>')+'</label>'; };
  var dmd=mk('div','dmd',
    '<div class="dmd__fond"></div><div class="dmd__boite" role="dialog" aria-modal="true" aria-labelledby="dmdT">'+
    '<button type="button" class="dmd__x" data-ui-aria="fermer">'+I.x+'</button>'+
    '<aside class="dmd__a">'+
      '<div class="dmd__ath"><div class="dmd__ph"><img alt=""></div></div>'+
      '<p class="dmd__k" data-ui="k"></p><h2 class="dmd__t" id="dmdT"></h2><p class="dmd__s"></p>'+
      '<ul class="dmd__pts"><li>'+ck+'<span data-ui="pt1"></span></li><li>'+ck+'<span data-ui="pt2"></span></li><li>'+ck+'<span data-ui="pt3"></span></li></ul>'+
      '<a class="dmd__tel" href="'+TELH+'">'+I.tel+'<span><small data-ui="parler"></small><b>'+TEL+'</b></span></a>'+
    '</aside>'+
    '<div class="dmd__m"><div class="dmd__f">'+
      '<form novalidate>'+
      '<fieldset class="dmd__ix"><legend><span class="dmd__n"></span><b data-ui="iCible"></b></legend><div class="dmd__g">'+
        '<label class="dmd__c dmd__c--l"><span><b data-ui="iNom"></b></span><input name="cible" type="text" data-ui-ph="iNomPh"></label>'+
        '<label class="dmd__c"><span><b data-ui="iPays"></b></span><input name="pays" type="text" data-ui-ph="iPaysPh"></label>'+
        '<label class="dmd__c"><span><b data-ui="iLieu"></b></span><input name="lieu" type="text" data-ui-ph="iLieuPh"></label>'+
      '</div></fieldset>'+
      '<fieldset class="dmd__bes"><legend><span class="dmd__n"></span><b data-ui="besoins"></b></legend><div class="dmd__chips"></div></fieldset>'+
      '<fieldset><legend><span class="dmd__n"></span><b data-ui="coord"></b></legend><div class="dmd__g">'+
        champ('nom','nom','text',1,0,'name')+champ('entreprise','ent','text',0,0,'organization')+champ('courriel','mail','email',1,0,'email')+champ('telephone','tel','tel',0,0,'tel')+
      '</div></fieldset>'+
      '<fieldset><legend><span class="dmd__n"></span><b data-ui="projet"></b></legend><div class="dmd__g">'+
        champ('date','date','text')+'<label class="dmd__c dmd__c--budget"><span><b data-ui="budget"></b></span><select name="budget" class="dmd__sel"></select></label>'+'<div class="dmd__perso">'+champ('personnalite','perso','text')+'</div>'+champ('message','message','textarea',0,1)+
      '</div></fieldset>'+
      '<div class="dmd__err" role="alert" hidden></div><button class="dmd__go" type="submit"><span data-ui="envoyer"></span>'+I.fl+'</button>'+
      '<p class="dmd__note" data-ui="note"></p></form></div>'+
    '<div class="dmd__ok" hidden><span class="dmd__okic">'+ck+'</span><h3 data-ui="okT"></h3><p class="dmd__okp"></p><button type="button" class="dmd__okb" data-ui="fermer"></button></div></div></div>');
  body.appendChild(dmd);
  var form=dmd.querySelector('form'), err=dmd.querySelector('.dmd__err'), go=dmd.querySelector('.dmd__go'), dernier=null, ATH=null;
  var chips=dmd.querySelector('.dmd__chips');
  var majTitres=function(){
    var d=D[L()], img=dmd.querySelector('.dmd__ph img');
    var INTL=!!(ATH&&ATH.intl);
    dmd.classList.toggle('dmd--ath',!!(ATH&&ATH.nom)); dmd.classList.toggle('dmd--intl',INTL);
    form.cible.required=INTL;
    dmd.querySelector('.dmd__k').textContent=INTL? d.iK : d.k;
    var pts=dmd.querySelectorAll('.dmd__pts span'); pts[0].textContent=INTL?d.i1:d.pt1; pts[1].textContent=INTL?d.i2:d.pt2; pts[2].textContent=INTL?d.i3:d.pt3;
    dmd.querySelector('.dmd__t').innerHTML=INTL? d.iT : (ATH? d.avec+' <em>'+ATH.nom+'</em>' : d.t);
    dmd.querySelector('.dmd__s').textContent=INTL? d.iP : (ATH? (ATH.sous||'') : d.p);
    dmd.querySelector('.dmd__okp').textContent=INTL? d.iOk : (ATH? d.okPa.replace('%',ATH.nom) : d.okP);
    if(ATH&&ATH.nom){ img.src=ATH.photo||''; img.className=ATH.cut?'est-detoure':''; img.onerror=function(){ if(ATH.photo2 && img.src.indexOf(ATH.photo2)<0){ img.className=''; img.src=ATH.photo2; } else dmd.querySelector('.dmd__ath').classList.add('sans-photo'); }; dmd.querySelector('.dmd__ath').classList.remove('sans-photo'); }
    form.personnalite.value=(ATH&&ATH.nom)?ATH.nom:(form.personnalite.dataset.v||'');
  };
  var dmdO=function(o,ath){
    if(o){
      if(ath!==undefined){ if((ath&&(ath.nom||ath.intl))!==(ATH&&(ATH.nom||ATH.intl))){ dmd.querySelector('.dmd__f').hidden=false; dmd.querySelector('.dmd__ok').hidden=true; err.hidden=true; } ATH=ath; majTitres(); }
      carteO(false); fermerMenus(); dernier=document.activeElement;
      if(dmd.querySelector('.dmd__ok:not([hidden])')){ dmd.querySelector('.dmd__f').hidden=false; dmd.querySelector('.dmd__ok').hidden=true; }
      dmd.querySelector('.dmd__m').scrollTop=0;
      setTimeout(function(){ var f=form.querySelector('.dmd__chip'); if(f && matchMedia('(pointer:fine)').matches) f.focus({preventScroll:true}); },420);
    }
    dmd.classList.toggle('est-ouvert',o); document.documentElement.classList.toggle('dmd-ouvert',o);
    body.style.overflow=o?'hidden':'';
    if(!o && dernier && dernier.focus) dernier.focus({preventScroll:true});
  };
  var fermerMenus=function(){
    var m=document.getElementById('mobileMenu'); if(m){ m.classList.remove('open','est-ouvert'); }
    document.documentElement.classList.remove('mm-ouvert'); var b=document.getElementById('burger'); if(b) b.setAttribute('aria-expanded','false');
  };
  /* window.mvpDemande()                       → demande générale
     window.mvpDemande({nom, sous, photo, cut}) → demande pour un athlète précis
     window.mvpDemande({intl:true})            → demande d'une personnalité internationale */
  window.mvpDemande=function(ath){ dmdO(true, ath||null); };
  form.personnalite.addEventListener('input',function(){ if(!ATH) this.dataset.v=this.value; });
  chips.addEventListener('click',function(e){ var c=e.target.closest('.dmd__chip'); if(!c) return; c.setAttribute('aria-pressed', c.getAttribute('aria-pressed')!=='true'); });
  /* tout lien « Travailler avec nous » ouvre la fenêtre au lieu de descendre au formulaire */
  document.addEventListener('click',function(e){
    var a=e.target.closest('[data-ui-ouvrir], [data-ui-intl], a[href="#demande"], a[href="index.html#demande"], [data-ath-nom]');
    if(a && !e.defaultPrevented && !e.metaKey && !e.ctrlKey){
      e.preventDefault(); e.stopPropagation();
      dmdO(true, a.hasAttribute('data-ui-intl') ? {intl:true} : a.dataset.athNom ? {nom:a.dataset.athNom, sous:a.dataset.athSous, photo:a.dataset.athPhoto, photo2:a.dataset.athPhoto2, cut:a.dataset.athCut==='1'} : null);
      return;
    }
    if(carte.classList.contains('est-ouvert') && !e.target.closest('.aide-c,.aide-b')) carteO(false);
  },true);
  dmd.querySelector('.dmd__fond').addEventListener('click',function(){ dmdO(false); });
  dmd.querySelector('.dmd__x').addEventListener('click',function(){ dmdO(false); });
  dmd.querySelector('.dmd__okb').addEventListener('click',function(){ dmdO(false); });
  addEventListener('keydown',function(e){ if(e.key==='Escape'){ if(dmd.classList.contains('est-ouvert')) dmdO(false); else carteO(false); } });
  form.addEventListener('submit',function(e){
    e.preventDefault(); var d=D[L()], ok=true, prem=null;
    form.querySelectorAll('[required]').forEach(function(f){ var v=f.value.trim(), bon=v && (f.type!=='email' || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)); f.closest('.dmd__c').classList.toggle('est-invalide',!bon); if(!bon){ ok=false; prem=prem||f; } });
    if(!ok){ err.hidden=false; err.textContent=d.req; prem.focus(); return; }
    err.hidden=true; go.disabled=true; go.querySelector('span').textContent=d.envoi;
    var o={source:(ATH&&ATH.intl)?'international':ATH?'athlete':'travailler-avec-nous',page:location.href,langue:L()}; new FormData(form).forEach(function(v,k){ o[k]=v; });
    o.besoins=[].map.call(chips.querySelectorAll('[aria-pressed=true]'),function(c){ return c.textContent; }).join(', ');
    o.type=o.besoins;
    fetch('/api/demande',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(o)})
      .then(function(r){ if(!r.ok) throw 0; dmd.querySelector('.dmd__f').hidden=true; dmd.querySelector('.dmd__ok').hidden=false; form.reset(); chips.querySelectorAll('[aria-pressed]').forEach(function(c){ c.setAttribute('aria-pressed','false'); }); majTitres(); })
      .catch(function(){ err.hidden=false; err.innerHTML=D[L()].err; })
      .then(function(){ go.disabled=false; go.querySelector('span').textContent=D[L()].envoyer; });
  });

  /* 5. mobile : barre d'actions fixe en bas, la bande bleue se retire en défilant */
  var bb=mk('div','bb','<button type="button" class="bb__b bb__b--o" data-ui-ouvrir>'+I.bulle+'<span data-ui="work"></span></button>'+
    '<a class="bb__b bb__b--w" href="'+TELH+'">'+I.tel+'<span data-ui="appel2"></span></a>');
  body.appendChild(bb);
  var html=document.documentElement;
  var defile=function(){ html.classList.toggle('tb-cache', scrollY>60); };
  addEventListener('scroll',defile,{passive:true}); defile();

  /* 6. Couleur des boutons selon leur fonction :
        BLEU   = action qui ouvre un formulaire (demande, collaboration, contact)
        BRONZE = navigation vers une page de contenu (projets, personnalités, profils…) */
  var SEL='.btn, .intro__cta, .mo__go, .eq-btn, .ag-cta, .cat__cta, .nw__more, .talents__all';
  var EXCLU='.tb, .bb, .dmd, .aide-c, .hero__q, .footer__go';
  var FORM=/#demande$|travailler=1/;
  function classer(racine){
    (racine||document).querySelectorAll(SEL).forEach(function(b){
      if(b.closest(EXCLU)) return;
      var h=b.getAttribute('href')||'';
      if(/^tel:/.test(h)) return;
      if(/^mailto:/.test(h) && !b.hasAttribute('data-ui-ouvrir')) b.setAttribute('data-ui-ouvrir','');
      var act=b.hasAttribute('data-ui-ouvrir')||b.hasAttribute('data-ui-intl')||b.hasAttribute('data-travailler')||b.hasAttribute('data-ath-nom')||FORM.test(h);
      var nav=!act && (/\.html/.test(h) || b.classList.contains('tk__v') || (b.tagName==='BUTTON' && /plus|more/i.test(b.id+b.className)));
      b.classList.toggle('ui-act',act); b.classList.toggle('ui-nav',!!nav);
    });
  }
  classer();
  /* les cartes et listes créées plus tard (filtres, « voir plus », langue) sont classées aussi */
  new MutationObserver(function(ms){ ms.forEach(function(m){ m.addedNodes.forEach(function(n){ if(n.nodeType===1){ if(n.matches&&n.matches(SEL)) classer(n.parentNode); else classer(n); } }); }); }).observe(body,{childList:true,subtree:true});

  /* langue */
  function appliquer(){
    var d=D[L()];
    document.querySelectorAll('[data-ui]').forEach(function(el){ if(d[el.dataset.ui]) el.textContent=d[el.dataset.ui]; });
    document.querySelectorAll('[data-ui-html]').forEach(function(el){ el.innerHTML=d[el.dataset.uiHtml]; });
    document.querySelectorAll('[data-ui-ph]').forEach(function(el){ el.placeholder=d[el.dataset.uiPh]; });
    document.querySelectorAll('[data-ui-aria]').forEach(function(el){ el.setAttribute('aria-label',d[el.dataset.uiAria]); });
    var on=[].map.call(chips.children,function(c){ return c.getAttribute('aria-pressed')==='true'; });
    chips.innerHTML=d.types.map(function(t,i){ return '<button type="button" class="dmd__chip" aria-pressed="'+(on[i]?'true':'false')+'">'+t+'</button>'; }).join('');
    var bs=form.budget, bv=bs.selectedIndex; bs.innerHTML=d.budgets.map(function(t,i){ return '<option value="'+(i?t:'')+'">'+t+'</option>'; }).join(''); bs.selectedIndex=Math.max(0,bv);
    majTitres();
  }
  var lang=document.getElementById('lang');
  if(lang) lang.addEventListener('click',function(){ setTimeout(appliquer,0); });
  appliquer();
})();

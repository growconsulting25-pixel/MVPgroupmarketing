/* Éléments communs à toutes les pages : bande bleue en haut, bouton
   « Trouver un athlète » dans le menu, bulle d'aide et formulaire de demande. */
(function(){
  var TEL='514-582-3306', TELH='tel:+15145823306';
  var D={
    fr:{msg:"L'Agence de Marketing Sportif <i>#1</i> au Québec",work:'Travailler avec nous',call:'Appelez-nous',find:'Trouver un athlète',
      bulle:'Une question ?',aideT:"Besoin d'aide ?",aideS:'Nous sommes là pour vous',
      aideP:"Dites-nous ce que vous cherchez : conférencier, ambassadeur, invité d'honneur… Un agent vous répond rapidement avec des propositions.",
      start:'Démarrer une demande',appeler:'Appeler '+TEL,rapide:'Réponse rapide · Lun-Ven 9 h-17 h',fermer:'Fermer',
      k:'Démarrer une demande',t:'Parlez-nous de votre projet',p:"Quelques informations suffisent. Un agent de MVP Group vous revient rapidement.",
      nom:'Nom',ent:'Entreprise',mail:'Courriel',tel:'Téléphone',type:'Type de projet',date:'Date approximative',perso:'Personnalité souhaitée',message:'Message',
      types:['Choisir…','Conférence','Ambassadeur / porte-parole','Médias sociaux / influence','Invité d\'honneur','Événement corporatif','Autre'],
      persoPh:'Ex. : un olympien, un joueur du Canadien…',msgPh:'Objectif, public, budget, lieu…',
      envoyer:'Envoyer la demande',envoi:'Envoi…',req:'Merci de remplir les champs obligatoires (*).',
      err:"L'envoi n'a pas fonctionné. Écrivez-nous à <a href=\"mailto:info@mvpsportsmarketing.com\">info@mvpsportsmarketing.com</a> ou appelez le <a href=\""+TELH+"\">"+TEL+"</a>.",
      okT:'Merci !',okP:'Votre demande est bien reçue. Un agent vous contactera sous peu.'},
    en:{msg:'The <i>#1</i> Sports Marketing Agency in Québec',work:'Work with us',call:'Call us',find:'Find an athlete',
      bulle:'Questions?',aideT:'Need help?',aideS:"We're here for you",
      aideP:"Tell us what you're looking for: keynote speaker, ambassador, guest of honor… An agent will get back to you quickly with suggestions.",
      start:'Start inquiry',appeler:'Call '+TEL,rapide:'Fast reply · Mon-Fri 9am-5pm',fermer:'Close',
      k:'Start inquiry',t:'Tell us about your project',p:'A few details are enough. An MVP Group agent will get back to you quickly.',
      nom:'Name',ent:'Company',mail:'Email',tel:'Phone',type:'Project type',date:'Approximate date',perso:'Preferred personality',message:'Message',
      types:['Choose…','Keynote','Ambassador / spokesperson','Social media / influence','Guest of honor','Corporate event','Other'],
      persoPh:'E.g. an Olympian, a Canadiens player…',msgPh:'Goal, audience, budget, location…',
      envoyer:'Send inquiry',envoi:'Sending…',req:'Please fill in the required fields (*).',
      err:"Sending failed. Email us at <a href=\"mailto:info@mvpsportsmarketing.com\">info@mvpsportsmarketing.com</a> or call <a href=\""+TELH+"\">"+TEL+"</a>.",
      okT:'Thank you!',okP:'Your inquiry has been received. An agent will contact you shortly.'}
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
  var tb=mk('div','tb','<a class="tb__tel" href="'+TELH+'">'+I.tel+'<span>'+TEL+'</span></a>'+
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

  /* 4. formulaire de demande */
  var champ=function(n,k,type,req,large){ return '<label class="dmd__c'+(large?' dmd__c--l':'')+'"><span><b data-ui="'+k+'"></b>'+(req?' *':'')+'</span>'+
    (type==='textarea'?'<textarea name="'+n+'" data-ui-ph="msgPh"></textarea>':type==='select'?'<select name="'+n+'"></select>':'<input name="'+n+'" type="'+type+'"'+(req?' required':'')+(n==='personnalite'?' data-ui-ph="persoPh"':'')+'>')+'</label>'; };
  var dmd=mk('div','dmd',
    '<div class="dmd__fond"></div><div class="dmd__boite" role="dialog" aria-modal="true" aria-labelledby="dmdT">'+
    '<button type="button" class="dmd__x" data-ui-aria="fermer">'+I.x+'</button>'+
    '<div class="dmd__f"><div class="dmd__k" data-ui="k"></div><h2 class="dmd__t" id="dmdT" data-ui="t"></h2><p class="dmd__p" data-ui="p"></p>'+
    '<form novalidate><div class="dmd__g">'+champ('nom','nom','text',1)+champ('entreprise','ent','text')+champ('courriel','mail','email',1)+champ('telephone','tel','tel')+
    champ('type','type','select')+champ('date','date','text')+champ('personnalite','perso','text',0,1)+champ('message','message','textarea',0,1)+
    '</div><div class="dmd__err" hidden></div><button class="dmd__go" type="submit"><span data-ui="envoyer"></span>'+I.fl+'</button></form></div>'+
    '<div class="dmd__ok" hidden><span class="aide-c__ic">'+I.bulle+'</span><h3 data-ui="okT"></h3><p data-ui="okP"></p></div></div>');
  body.appendChild(dmd);
  var form=dmd.querySelector('form'), err=dmd.querySelector('.dmd__err'), go=dmd.querySelector('.dmd__go'), dernier=null;
  var dmdO=function(o){
    dmd.classList.toggle('est-ouvert',o); document.documentElement.classList.toggle('dmd-ouvert',o);
    body.style.overflow=o?'hidden':'';
    if(o){ carteO(false); dernier=document.activeElement; setTimeout(function(){ var f=form.querySelector('input'); if(f && !dmd.querySelector('.dmd__ok:not([hidden])')) f.focus(); },350); }
    else if(dernier && dernier.focus) dernier.focus();
  };
  window.mvpDemande=function(){ dmdO(true); };
  document.addEventListener('click',function(e){
    var a=e.target.closest('[data-ui-ouvrir]'); if(a){ e.preventDefault(); dmdO(true); return; }
    if(carte.classList.contains('est-ouvert') && !e.target.closest('.aide-c,.aide-b')) carteO(false);
  });
  dmd.querySelector('.dmd__fond').addEventListener('click',function(){ dmdO(false); });
  dmd.querySelector('.dmd__x').addEventListener('click',function(){ dmdO(false); });
  addEventListener('keydown',function(e){ if(e.key==='Escape'){ if(dmd.classList.contains('est-ouvert')) dmdO(false); else carteO(false); } });
  form.addEventListener('submit',function(e){
    e.preventDefault(); var d=D[L()], ok=true;
    form.querySelectorAll('[required]').forEach(function(f){ var v=f.value.trim(), bon=v && (f.type!=='email' || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)); f.closest('.dmd__c').classList.toggle('est-invalide',!bon); if(!bon) ok=false; });
    if(!ok){ err.hidden=false; err.textContent=d.req; return; }
    err.hidden=true; go.disabled=true; go.querySelector('span').textContent=d.envoi;
    var o={source:'bulle-aide',page:location.pathname,langue:L()}; new FormData(form).forEach(function(v,k){ o[k]=v; });
    fetch('/api/demande',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(o)})
      .then(function(r){ if(!r.ok) throw 0; dmd.querySelector('.dmd__f').hidden=true; dmd.querySelector('.dmd__ok').hidden=false; form.reset(); })
      .catch(function(){ err.hidden=false; err.innerHTML=D[L()].err; })
      .then(function(){ go.disabled=false; go.querySelector('span').textContent=D[L()].envoyer; });
  });

  /* langue */
  function appliquer(){
    var d=D[L()];
    document.querySelectorAll('[data-ui]').forEach(function(el){ if(d[el.dataset.ui]) el.textContent=d[el.dataset.ui]; });
    document.querySelectorAll('[data-ui-html]').forEach(function(el){ el.innerHTML=d[el.dataset.uiHtml]; });
    document.querySelectorAll('[data-ui-ph]').forEach(function(el){ el.placeholder=d[el.dataset.uiPh]; });
    document.querySelectorAll('[data-ui-aria]').forEach(function(el){ el.setAttribute('aria-label',d[el.dataset.uiAria]); });
    var s=form.querySelector('select'), v=s.selectedIndex;
    s.innerHTML=d.types.map(function(t,i){ return '<option value="'+(i?t:'')+'">'+t+'</option>'; }).join(''); s.selectedIndex=Math.max(0,v);
  }
  var lang=document.getElementById('lang');
  if(lang) lang.addEventListener('click',function(){ setTimeout(appliquer,0); });
  appliquer();
})();

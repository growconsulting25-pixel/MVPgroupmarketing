/* Repères « + » et petits groupes de croix en fondu, comme sur l'accueil : placés dans les marges de chaque section. */
(function(){
  var lum=function(c){ var m=(c||'').match(/\d+(\.\d+)?/g); if(!m||m.length<3) return 1; if(m.length>3&&+m[3]===0) return 1; return (0.299*m[0]+0.587*m[1]+0.114*m[2])/255; };
  var motifs={clair:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='26' height='26'%3E%3Cpath d='M13 8.5v9M8.5 13h9' stroke='%23fff' stroke-width='1'/%3E%3C/svg%3E\")",
              sombre:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='26' height='26'%3E%3Cpath d='M13 8.5v9M8.5 13h9' stroke='%23000' stroke-width='1'/%3E%3C/svg%3E\")"};
  var pos=[['t',14,1],['b',46,0],['l',30,0],['r',64,1],['t',72,0],['b',88,1]];
  var ajouter=function(){
    var secs=[].slice.call(document.querySelectorAll('main > section, #svc > section, #projet > section, section.psl, section.pg, section.pcta'));
    secs.forEach(function(sec,n){
      if(sec.querySelector(':scope > .plus')) return;
      var st=getComputedStyle(sec); if(st.position==='static') sec.style.position='relative';
      var fond=lum(st.backgroundColor)>.55, ton=fond?'#000':'#fff';
      var p=pos[n%pos.length], q=pos[(n+3)%pos.length];
      [p,q].forEach(function(t,k){
        var el=document.createElement('span'); el.className='plus plus--'+t[0]+(t[2]||k===0?' plus--lg':''); el.setAttribute('aria-hidden','true'); el.style.color=ton;
        if(t[0]==='t'||t[0]==='b') el.style.left=t[1]+'%'; else el.style.top=t[1]+'%';
        sec.appendChild(el);
      });
      if(n%2===0&&sec.offsetHeight>300){
        var g=document.createElement('span'); g.className='grille'; g.setAttribute('aria-hidden','true');
        g.style.cssText='position:absolute;pointer-events:none;z-index:1;opacity:.45;background-size:26px 26px;background-repeat:repeat;width:300px;height:170px;'+(n%4===0?'right:4%;top:70px;':'left:3%;bottom:50px;')+'background-image:'+(fond?motifs.sombre:motifs.clair)+';-webkit-mask-image:radial-gradient(closest-side,#000 25%,transparent 100%);mask-image:radial-gradient(closest-side,#000 25%,transparent 100%)';
        sec.appendChild(g);
      }
    });
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){setTimeout(ajouter,80);}); else setTimeout(ajouter,80);
  addEventListener('load',function(){ setTimeout(ajouter,400); });
})();

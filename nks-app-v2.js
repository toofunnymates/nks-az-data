(function(){
/* NKS AZ v2 - Self-contained app. Builds full UI dynamically. */
var JSON_URL='https://raw.githubusercontent.com/toofunnymates/nks-az-data/main/nks-az-live.json';
var DEFAULT_CATS={'series-1':'Dubbed by Saurav Chakraborty','series-2':'Upcoming','series-3':'Upcoming'};

function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

/* Build the full UI structure */
function buildUI(){
  var root=document.getElementById('nks-app-root');
  if(!root){root=document.createElement('div');root.id='nks-app-root';document.body.appendChild(root);}
  if(root.getAttribute('data-built'))return root;
  root.setAttribute('data-built','1');

  var html='';
  /* Nav */
  html+='<nav class="nks-nav"><div><a class="nks-brand" href="/">NKS<span class="nks-tube">AZ</span></a><div class="nks-tagline">Broadcast Yourself.</div></div>';
  html+='<form class="nks-search" id="nks-search-form" action="#"><input id="nks-search" type="text" placeholder="Search episodes..." autocomplete="off"/><button class="nks-xpbtn" type="submit">Search</button></form>';
  html+='<div class="nks-nav-links"><a href="/">Home</a><span class="sep">|</span><a href="#series">Series</a><span class="sep">|</span><a href="mailto:nksaz2511@gmail.com">Guestbook</a></div></nav>';
  /* Marquee */
  html+='<div class="nks-marquee"><marquee scrollamount="4">&#9733; Welcome to NKS AZ &#9733; Your personal video corner &#9733; New episodes added all the time &#9733; Best viewed at 1024x768 &#9733; Sign the guestbook! &#9733;</marquee></div>';
  /* Hero */
  html+='<section class="nks-hero"><div class="nks-hero-win"><div class="nks-titlebar">NKS AZ</div><div class="nks-hero-body">';
  html+='<div class="nks-hero-art" id="nks-hero-art"><span>&#9654;</span></div>';
  html+='<div class="nks-hero-inner"><div class="nks-hero-kicker">NKS AZ ORIGINALS</div><h1 id="nks-hero-title">Humara Wala Oggy</h1>';
  html+='<div class="nks-hero-stars">&#9733;&#9733;&#9733;&#9733;&#9734;</div>';
  html+='<p id="nks-hero-desc">A fanmade collection of the lost hindi dubbed episodes of oggy and the cockroaches A.K.A Humara Wala Oggy</p>';
  html+='<a class="nks-btn nks-xpbtn" href="#series" id="nks-hero-play">&#9654; Browse Episodes</a></div></div></div></section>';
  /* Home container */
  html+='<main id="nks-home"><div class="nks-loading">Loading episodes...</div></main>';
  /* Player overlay */
  html+='<div class="nks-player-overlay" id="nks-player-overlay"><div class="nks-player-wrap">';
  html+='<div class="nks-player-top"><span class="nks-player-top-title" id="nks-player-top-title">NKS AZ</span><button class="nks-xp-close" id="nks-player-close" title="Close">&#10005;</button></div>';
  html+='<div class="nks-player-body"><h2 class="nks-player-title" id="nks-ep-title">Loading...</h2><div class="nks-player-meta" id="nks-ep-meta"></div>';
  html+='<div class="nks-player-video" id="nks-player-video"><iframe id="nks-embed-frame" title="NKS AZ video player" allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowfullscreen="allowfullscreen" referrerpolicy="strict-origin-when-cross-origin" style="width:100%;height:100%;border:0"></iframe>';
  html+='<div class="nks-watermark">NKS AZ</div><div class="nks-player-loading" id="nks-player-loading"><div class="nks-spinner"></div><div>Connecting...</div></div></div>';
  html+='<div class="nks-player-err" id="nks-player-err"></div>';
  html+='<div class="nks-server-panel"><div class="nks-server-head"><div><div class="nks-server-title">Streaming server</div><div class="nks-server-status" id="nks-server-status">Ready</div></div></div>';
  html+='<div class="nks-server-list" id="nks-server-list"></div>';
  html+='<div class="nks-tool-row"><button class="nks-tool-btn" id="nks-copy-link" type="button">Copy episode link</button></div></div>';
  html+='</div></div></div>';

  root.innerHTML=html;
  return root;
}

/* Build episode grids from catalog */
function buildEpisodes(){
  var home=document.getElementById('nks-home');
  var cat=window.NKS_LOCAL_CATALOG;
  if(!home||!cat)return;
  var series=cat.series||[];
  var html='<section class="nks-section" id="series"><h2>Series</h2><div class="nks-series-grid">';
  series.forEach(function(s){
    var n=(s.episodes||[]).length;
    html+='<a class="nks-series-card" href="#series-'+esc(s.id)+'"><div class="nks-series-body"><h3>'+esc(s.title||'Untitled')+'</h3><p>'+esc(s.description||'')+'</p><span class="nks-count">'+n+(n===1?' episode':' episodes')+'</span></div></a>';
  });
  html+='</div></section>';
  series.forEach(function(s){
    var eps=s.episodes||[];
    html+='<section class="nks-section" id="series-'+esc(s.id)+'"><h2>'+esc(s.title||'Untitled')+'</h2>';
    if(s.description)html+='<p class="nks-sub">'+esc(s.description)+'</p>';
    if(!eps.length){
      html+='<div class="nks-coming">Episodes coming soon.</div>';
    }else{
      html+='<div class="nks-grid">';
      eps.forEach(function(e){
        html+='<a class="nks-card" href="#watch/'+esc(e.id)+'" data-ep="'+esc(e.id)+'"><div class="nks-poster"><img src="" alt="" data-epimg="'+esc(e.id)+'"/><div class="nks-play"></div></div><div class="nks-card-body"><h3>'+esc(e.title||'Untitled')+'</h3><div class="nks-card-meta">S'+esc(e.season)+' &#183; E'+esc(e.episode)+'</div></div></a>';
      });
      html+='</div>';
    }
    html+='</section>';
  });
  home.innerHTML=html;
}

/* Player */
var NKS_SERVERS={};
var NKS_POSTERS={};
function nksDecode(enc,epId,prov){
  var clean=String(enc||'').replace(/-/g,'+').replace(/_/g,'/');
  while(clean.length%4)clean+='=';
  try{
    var bin=atob(clean);
    var key='nksaz.blogspot.com|'+epId+'|'+prov;
    var out='';
    for(var i=0;i<bin.length;i++)out+=String.fromCharCode(bin.charCodeAt(i)^key.charCodeAt(i%key.length));
    try{return decodeURIComponent(escape(out));}catch(e){return out;}
  }catch(e){return null;}
}
function openPlayer(epId){
  var overlay=document.getElementById('nks-player-overlay');
  var frame=document.getElementById('nks-embed-frame');
  var title=document.getElementById('nks-ep-title');
  var meta=document.getElementById('nks-ep-meta');
  var loading=document.getElementById('nks-player-loading');
  var err=document.getElementById('nks-player-err');
  var serverList=document.getElementById('nks-server-list');
  var serverStatus=document.getElementById('nks-server-status');
  if(!overlay||!frame)return;
  var cat=window.NKS_LOCAL_CATALOG;
  var epTitle=epId, epSeason='', epNum='';
  if(cat){(cat.series||[]).forEach(function(s){(s.episodes||[]).forEach(function(e){if(e.id===epId){epTitle=e.title||epId;epSeason=e.season;epNum=e.episode;}});});}
  title.textContent=epTitle;
  if(meta)meta.textContent=(epSeason!==''?'Season '+epSeason+' ':'')+(epNum!==''?'Episode '+epNum:'');
  err.textContent='';
  loading.style.display='';
  overlay.style.display='block';
  document.body.style.overflow='hidden';
  if(serverStatus)serverStatus.textContent='Finding best server...';
  fetch(JSON_URL).then(function(r){return r.json();}).then(function(d){
    var servers=d.servers||{};
    var epServers=servers[epId]||NKS_SERVERS[epId];
    if(!epServers){
      loading.style.display='none';
      err.textContent='This episode is not yet available. New episodes are being added daily.';
      if(serverStatus)serverStatus.textContent='No servers yet';
      return;
    }
    var decoded=[];
    for(var prov in epServers){
      var ref=epServers[prov];
      var enc=ref&&ref.enc?ref.enc:null;
      if(enc){
        var url=nksDecode(enc,epId,prov);
        if(url)decoded.push({prov:prov,url:url});
      }
    }
    if(!decoded.length){
      loading.style.display='none';
      err.textContent='Could not load video servers.';
      return;
    }
    if(serverList){
      serverList.innerHTML='';
      decoded.forEach(function(s,i){
        var btn=document.createElement('button');
        btn.className='nks-server-btn'+(i===0?' active':'');
        btn.textContent='Server '+(i+1);
        btn.onclick=function(){
          var all=serverList.querySelectorAll('.nks-server-btn');
          for(var j=0;j<all.length;j++)all[j].classList.remove('active');
          btn.classList.add('active');
          loading.style.display='';
          frame.src=s.url;
          if(serverStatus)serverStatus.textContent='Playing via Server '+(i+1);
        };
        serverList.appendChild(btn);
      });
    }
    loading.style.display='none';
    frame.src=decoded[0].url;
    if(serverStatus)serverStatus.textContent='Playing via Server 1';
    var copyBtn=document.getElementById('nks-copy-link');
    if(copyBtn)copyBtn.onclick=function(){
      var url=location.origin+location.pathname+'#watch/'+epId;
      if(navigator.clipboard)navigator.clipboard.writeText(url).then(function(){copyBtn.textContent='Copied!';setTimeout(function(){copyBtn.textContent='Copy episode link';},2000);});
    };
  }).catch(function(){
    loading.style.display='none';
    err.textContent='Could not reach the streaming server. Try again in a minute.';
    if(serverStatus)serverStatus.textContent='Connection failed';
  });
}
function closePlayer(){
  var overlay=document.getElementById('nks-player-overlay');
  var frame=document.getElementById('nks-embed-frame');
  if(overlay)overlay.style.display='none';
  if(frame)frame.src='about:blank';
  document.body.style.overflow='';
}

/* Include v1 logic for tabs, search, etc. */
function applyView(view){
  var tabs=document.querySelectorAll('#nks-tabs .nks-tab');
  for(var i=0;i<tabs.length;i++){tabs[i].classList.toggle('active',tabs[i].getAttribute('data-view')===view);}
  var hero=document.querySelector('.nks-hero');
  var overview=document.getElementById('series');
  var epSecs=document.querySelectorAll("#nks-home section[id^='series-']");
  var home=document.getElementById('nks-home');
  if(home){home.classList.remove('nks-view-fade');void home.offsetWidth;home.classList.add('nks-view-fade');}
  var j,k;
  var fbSec=document.getElementById('nks-feedback');
  var srSec=document.getElementById('nks-search-results');
  if(fbSec)fbSec.style.display='none';
  if(srSec)srSec.style.display='none';
  if(view==='home'){
    if(hero)hero.style.display='';
    if(overview)overview.style.display='';
    for(j=0;j<epSecs.length;j++)epSecs[j].style.display='none';
    window.scrollTo(0,0);
  }else if(view==='feedback'){
    if(hero)hero.style.display='none';
    if(overview)overview.style.display='none';
    for(j=0;j<epSecs.length;j++)epSecs[j].style.display='none';
    if(!fbSec){fbSec=buildFeedback();home.appendChild(fbSec);}
    fbSec.style.display='';
    if(fbSec.scrollIntoView)fbSec.scrollIntoView();
  }else if(view==='search'){
    if(hero)hero.style.display='none';
    if(overview)overview.style.display='none';
    for(j=0;j<epSecs.length;j++)epSecs[j].style.display='none';
    if(srSec)srSec.style.display='';
  }else{
    if(hero)hero.style.display='none';
    if(overview)overview.style.display='none';
    for(k=0;k<epSecs.length;k++){
      var show=(epSecs[k].id==='series-'+view);
      epSecs[k].style.display=show?'':'none';
      if(show&&epSecs[k].scrollIntoView)epSecs[k].scrollIntoView();
    }
  }
}

function setupTabs(){
  if(document.getElementById('nks-tabs'))return;
  var cat=window.NKS_LOCAL_CATALOG;
  if(!cat)return;
  var series=cat.series||[];
  var bar=document.createElement('div');
  bar.id='nks-tabs';
  bar.className='nks-tabbar';
  var views=[{id:'home',title:'Home'}];
  series.forEach(function(s){views.push({id:s.id,title:s.title||s.id});});
  views.push({id:'feedback',title:'Feedback'});
  views.forEach(function(v,i){
    var b=document.createElement('button');
    b.type='button';
    b.className='nks-tab'+(i===0?' active':'');
    b.textContent=v.title;
    b.setAttribute('data-view',v.id);
    b.onclick=function(){applyView(v.id);};
    bar.appendChild(b);
  });
  var root=document.getElementById('nks-app-root');
  var home=document.getElementById('nks-home');
  if(root&&home)root.insertBefore(bar,home);
}

function buildFeedback(){
  var sec=document.createElement('section');
  sec.className='nks-section';
  sec.id='nks-feedback';
  sec.style.display='none';
  sec.innerHTML='<h2>Feedback</h2><p class="nks-sub">Got a request, found a bug, or just want to say hi?</p>'+
  '<form class="nks-feedback-form" action="https://formsubmit.co/nksaz2511@gmail.com" method="POST">'+
  '<input type="text" name="_honey" style="display:none" tabindex="-1" autocomplete="off"/>'+
  '<input type="hidden" name="_captcha" value="true"/>'+
  '<label>Your name<input type="text" name="name" required maxlength="60"/></label>'+
  '<label>Your email<input type="email" name="email" required maxlength="80"/></label>'+
  '<label>Message<textarea name="message" required rows="5" maxlength="2000"></textarea></label>'+
  '<button class="nks-xpbtn" type="submit">Send Feedback</button></form>';
  return sec;
}

function doSearch(q){
  q=(q||'').trim().toLowerCase();
  var home=document.getElementById('nks-home');
  if(!home)return;
  var old=document.getElementById('nks-search-results');
  if(old)old.parentNode.removeChild(old);
  if(!q){applyView('home');return;}
  var cat=window.NKS_LOCAL_CATALOG;
  var series=cat?(cat.series||[]):[];
  var hits=[];
  series.forEach(function(s){
    (s.episodes||[]).forEach(function(e){
      if((e.title||'').toLowerCase().indexOf(q)>=0||(e.id||'').toLowerCase().indexOf(q)>=0)hits.push(e);
    });
  });
  var sec=document.createElement('section');
  sec.className='nks-section';
  sec.id='nks-search-results';
  var html='<h2>Search results</h2><p class="nks-sub">'+hits.length+' episode'+(hits.length===1?'':'s')+'</p>';
  if(hits.length){
    html+='<div class="nks-grid">';
    hits.forEach(function(e){
      var poster=NKS_POSTERS[e.id]?'<img src="'+esc(NKS_POSTERS[e.id])+'" alt=""/>':'<div class="nks-no-poster">No preview</div>';
      html+='<a class="nks-card" href="#watch/'+esc(e.id)+'" data-ep="'+esc(e.id)+'"><div class="nks-poster">'+poster+'<div class="nks-play"></div></div><div class="nks-card-body"><h3>'+esc(e.title||'Untitled')+'</h3><div class="nks-card-meta">S'+esc(e.season)+' &#183; E'+esc(e.episode)+'</div></div></a>';
    });
    html+='</div>';
  }else{
    html+='<div class="nks-coming">No episodes found.</div>';
  }
  sec.innerHTML=html;
  home.appendChild(sec);
  applyView('search');
  if(sec.scrollIntoView)sec.scrollIntoView();
}

/* Init */
function init(){
  if(!window.NKS_LOCAL_CATALOG){
    /* Catalog not loaded yet, wait */
    setTimeout(init,500);
    return;
  }
  buildUI();
  buildEpisodes();
  setupTabs();
  /* Load live data (posters, servers) */
  fetch(JSON_URL).then(function(r){return r.json();}).then(function(d){
    NKS_POSTERS=d.posters||{};
    NKS_SERVERS=d.servers||{};
    var cats=d.categories||{};
    /* Apply posters */
    var imgs=document.querySelectorAll('img[data-epimg]');
    for(var i=0;i<imgs.length;i++){
      var eid=imgs[i].getAttribute('data-epimg');
      if(NKS_POSTERS[eid])imgs[i].src=NKS_POSTERS[eid];
    }
    /* Apply category badges */
    var series=window.NKS_LOCAL_CATALOG.series||[];
    series.forEach(function(s){
      var label=cats[s.id]||DEFAULT_CATS[s.id]||'';
      if(label){
        var sec=document.getElementById('series-'+s.id);
        if(sec){
          var h2=sec.querySelector('h2');
          if(h2&&!h2.querySelector('.nks-catbadge')){
            var badge=document.createElement('span');
            badge.className='nks-catbadge';
            badge.textContent=label;
            h2.appendChild(badge);
          }
        }
      }
    });
  }).catch(function(){});
  /* Event listeners */
  document.addEventListener('click',function(ev){
    var card=ev.target.closest?ev.target.closest('a.nks-card[data-ep]'):null;
    if(card){
      ev.preventDefault();
      var epId=card.getAttribute('data-ep');
      openPlayer(epId);
      return;
    }
    var sCard=ev.target.closest?ev.target.closest('a.nks-series-card'):null;
    if(sCard){
      var m=(sCard.getAttribute('href')||'').match(/#series-(.+)/);
      if(m){ev.preventDefault();applyView(m[1]);}
      return;
    }
    if(ev.target.id==='nks-player-close'||ev.target.id==='nks-player-overlay'){
      closePlayer();
    }
  });
  var sForm=document.getElementById('nks-search-form');
  if(sForm)sForm.addEventListener('submit',function(e){e.preventDefault();var inp=document.getElementById('nks-search');doSearch(inp?inp.value:'');});
  var sInp=document.getElementById('nks-search');
  if(sInp)sInp.addEventListener('input',function(){if(!sInp.value.trim())applyView('home');});
  var copyBtn=document.getElementById('nks-copy-link');
  if(copyBtn)copyBtn.onclick=function(){
    var hash=location.hash;
    var url=location.origin+location.pathname+hash;
    if(navigator.clipboard)navigator.clipboard.writeText(url);
  };
  /* Hash routing */
  function checkHash(){
    var m=location.hash.match(/^#watch\/([A-Za-z0-9_-]+)/);
    if(m)openPlayer(m[1]);
  }
  window.addEventListener('hashchange',checkHash);
  checkHash();
  applyView('home');
}

/* Anti-scrape */
document.addEventListener('contextmenu',function(e){
  var t=e.target;
  if(t&&t.closest&&(t.closest('#nks-player-overlay')||t.closest('.nks-hero-art'))){e.preventDefault();}
});

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
else init();
})();

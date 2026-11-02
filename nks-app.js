(function(){
  var JSON_URL='https://raw.githubusercontent.com/toofunnymates/nks-az-data/main/nks-az-live.json';
  var DEFAULT_CATS={'series-1':'Dubbed by Saurav Chakraborty','series-2':'Upcoming','series-3':'Upcoming'};
  function applyView(view){
    var tabs=document.querySelectorAll('#nks-tabs .nks-tab');
    for(var i=0;i<tabs.length;i++){tabs[i].classList.toggle('active',tabs[i].getAttribute('data-view')===view);}
    var hero=document.querySelector('.nks-hero');
    var overview=document.getElementById('series');
    var epSecs=document.querySelectorAll("#nks-home section[id^='series-']");
    var home=document.getElementById('nks-home');
    if(home){home.classList.remove('nks-view-fade');void home.offsetWidth;home.classList.add('nks-view-fade');}
    var j,k,c;
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
        if(show){
          var cards=epSecs[k].querySelectorAll('.nks-card');
          for(c=0;c<cards.length;c++){
            (function(card,idx){
              card.classList.remove('nks-enter');
              card.style.animationDelay=(Math.min(idx,24)*28)+'ms';
              void card.offsetWidth;
              card.classList.add('nks-enter');
            })(cards[c],c);
          }
          if(epSecs[k].scrollIntoView)epSecs[k].scrollIntoView();
        }
      }
    }
  }
  function setup(){
    if(document.getElementById('nks-tabs'))return;
    var home=document.getElementById('nks-home');
    var cat=window.NKS_LOCAL_CATALOG;
    if(!home||!cat)return;
    var series=cat.series||cat;
    if(!series||!series.length)return;
    var bar=document.createElement('div');
    bar.id='nks-tabs';
    bar.className='nks-tabbar';
    var views=[{id:'home',title:'Home'}];
    series.forEach(function(s){views.push({id:s.id,title:s.title||s.id});});views.push({id:'feedback',title:'Feedback'});
    views.forEach(function(v,i){
      var b=document.createElement('button');
      b.type='button';
      b.className='nks-tab'+(i===0?' active':'');
      b.textContent=v.title;
      b.setAttribute('data-view',v.id);
      b.onclick=function(){applyView(v.id);};
      bar.appendChild(b);
    });
    var marquee=document.querySelector('.nks-marquee');
    if(marquee&&marquee.parentNode)marquee.parentNode.insertBefore(bar,marquee.nextSibling);
    else home.parentNode.insertBefore(bar,home);
    document.addEventListener('click',function(ev){
      var a=ev.target.closest?ev.target.closest("a[href='#series']"):null;
      if(a){
        ev.preventDefault();
        applyView('home');
        setTimeout(function(){var s=document.getElementById('series');if(s&&s.scrollIntoView)s.scrollIntoView();},60);
        return;
      }
      var c2=ev.target.closest?ev.target.closest('a.nks-series-card'):null;
      if(c2){
        var m=(c2.getAttribute('href')||'').match(/#series-(.+)/);
        if(m){ev.preventDefault();applyView(m[1]);}
      }
    });
    var sForm=document.getElementById('nks-search-form');
    if(sForm){sForm.addEventListener('submit',function(e){e.preventDefault();var inp=document.getElementById('nks-search');doSearch(inp?inp.value:'');});}
    var sInp=document.getElementById('nks-search');
    if(sInp){sInp.addEventListener('input',function(){if(!sInp.value.trim()){var sr=document.getElementById('nks-search-results');if(sr)sr.parentNode.removeChild(sr);applyView('home');}});}
    fetch(JSON_URL).then(function(r){return r.json()}).then(function(d){
      var cats=d.categories||{};
      var posters=d.posters||{};NKS_POSTERS=posters;
      var sv=d.servers||{};
      for(var k in sv){if(window.NKS_SERVER_DATA&&window.NKS_SERVER_DATA.episodes)window.NKS_SERVER_DATA.episodes[k]=sv[k];}
      series.forEach(function(s){
        var label=cats[s.id]||DEFAULT_CATS[s.id]||'';
        if(label){
          var sec=document.getElementById('series-'+s.id);
          if(sec&&!sec.querySelector('.nks-catbadge')){
            var h2=sec.querySelector('h2');
            if(h2){
              var badge=document.createElement('span');
              badge.className='nks-catbadge';
              badge.textContent=label;
              h2.appendChild(badge);
            }
          }
        }
      });
      var imgs=document.querySelectorAll("#nks-home .nks-card[data-ep] img");
      for(var i=0;i<imgs.length;i++){
        var card=imgs[i].closest('.nks-card');
        var eid=card?card.getAttribute('data-ep'):null;
        if(eid&&posters[eid]&&imgs[i].getAttribute('src')!==posters[eid]){imgs[i].src=posters[eid];}
      }
    }).catch(function(){});
    applyView('home');
  }

  /* Anti-scrape: block right-click on player, deter casual downloading */
  document.addEventListener('contextmenu',function(e){
    var t=e.target;
    if(t&&t.closest&&(t.closest('#nks-player')||t.closest('.nks-player-overlay')||t.closest('#nks-embed-frame')||t.closest('.nks-hero-art'))){e.preventDefault();}
  });
  document.addEventListener('dragstart',function(e){
    var t=e.target;
    if(t&&t.closest&&(t.closest('#nks-player')||t.closest('.nks-player-overlay'))){e.preventDefault();}
  });

  var NKS_POSTERS={};
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function buildFeedback(){
    var sec=document.createElement('section');
    sec.className='nks-section';
    sec.id='nks-feedback';
    sec.innerHTML='<h2>Feedback</h2><p class="nks-sub">Got a request, found a bug, or just want to say hi? Drop a message below.</p>'+
    '<form class="nks-feedback-form" action="https://formsubmit.co/nksaz2511@gmail.com" method="POST">'+
    '<input type="text" name="_honey" style="display:none" tabindex="-1" autocomplete="off"/>'+
    '<input type="hidden" name="_captcha" value="true"/>'+
    '<input type="hidden" name="_template" value="table"/>'+
    '<input type="hidden" name="_subject" value="NKS AZ Feedback"/>'+
    '<label>Your name<input type="text" name="name" required="required" maxlength="60" placeholder="Your name"/></label>'+
    '<label>Your email<input type="email" name="email" required="required" maxlength="80" placeholder="you@example.com"/></label>'+
    '<label>Message<textarea name="message" required="required" rows="5" maxlength="2000" placeholder="What would you like to tell us?"></textarea></label>'+
    '<button class="nks-xpbtn" type="submit">Send Feedback</button></form>'+
    '<p class="nks-sub" style="margin-top:8px">We read every message. No spam, ever.</p>';
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
    var series=cat?(cat.series||cat):[];
    var hits=[];
    series.forEach(function(s){
      (s.episodes||[]).forEach(function(e){
        var title=(e.title||'').toLowerCase();
        if(title.indexOf(q)>=0||(e.id||'').toLowerCase().indexOf(q)>=0){hits.push(e);}
      });
    });
    var sec=document.createElement('section');
    sec.className='nks-section';
    sec.id='nks-search-results';
    var html='<h2>Search results</h2><p class="nks-sub">'+hits.length+' episode'+(hits.length===1?'':'s')+' for &ldquo;'+esc(q)+'&rdquo;</p>';
    if(hits.length){
      html+='<div class="nks-grid">';
      hits.forEach(function(e,i){
        var poster=NKS_POSTERS[e.id]?'<img src="'+esc(NKS_POSTERS[e.id])+'" alt=""/>':'<img src="'+esc(window.NKS_COMING_SOON||'')+'" alt="Coming soon"/>';
        html+='<a class="nks-card nks-enter" style="animation-delay:'+Math.min(i,24)*28+'ms" href="#watch" data-ep="'+esc(e.id)+'">'+
        '<div class="nks-poster">'+poster+'<div class="nks-play"></div></div>'+
        '<div class="nks-card-body"><h3>'+esc(e.title||'Untitled')+'</h3>'+
        '<div class="nks-card-meta">S'+esc(e.season)+' &#183; E'+esc(e.episode)+'</div></div></a>';
      });
      html+='</div>';
    }else{
      html+='<div class="nks-coming">No episodes found. Try another search.</div>';
    }
    sec.innerHTML=html;
    home.appendChild(sec);
    // stash posters for results
    applyView('search');
    if(sec.scrollIntoView)sec.scrollIntoView();
  }
  var tries=0;
  var iv=setInterval(function(){
    tries++;
    if(document.querySelector("#nks-home section[id^='series-']")||tries>60){clearInterval(iv);setup();}
  },500);
})();

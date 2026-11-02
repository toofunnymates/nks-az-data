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
    if(view==='home'){
      if(hero)hero.style.display='';
      if(overview)overview.style.display='';
      for(j=0;j<epSecs.length;j++)epSecs[j].style.display='none';
      window.scrollTo(0,0);
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
    series.forEach(function(s){views.push({id:s.id,title:s.title||s.id});});
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
    fetch(JSON_URL).then(function(r){return r.json()}).then(function(d){
      var cats=d.categories||{};
      var posters=d.posters||{};
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
  var tries=0;
  var iv=setInterval(function(){
    tries++;
    if(document.querySelector("#nks-home section[id^='series-']")||tries>60){clearInterval(iv);setup();}
  },500);
})();

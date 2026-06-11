(function(){
  'use strict';

  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => Array.from(root.querySelectorAll(s));
  const pad = n => String(n).padStart(2,'0');
  const todayKey = (d=new Date()) => d.toISOString().slice(0,10);
  const fmtDate = d => new Intl.DateTimeFormat('id-ID',{weekday:'long',day:'2-digit',month:'long',year:'numeric'}).format(d);
  const escapeHtml = str => String(str ?? '').replace(/[&<>'"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[m]));
  const clone = obj => JSON.parse(JSON.stringify(obj));

  const CATEGORIES = [
    'Lagu Belajar','Deep Fokus','Galau','Breakbeat','Pop Indonesia','Bahasa Inggris','Lagu Timur','Lagu Santai','Moodbooster'
  ];

  const PLAYLISTS = [
    {cat:'Lagu Belajar', title:'Intense Studying', desc:'Belajar intens, fokus stabil.', url:'https://open.spotify.com/playlist/37i9dQZF1DX8NTLI2TtZa6'},
    {cat:'Lagu Belajar', title:'Instrumental Study', desc:'Instrumental bersih tanpa distraksi.', url:'https://open.spotify.com/playlist/37i9dQZF1DX9sIqqvKsjG8'},
    {cat:'Lagu Belajar', title:'Study Music No Lyrics', desc:'Musik belajar tanpa vokal.', url:'https://open.spotify.com/playlist/37i9dQZF1DWVceT0UosQME'},
    {cat:'Lagu Belajar', title:'Peaceful Piano', desc:'Piano ringan untuk membaca.', url:'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO'},
    {cat:'Lagu Belajar', title:'Coding Mode', desc:'Cocok untuk coding dan mengetik.', url:'https://open.spotify.com/playlist/37i9dQZF1DX5trt9i14X7j'},
    {cat:'Lagu Belajar', title:'Deep Focus Study Playlist', desc:'Fokus panjang untuk tugas berat.', url:'https://open.spotify.com/playlist/0oPyDVNdgcPFAWmOYSK7O1'},
    {cat:'Lagu Belajar', title:'Writing Study Flow', desc:'Untuk menulis laporan dan skripsi.', url:'https://open.spotify.com/playlist/1u6qp2VMeFGH57UEuTGmL8'},
    {cat:'Lagu Belajar', title:'Coding Music Programming', desc:'Beat rapi untuk kerja teknis.', url:'https://open.spotify.com/playlist/679wCT6dVMDBxrYa5NcrXL'},
    {cat:'Lagu Belajar', title:'No Lyrics Study', desc:'Ruang fokus tanpa lirik.', url:'https://open.spotify.com/playlist/7suCo6IOn5PqS0sFrJaNEN'},
    {cat:'Lagu Belajar', title:'Exam Preparation', desc:'Mode belajar ujian.', url:'https://open.spotify.com/playlist/2Bf8tYzWXVyU3BcMIgJC7l'},

    {cat:'Deep Fokus', title:'Deep Focus', desc:'Playlist fokus Spotify.', url:'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ'},
    {cat:'Deep Fokus', title:'Focus Music 2026', desc:'Instrumental untuk kerja dan belajar.', url:'https://open.spotify.com/playlist/4b1cXJ3znhQIbsVzzrWfpO'},
    {cat:'Deep Fokus', title:'Deep Focus Music', desc:'Fokus tenang dan konsisten.', url:'https://open.spotify.com/playlist/14KtkIpsvzDSCXR24EqHCL'},
    {cat:'Deep Fokus', title:'Deep Focus Soundscapes', desc:'Soundscape minim distraksi.', url:'https://open.spotify.com/playlist/19btKKOB255dgQsBhN4knw'},
    {cat:'Deep Fokus', title:'Concentration Music', desc:'Untuk konsentrasi panjang.', url:'https://open.spotify.com/playlist/5H6Y64mwyp1cUYBDOeid3u'},
    {cat:'Deep Fokus', title:'Epidemic Deep Focus', desc:'Fokus modern dan sinematik.', url:'https://open.spotify.com/playlist/7LPVRPUHubQaRhz43GAxKi'},
    {cat:'Deep Fokus', title:'Music for the Brain', desc:'Fokus mental dan flow.', url:'https://open.spotify.com/playlist/4orfDu3Dx1mOPjZSfEQ63I'},
    {cat:'Deep Fokus', title:'Deep Concentration', desc:'Konsentrasi dalam.', url:'https://open.spotify.com/playlist/6EPDI83EcCmTNtydnxenK6'},
    {cat:'Deep Fokus', title:'Deep Focus Study Radio', desc:'Radio fokus otomatis.', url:'https://open.spotify.com/playlist/37i9dQZF1E4v5ZZkTHBSyQ'},
    {cat:'Deep Fokus', title:'Classical Focus', desc:'Klasik dan cinematic study.', url:'https://open.spotify.com/playlist/2WHaYDKe9C58cYamOB15RQ'},

    {cat:'Galau', title:'Generasi Galau', desc:'Mood mellow Indonesia.', url:'https://open.spotify.com/playlist/37i9dQZF1DX9U5XaCM7ssr'},
    {cat:'Galau', title:'Lagu Galau Terbaik 2026', desc:'Lagu galau populer.', url:'https://open.spotify.com/playlist/3Uo6wcwipB5JtMBtDk1msK'},
    {cat:'Galau', title:'Lagu Galau Indonesia 2026', desc:'Galau lokal terbaru.', url:'https://open.spotify.com/playlist/2fDdxVb25X7eaCbfkONQOW'},
    {cat:'Galau', title:'Super Galau Indonesia', desc:'Sedih, tenang, dan mellow.', url:'https://open.spotify.com/playlist/0R1qvF1b1RhHSqLedFQnuV'},
    {cat:'Galau', title:'Galau Viral Bikin Nangis', desc:'Lagu viral suasana sedih.', url:'https://open.spotify.com/playlist/4YHrz6eFQUaJhrjYUCgVlA'},
    {cat:'Galau', title:'Waktu Indonesia Bagian Galau', desc:'Malam, rindu, dan cerita lama.', url:'https://open.spotify.com/playlist/7BjPn4roe985wP9TR5pXJF'},
    {cat:'Galau', title:'Sad TikTok Songs', desc:'Galau Indonesia dan Inggris.', url:'https://open.spotify.com/playlist/4wRWjtfOGukZ6p7y7t8Owy'},
    {cat:'Galau', title:'Kumpulan Lagu Galau 2026', desc:'Kumpulan galau terbaru.', url:'https://open.spotify.com/playlist/2dBBxWafBaWKkVUsGMWvxO'},
    {cat:'Galau', title:'Galau Viral TikTok', desc:'Mood patah hati viral.', url:'https://open.spotify.com/playlist/4gTYmUZAWAPK4g0KhQlBjk'},
    {cat:'Galau', title:'Galau Trending Hits', desc:'Hits galau Indonesia.', url:'https://open.spotify.com/playlist/6ch6YCsljDwsYGkOAWjRqP'},

    {cat:'Breakbeat', title:'DJ Breakbeat Mix', desc:'Mix breakbeat energik.', url:'https://open.spotify.com/playlist/37i9dQZF1EIYX1X6aNuxwU'},
    {cat:'Breakbeat', title:'DJ Breakbeat Indo', desc:'Breakbeat Indonesia.', url:'https://open.spotify.com/playlist/6nldbW4Ruy2BWBUpMSzsWz'},
    {cat:'Breakbeat', title:'The Sound of Breakbeat', desc:'Rasa breakbeat klasik-modern.', url:'https://open.spotify.com/playlist/1yckyfEZtFkkq7UPXHbLwi'},
    {cat:'Breakbeat', title:'Breakbeat Indo', desc:'Breakbeat lokal pilihan.', url:'https://open.spotify.com/playlist/5naoJxxaCCKbgRIpDzTf8c'},
    {cat:'Breakbeat', title:'DJ Breakbeat TikTok 2026', desc:'Remix viral.', url:'https://open.spotify.com/playlist/6a6CloXnQRkQq7o74eYzEp'},
    {cat:'Breakbeat', title:'Breakbeat Drum Remix', desc:'Bass dan beat lebih kuat.', url:'https://open.spotify.com/playlist/4PowZ9NGkT8D2M19S9COdV'},
    {cat:'Breakbeat', title:'JJ Tembak Langit', desc:'Breakbeat jedag-jedug.', url:'https://open.spotify.com/playlist/6VOPpeYy9CmZFcavKMjRXy'},
    {cat:'Breakbeat', title:'Top Breakbeat Music 2026', desc:'Breakbeat mix terbaru.', url:'https://open.spotify.com/playlist/20uh1OuhTFGt83OGEaxuJ6'},
    {cat:'Breakbeat', title:'Breakbeat Indonesia Radio', desc:'Radio breakbeat Indonesia.', url:'https://open.spotify.com/playlist/37i9dQZF1E4xVD2YfjPMKQ'},
    {cat:'Breakbeat', title:'DJ Dugem Breakbeat', desc:'Energi malam dan full bass.', url:'https://open.spotify.com/playlist/360V6eWvY54zMaNmV9k6t0'},

    {cat:'Pop Indonesia', title:'Top 50 Indonesia', desc:'Chart Indonesia Spotify.', url:'https://open.spotify.com/playlist/37i9dQZEVXbObFQZ3JLcXt'},
    {cat:'Pop Indonesia', title:'Hot Hits Indonesia', desc:'Hits populer Indonesia.', url:'https://open.spotify.com/playlist/37i9dQZF1DXa2EiKmMLhFD'},
    {cat:'Pop Indonesia', title:'Pop Rising Indonesia', desc:'Pop baru yang naik.', url:'https://open.spotify.com/playlist/37i9dQZF1DX6yQB7bkflag'},
    {cat:'Pop Indonesia', title:'Pop Kreatif', desc:'Pop Indonesia alternatif.', url:'https://open.spotify.com/playlist/37i9dQZF1DWVjaT6aAk59Z'},
    {cat:'Pop Indonesia', title:'Pop Indonesia 2000-2026', desc:'Pop Indonesia lintas era.', url:'https://open.spotify.com/playlist/1Fq1x4lGl74M6g7PChk37h'},
    {cat:'Pop Indonesia', title:'Top 50 Indonesia Playlist', desc:'Kumpulan chart lokal.', url:'https://open.spotify.com/playlist/1OiiFyV4pJ7Pl5yhB4OHLO'},
    {cat:'Pop Indonesia', title:'Hot Viral Hits Indonesia', desc:'Lagu lokal viral.', url:'https://open.spotify.com/playlist/7oTS20odYTqpCDR3fEBtOC'},
    {cat:'Pop Indonesia', title:'Pop Viral Hits 2026', desc:'Pop viral masa kini.', url:'https://open.spotify.com/playlist/3hy5HvmSB8DNSOXx3NafSm'},
    {cat:'Pop Indonesia', title:'Top 50 Indonesia Clean', desc:'Chart versi clean.', url:'https://open.spotify.com/playlist/5rOOcyfzFZFqHNh7TMn0nK'},
    {cat:'Pop Indonesia', title:'Indonesia Top 50', desc:'Lagu Indonesia populer.', url:'https://open.spotify.com/playlist/4WktjzbRHDAkpUX8scssar'},

    {cat:'Bahasa Inggris', title:"Today's Top Hits", desc:'Hits global utama.', url:'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M'},
    {cat:'Bahasa Inggris', title:'Top 50 Global', desc:'Chart global Spotify.', url:'https://open.spotify.com/playlist/37i9dQZEVXbMDoHDwVN2tF'},
    {cat:'Bahasa Inggris', title:'Viral 50 Global', desc:'Viral global terbaru.', url:'https://open.spotify.com/playlist/37i9dQZEVXbLiRSasKsNU9'},
    {cat:'Bahasa Inggris', title:'Pop Rising', desc:'Pop global yang sedang naik.', url:'https://open.spotify.com/playlist/37i9dQZF1DWUa8ZRTfalHk'},
    {cat:'Bahasa Inggris', title:'Hot Hits USA', desc:'Hits Amerika.', url:'https://open.spotify.com/playlist/37i9dQZF1DX0kbJZpiYdZl'},
    {cat:'Bahasa Inggris', title:'Hot Hits UK', desc:'Hits Inggris.', url:'https://open.spotify.com/playlist/37i9dQZF1DWY4lFlS4Pnso'},
    {cat:'Bahasa Inggris', title:'The Best English Song', desc:'Kumpulan lagu Inggris.', url:'https://open.spotify.com/playlist/716rg48FuucgfTlJxrcgly'},
    {cat:'Bahasa Inggris', title:'English Pop Hits', desc:'Pop Inggris pilihan.', url:'https://open.spotify.com/playlist/7kUtBokK94otxfbdWhmd5M'},
    {cat:'Bahasa Inggris', title:'Fav English Pop Hits', desc:'Pop Inggris favorit.', url:'https://open.spotify.com/playlist/7BsL0M2kGaB86CR8qNuNiH'},
    {cat:'Bahasa Inggris', title:'English Pop 90s-00s', desc:'Pop Inggris nostalgia.', url:'https://open.spotify.com/playlist/7AePGhGeOYm24mPkv1zARQ'},

    {cat:'Lagu Timur', title:'The Sound of Lagu Timur', desc:'Identitas lagu Timur.', url:'https://open.spotify.com/playlist/0S6mwmMZjJwmPm6Mtt20Oa'},
    {cat:'Lagu Timur', title:'Lagu Timur Viral 2026', desc:'Timur terpopuler viral.', url:'https://open.spotify.com/playlist/1J140YOVUECeJUAKNhdzuZ'},
    {cat:'Lagu Timur', title:'Lagu Timur 2025', desc:'Kumpulan Timur modern.', url:'https://open.spotify.com/playlist/50ilr1fSlnq0qSpnw4FXtB'},
    {cat:'Lagu Timur', title:'Lagu Timur Sessions', desc:'Sesi lagu Timur.', url:'https://open.spotify.com/playlist/6MSYfNMH5Z3istxSG1DKmx'},
    {cat:'Lagu Timur', title:'Lagu Timur Hits', desc:'Hits Timur pilihan.', url:'https://open.spotify.com/playlist/7freNdpfNYaoE7ZXyivTWl'},
    {cat:'Lagu Timur', title:'Timur FYP TikTok Viral', desc:'Lagu Timur viral TikTok.', url:'https://open.spotify.com/playlist/0cdCr2npJYB2LWbc4lmyP1'},
    {cat:'Lagu Timur', title:'Lagu Timur Terbaik 2026', desc:'Timur terbaik terbaru.', url:'https://open.spotify.com/playlist/6p6Pl5wXqb46YX4GNkU0eI'},
    {cat:'Lagu Timur', title:'Playlist Lagu Timur', desc:'Kumpulan lagu Timur.', url:'https://open.spotify.com/playlist/3sCg892pwis8Z84Q8vCx2v'},
    {cat:'Lagu Timur', title:'Galau Timur', desc:'Galau dari Timur.', url:'https://open.spotify.com/playlist/54xOF93ctwN0x8TLhFJCgb'},
    {cat:'Lagu Timur', title:'Timur TikTok Viral', desc:'Lagu Timur viral.', url:'https://open.spotify.com/playlist/2NaNBtkA73oniEwOAYTExH'},

    {cat:'Lagu Santai', title:'Chill Hits', desc:'Santai modern.', url:'https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6'},
    {cat:'Lagu Santai', title:'Barat Pengantar Tidur', desc:'Lagu santai sebelum tidur.', url:'https://open.spotify.com/playlist/5wSBFp5we0nqorbGqZASqK'},
    {cat:'Lagu Santai', title:'Lagu Inggris Mood Santai', desc:'Bahasa Inggris santai.', url:'https://open.spotify.com/playlist/3F3zZn4oOrFwYYLM4cnq6w'},
    {cat:'Lagu Santai', title:'Dinner Party Songs', desc:'Santai untuk suasana ringan.', url:'https://open.spotify.com/playlist/6LGnwSuh7EPEGKabAfRMT3'},
    {cat:'Lagu Santai', title:'Chill House 2026', desc:'House ringan dan rileks.', url:'https://open.spotify.com/playlist/7wDZ5nB0Wb1tcoloILplN8'},
    {cat:'Lagu Santai', title:'Summer Vibes Chill Hits', desc:'Santai cerah dan ringan.', url:'https://open.spotify.com/playlist/2hmLDliFT9mW84XHxRUzwx'},
    {cat:'Lagu Santai', title:'Chill Hits 2026', desc:'Chill terbaru.', url:'https://open.spotify.com/playlist/2yrMAJe8pqWk3n7l4VYLMk'},
    {cat:'Lagu Santai', title:'Chill Playlist', desc:'Playlist santai harian.', url:'https://open.spotify.com/playlist/42eLtt8RUBboyXLmNQWU5a'},
    {cat:'Lagu Santai', title:'Chillout Lounge', desc:'Lounge santai.', url:'https://open.spotify.com/playlist/7B1iATgEWan3ecVG0aUIXy'},
    {cat:'Lagu Santai', title:'Beach Chill Hits', desc:'Santai rasa pantai.', url:'https://open.spotify.com/playlist/0g1wcdtSjBOcMAt8mZzPbK'},

    {cat:'Moodbooster', title:'Mood Booster', desc:'Energi positif.', url:'https://open.spotify.com/playlist/37i9dQZF1DX3rxVfibe1L0'},
    {cat:'Moodbooster', title:'Good Vibes', desc:'Vibes baik untuk hari ini.', url:'https://open.spotify.com/playlist/37i9dQZF1DWYBO1MoTDhZI'},
    {cat:'Moodbooster', title:'Happy Hits', desc:'Lagu ceria dan ringan.', url:'https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC'},
    {cat:'Moodbooster', title:'Good Vibes Summer Hits', desc:'Mood cerah dan fresh.', url:'https://open.spotify.com/playlist/5IgMN3bZH4eHR8n2jZoCHr'},
    {cat:'Moodbooster', title:'Feel Good Happy Hits', desc:'Lagu yang bikin lebih ringan.', url:'https://open.spotify.com/playlist/1h90L3LP8kAJ7KGjCV2Xfd'},
    {cat:'Moodbooster', title:'Good Vibes Happy Mood', desc:'Mood bahagia.', url:'https://open.spotify.com/playlist/7jgspZkQqGrrfd2Q7lP3BR'},
    {cat:'Moodbooster', title:'Happy Hits 2026', desc:'Lagu happy terbaru.', url:'https://open.spotify.com/playlist/2tUhGmB8Vn6Fe8zRdvGBpE'},
    {cat:'Moodbooster', title:'Feel Good Mix', desc:'Campuran lagu positif.', url:'https://open.spotify.com/playlist/4xsyxTXCv4Lvx48rp5ink2'},
    {cat:'Moodbooster', title:'Feeling Good Vibes', desc:'Vibes positif sepanjang hari.', url:'https://open.spotify.com/playlist/6NyANZ6bIdvrrEtNFeA3SD'},
    {cat:'Moodbooster', title:'Happy Songs Happy Hits', desc:'Happy hits pilihan.', url:'https://open.spotify.com/playlist/7d7ulZK4Ivadu6zih6AgLQ'},
  ].map((p,i)=>({...p,id:`pl-${i+1}`}));

  const DEFAULT_STATE = {
    theme:'dark', view:'dashboard',
    timer:{mode:'focus', running:false, remaining:1500, durations:{focus:25,short:5,long:15}, sound:true},
    goal:6,
    tasks:[
      {id:'t1',title:'Belajar 1 bab materi',priority:'high',target:2,done:false,completedPomodoro:0,createdAt:Date.now()-864000},
      {id:'t2',title:'Rapikan catatan tugas',priority:'medium',target:1,done:false,completedPomodoro:0,createdAt:Date.now()-360000},
      {id:'t3',title:'Review playlist fokus',priority:'low',target:1,done:true,completedPomodoro:1,createdAt:Date.now()-120000}
    ],
    activeTaskId:'t1', taskFilter:'all', notes:[], sessions:[], selectedPlaylistId:'', selectedUrl:'', selectedTitle:'', selectedDesc:'', selectedCat:'', playlistFilter:'Semua', playlistSearch:''
  };

  let state = loadState();
  let interval = null;
  let toastTimer = null;

  function loadState(){
    try{
      const raw = localStorage.getItem('awanspace.clean.v1');
      if(!raw) return clone(DEFAULT_STATE);
      const parsed = JSON.parse(raw);
      return merge(DEFAULT_STATE, parsed);
    }catch{
      return clone(DEFAULT_STATE);
    }
  }
  function merge(base, data){
    const out = clone(base);
    for(const [k,v] of Object.entries(data||{})){
      if(v && typeof v === 'object' && !Array.isArray(v) && out[k] && typeof out[k]==='object' && !Array.isArray(out[k])) out[k]=merge(out[k],v);
      else out[k]=v;
    }
    return out;
  }
  function save(){localStorage.setItem('awanspace.clean.v1', JSON.stringify(state));}
  function toast(msg){
    const el=$('#toast'); if(!el) return;
    el.textContent=msg; el.classList.add('show');
    clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove('show'),2200);
  }
  function setTheme(theme){
    state.theme=theme; document.documentElement.dataset.theme=theme; save();
    $('#themeToggle').textContent = theme === 'dark' ? 'Switch ke light' : 'Switch ke dark';
  }
  function showView(name){
    state.view = name;
    $$('.view').forEach(v=>v.classList.toggle('active', v.id === `view-${name}`));
    $$('[data-view-link]').forEach(b=>b.classList.toggle('active', b.dataset.viewLink === name));
    const view = $(`#view-${name}`);
    $('#pageTitle').textContent = view?.dataset.title || 'Dashboard';
    save();
    $('#workspace')?.scrollTo({top:0,behavior:'smooth'});
  }

  function spotifyEmbed(raw){
    try{
      const clean = String(raw||'').trim();
      const url = new URL(clean);
      if(!url.hostname.includes('spotify.com')) return '';
      const parts = url.pathname.replace(/^\/intl-[a-z]{2}\//i,'/').split('/').filter(Boolean);
      const allowed = new Set(['playlist','track','album','artist','show','episode']);
      const typeIndex = parts.findIndex(x=>allowed.has(x));
      if(typeIndex < 0 || !parts[typeIndex+1]) return '';
      const type = parts[typeIndex];
      const id = parts[typeIndex+1].replace(/[^a-zA-Z0-9]/g,'');
      return id ? `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0` : '';
    }catch{return '';}
  }
  function selectPlaylist(p){
    state.selectedPlaylistId = p.id || '';
    state.selectedUrl = p.url || '';
    state.selectedTitle = p.title || 'Spotify';
    state.selectedDesc = p.desc || 'Playlist Spotify';
    state.selectedCat = p.cat || 'Custom';
    save();
    renderPlayer(); renderPlaylistGrid(); renderDashboard();
    toast(`${state.selectedTitle} dipilih`);
  }
  function setCustomSpotify(url){
    const embed = spotifyEmbed(url);
    if(!embed){toast('Link Spotify tidak valid'); return;}
    selectPlaylist({id:'custom',title:'Spotify Custom',desc:'Link yang kamu tempel.',cat:'Custom',url});
  }
  function openSpotify(){
    if(!state.selectedUrl){toast('Pilih playlist dulu'); return;}
    window.open(state.selectedUrl,'_blank','noopener,noreferrer');
  }
  async function copySpotify(){
    if(!state.selectedUrl){toast('Belum ada link'); return;}
    try{await navigator.clipboard.writeText(state.selectedUrl); toast('Link disalin');}
    catch{
      const input = document.createElement('input'); input.value = state.selectedUrl; document.body.appendChild(input); input.select(); document.execCommand('copy'); input.remove(); toast('Link disalin');
    }
  }

  function getTodaySessions(){return state.sessions.filter(s=>s.date===todayKey()).length;}
  function daysAgo(n){const d=new Date();d.setDate(d.getDate()-n);return todayKey(d);}
  function updateTimerText(){
    const m = Math.floor(state.timer.remaining/60); const s = state.timer.remaining % 60;
    const text = `${pad(m)}:${pad(s)}`;
    ['#timerText','#dashTimerText','#sideTimer'].forEach(sel=>{const el=$(sel); if(el) el.textContent=text;});
    const total = Math.max(1, state.timer.durations[state.timer.mode]*60);
    const done = Math.max(0, Math.min(100, 100 - (state.timer.remaining/total*100)));
    $('#timerRing')?.style.setProperty('--progress',`${done}%`);
    $('#timerStatus').textContent = state.timer.running ? 'Sedang berjalan' : 'Siap mulai';
    $('#sideMode').textContent = state.timer.mode === 'focus' ? 'Focus mode' : state.timer.mode === 'short' ? 'Short break' : 'Long break';
    const label = state.timer.running ? 'Pause' : 'Start';
    ['#startPauseBtn','#dashStartPauseBtn'].forEach(sel=>{const el=$(sel); if(el) el.textContent=label;});
    document.title = `${text} — Awan Space`;
  }
  function setMode(mode){
    state.timer.mode=mode; state.timer.running=false; state.timer.remaining=state.timer.durations[mode]*60; save(); renderTimer(); stopLoop();
  }
  function startTimer(){state.timer.running=true; save(); startLoop(); renderTimer();}
  function pauseTimer(){state.timer.running=false; save(); stopLoop(); renderTimer();}
  function toggleTimer(){state.timer.running ? pauseTimer() : startTimer();}
  function resetTimer(){state.timer.running=false; state.timer.remaining=state.timer.durations[state.timer.mode]*60; save(); stopLoop(); renderTimer();}
  function completeRound(){
    if(state.timer.mode==='focus'){
      state.sessions.push({id:`s${Date.now()}`,date:todayKey(),time:new Date().toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'}),taskId:state.activeTaskId||'',playlistId:state.selectedPlaylistId||'',createdAt:Date.now()});
      const t=state.tasks.find(x=>x.id===state.activeTaskId); if(t){t.completedPomodoro=(t.completedPomodoro||0)+1; if(t.completedPomodoro>=t.target)t.done=true;}
      playBeep(); toast('Sesi fokus selesai');
    }
    const next = state.timer.mode === 'focus' ? 'short' : 'focus';
    state.timer.mode=next; state.timer.running=false; state.timer.remaining=state.timer.durations[next]*60; save(); stopLoop(); renderAll();
  }
  function startLoop(){
    if(interval) return;
    interval=setInterval(()=>{
      if(!state.timer.running) return;
      state.timer.remaining -= 1;
      if(state.timer.remaining <= 0){ completeRound(); }
      else { save(); updateTimerText(); }
    },1000);
  }
  function stopLoop(){ if(interval){clearInterval(interval); interval=null;} }
  function playBeep(){
    if(!state.timer.sound) return;
    try{
      const ctx=new (window.AudioContext||window.webkitAudioContext)();
      const osc=ctx.createOscillator(); const gain=ctx.createGain();
      osc.frequency.value=680; gain.gain.value=.05; osc.connect(gain); gain.connect(ctx.destination); osc.start();
      setTimeout(()=>{osc.stop();ctx.close();},180);
    }catch{}
  }

  function renderDashboard(){
    $('#todayLabel').textContent = fmtDate(new Date());
    $('#statTodaySessions').textContent = getTodaySessions();
    $('#statDoneTasks').textContent = state.tasks.filter(t=>t.done).length;
    $('#statTotalTasks').textContent = state.tasks.length;
    $('#statPlaylistCount').textContent = PLAYLISTS.length;
    $('#statNoteCount').textContent = state.notes.length;
    $('#heroPlaylistName').textContent = state.selectedTitle || 'Pilih playlist untuk mulai.';
    const list=$('#dashboardTasks');
    if(list){
      const active=state.tasks.filter(t=>!t.done).slice(0,4);
      list.innerHTML = active.length ? active.map(t=>`<li><div><b>${escapeHtml(t.title)}</b><small>${t.completedPomodoro||0}/${t.target} Pomodoro • <span class="priority-${t.priority}">${priorityText(t.priority)}</span></small></div><button class="button small ghost" data-set-task="${t.id}">Pilih</button></li>`).join('') : '<li><div><b>Tidak ada tugas aktif</b><small>Tambahkan tugas baru.</small></div></li>';
      $$('[data-set-task]',list).forEach(btn=>btn.onclick=()=>{state.activeTaskId=btn.dataset.setTask;save();renderAll();toast('Tugas aktif diganti');});
    }
    const quick=$('#quickPlaylists');
    if(quick){
      const picks=[PLAYLISTS[0],PLAYLISTS[10],PLAYLISTS[20],PLAYLISTS[50]];
      quick.innerHTML=picks.map(p=>`<button class="quick-playlist" data-play-id="${p.id}"><b>${escapeHtml(p.title)}<small>${escapeHtml(p.cat)}</small></b><span>▶</span></button>`).join('');
      $$('[data-play-id]',quick).forEach(btn=>btn.onclick=()=>selectPlaylist(PLAYLISTS.find(p=>p.id===btn.dataset.playId)));
    }
  }
  function renderTimer(){
    $$('#modeTabs button').forEach(b=>b.classList.toggle('active',b.dataset.mode===state.timer.mode));
    $('#focusMinutes').value = state.timer.durations.focus;
    $('#shortMinutes').value = state.timer.durations.short;
    $('#longMinutes').value = state.timer.durations.long;
    $('#soundToggle').textContent = state.timer.sound ? 'Suara aktif' : 'Suara mati';
    $('#goalInput').value = state.goal;
    $('#goalTarget').textContent = state.goal;
    $('#goalDone').textContent = getTodaySessions();
    $('#goalProgress').style.width = `${Math.min(100,getTodaySessions()/Math.max(1,state.goal)*100)}%`;
    const sel=$('#activeTaskSelect');
    if(sel){
      const opts = state.tasks.filter(t=>!t.done);
      sel.innerHTML = '<option value="">Tanpa tugas aktif</option>' + opts.map(t=>`<option value="${t.id}">${escapeHtml(t.title)}</option>`).join('');
      sel.value = state.activeTaskId || '';
    }
    updateTimerText();
  }
  function priorityText(p){return p==='high'?'Tinggi':p==='medium'?'Sedang':'Rendah';}
  function renderTasks(){
    const list=$('#taskList'); if(!list) return;
    let items=[...state.tasks].sort((a,b)=>(a.done-b.done)||((b.createdAt||0)-(a.createdAt||0)));
    if(state.taskFilter==='active') items=items.filter(t=>!t.done);
    if(state.taskFilter==='done') items=items.filter(t=>t.done);
    if(state.taskFilter==='high') items=items.filter(t=>t.priority==='high' && !t.done);
    $$('.chip[data-task-filter]').forEach(c=>c.classList.toggle('active',c.dataset.taskFilter===state.taskFilter));
    list.innerHTML = items.length ? items.map(t=>`
      <li class="task-item ${t.done?'done':''}">
        <button class="task-check" data-task-done="${t.id}" aria-label="Tandai selesai">${t.done?'✓':''}</button>
        <div>
          <div class="task-title">${escapeHtml(t.title)}</div>
          <div class="task-meta"><span class="priority-${t.priority}">${priorityText(t.priority)}</span> • ${t.completedPomodoro||0}/${t.target} Pomodoro ${state.activeTaskId===t.id?'• Aktif':''}</div>
        </div>
        <div class="task-actions">
          <button data-task-active="${t.id}">Aktif</button>
          <button data-task-delete="${t.id}">Hapus</button>
        </div>
      </li>`).join('') : '<li class="task-item"><div></div><div><b>Belum ada tugas</b><div class="task-meta">Tambahkan tugas baru di atas.</div></div><div></div></li>';
    $$('[data-task-done]',list).forEach(b=>b.onclick=()=>{const t=state.tasks.find(x=>x.id===b.dataset.taskDone); if(t)t.done=!t.done; save(); renderAll();});
    $$('[data-task-active]',list).forEach(b=>b.onclick=()=>{state.activeTaskId=b.dataset.taskActive; save(); renderAll(); toast('Tugas aktif dipilih');});
    $$('[data-task-delete]',list).forEach(b=>b.onclick=()=>{state.tasks=state.tasks.filter(t=>t.id!==b.dataset.taskDelete); if(state.activeTaskId===b.dataset.taskDelete)state.activeTaskId=''; save(); renderAll();});
  }
  function renderCategories(){
    const select=$('#playlistFilter');
    if(select){
      const value=state.playlistFilter||'Semua';
      select.innerHTML = ['Semua',...CATEGORIES].map(c=>`<option value="${c}">${c}</option>`).join(''); select.value=value;
    }
    const strip=$('#categoryStrip'); if(!strip) return;
    strip.innerHTML = ['Semua',...CATEGORIES].map(c=>`<button class="chip ${state.playlistFilter===c?'active':''}" data-cat="${c}">${c}</button>`).join('');
    $$('[data-cat]',strip).forEach(b=>b.onclick=()=>{state.playlistFilter=b.dataset.cat; save(); renderPlaylistGrid(); renderCategories();});
  }
  function filteredPlaylists(){
    const q=(state.playlistSearch||'').trim().toLowerCase();
    let items=PLAYLISTS;
    if(state.playlistFilter && state.playlistFilter!=='Semua') items=items.filter(p=>p.cat===state.playlistFilter);
    if(q) items=items.filter(p=>[p.title,p.cat,p.desc,p.url].join(' ').toLowerCase().includes(q));
    return items;
  }
  function renderPlaylistGrid(){
    const grid=$('#playlistGrid'); if(!grid) return;
    const items=filteredPlaylists();
    grid.innerHTML = items.length ? items.map((p,idx)=>`
      <button class="playlist-card ${state.selectedPlaylistId===p.id?'active':''}" data-play-id="${p.id}">
        <div class="cover" style="background:${coverGradient(p.cat,idx)}"><small>${escapeHtml(p.cat)}</small><span>▶</span></div>
        <h4>${escapeHtml(p.title)}</h4>
        <p>${escapeHtml(p.desc)}</p>
      </button>`).join('') : '<div class="empty-player">Playlist tidak ditemukan.</div>';
    $$('[data-play-id]',grid).forEach(btn=>btn.onclick=()=>selectPlaylist(PLAYLISTS.find(p=>p.id===btn.dataset.playId)));
  }
  function coverGradient(cat,idx){
    const map={
      'Lagu Belajar':['#193f2b','#1ed760'], 'Deep Fokus':['#10221a','#0a8f4b'], 'Galau':['#312035','#7d6aff'],
      'Breakbeat':['#2b1b12','#ff9f1c'], 'Pop Indonesia':['#1a2c42','#49c6ff'], 'Bahasa Inggris':['#241c3a','#a98bff'],
      'Lagu Timur':['#33220f','#f5b642'], 'Lagu Santai':['#173337','#5dd7d0'], 'Moodbooster':['#243012','#c5f23d']
    };
    const [a,b]=map[cat]||['#183323','#1ed760'];
    return `linear-gradient(135deg, ${a}, ${b})`;
  }
  function renderPlayer(){
    $('#selectedTitle').textContent = state.selectedTitle || 'Belum ada playlist';
    $('#selectedDesc').textContent = state.selectedDesc || 'Pilih playlist di kiri atau tempel link Spotify.';
    const frame=$('#spotifyFrame'); if(!frame) return;
    const embed=spotifyEmbed(state.selectedUrl);
    frame.innerHTML = embed ? `<iframe title="Spotify player" src="${embed}" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>` : '<div class="empty-player">Pilih playlist untuk menampilkan Spotify player.</div>';
  }
  function renderNotes(){
    const list=$('#noteList'); if(!list) return;
    const notes=[...state.notes].sort((a,b)=>b.createdAt-a.createdAt);
    list.innerHTML = notes.length ? notes.map(n=>`<li class="note-item"><p>${escapeHtml(n.text)}</p><small>${new Date(n.createdAt).toLocaleString('id-ID')}</small></li>`).join('') : '<li class="note-item"><p>Belum ada catatan.</p><small>Tulis catatan fokus pertama.</small></li>';
  }
  function renderHistory(){
    const chart=$('#barChart');
    if(chart){
      const days=[6,5,4,3,2,1,0].map(n=>daysAgo(n));
      const max=Math.max(1,...days.map(d=>state.sessions.filter(s=>s.date===d).length));
      chart.innerHTML=days.map(d=>{
        const count=state.sessions.filter(s=>s.date===d).length;
        const label=d.slice(5).replace('-','/');
        return `<div class="bar-row"><span>${label}</span><div class="bar-track"><i style="width:${(count/max)*100}%"></i></div><b>${count}</b></div>`;
      }).join('');
    }
    const history=$('#historyList');
    if(history){
      const items=[...state.sessions].sort((a,b)=>b.createdAt-a.createdAt).slice(0,12);
      history.innerHTML = items.length ? items.map(s=>{
        const task=state.tasks.find(t=>t.id===s.taskId);
        const pl=PLAYLISTS.find(p=>p.id===s.playlistId);
        return `<div class="history-item"><b>Pomodoro selesai</b><small>${s.date} ${s.time||''} • ${escapeHtml(task?.title||'Tanpa tugas')} • ${escapeHtml(pl?.title||'Tanpa playlist')}</small></div>`;
      }).join('') : '<div class="history-item"><b>Belum ada riwayat</b><small>Selesaikan Pomodoro untuk membuat riwayat.</small></div>';
    }
  }

  function renderAll(){
    setTheme(state.theme || 'dark');
    renderDashboard(); renderTimer(); renderTasks(); renderCategories(); renderPlaylistGrid(); renderPlayer(); renderNotes(); renderHistory();
  }

  function bind(){
    $$('[data-view-link]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();showView(el.dataset.viewLink);}));
    $('#themeToggle').addEventListener('click',()=>setTheme(state.theme==='dark'?'light':'dark'));
    $('#quickFocusBtn').addEventListener('click',()=>{showView('pomodoro'); startTimer();});
    $('#dashStartPauseBtn').addEventListener('click',toggleTimer);
    $('#dashResetBtn').addEventListener('click',resetTimer);
    $('#startPauseBtn').addEventListener('click',toggleTimer);
    $('#timerResetBtn').addEventListener('click',resetTimer);
    $('#timerSkipBtn').addEventListener('click',completeRound);
    $('#randomPlaylistBtn').addEventListener('click',()=>selectPlaylist(PLAYLISTS[Math.floor(Math.random()*PLAYLISTS.length)]));
    $('#playlistRandomBtn').addEventListener('click',()=>selectPlaylist(PLAYLISTS[Math.floor(Math.random()*PLAYLISTS.length)]));
    $('#soundToggle').addEventListener('click',()=>{state.timer.sound=!state.timer.sound;save();renderTimer();});
    $$('#modeTabs button').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));
    [['#focusMinutes','focus'],['#shortMinutes','short'],['#longMinutes','long']].forEach(([sel,key])=>{
      $(sel).addEventListener('change',e=>{
        let n=Math.max(1,Math.round(Number(e.target.value)||DEFAULT_STATE.timer.durations[key]));
        const max=key==='focus'?180:key==='short'?60:90; n=Math.min(max,n);
        state.timer.durations[key]=n;
        if(state.timer.mode===key){state.timer.remaining=n*60; state.timer.running=false; stopLoop();}
        save(); renderTimer();
      });
    });
    $('#goalInput').addEventListener('change',e=>{state.goal=Math.min(30,Math.max(1,Math.round(Number(e.target.value)||6))); save(); renderTimer(); renderDashboard();});
    $('#activeTaskSelect').addEventListener('change',e=>{state.activeTaskId=e.target.value; save(); renderAll();});
    $('#taskForm').addEventListener('submit',e=>{
      e.preventDefault();
      const title=$('#taskInput').value.trim(); if(!title) return;
      const task={id:`t${Date.now()}`,title,priority:$('#taskPriority').value,target:Math.max(1,Math.round(Number($('#taskPomodoro').value)||1)),done:false,completedPomodoro:0,createdAt:Date.now()};
      state.tasks.unshift(task); state.activeTaskId=task.id; $('#taskInput').value=''; save(); renderAll(); toast('Tugas ditambahkan');
    });
    $$('.chip[data-task-filter]').forEach(c=>c.addEventListener('click',()=>{state.taskFilter=c.dataset.taskFilter;save();renderTasks();}));
    $('#playlistSearch').addEventListener('input',e=>{state.playlistSearch=e.target.value;save();renderPlaylistGrid();});
    $('#playlistFilter').addEventListener('change',e=>{state.playlistFilter=e.target.value;save();renderCategories();renderPlaylistGrid();});
    $('#customSpotifyForm').addEventListener('submit',e=>{e.preventDefault();setCustomSpotify($('#customSpotifyInput').value);});
    $('#openSpotifyBtn').addEventListener('click',openSpotify);
    $('#copySpotifyBtn').addEventListener('click',copySpotify);
    $('#clearPlayerBtn').addEventListener('click',()=>{state.selectedPlaylistId='';state.selectedUrl='';state.selectedTitle='';state.selectedDesc='';state.selectedCat='';save();renderAll();});
    $('#noteForm').addEventListener('submit',e=>{e.preventDefault();const text=$('#noteInput').value.trim(); if(!text)return; state.notes.push({id:`n${Date.now()}`,text,createdAt:Date.now()}); $('#noteInput').value=''; save(); renderAll(); toast('Catatan disimpan');});
    $('#exportDataBtn').addEventListener('click',()=>{
      const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});
      const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`awanspace-data-${todayKey()}.json`; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),500);
    });
    $('#importDataInput').addEventListener('change',e=>{
      const file=e.target.files?.[0]; if(!file)return;
      const reader=new FileReader(); reader.onload=()=>{try{state=merge(DEFAULT_STATE,JSON.parse(reader.result)); save(); renderAll(); toast('Data diimport');}catch{toast('File JSON tidak valid');}}; reader.readAsText(file);
    });
    $('#resetAllBtn').addEventListener('click',()=>{if(confirm('Reset semua data Awan Space?')){state=clone(DEFAULT_STATE);save();renderAll();showView('dashboard');toast('Data direset');}});
    window.addEventListener('beforeunload',save);
  }

  function init(){
    bind(); renderAll(); showView(state.view || 'dashboard');
    if(state.timer.running) startLoop();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();

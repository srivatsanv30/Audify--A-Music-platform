// ═══ PLAYER PART 2 - Playback, Navigation, Modals ═══

// ── Navigation ──
let navHistory = ['home'], navIndex = 0;
function showSection(id) {
  document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
  const sec = document.getElementById('section-' + id);
  if (sec) sec.classList.add('active');
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const n = document.getElementById('nav-' + id);
  if (n) n.classList.add('active');
  document.getElementById('main-content').scrollTop = 0;
  if (id === 'history') renderHistory();
  if (id === 'home') renderContentRows();
}
function navigate(section) { navHistory = navHistory.slice(0, navIndex + 1); navHistory.push(section); navIndex = navHistory.length - 1; showSection(section); }
function goBack() { if (navIndex > 0) { navIndex--; showSection(navHistory[navIndex]); } }
function goForward() { if (navIndex < navHistory.length - 1) { navIndex++; showSection(navHistory[navIndex]); } }

// ── Playlist View ──
function openPlaylist(id) {
  let p = PLAYLISTS.find(x => x.id === id);
  let isCustom = false;
  if (!p) { p = AUTH.getCustomPlaylists().find(x => x.id === id); isCustom = true; }
  if (!p) return;
  currentPlaylist = p; currentPlaylistId = id;
  const hero = document.getElementById('playlist-hero');
  const color = isCustom ? 'linear-gradient(180deg,var(--bg-highlight) 0%,var(--bg-surface) 100%)' : `linear-gradient(180deg,${p.color || '#333'} 0%,var(--bg-surface) 100%)`;
  hero.style.background = color;
  const imgHtml = p.cover ? `<img class="playlist-hero-img" src="${p.cover}" alt="">` : `<div class="playlist-hero-icon"><i class="fas fa-music"></i></div>`;
  hero.innerHTML = `${imgHtml}<div class="playlist-hero-info"><div class="label">Playlist</div><h1>${p.name}</h1><div class="desc">${p.desc || ''}</div><div class="meta"><strong>Audify</strong> · ${p.songIds.length} songs</div></div>`;
  document.getElementById('add-songs-btn').style.display = isCustom ? '' : 'none';
  document.getElementById('delete-playlist-btn').style.display = isCustom ? '' : 'none';
  renderPlaylistTracks(p);
  renderSidebarPlaylists();
  navigate('playlist');
}

function renderPlaylistTracks(p) {
  const list = document.getElementById('tracks-list');
  const songs = p.songIds.map(id => SONGS.find(s => s.id === id)).filter(Boolean);
  if (!songs.length) { list.innerHTML = '<p style="padding:32px;color:var(--text-subdued);text-align:center">No songs yet. Click + to add songs.</p>'; return; }
  list.innerHTML = songs.map((s, i) => {
    const active = queue.length > 0 && currentSongIndex >= 0 && queue[currentSongIndex] && queue[currentSongIndex].id === s.id;
    return `<div class="track-row ${active?'playing':''}" onclick="playFromPlaylist('${p.id}',${i})" oncontextmenu="showCtx(event,${s.id})" data-song-id="${s.id}">
      <div class="track-num">${active && isPlaying ? '<div class="eq-bars"><div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div></div>' : `<span class="track-num-text">${i+1}</span><i class="fas fa-play track-num-play" style="display:none;font-size:.7rem"></i>`}</div>
      <div class="track-title-col">${getSongImageHTML(s, 'track-thumb')}<div class="track-name">${s.title}</div></div>
      <div class="track-artist">${s.artist}</div>
      <div class="track-dur">--:--</div></div>`;
  }).join('');
}

// ── Playback ──
function playSongById(id) {
  const s = SONGS.find(x => x.id === id);
  if (!s) return;
  queue = [s]; currentSongIndex = 0; loadAndPlay();
}
function playPlaylistById(id) {
  let p = PLAYLISTS.find(x => x.id === id);
  if (!p) p = AUTH.getCustomPlaylists().find(x => x.id === id);
  if (!p || !p.songIds.length) return;
  currentPlaylist = p; currentPlaylistId = id;
  queue = p.songIds.map(sid => SONGS.find(s => s.id === sid)).filter(Boolean);
  if (isShuffled) shuffleArr(queue);
  currentSongIndex = 0; loadAndPlay();
}
function playPlaylist() { if (currentPlaylistId) playPlaylistById(currentPlaylistId); }
function playFromPlaylist(pid, idx) {
  let p = PLAYLISTS.find(x => x.id === pid);
  if (!p) p = AUTH.getCustomPlaylists().find(x => x.id === pid);
  if (!p) return;
  currentPlaylist = p; currentPlaylistId = pid;
  queue = p.songIds.map(sid => SONGS.find(s => s.id === sid)).filter(Boolean);
  currentSongIndex = idx; loadAndPlay();
}
function loadAndPlay() {
  if (currentSongIndex < 0 || currentSongIndex >= queue.length) return;
  const s = queue[currentSongIndex];
  audio.src = s.url;
  audio.play().then(() => { isPlaying = true; postPlay(s); }).catch(() => { isPlaying = true; postPlay(s); });
}
function postPlay(s) {
  updatePlayPauseUI(); updateNowPlaying(s); updateQueueUI(); highlightTrack();
  AUTH.addToHistory(s.id);
  updateFullscreenPlayer();
}
function togglePlay() {
  if (!queue.length) { playPlaylistById(PLAYLISTS[0].id); return; }
  if (isPlaying) { audio.pause(); isPlaying = false; } else { audio.play(); isPlaying = true; }
  updatePlayPauseUI(); highlightTrack();
}
function playNext() {
  if (!queue.length) return;
  if (repeatMode === 2) { audio.currentTime = 0; audio.play(); return; }
  currentSongIndex++;
  if (currentSongIndex >= queue.length) { if (repeatMode === 1) currentSongIndex = 0; else { currentSongIndex--; return; } }
  loadAndPlay();
}
function playPrev() {
  if (!queue.length) return;
  if (audio.currentTime > 3) { audio.currentTime = 0; return; }
  currentSongIndex--; if (currentSongIndex < 0) currentSongIndex = repeatMode === 1 ? queue.length - 1 : 0;
  loadAndPlay();
}
function toggleShuffle() {
  isShuffled = !isShuffled;
  document.querySelectorAll('#shuffle-btn,#playlist-shuffle-btn').forEach(b => b.classList.toggle('active', isShuffled));
  if (isShuffled && queue.length > 1) { const cur = queue[currentSongIndex]; const rest = queue.filter((_, i) => i !== currentSongIndex); shuffleArr(rest); queue = [cur, ...rest]; currentSongIndex = 0; }
  updateQueueUI();
}
function toggleRepeat() {
  repeatMode = (repeatMode + 1) % 3;
  const btn = document.getElementById('repeat-btn');
  btn.classList.toggle('active', repeatMode > 0);
  btn.innerHTML = repeatMode === 2 ? '<i class="fas fa-repeat"></i><span style="font-size:.5rem;position:absolute;margin-top:8px">1</span>' : '<i class="fas fa-repeat"></i>';
}
function toggleLike() {
  if (!queue.length || currentSongIndex < 0) return;
  const liked = AUTH.toggleLikedSong(queue[currentSongIndex].id);
  const btn = document.getElementById('like-btn');
  btn.classList.toggle('liked', liked);
  btn.innerHTML = liked ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
  showToast(liked ? '💜 Added to Liked Songs' : 'Removed from Liked Songs');
}

// ── UI Updates ──
function updatePlayPauseUI() {
  const ic = isPlaying ? 'fa-pause' : 'fa-play';
  document.getElementById('play-pause-btn').innerHTML = `<i class="fas ${ic}"></i>`;
  const pb = document.getElementById('playlist-play-btn');
  if (pb) pb.innerHTML = `<i class="fas ${ic}"></i>`;
}
function updateNowPlaying(s) {
  document.getElementById('np-img').innerHTML = getSongImageHTML(s, '', 'width:100%;height:100%;object-fit:cover;border-radius:10px');
  document.getElementById('np-title').textContent = s.title;
  document.getElementById('np-artist').textContent = s.artist;
  document.title = s.title + ' · Audify';
  const liked = AUTH.getLikedSongs().includes(s.id);
  const btn = document.getElementById('like-btn');
  btn.classList.toggle('liked', liked);
  btn.innerHTML = liked ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
}
function highlightTrack() {
  document.querySelectorAll('.track-row').forEach(row => {
    const sid = parseInt(row.dataset.songId);
    const active = queue[currentSongIndex] && sid === queue[currentSongIndex].id;
    row.classList.toggle('playing', active);
    const num = row.querySelector('.track-num');
    if (active && isPlaying) num.innerHTML = '<div class="eq-bars"><div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div></div>';
    else { const rows = [...document.querySelectorAll('.track-row')]; num.innerHTML = `<span class="track-num-text">${rows.indexOf(row)+1}</span><i class="fas fa-play track-num-play" style="display:none;font-size:.7rem"></i>`; }
  });
}
function updateQueueUI() {
  const curr = document.getElementById('queue-current'), list = document.getElementById('queue-list');
  if (queue.length && currentSongIndex >= 0 && queue[currentSongIndex]) {
    const s = queue[currentSongIndex];
    curr.innerHTML = `<div class="queue-item active">${getSongImageHTML(s, 'queue-item-icon', 'border-radius:6px;object-fit:cover')}<div class="queue-item-info"><div class="queue-item-title">${s.title}</div><div class="queue-item-artist">${s.artist}</div></div></div>`;
  }
  list.innerHTML = queue.slice(currentSongIndex + 1).map((s, i) => `<div class="queue-item" onclick="jumpQ(${currentSongIndex+1+i})">${getSongImageHTML(s, 'queue-item-icon', 'border-radius:6px;object-fit:cover')}<div class="queue-item-info"><div class="queue-item-title">${s.title}</div><div class="queue-item-artist">${s.artist}</div></div></div>`).join('');
}
function jumpQ(i) { currentSongIndex = i; loadAndPlay(); }
function toggleQueue() {
  const panel = document.getElementById('queue-panel');
  panel.classList.toggle('open');
  document.getElementById('queue-btn').classList.toggle('active');
}

// ── Audio Events ──
audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  document.getElementById('progress-filled').style.width = pct + '%';
  document.getElementById('progress-thumb').style.left = pct + '%';
  document.getElementById('time-current').textContent = fmtTime(audio.currentTime);
});
audio.addEventListener('loadedmetadata', () => {
  document.getElementById('time-total').textContent = fmtTime(audio.duration);
});
audio.addEventListener('ended', playNext);
function fmtTime(s) { if (isNaN(s)) return '0:00'; const m = Math.floor(s/60), sec = Math.floor(s%60); return m+':'+(sec<10?'0':'')+sec; }

// ── Progress & Volume ──
function seekTo(e) { const b = document.getElementById('progress-bar'); audio.currentTime = ((e.clientX - b.getBoundingClientRect().left) / b.offsetWidth) * audio.duration; }
function setVolume(e) { const b = document.getElementById('volume-bar'); volume = Math.max(0, Math.min(1, (e.clientX - b.getBoundingClientRect().left) / b.offsetWidth)); audio.volume = volume; updateVolUI(); }
function toggleMute() { audio.muted = !audio.muted; updateVolUI(); }
function updateVolUI() {
  const pct = audio.muted ? 0 : volume * 100;
  document.getElementById('volume-filled').style.width = pct + '%';
  document.getElementById('volume-thumb').style.left = pct + '%';
  const ic = audio.muted || volume === 0 ? 'fa-volume-xmark' : volume < 0.5 ? 'fa-volume-low' : 'fa-volume-high';
  document.getElementById('volume-btn').innerHTML = `<i class="fas ${ic}"></i>`;
}
function setupProgressDrag() { let d=false; const b=document.getElementById('progress-bar'); b.addEventListener('mousedown',e=>{d=true;seekTo(e)}); document.addEventListener('mousemove',e=>{if(d)seekTo(e)}); document.addEventListener('mouseup',()=>{d=false}); }
function setupVolumeDrag() { let d=false; const b=document.getElementById('volume-bar'); b.addEventListener('mousedown',e=>{d=true;setVolume(e)}); document.addEventListener('mousemove',e=>{if(d)setVolume(e)}); document.addEventListener('mouseup',()=>{d=false}); }
function setupScrollListener() { const m=document.getElementById('main-content'),t=document.getElementById('top-bar'); m.addEventListener('scroll',()=>{t.classList.toggle('scrolled',m.scrollTop>80)}); }

// ── Fullscreen progress drag ──
// Removed as progress bar is no longer in fullscreen

// ── Search ──
function handleSearch(val) {
  const res = document.getElementById('search-results'), browse = document.getElementById('browse-categories');
  if (!val.trim()) { res.innerHTML = ''; browse.style.display = ''; return; }
  browse.style.display = 'none';
  const q = val.toLowerCase();
  const matches = SONGS.filter(s => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q) || s.album.toLowerCase().includes(q));
  if (!matches.length) { res.innerHTML = '<p style="color:var(--text-secondary);padding:16px">No results found</p>'; return; }
  res.innerHTML = '<h2 style="font-size:1.4rem;font-weight:800;margin-bottom:16px">Songs</h2>' + matches.map(s => {
    return `<div class="track-row" onclick="playSongById(${s.id})" oncontextmenu="showCtx(event,${s.id})"><div class="track-num"><i class="fas fa-music" style="color:var(--text-subdued)"></i></div><div class="track-title-col">${getSongImageHTML(s, 'track-thumb')}<div class="track-name">${s.title}</div></div><div class="track-artist">${s.artist}</div><div class="track-dur">--:--</div></div>`;
  }).join('');
}
function searchByCategory(name) { document.getElementById('search-input').value = name; handleSearch(name); navigate('search'); }

// ── History ──
function renderHistory() {
  const hist = AUTH.getHistory();
  const el = document.getElementById('history-list');
  if (!hist.length) { el.innerHTML = '<p style="padding:32px;color:var(--text-subdued);text-align:center">No listening history yet. Start playing some songs!</p>'; return; }
  el.innerHTML = '<div class="tracks-header"><span class="track-num">#</span><span>Title</span><span>Artist</span><span>Played</span><span><i class="fas fa-clock"></i></span></div>' +
    hist.map((h, i) => { const s = SONGS.find(x => x.id === h.songId); if (!s) return ''; const ago = timeAgo(h.timestamp);
      return `<div class="track-row" onclick="playSongById(${s.id})" oncontextmenu="showCtx(event,${s.id})"><div class="track-num">${i+1}</div><div class="track-title-col">${getSongImageHTML(s, 'track-thumb')}<div class="track-name">${s.title}</div></div><div class="track-artist">${s.artist}</div><div class="track-date">${ago}</div><div class="track-dur">--:--</div></div>`;
    }).join('');
}
function clearHistory() { AUTH.clearHistory(); renderHistory(); renderSidebarPlaylists(); renderContentRows(); showToast('History cleared'); }
function timeAgo(ts) { const d = Date.now() - ts, m = Math.floor(d/60000); if (m < 1) return 'Just now'; if (m < 60) return m+'m ago'; const h = Math.floor(m/60); if (h < 24) return h+'h ago'; return Math.floor(h/24)+'d ago'; }

// ── Create Playlist ──
function openCreatePlaylistModal() { closeAllModals(); document.getElementById('modal-overlay').classList.remove('hidden'); document.getElementById('create-playlist-modal').classList.remove('hidden'); document.getElementById('new-playlist-name').focus(); }
function handleCreatePlaylist(e) {
  e.preventDefault();
  const name = document.getElementById('new-playlist-name').value.trim();
  const desc = document.getElementById('new-playlist-desc').value.trim();
  if (!name) return;
  const pl = AUTH.createPlaylist(name, desc);
  closeAllModals(); document.getElementById('new-playlist-name').value = ''; document.getElementById('new-playlist-desc').value = '';
  renderSidebarPlaylists(); openPlaylist(pl.id);
  showToast('🎵 Playlist "' + name + '" created');
}
function deleteCurrentPlaylist() {
  if (!currentPlaylistId || !currentPlaylistId.startsWith('user_')) return;
  if (!confirm('Delete this playlist?')) return;
  AUTH.deletePlaylist(currentPlaylistId); renderSidebarPlaylists(); navigate('home');
  showToast('Playlist deleted');
}

// ── Add Songs Modal ──
function openAddSongsModal() {
  if (!currentPlaylistId) return;
  closeAllModals();
  document.getElementById('modal-overlay').classList.remove('hidden');
  document.getElementById('add-songs-modal').classList.remove('hidden');
  document.getElementById('add-songs-search').value = '';
  renderAddSongsList(SONGS);
}
function renderAddSongsList(songs) {
  const pl = AUTH.getCustomPlaylists().find(x => x.id === currentPlaylistId);
  const el = document.getElementById('add-songs-list');
  el.innerHTML = songs.map(s => {
    const added = pl && pl.songIds.includes(s.id);
    return `<div class="add-song-row" onclick="toggleSongInPlaylist(${s.id},this)"><div class="song-info"><div class="s-title">${s.title}</div><div class="s-artist">${s.artist}</div></div><div class="add-check ${added?'added':''}"><i class="fas ${added?'fa-check':'fa-plus'}"></i></div></div>`;
  }).join('');
}
function filterAddSongs(val) {
  const q = val.toLowerCase();
  const filtered = q ? SONGS.filter(s => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)) : SONGS;
  renderAddSongsList(filtered);
}
function toggleSongInPlaylist(songId, row) {
  const pl = AUTH.getCustomPlaylists().find(x => x.id === currentPlaylistId);
  if (!pl) return;
  const check = row.querySelector('.add-check');
  if (pl.songIds.includes(songId)) { AUTH.removeSongFromPlaylist(currentPlaylistId, songId); check.classList.remove('added'); check.innerHTML = '<i class="fas fa-plus"></i>'; }
  else { AUTH.addSongToPlaylist(currentPlaylistId, songId); check.classList.add('added'); check.innerHTML = '<i class="fas fa-check"></i>'; }
  // Refresh playlist view
  const updated = AUTH.getCustomPlaylists().find(x => x.id === currentPlaylistId);
  if (updated) { currentPlaylist = updated; renderPlaylistTracks(updated); document.querySelector('.playlist-hero-info .meta').innerHTML = `<strong>Audify</strong> · ${updated.songIds.length} songs`; }
}

// ── Context Menu (right-click add to playlist) ──
let ctxSongId = null;
function showCtx(e, songId) {
  e.preventDefault(); ctxSongId = songId;
  const menu = document.getElementById('context-menu');
  const items = document.getElementById('ctx-items');
  const customs = AUTH.getCustomPlaylists();
  let html = customs.map(p => `<a href="#" onclick="addToCtxPlaylist('${p.id}');return false"><i class="fas fa-music"></i> ${p.name}</a>`).join('');
  if (!customs.length) html = '<a style="pointer-events:none;opacity:.5">No playlists yet</a>';
  html += `<a href="#" onclick="openCreatePlaylistModal();hideCtx();return false"><i class="fas fa-plus"></i> New Playlist</a>`;
  items.innerHTML = html;
  menu.classList.remove('hidden');
  menu.style.left = Math.min(e.clientX, window.innerWidth - 220) + 'px';
  menu.style.top = Math.min(e.clientY, window.innerHeight - 200) + 'px';
}
function addToCtxPlaylist(plId) {
  if (ctxSongId) AUTH.addSongToPlaylist(plId, ctxSongId);
  hideCtx(); renderSidebarPlaylists();
  showToast('Added to playlist');
}
function hideCtx() { document.getElementById('context-menu').classList.add('hidden'); }
document.addEventListener('click', hideCtx);

// ── Modals ──
function closeAllModals() { document.getElementById('modal-overlay').classList.add('hidden'); document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden')); }
function toggleUserMenu() { document.getElementById('user-dropdown').classList.toggle('open'); }
document.addEventListener('click', e => { if (!e.target.closest('.user-menu-wrap')) document.getElementById('user-dropdown').classList.remove('open'); });

// ── Utils ──
function shuffleArr(a) { for (let i=a.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]; } }

// ── Local Files ──
function handleLocalFiles(e) {
  const files = Array.from(e.target.files);
  if (!files.length) return;
  
  let localPlaylist = PLAYLISTS.find(p => p.id === 'local_files');
  if (!localPlaylist) {
    localPlaylist = {
      id: 'local_files',
      name: 'Local Files',
      desc: 'Songs from your device',
      cover: 'https://images.unsplash.com/photo-1516280440502-61a7a030f0a4?q=80&w=300&auto=format&fit=crop', // Placeholder cover
      color: '#34495e',
      songIds: []
    };
    PLAYLISTS.splice(1, 0, localPlaylist); // Insert after All Songs
  }
  
  const startIndex = localPlaylist.songIds.length;
  files.forEach(file => {
    const localId = 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const localSong = {
      id: localId,
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: "Local Device",
      album: "Local Files",
      genre: "Local",
      url: URL.createObjectURL(file),
      isLocal: true
    };
    SONGS.push(localSong);
    localPlaylist.songIds.push(localId);
  });
  
  renderSidebarPlaylists();
  renderContentRows();
  playFromPlaylist('local_files', startIndex);
  showToast(`Added ${files.length} local file(s)`);
}

// ── Keyboard Shortcuts ──
document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT') return;
  if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
  if (e.code === 'ArrowRight' && e.ctrlKey) playNext();
  if (e.code === 'ArrowLeft' && e.ctrlKey) playPrev();
  if (e.code === 'KeyF' && !e.ctrlKey && !e.metaKey) {
    if (fsOpen) closeFullscreenPlayer();
    else openFullscreenPlayer();
  }
  if (e.code === 'Escape' && fsOpen) closeFullscreenPlayer();
  if (e.code === 'KeyT' && !e.ctrlKey) toggleTheme();
});

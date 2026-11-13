// ═══ PLAYER CORE ═══
let currentSongIndex = -1, currentPlaylist = null, currentPlaylistId = null;
let queue = [], isPlaying = false, isShuffled = false, repeatMode = 0, volume = 0.7;
const audio = document.getElementById('audio-player');
audio.volume = volume;

function getSongImageHTML(s, cssClass = '', inlineStyle = '') {
  if (s.image) return `<img class="${cssClass}" src="${s.image}" style="${inlineStyle}" alt="">`;
  if (s.isLocal) return `<div class="${cssClass} local-icon" style="${inlineStyle}"><i class="fas fa-music"></i></div>`;
  return `<img class="${cssClass}" src="https://picsum.photos/seed/${s.id}/300/300" style="${inlineStyle}" alt="">`;
}

// ── Theme Management ──
function getStoredTheme() {
  return localStorage.getItem('audify_theme') || 'light';
}
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('audify_theme', theme);
  const icon = document.getElementById('theme-icon');
  if (icon) {
    icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
  }
}
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  showToast(next === 'dark' ? '🌙 Dark mode enabled' : '☀️ Light mode enabled');
}
// Apply saved theme on load
(function() {
  applyTheme(getStoredTheme());
})();

// ── Toast Notifications ──
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2500);
}

// ── Auth UI ──
function showLogin() { document.getElementById('login-form').classList.remove('hidden'); document.getElementById('signup-form').classList.add('hidden'); }
function showSignup() { document.getElementById('login-form').classList.add('hidden'); document.getElementById('signup-form').classList.remove('hidden'); }
function handleLogin(e) {
  e.preventDefault();
  const r = AUTH.login(document.getElementById('login-email').value, document.getElementById('login-password').value);
  if (!r.ok) { document.getElementById('login-error').textContent = r.msg; return; }
  enterApp();
}
function handleSignup(e) {
  e.preventDefault();
  const r = AUTH.signup(document.getElementById('signup-name').value, document.getElementById('signup-email').value, document.getElementById('signup-password').value);
  if (!r.ok) { document.getElementById('signup-error').textContent = r.msg; return; }
  enterApp();
}
function handleLogout() { AUTH.logout(); location.reload(); }
function enterApp() {
  document.getElementById('login-page').classList.add('hidden');
  document.getElementById('app-wrapper').classList.remove('hidden');
  initApp();
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(getStoredTheme());
  if (AUTH.getCurrentUser() && AUTH.getProfile()) enterApp();
});
function initApp() {
  const p = AUTH.getProfile();
  if (!p) return;
  document.getElementById('user-display-name').textContent = p.name;
  document.getElementById('user-avatar').textContent = p.name.charAt(0).toUpperCase();
  setGreeting(p.name);
  renderSidebarPlaylists();
  renderQuickPicks();
  renderContentRows();
  renderCategories();
  setupScrollListener();
  setupProgressDrag();
  setupVolumeDrag();
}
function setGreeting(name) {
  const h = new Date().getHours();
  let g = h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening';
  document.getElementById('greeting-text').textContent = g + ', ' + name.split(' ')[0];
}

// ── Sidebar ──
function renderSidebarPlaylists(filter) {
  const el = document.getElementById('playlist-list');
  let html = '';
  const customs = AUTH.getCustomPlaylists();
  if (filter !== 'history') {
    PLAYLISTS.forEach(p => { html += sidebarItem(p.id, p.cover, null, p.name, 'Playlist · ' + p.songIds.length + ' songs'); });
    customs.forEach(p => { html += sidebarItem(p.id, null, 'fa-music', p.name, 'Playlist · ' + p.songIds.length + ' songs'); });
  }
  if (filter === 'history' || filter === 'all' || !filter) {
    const hist = AUTH.getHistory().slice(0, 8);
    hist.forEach(h => {
      const s = SONGS.find(x => x.id === h.songId);
      if (s) html += `<div class="playlist-item" onclick="playSongById(${s.id})"><div class="playlist-item-icon"><i class="fas fa-clock-rotate-left"></i></div><div class="playlist-item-info"><div class="playlist-item-name">${s.title}</div><div class="playlist-item-meta">${s.artist}</div></div></div>`;
    });
  }
  el.innerHTML = html || '<p style="padding:12px;color:var(--text-subdued);font-size:.8rem">Nothing here yet</p>';
}
function sidebarItem(id, img, icon, name, meta) {
  const imgHtml = img ? `<img class="playlist-item-img" src="${img}" alt="">` : `<div class="playlist-item-icon"><i class="fas ${icon}"></i></div>`;
  return `<div class="playlist-item ${currentPlaylistId===id?'active':''}" data-id="${id}" onclick="openPlaylist('${id}')">${imgHtml}<div class="playlist-item-info"><div class="playlist-item-name">${name}</div><div class="playlist-item-meta">${meta}</div></div></div>`;
}
function filterLibrary(type, btn) {
  document.querySelectorAll('.lib-tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  if (type === 'history') renderSidebarPlaylists('history');
  else if (type === 'playlists') renderSidebarPlaylists('playlists');
  else renderSidebarPlaylists('all');
}

// ── Quick Picks ──
function renderQuickPicks() {
  const el = document.getElementById('quick-picks');
  el.innerHTML = PLAYLISTS.slice(0, 6).map(p => `<div class="quick-pick-card" onclick="openPlaylist('${p.id}')"><img src="${p.cover}" alt=""><span>${p.name}</span><div class="qp-play" onclick="event.stopPropagation();playPlaylistById('${p.id}')"><i class="fas fa-play"></i></div></div>`).join('');
}

// ── Content Rows ──
function renderContentRows() {
  const hist = AUTH.getHistory();
  let recentHtml = '';
  if (hist.length > 0) {
    const recentSongs = hist.slice(0, 10).map(h => SONGS.find(s => s.id === h.songId)).filter(Boolean);
    recentHtml = `<h2>Recently Played</h2><div class="card-scroll">${recentSongs.map(s => songCard(s)).join('')}</div>`;
  }
  document.getElementById('row-recent').innerHTML = recentHtml;
  document.getElementById('row-trending').innerHTML = `<h2>Featured Playlists</h2><div class="card-scroll">${PLAYLISTS.map(p => playlistCard(p)).join('')}</div>`;
  document.getElementById('row-all').innerHTML = `<h2>All Songs</h2><div class="card-scroll">${SONGS.map(s => songCard(s)).join('')}</div>`;
}
function playlistCard(p) {
  return `<div class="song-card" onclick="openPlaylist('${p.id}')"><div class="card-img-wrap"><img src="${p.cover}" alt=""><button class="card-play-btn" onclick="event.stopPropagation();playPlaylistById('${p.id}')"><i class="fas fa-play"></i></button></div><div class="card-title">${p.name}</div><div class="card-subtitle">${p.desc}</div></div>`;
}
function songCard(s) {
  return `<div class="song-card" onclick="playSongById(${s.id})" oncontextmenu="showCtx(event,${s.id})"><div class="card-img-wrap">${getSongImageHTML(s, '', 'width:100%;height:100%;object-fit:cover')}<button class="card-play-btn" onclick="event.stopPropagation();playSongById(${s.id})"><i class="fas fa-play"></i></button></div><div class="card-title">${s.title}</div><div class="card-subtitle">${s.artist}</div></div>`;
}
function strColor(s) { let h=0; for(let i=0;i<s.length;i++) h=s.charCodeAt(i)+((h<<5)-h); return `hsl(${Math.abs(h)%360},55%,35%)`; }

// ── Categories ──
function renderCategories() {
  document.getElementById('category-grid').innerHTML = CATEGORIES.map(c => `<div class="category-card" style="background:${c.color}" onclick="searchByCategory('${c.name}')">${c.name}<i class="fas ${c.icon}"></i></div>`).join('');
}

// ── Fullscreen Player ──
let fsOpen = false;
function openFullscreenPlayer() {
  if (!queue.length || currentSongIndex < 0) return;
  const fs = document.getElementById('fullscreen-player');
  fs.classList.add('open');
  fsOpen = true;
  updateFullscreenPlayer();
  document.body.style.overflow = 'hidden';
}
function closeFullscreenPlayer() {
  const fs = document.getElementById('fullscreen-player');
  fs.style.animation = 'none';
  fs.offsetHeight; // trigger reflow
  fs.style.animation = '';
  fs.classList.remove('open');
  fsOpen = false;
  document.body.style.overflow = '';
}
function updateFullscreenPlayer() {
  if (!fsOpen || !queue.length || currentSongIndex < 0) return;
  const s = queue[currentSongIndex];
  
  document.getElementById('fs-artwork-inner').innerHTML = getSongImageHTML(s, '', 'width:100%;height:100%;object-fit:cover');
  
  // Playlist name
  if (currentPlaylist) {
    document.getElementById('fs-playlist-name').textContent = currentPlaylist.name;
  } else {
    document.getElementById('fs-playlist-name').textContent = 'Library';
  }
  
  // Artist cards
  const artistName = document.getElementById('fs-card-artist');
  const performerName = document.getElementById('fs-card-performer');
  if (artistName) artistName.textContent = s.artist;
  if (performerName) performerName.textContent = s.artist;
}
function seekToFS(e) {
  // no-op, since progress bar is removed from full screen in new layout
}



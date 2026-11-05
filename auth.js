// ═══ AUTH & USER MANAGEMENT (localStorage) ═══

const AUTH = {
  getUsers() { return JSON.parse(localStorage.getItem('audify_users') || '{}'); },
  saveUsers(u) { localStorage.setItem('audify_users', JSON.stringify(u)); },
  getCurrentUser() { return localStorage.getItem('audify_current_user'); },
  setCurrentUser(email) { localStorage.setItem('audify_current_user', email); },
  logout() { localStorage.removeItem('audify_current_user'); },

  signup(name, email, password) {
    const users = this.getUsers();
    if (users[email]) return { ok: false, msg: 'Email already registered' };
    users[email] = { name, email, password, history: [], customPlaylists: [], likedSongs: [] };
    this.saveUsers(users);
    this.setCurrentUser(email);
    return { ok: true };
  },

  login(email, password) {
    const users = this.getUsers();
    if (!users[email]) return { ok: false, msg: 'No account found with this email' };
    if (users[email].password !== password) return { ok: false, msg: 'Incorrect password' };
    this.setCurrentUser(email);
    return { ok: true };
  },

  getProfile() {
    const email = this.getCurrentUser();
    if (!email) return null;
    const users = this.getUsers();
    return users[email] || null;
  },

  updateProfile(data) {
    const email = this.getCurrentUser();
    if (!email) return;
    const users = this.getUsers();
    if (users[email]) { Object.assign(users[email], data); this.saveUsers(users); }
  },

  addToHistory(songId) {
    const p = this.getProfile();
    if (!p) return;
    const entry = { songId, timestamp: Date.now() };
    p.history = p.history.filter(h => h.songId !== songId);
    p.history.unshift(entry);
    if (p.history.length > 100) p.history = p.history.slice(0, 100);
    this.updateProfile({ history: p.history });
  },

  getHistory() { return (this.getProfile() || {}).history || []; },
  clearHistory() { this.updateProfile({ history: [] }); },

  getCustomPlaylists() { return (this.getProfile() || {}).customPlaylists || []; },

  createPlaylist(name, desc) {
    const p = this.getProfile();
    if (!p) return null;
    const id = 'user_' + Date.now();
    const pl = { id, name, desc: desc || '', songIds: [], createdAt: Date.now() };
    p.customPlaylists = p.customPlaylists || [];
    p.customPlaylists.push(pl);
    this.updateProfile({ customPlaylists: p.customPlaylists });
    return pl;
  },

  deletePlaylist(id) {
    const p = this.getProfile();
    if (!p) return;
    p.customPlaylists = (p.customPlaylists || []).filter(pl => pl.id !== id);
    this.updateProfile({ customPlaylists: p.customPlaylists });
  },

  addSongToPlaylist(playlistId, songId) {
    const p = this.getProfile();
    if (!p) return;
    const pl = (p.customPlaylists || []).find(x => x.id === playlistId);
    if (pl && !pl.songIds.includes(songId)) {
      pl.songIds.push(songId);
      this.updateProfile({ customPlaylists: p.customPlaylists });
    }
  },

  removeSongFromPlaylist(playlistId, songId) {
    const p = this.getProfile();
    if (!p) return;
    const pl = (p.customPlaylists || []).find(x => x.id === playlistId);
    if (pl) {
      pl.songIds = pl.songIds.filter(id => id !== songId);
      this.updateProfile({ customPlaylists: p.customPlaylists });
    }
  },

  getLikedSongs() { return (this.getProfile() || {}).likedSongs || []; },
  toggleLikedSong(songId) {
    const p = this.getProfile();
    if (!p) return false;
    p.likedSongs = p.likedSongs || [];
    const idx = p.likedSongs.indexOf(songId);
    if (idx >= 0) { p.likedSongs.splice(idx, 1); this.updateProfile({ likedSongs: p.likedSongs }); return false; }
    else { p.likedSongs.push(songId); this.updateProfile({ likedSongs: p.likedSongs }); return true; }
  }
};

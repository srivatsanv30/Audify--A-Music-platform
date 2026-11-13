# 🎵 Audify — A Music Platform

A premium music streaming web application with a modern UI, built using vanilla HTML, CSS, and JavaScript.

![Audify](assets/images/logo.png)

## ✨ Features

- 🎶 Stream songs from the cloud (Cloudinary-hosted)
- 🔐 User authentication (sign up / log in) with localStorage
- 📂 Create and manage custom playlists
- 🔍 Search songs by title, artist, album, or genre
- 🕐 Listening history tracking
- ❤️ Like / favorite songs
- 🔀 Shuffle & repeat modes
- 🖥️ Fullscreen player view
- 📱 Responsive design (desktop, tablet, mobile)
- 🌗 Light & dark theme toggle
- 🎵 Play local audio files

## 📁 Project Structure

```
Audify/
├── index.html              # Main HTML file
├── README.md               # Project documentation
├── .gitignore              # Git ignore rules
├── css/
│   └── style.css           # All styles (themes, layout, components)
├── js/
│   ├── auth.js             # Authentication & user management
│   ├── data.js             # Song database & playlist definitions
│   ├── player.js           # Audio player logic
│   └── script.js           # App logic, UI rendering, navigation
└── assets/
    └── images/
        ├── logo.png        # App logo
        ├── all_songs.png   # Playlist cover
        ├── romantic.png    # Playlist cover
        ├── party.png       # Playlist cover
        ├── chill.png       # Playlist cover
        ├── bollywood.png   # Playlist cover
        ├── trending.png    # Playlist cover
        └── classics.png   # Playlist cover
```

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/srivatsanv30/Audify--A-Music-platform.git
   ```
2. Open `index.html` in your browser, or use a local server:
   ```bash
   npx serve .
   ```

## 🛠️ Tech Stack

- **HTML5** — Semantic markup
- **CSS3** — Custom properties, glassmorphism, animations, responsive grid
- **JavaScript (ES6+)** — Vanilla JS, localStorage for persistence
- **Font Awesome 6** — Icons
- **DM Sans** — Typography (Google Fonts)
- **Cloudinary** — Audio file hosting

## 📜 License

This project is open source and available under the [MIT License](LICENSE).


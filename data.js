// ─── Song Database ───
const SONGS = [
  { id: 1, title: "Tum Hi Ho", artist: "Arijit Singh", album: "Aashiqui 2", genre: "Bollywood", url: "https://res.cloudinary.com/dvjkqjkr7/video/upload/v1778312714/_Tum_Hi_Ho__Aashiqui_2_Full_Song_With_Lyrics___Aditya_Roy_Kapur__Shraddha_Kapoor_MP3_320K_tfq3hg.mp3" },
  { id: 2, title: "Neruppe", artist: "Various", album: "Neruppe", genre: "Tamil", url: "https://res.cloudinary.com/dvjkqjkr7/video/upload/v1778312708/Neruppe_MP3_320K_puknnr.mp3" },
  { id: 3, title: "Maskara Pottu", artist: "Vijay Antony", album: "Salim", genre: "Tamil", url: "https://res.cloudinary.com/dvjkqjkr7/video/upload/v1778312703/Maskara_Pottu___Video_Song___Salim___Vijay_Antony___Supriya_joshi___%E0%AE%AE%E0%AE%B8%E0%AF%8D%E0%AE%95%E0%AE%BE%E0%AE%B0%E0%AE%BE___%E0%AE%9A%E0%AE%B2%E0%AF%80%E0%AE%AE%E0%AF%8D___Tamil__HD_Song_MP3_320K_voilae.mp3" },
  { id: 4, title: "Azhagaai Pookkuthey", artist: "Vijay Antony", album: "Ninaithale Inikkum", genre: "Tamil", url: "https://res.cloudinary.com/dvjkqjkr7/video/upload/v1778312702/Ninaithale_Inikkum_-_Azhagaai_Pookkuthey_Video___Vijay_Antony_MP3_320K_hpzoms.mp3" },
  { id: 5, title: "Anbil Avan", artist: "A.R. Rahman", album: "Vinnai Thaandi Varuvaaya", genre: "Tamil", url: "https://res.cloudinary.com/dvjkqjkr7/video/upload/v1778312630/Vinnai_Thaandi_Varuvaaya_-_Anbil_Avan_song_Lyrics___Tamil_MP3_320K_q2mh4s.mp3" },
  { id: 6, title: "Karu Karu", artist: "Harris Jayaraj", album: "Pachaikili Muthucharam", genre: "Tamil", url: "https://res.cloudinary.com/dvjkqjkr7/video/upload/v1778312493/Pachaikili_Muthucharam___Karu_Karu_-_Lyric_Video___Sarathkumar___Jyothika__Harris_Jayaraj___Ayngaran_MP3_320K_s626gx.mp3" },
  { id: 7, title: "Annul Maelae", artist: "Harris Jayaraj", album: "Vaaranam Aayiram", genre: "Tamil", url: "https://res.cloudinary.com/dvjkqjkr7/video/upload/v1778312414/Harris_Jayaraj_-_Annul_Maelae_Lyrics_Sudha_Ragunathan_MP3_160K_omzd1y.mp3" },
  { id: 8, title: "Enna Solla Pogirai", artist: "A.R. Rahman", album: "Kandukondain Kandukondain", genre: "Tamil", url: "https://res.cloudinary.com/dvjkqjkr7/video/upload/v1778312396/Enna_Solla_Pogirai_-_Kandukondain_Kandukondain___Video_Song___A.R_Rahman_MP3_160K_lp5mdh.mp3" },
  { id: 9, title: "Vaadi Pulla Vaadi", artist: "Various", album: "Vaadi Pulla Vaadi", genre: "Tamil", url: "https://res.cloudinary.com/dvjkqjkr7/video/upload/v1778312387/Vaadi_Pulla_Vaadi_TamilTunes.com_t8zf7w.mp3" },
  { id: 10, title: "Vilagathey", artist: "Stephen Zechariah", album: "Vilagathey", genre: "Tamil Indie", url: "https://res.cloudinary.com/dvjkqjkr7/video/upload/v1778312365/Vilagathey_Lyric_Music_Video_-_Stephen_Zechariah_ft_Rakshita_Suresh___T_Suriavelan___Rupini_MP3_160K_min1ih.mp3" },
  { id: 11, title: "Adiyeh Kirukki", artist: "Various", album: "Adiyeh Kirukki", genre: "Tamil", url: "https://res.cloudinary.com/dvjkqjkr7/video/upload/v1778312315/Adiyeh_Kirukki_-_Music_Video_HD_MP3_160K_bmgmhk.mp3" },
  { id: 12, title: "Muttu Muttu", artist: "TeeJay & BAB", album: "Muttu Muttu", genre: "Tamil Indie", url: "https://res.cloudinary.com/dvjkqjkr7/video/upload/v1778312286/Muttu_Muttu-TeeJay___BAB_MP3_160K_scefa0.mp3" },
  { id: 13, title: "Kaattu Sirukki", artist: "A.R. Rahman", album: "Raavanan", genre: "Tamil", url: "https://res.cloudinary.com/dvjkqjkr7/video/upload/v1778312250/Raavanan_-_Kaattu_Sirukki_Tamil_Lyric___A.R._Rahman___Vikram__Aishwarya_Rai_MP3_160K_hzgwsr.mp3" },
  { id: 14, title: "Ava Enna", artist: "Harris Jayaraj", album: "Vaaranam Aayiram", genre: "Tamil", url: "https://res.cloudinary.com/dvjkqjkr7/video/upload/v1778312238/Vaaranam_Aayiram_-_Ava_Enna_Video___Harris_Jayaraj___Suriya_MP3_160K_xtth1t.mp3" },
  { id: 15, title: "Kannoram", artist: "Stephen Zechariah", album: "Naam 2", genre: "Tamil Indie", url: "https://res.cloudinary.com/dvjkqjkr7/video/upload/v1778312211/Naam_2_-_Kannoram_Official_Video_4K_-_T_Suriavelan___Stephen_Zechariah_ft_Srinisha_Jayaseelan_MP3_160K_lltvqb.mp3" },
  { id: 16, title: "Pirai Thedum Iraviley", artist: "Dhanush", album: "Pirai Thedum", genre: "Tamil", url: "https://res.cloudinary.com/dvjkqjkr7/video/upload/v1778312207/Pirai_Thedum_iraviley___Lyrical_video___dhanush_--_Studio_Mine_MP3_160K_1_neko1m.mp3" },
  { id: 17, title: "Mayilaanjiye", artist: "Various", album: "Mayilaanjiye", genre: "Tamil", url: "https://res.cloudinary.com/dvjkqjkr7/video/upload/v1778310909/Mayilaanjiye-MassTamilan.org_iqcqxo.mp3" },
  { id: 18, title: "Idhu Dhaan", artist: "Various", album: "Idhu Dhaan", genre: "Tamil", url: "https://res.cloudinary.com/dvjkqjkr7/video/upload/v1778310964/Idhu-Dhaan-MassTamilan.org_lg3prx.mp3" },
  { id: 19, title: "Yean Ennai Pirindhaai", artist: "Various", album: "Yean Ennai Pirindhaai", genre: "Tamil", url: "https://res.cloudinary.com/dvjkqjkr7/video/upload/v1778311230/Yean-Ennai-Pirindhaai-MassTamilan.org_iq2cbp.mp3" },
  { id: 20, title: "Aye Aye Aye", artist: "Hiphop Tamizha", album: "Aambala", genre: "Tamil", url: "https://res.cloudinary.com/dvjkqjkr7/video/upload/v1778311240/Aye_Aye_Aye_-_Official_Video_Song___Aambala___Vishal_Hansika___Sundar_C___Hiphop_Tamizha_MP3_160K_wbwtee.mp3" },
  { id: 21, title: "Sollitaley Ava Kaadhala", artist: "D. Imman", album: "Kumki", genre: "Tamil", url: "https://res.cloudinary.com/dvjkqjkr7/video/upload/v1778311292/Kumki_-_Sollitaley_Ava_Kaadhala_Video___Vikram_Prabhu__Lakshmi_Menon___D._Imman_M4A_128K_dtn5se.m4a" },
  { id: 22, title: "Kacheri Kacheri", artist: "Various", album: "Kacheri Kacheri", genre: "Tamil", url: "https://res.cloudinary.com/dvjkqjkr7/video/upload/v1778311315/Kacheri-Kacheri_v8kqq7.mp3" },
  { id: 23, title: "Kadavule Kadavule", artist: "Various", album: "Kadavule Kadavule", genre: "Tamil", url: "https://res.cloudinary.com/dvjkqjkr7/video/upload/v1778311359/Kadavule-Kadavule_sobfep.mp3" },
  { id: 24, title: "Devathai", artist: "Various", album: "Devathai", genre: "Tamil", url: "https://res.cloudinary.com/dvjkqjkr7/video/upload/v1778311441/Devathai_M4A_128K_b2m97q.m4a" },
  { id: 25, title: "Yennachu Yedhachu", artist: "G.V. Prakash Kumar", album: "Trisha Illana Nayanthara", genre: "Tamil", url: "https://res.cloudinary.com/dvjkqjkr7/video/upload/v1778311422/Trisha_Illana_Nayanthara_-_Yennachu_Yedhachu_Video___G.V._Prakash_Kumar__Anandhi_MP3_160K_ruiyvr.mp3" },
  { id: 26, title: "Katchi Sera", artist: "Sai Abhyankkar", album: "Katchi Sera", genre: "Tamil Indie", url: "https://res.cloudinary.com/dvjkqjkr7/video/upload/v1778311490/Katchi_Sera_Lyrics_-_Sai_Abhyankkar__Samyuktha___Think_Music_India___trending_song_MP3_160K_cxh8mw.mp3" },
  { id: 27, title: "Sirukki Vaasam", artist: "Santhosh Narayanan", album: "Kodi", genre: "Tamil", url: "https://res.cloudinary.com/dvjkqjkr7/video/upload/v1778311660/Kodi_-_Sirukki_Vaasam_Tamil_Lyric___Dhanush__Trisha___Santhosh_Narayanan_MP3_160K_bsnxrt.mp3" },
  { id: 28, title: "Oru Paadhi Kadhavu", artist: "Various", album: "Thandavam", genre: "Tamil", url: "https://res.cloudinary.com/dvjkqjkr7/video/upload/v1778311765/Thandavam_Video_Song_Oru_Paadhi_Kadhavu_1080_HD_Full_HD_MP3_160K_klktou.mp3" },
  { id: 29, title: "Thean Kudika", artist: "TeeJay", album: "Thean Kudika", genre: "Tamil Indie", url: "https://res.cloudinary.com/dvjkqjkr7/video/upload/v1778311789/Thean_Kudika___TeeJay_ft_Pragathi_Guruprasad___Official_Music_Video_MP3_160K_e0yarx.mp3" },
  { id: 30, title: "Velicha Poove", artist: "D. Imman", album: "Ethir Neechal", genre: "Tamil", url: "https://res.cloudinary.com/dvjkqjkr7/video/upload/v1778311847/Ethir_Neechal_-_Velicha_Poove_Video___Sivakarthikeyan__Priya_MP3_160K_tqthwh.mp3" },
  { id: 31, title: "Munbe Vaa", artist: "A.R. Rahman", album: "Sillunu Oru Kadhal", genre: "Tamil", url: "https://res.cloudinary.com/dvjkqjkr7/video/upload/v1778312166/Munbe_Vaa_Lyrical_Video_Song___Sillunu_Oru_Kadhal_Movie___Surya___Bhumika___A_R_Rahman___Star_music_MP3_160K_qk1von.mp3" },
  { id: 32, title: "Usuraiya Tholaichen", artist: "Stephen Zechariah", album: "Usuraiya Tholaichen", genre: "Tamil Indie", url: "https://res.cloudinary.com/dvjkqjkr7/video/upload/v1778312096/Usuraiya_Tholaichen_-_Stephen_Zechariah___Lyric_Video___T_Suriavelan___Rupini___SKPRODUCTIONS_MP3_160K_rrkxam.mp3" },
  { id: 33, title: "Amali Thumali", artist: "Harris Jayaraj", album: "KO", genre: "Tamil", url: "https://res.cloudinary.com/dvjkqjkr7/video/upload/v1778312059/KO_-_Amali_Thumali_Tamil_Lyric___Jiiva___Harris_Jayaraj_MP3_160K_q2pnfp.mp3" },
  { id: 34, title: "Ennodu Nee Irundhaal", artist: "A.R. Rahman", album: "I", genre: "Tamil", url: "https://res.cloudinary.com/dvjkqjkr7/video/upload/v1778311986/I_-_Ennodu_Nee_Irundhaal_Lyric___A.R._Rahman___Vikram___Shankar_MP3_160K_gv1dhb.mp3" },
  { id: 35, title: "Chillena", artist: "G.V. Prakash Kumar", album: "Raja Rani", genre: "Tamil", url: "https://res.cloudinary.com/dvjkqjkr7/video/upload/v1778311973/Chillena_Video_Song___Raja_Rani___Aarya__Jai__Nayanthara__Nazriya_Nazim_MP3_160K_nhx8mo.mp3" },
  { id: 36, title: "Enadhuyire", artist: "Harris Jayaraj", album: "Bheema", genre: "Tamil", url: "https://res.cloudinary.com/dvjkqjkr7/video/upload/v1778311879/Enadhuyire_Super_Song___Bheema___Vikram___Trisha___Harris_Jayaraj_MP3_160K_eenrwb.mp3" },
  { id: 37, title: "Vaarayo Vaarayo", artist: "Harris Jayaraj", album: "Aadhavan", genre: "Tamil", url: "https://res.cloudinary.com/dvjkqjkr7/video/upload/v1778311862/Aadhavan_-_Vaarayo_Vaarayo_Video___Suriya_MP3_160K_q3fjhb.mp3" },
  { id: 38, title: "Anbe Anbe", artist: "Various", album: "Anbe Anbe", genre: "Tamil", url: "https://res.cloudinary.com/dvjkqjkr7/video/upload/v1778311796/Anbe-Anbe_ipkdn0.mp3" },
  { id: 39, title: "Thanjavoor Jilla Kaari", artist: "Mani Sharma", album: "Suraa", genre: "Tamil", url: "https://res.cloudinary.com/dvjkqjkr7/video/upload/v1778311746/Suraa_-_Thanjavoor_Jilla_Kaari_Video___Mani_Sharma_MP3_160K_py4fz5.mp3" },
  { id: 40, title: "Yaenadi", artist: "D. Imman", album: "Adhagappattathu Magajanangalay", genre: "Tamil", url: "https://res.cloudinary.com/dvjkqjkr7/video/upload/v1778311729/Adhagappattathu_Magajanangalay_-_Yaenadi_Tamil_Video___D._Imman_MP3_160K_lo7bu5.mp3" },
  { id: 41, title: "Oday Oday", artist: "Various", album: "Oday Oday", genre: "Tamil", url: "https://res.cloudinary.com/dvjkqjkr7/video/upload/v1778311717/Oday_Oday_MP3_160K_qmmiex.mp3" },
  { id: 42, title: "Vaada Vaada", artist: "Various", album: "Vaada Vaada", genre: "Tamil", url: "https://res.cloudinary.com/dvjkqjkr7/video/upload/v1778311529/Vaada-Vaada_bzhtcy.mp3" }
];

// ─── Playlists ───
const PLAYLISTS = [
  {
    id: "all_songs",
    name: "All Songs",
    desc: "Every track available in Audify",
    cover: "assets/images/all_songs.png",
    color: "#27ae60",
    songIds: SONGS.map(s => s.id)
  },
  {
    id: "romantic",
    name: "Romantic Hits",
    desc: "The most heartfelt love songs to set the mood",
    cover: "assets/images/romantic.png",
    color: "#8b2fc9",
    songIds: [1, 5, 8, 10, 15, 19, 21, 23, 24, 31]
  },
  {
    id: "party",
    name: "Party Vibes",
    desc: "Turn up the energy with these bangers",
    cover: "assets/images/party.png",
    color: "#e8530e",
    songIds: [2, 9, 11, 12, 20, 22, 25, 29]
  },
  {
    id: "chill",
    name: "Chill Melodies",
    desc: "Relax and unwind with soulful melodies",
    cover: "assets/images/chill.png",
    color: "#1a8a6e",
    songIds: [4, 6, 7, 13, 14, 16, 27, 28, 30]
  },
  {
    id: "bollywood",
    name: "Bollywood Feels",
    desc: "Best of Hindi cinema music",
    cover: "assets/images/bollywood.png",
    color: "#c41c1c",
    songIds: [1]
  },
  {
    id: "trending",
    name: "Trending Now",
    desc: "What everyone is listening to right now",
    cover: "assets/images/trending.png",
    color: "#1db954",
    songIds: [26, 10, 12, 15, 29, 17, 18, 11]
  },
  {
    id: "classics",
    name: "Timeless Classics",
    desc: "Golden era hits that never get old",
    cover: "assets/images/classics.png",
    color: "#b8860b",
    songIds: [5, 6, 7, 8, 13, 14, 31, 3, 4]
  }
];

const CATEGORIES = [
  { name: "Tamil", color: "#e13300", icon: "fa-music" },
  { name: "Bollywood", color: "#8400e7", icon: "fa-film" },
  { name: "Romantic", color: "#e8115b", icon: "fa-heart" },
  { name: "Party", color: "#1e3264", icon: "fa-champagne-glasses" },
  { name: "Indie", color: "#148a08", icon: "fa-guitar" },
  { name: "Chill", color: "#477d95", icon: "fa-cloud-moon" },
  { name: "Workout", color: "#e91429", icon: "fa-dumbbell" },
  { name: "Devotional", color: "#e1118b", icon: "fa-om" }
];

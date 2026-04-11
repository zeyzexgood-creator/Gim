// ============================================
// MOCK DATA (Fallback jika API tidak tersedia)
// ============================================

const quickPicks = [
    { id: 'UC_l32WwGX6D4B4TzL2pUJwA', name: 'Tulus', thumbnailColor: 'linear-gradient(135deg, #667eea, #764ba2)' },
    { id: 'UCsLmWCPQ11W1XPlTpDQEb1w', name: 'Dewa 19', thumbnailColor: 'linear-gradient(135deg, #f093fb, #f5576c)' },
    { id: 'UCeJMj0AQC7mE2qOjZ-zFJtA', name: 'Sheila On 7', thumbnailColor: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
    { id: 'UCXykPOCtn2ktu6SaM2f9u6g', name: 'Noah', thumbnailColor: 'linear-gradient(135deg, #43e97b, #38f9d7)' },
];

const getMockTrending = () => {
    return [
        { id: 's1', title: 'Hati-Hati di Jalan', artist: 'Tulus', thumbnailColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', duration: 225, durationFormatted: '3:45', views: '12M', likes: '450K' },
        { id: 's2', title: 'Risalah Hati', artist: 'Dewa 19', thumbnailColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', duration: 255, durationFormatted: '4:15', views: '8.5M', likes: '320K' },
        { id: 's3', title: 'Dan', artist: 'Sheila On 7', thumbnailColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', duration: 245, durationFormatted: '4:05', views: '15M', likes: '580K' },
        { id: 's4', title: 'Kukatakan Dengan Indah', artist: 'Peterpan', thumbnailColor: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', duration: 235, durationFormatted: '3:55', views: '20M', likes: '750K' },
        { id: 's5', title: 'Monokrom', artist: 'Tulus', thumbnailColor: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', duration: 222, durationFormatted: '3:42', views: '9.2M', likes: '380K' },
    ];
};

const getMockPlaylists = () => {
    return [
        { id: 'p1', title: 'Hits Indonesia 2024', description: 'Lagu terpopuler minggu ini', thumbnailColor: 'linear-gradient(135deg, #FF6B6B, #FF8E53)', songCount: 50, type: 'playlist' },
        { id: 'p2', title: 'Santai Sejenak', description: 'Temani waktu santaimu', thumbnailColor: 'linear-gradient(135deg, #6B8EFF, #53B8FF)', songCount: 35, type: 'playlist' },
        { id: 'p3', title: 'Throwback 2000an', description: 'Nostalgia masa SMA', thumbnailColor: 'linear-gradient(135deg, #C56BFF, #9B53FF)', songCount: 42, type: 'playlist' },
    ];
};

const getMockSearchResults = (query) => {
    const allSongs = [
        ...getMockTrending(),
        { id: 'n1', title: 'Selamat Ulang Tahun', artist: 'Nadin Amizah', thumbnailColor: 'linear-gradient(135deg, #FF9A9E, #FECFEF)', duration: 252, durationFormatted: '4:12', views: '5.2M' },
        { id: 'n2', title: 'Bunga Hati', artist: 'Salma Salsabil', thumbnailColor: 'linear-gradient(135deg, #A18CD1, #FBC2EB)', duration: 238, durationFormatted: '3:58', views: '3.1M' },
        { id: 'n3', title: 'Tak Segampang Itu', artist: 'Anggi Marito', thumbnailColor: 'linear-gradient(135deg, #FFD3A5, #FD6585)', duration: 262, durationFormatted: '4:22', views: '7.8M' },
        { id: 'n4', title: 'Komang', artist: 'Raim Laode', thumbnailColor: 'linear-gradient(135deg, #89F7FE, #66A6FF)', duration: 225, durationFormatted: '3:45', views: '11M' },
        { id: 'c1', title: 'Sial', artist: 'Mahalini', thumbnailColor: 'linear-gradient(135deg, #E2B0FF, #9F44D3)', duration: 232, durationFormatted: '3:52', views: '25M' },
        { id: 'c2', title: 'Sempurna', artist: 'Andra & The Backbone', thumbnailColor: 'linear-gradient(135deg, #FCCF31, #F55555)', duration: 248, durationFormatted: '4:08', views: '30M' },
        { id: 'c3', title: 'Kisah Sempurna', artist: 'Mahalini', thumbnailColor: 'linear-gradient(135deg, #A9F1DF, #FFBBBB)', duration: 242, durationFormatted: '4:02', views: '18M' },
        { id: 'c4', title: 'Rayuan Perempuan Gila', artist: 'Nadin Amizah', thumbnailColor: 'linear-gradient(135deg, #B5EAEA, #EDF6E5)', duration: 255, durationFormatted: '4:15', views: '12M' },
    ];
    
    if (!query) return allSongs.slice(0, 10);
    return allSongs.filter(song =>
        song.title.toLowerCase().includes(query.toLowerCase()) ||
        song.artist.toLowerCase().includes(query.toLowerCase())
    );
};

const categories = [
    { id: 'all', name: 'Semua', icon: 'fa-globe', color: '#ff4444' },
    { id: 'music', name: 'Musik', icon: 'fa-music', color: '#ff4444' },
    { id: 'podcast', name: 'Podcast', icon: 'fa-podcast', color: '#ff4444' },
    { id: 'live', name: 'Live', icon: 'fa-circle', color: '#ff4444' },
];
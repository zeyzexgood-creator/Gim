// ============================================
// CONFIGURATION - GANTI DENGAN API KEY ANDA
// ============================================

const CONFIG = {
    YOUTUBE_API_KEY: 'AIzaSyD4wbENNzhW6QIpOVWQTGBeRGGR0NdR3gQ', // ← GANTI DENGAN API KEY ANDA
    YOUTUBE_API_BASE: 'https://www.googleapis.com/youtube/v3',
    DEFAULT_REGION: 'ID',
    MAX_RESULTS: 20
};

// Cek apakah API Key sudah diisi
if (CONFIG.YOUTUBE_API_KEY === 'AIzaSyD4wbENNzhW6QIpOVWQTGBeRGGR0NdR3gQ') {
    console.warn('⚠️ YouTube API Key belum diatur. Menggunakan data mock.');
}
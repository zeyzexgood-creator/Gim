// ============================================
// MAIN APP COMPONENT
// ============================================

const App = () => {
    const [activeNav, setActiveNav] = React.useState('home');
    const [activeCategory, setActiveCategory] = React.useState('all');
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [currentSong, setCurrentSong] = React.useState(null);
    const [trendingSongs, setTrendingSongs] = React.useState([]);
    const [playlists, setPlaylists] = React.useState([]);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [searchResults, setSearchResults] = React.useState([]);
    const [isSearching, setIsSearching] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [apiError, setApiError] = React.useState(null);
    
    // Helper function untuk style thumbnail (menghindari warning)
    const getThumbnailStyle = (thumbnailColor) => {
        if (!thumbnailColor) {
            return {
                backgroundImage: 'linear-gradient(135deg, #667eea, #764ba2)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            };
        }
        
        if (thumbnailColor.startsWith('url(') || thumbnailColor.startsWith('http')) {
            const url = thumbnailColor.startsWith('url(') 
                ? thumbnailColor 
                : `url(${thumbnailColor})`;
            return {
                backgroundImage: url,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            };
        } else {
            return {
                backgroundImage: thumbnailColor,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            };
        }
    };
    
    // Load initial data
    React.useEffect(() => {
        loadTrendingMusic();
        loadPlaylists();
    }, []);
    
    const loadTrendingMusic = async () => {
        setIsLoading(true);
        setApiError(null);
        try {
            const trending = await getTrendingMusic(10);
            setTrendingSongs(trending);
            if (trending.length > 0 && !currentSong) {
                setCurrentSong(trending[0]);
            }
        } catch (error) {
            console.error('Error loading trending:', error);
            setApiError('Gagal memuat data trending. Menggunakan data offline.');
            // Fallback ke mock data
            const mockTrending = getMockTrending();
            setTrendingSongs(mockTrending);
            if (!currentSong && mockTrending.length > 0) {
                setCurrentSong(mockTrending[0]);
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const loadPlaylists = async () => {
        try {
            const playlistsData = await getMusicPlaylists(6);
            setPlaylists(playlistsData);
        } catch (error) {
            console.error('Error loading playlists:', error);
            setPlaylists(getMockPlaylists());
        }
    };
    
    // Search debounce
    const debouncedSearch = React.useCallback(
        debounce(async (query) => {
            if (!query.trim()) {
                setSearchResults([]);
                setIsSearching(false);
                return;
            }
            
            setIsLoading(true);
            try {
                const results = await searchVideos(query, 20);
                setSearchResults(results);
            } catch (error) {
                console.error('Search error:', error);
                setSearchResults(getMockSearchResults(query));
            } finally {
                setIsLoading(false);
            }
        }, 500),
        []
    );
    
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        setIsSearching(value.length > 0);
        debouncedSearch(value);
    };
    
    const handleNavigate = (nav) => {
        setActiveNav(nav);
        if (nav !== 'home') {
            alert(`📱 Navigasi ke ${nav}`);
        }
    };
    
    const handlePlaySong = (song) => {
        setCurrentSong(song);
        setIsPlaying(true);
        setSearchQuery('');
        setIsSearching(false);
        setActiveNav('home');
    };
    
    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };
    
    const handleNext = () => {
        if (!currentSong || trendingSongs.length === 0) return;
        const currentIndex = trendingSongs.findIndex(s => s.id === currentSong.id);
        const nextIndex = (currentIndex + 1) % trendingSongs.length;
        setCurrentSong(trendingSongs[nextIndex]);
        setIsPlaying(true);
    };
    
    const handlePrevious = () => {
        if (!currentSong || trendingSongs.length === 0) return;
        const currentIndex = trendingSongs.findIndex(s => s.id === currentSong.id);
        const prevIndex = currentIndex === 0 ? trendingSongs.length - 1 : currentIndex - 1;
        setCurrentSong(trendingSongs[prevIndex]);
        setIsPlaying(true);
    };
    
    // Tampilkan API warning jika belum di-set
    React.useEffect(() => {
        if (!isApiKeyValid()) {
            setApiError('⚠️ YouTube API Key belum diatur. Edit js/config.js dan tambahkan API Key Anda. Aplikasi menggunakan data mock.');
        }
    }, []);
    
    return (
        <div className="app-container">
            {/* Header */}
            <header className="app-header">
                <div className="header-top">
                    <div className="logo-area">
                        <div className="logo-icon">
                            <i className="fab fa-youtube"></i>
                        </div>
                        <span className="logo-text">
                            <span className="yt">YouTube</span>
                            <span className="music"> Music</span>
                        </span>
                    </div>
                    <div className="header-actions">
                        <i className="fas fa-cast" onClick={() => alert('📺 Cast ke perangkat')}></i>
                        <i className="far fa-bell" onClick={() => alert('🔔 Notifikasi')}></i>
                    </div>
                </div>
                <div className="search-wrapper">
                    <i className="fas fa-search"></i>
                    <input 
                        type="text" 
                        placeholder="Cari lagu, artis, atau podcast" 
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={() => setIsSearching(true)}
                    />
                    {searchQuery && (
                        <i 
                            className="fas fa-times" 
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                                setSearchQuery('');
                                setIsSearching(false);
                                setSearchResults([]);
                            }}
                        ></i>
                    )}
                </div>
            </header>

            {/* API Error Message */}
            {apiError && (
                <div className="error-message">
                    <i className="fas fa-exclamation-triangle" style={{ marginRight: '8px' }}></i>
                    {apiError}
                </div>
            )}

            {isSearching ? (
                <main className="app-content">
                    <div className="section-header">
                        <h3><i className="fas fa-search"></i> Hasil Pencarian</h3>
                        <span className="view-link" onClick={() => setIsSearching(false)}>Tutup ›</span>
                    </div>
                    <SearchResults 
                        results={searchResults}
                        isLoading={isLoading}
                        onPlaySong={handlePlaySong}
                    />
                </main>
            ) : (
                <>
                    {/* Chip Categories */}
                    <div className="chip-container">
                        {categories.map(cat => (
                            <div
                                key={cat.id}
                                className={`chip ${activeCategory === cat.id ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat.id)}
                            >
                                <i className={`fas ${cat.icon}`} style={{ marginRight: '6px' }}></i>
                                {cat.name}
                            </div>
                        ))}
                    </div>

                    {/* Main Content */}
                    <main className="app-content">
                        {/* Quick Picks */}
                        <div className="section-header">
                            <h3><i className="fas fa-bolt" style={{ color: '#FFD700' }}></i> Pilihan Cepat</h3>
                            <span className="view-link" onClick={() => alert('✏️ Edit pilihan cepat')}>Edit ›</span>
                        </div>
                        <div className="quick-picks-grid">
                            {quickPicks.map(pick => (
                                <div key={pick.id} className="quick-pick-item" onClick={() => alert(`👤 ${pick.name}`)}>
                                    <div 
                                        className="quick-pick-thumb" 
                                        style={getThumbnailStyle(pick.thumbnailColor)}
                                    ></div>
                                    <div className="quick-pick-name">{pick.name}</div>
                                </div>
                            ))}
                        </div>

                        {/* Trending Songs */}
                        <div className="section-header">
                            <h3><i className="fas fa-fire" style={{ color: '#FF6B6B' }}></i> Sedang Trending</h3>
                            <span className="view-link" onClick={() => alert('📈 Lihat semua trending')}>Lihat semua ›</span>
                        </div>
                        
                        {isLoading ? (
                            <div className="loading-container">
                                <div className="loading-spinner"></div>
                            </div>
                        ) : (
                            <div className="horizontal-scroll">
                                {trendingSongs.map(song => (
                                    <MusicCard key={song.id} song={song} onClick={handlePlaySong} />
                                ))}
                            </div>
                        )}

                        {/* Recommended Playlists */}
                        <div className="section-header">
                            <h3><i className="fas fa-headphones" style={{ color: '#6B8EFF' }}></i> Rekomendasi Playlist</h3>
                            <span className="view-link" onClick={() => alert('📋 Playlist lainnya')}>Lainnya ›</span>
                        </div>
                        <div className="grid-2col">
                            {playlists.slice(0, 4).map(playlist => (
                                <PlaylistCard 
                                    key={playlist.id} 
                                    playlist={playlist} 
                                    onClick={() => alert(`📀 Membuka ${playlist.title}`)} 
                                />
                            ))}
                        </div>

                        <div className="divider"></div>
                        <div style={{ height: '10px' }}></div>
                    </main>
                </>
            )}

            {/* Player Bar */}
            <PlayerBar 
                currentSong={currentSong} 
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                onNext={handleNext}
                onPrevious={handlePrevious}
            />

            {/* Bottom Navigation */}
            <BottomNav active={activeNav} onNavigate={handleNavigate} />
        </div>
    );
};
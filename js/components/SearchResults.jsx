// ============================================
// COMPONENT: SearchResults
// ============================================

const SearchResults = ({ results, isLoading, onPlaySong, onClose }) => {
    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Mencari lagu...</p>
            </div>
        );
    }

    if (!results || results.length === 0) {
        return (
            <div className="loading-container">
                <i className="fas fa-search" style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.5 }}></i>
                <p>Tidak ada hasil ditemukan</p>
            </div>
        );
    }

    return (
        <div className="search-results-grid">
            {results.map(video => (
                <VideoCard key={video.id} video={video} onClick={onPlaySong} />
            ))}
        </div>
    );
};
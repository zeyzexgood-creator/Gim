// ============================================
// COMPONENT: PlaylistCard
// ============================================

const PlaylistCard = ({ playlist, onClick }) => {
    const handleClick = () => {
        if (onClick) onClick(playlist);
    };
    
    const getThumbnailStyle = () => {
        const thumbColor = playlist.thumbnailColor || 'linear-gradient(135deg, #FF6B6B, #FF8E53)';
        
        if (thumbColor.startsWith('url(') || thumbColor.startsWith('http')) {
            const url = thumbColor.startsWith('url(') ?
                thumbColor :
                `url(${thumbColor})`;
            return {
                backgroundImage: url,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            };
        } else {
            return {
                backgroundImage: thumbColor,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            };
        }
    };
    
    return (
        <div className="playlist-card" onClick={handleClick}>
            <div className="playlist-thumb" style={getThumbnailStyle()}></div>
            <div className="playlist-info">
                <div className="playlist-title">{playlist.title}</div>
                <div className="playlist-meta">
                    {playlist.type === 'playlist' ? '📋 Playlist' : '💿 Album'} · {playlist.songCount} lagu
                </div>
            </div>
        </div>
    );
};
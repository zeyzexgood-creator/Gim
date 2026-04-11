// ============================================
// COMPONENT: MusicCard
// ============================================

const MusicCard = ({ song, onClick }) => {
    const handleClick = () => {
        if (onClick) onClick(song);
    };
    
    const getThumbnailStyle = () => {
        const thumbColor = song.thumbnailColor || 'linear-gradient(135deg, #667eea, #764ba2)';
        
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
        <div className="music-card" onClick={handleClick}>
            <div className="card-thumbnail" style={getThumbnailStyle()}>
                <div className="thumbnail-overlay">
                    <i className="fas fa-play"></i>
                </div>
            </div>
            <div className="card-title">{song.title}</div>
            <div className="card-subtitle">{song.artist}</div>
        </div>
    );
};
// ============================================
// COMPONENT: VideoCard (untuk hasil search)
// ============================================

const VideoCard = ({ video, onClick }) => {
    const getThumbnailStyle = () => {
        const thumbColor = video.thumbnailColor || 'linear-gradient(135deg, #2a2a3a, #1a1a2a)';
        
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
        <div className="music-card" onClick={() => onClick(video)}>
            <div className="card-thumbnail" style={getThumbnailStyle()}>
                <div className="thumbnail-overlay">
                    <i className="fas fa-play"></i>
                </div>
                <div style={{
                    position: 'absolute',
                    bottom: '4px',
                    right: '4px',
                    background: 'rgba(0,0,0,0.7)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    color: 'white'
                }}>
                    {video.durationFormatted}
                </div>
            </div>
            <div className="card-title">{video.title}</div>
            <div className="card-subtitle">{video.artist}</div>
            <div className="video-stat">
                <span><i className="fas fa-eye"></i> {video.views}</span>
                <span><i className="far fa-clock"></i> {video.durationFormatted}</span>
            </div>
        </div>
    );
};
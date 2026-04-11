// ============================================
// COMPONENT: NowPlayingPage (Full Screen Player)
// ============================================

const NowPlayingPage = ({ 
    currentSong, 
    isPlaying, 
    currentTime, 
    duration,
    volume,
    isMuted,
    isBuffering,
    isLoadingSong,
    progressPercent,
    onPlayPause, 
    onNext, 
    onPrevious,
    onVolumeChange,
    onToggleMute,
    onSeek,
    onClose
}) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);
    const pageRef = React.useRef(null);
    const progressRef = React.useRef(null);

    React.useEffect(() => {
        // Animasi masuk
        setTimeout(() => {
            setIsVisible(true);
        }, 10);

        // Handle escape key
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        setIsVisible(false);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    const handleProgressClick = (e) => {
        if (!progressRef.current || !duration) return;
        const rect = progressRef.current.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        const newTime = Math.max(0, Math.min(duration, percent * duration));
        onSeek(newTime);
    };

    const getThumbnailStyle = () => {
        const thumbColor = currentSong?.thumbnailColor || 'linear-gradient(135deg, #667eea, #764ba2)';
        
        if (thumbColor.startsWith('url(') || thumbColor.startsWith('http')) {
            const url = thumbColor.startsWith('url(') 
                ? thumbColor 
                : `url(${thumbColor})`;
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

    if (!currentSong) return null;

    return (
        <>
            {/* Overlay background */}
            <div 
                className={`now-playing-overlay ${isVisible ? 'visible' : ''} ${isClosing ? 'closing' : ''}`}
                onClick={handleClose}
            ></div>
            
            {/* Now Playing Page */}
            <div 
                className={`now-playing-page ${isVisible ? 'visible' : ''} ${isClosing ? 'closing' : ''}`}
                ref={pageRef}
            >
                {/* Header */}
                <div className="now-playing-header">
                    <i className="fas fa-chevron-down" onClick={handleClose}></i>
                    <div className="now-playing-header-title">
                        <span>NOW PLAYING</span>
                    </div>
                    <i className="fas fa-ellipsis-v" onClick={() => alert('🎵 Opsi lainnya')}></i>
                </div>
                
                {/* Artwork */}
                <div className="now-playing-artwork">
                    <div 
                        className={`artwork-image ${isPlaying ? 'playing' : 'paused'}`}
                        style={getThumbnailStyle()}
                    >
                        {(isLoadingSong || isBuffering) && (
                            <div className="artwork-shimmer"></div>
                        )}
                    </div>
                </div>
                
                {/* Song Info */}
                <div className="now-playing-info">
                    <div className="now-playing-title">
                        {currentSong.title}
                        {isLoadingSong && <span className="loading-dots"></span>}
                    </div>
                    <div className="now-playing-artist">{currentSong.artist}</div>
                </div>
                
                {/* Progress Bar */}
                <div className="now-playing-progress">
                    <div 
                        className="now-playing-progress-wrapper"
                        ref={progressRef}
                        onClick={handleProgressClick}
                    >
                        <div 
                            className="now-playing-progress-fill"
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                        {(isBuffering || isLoadingSong) && (
                            <div className="now-playing-shimmer-container">
                                <div className="now-playing-shimmer"></div>
                            </div>
                        )}
                    </div>
                    <div className="now-playing-time-display">
                        <span>{formatDuration(currentTime)}</span>
                        <span>{formatDuration(duration)}</span>
                    </div>
                </div>
                
                {/* Controls */}
                <div className="now-playing-controls">
                    <i className="fas fa-random" onClick={() => alert('🔀 Shuffle')}></i>
                    <i className="fas fa-step-backward" onClick={onPrevious}></i>
                    <div className="play-pause-wrapper" onClick={onPlayPause}>
                        <i className={`fas ${isPlaying ? 'fa-pause-circle' : 'fa-play-circle'}`}></i>
                    </div>
                    <i className="fas fa-step-forward" onClick={onNext}></i>
                    <i className="fas fa-redo-alt" onClick={() => alert('🔁 Repeat')}></i>
                </div>
                
                {/* Volume Control */}
                <div className="now-playing-volume">
                    <i 
                        className={`fas fa-volume-${isMuted || volume === 0 ? 'mute' : volume < 50 ? 'down' : 'up'}`}
                        onClick={onToggleMute}
                    ></i>
                    <div 
                        className="now-playing-volume-slider"
                        onClick={onVolumeChange}
                    >
                        <div 
                            className="now-playing-volume-fill"
                            style={{ width: `${isMuted ? 0 : volume}%` }}
                        ></div>
                    </div>
                </div>
                
                {/* Action Buttons */}
                <div className="now-playing-actions">
                    <div className="action-item" onClick={() => alert('❤️ Tambah ke Favorit')}>
                        <i className="far fa-heart"></i>
                        <span>Favorit</span>
                    </div>
                    <div className="action-item" onClick={() => alert('📋 Tambah ke Playlist')}>
                        <i className="far fa-list-alt"></i>
                        <span>Playlist</span>
                    </div>
                    <div className="action-item" onClick={() => alert('⬇️ Download')}>
                        <i className="fas fa-download"></i>
                        <span>Download</span>
                    </div>
                    <div className="action-item" onClick={() => alert('📤 Share')}>
                        <i className="fas fa-share-alt"></i>
                        <span>Share</span>
                    </div>
                </div>
                
                {/* Status Loading */}
                {(isBuffering || isLoadingSong) && (
                    <div className="now-playing-status">
                        <div className="loading-spinner-small"></div>
                        <span>{isLoadingSong ? 'Memuat lagu...' : 'Buffering...'}</span>
                    </div>
                )}
            </div>
        </>
    );
};
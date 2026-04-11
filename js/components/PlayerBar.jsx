// ============================================
// COMPONENT: PlayerBar dengan YouTube IFrame API
// ============================================

// Global variable untuk menyimpan player instance
let youtubePlayer = null;
let playerReady = false;
let pendingVideoId = null;
let loadTimeout = null;

// Inisialisasi YouTube API
window.onYouTubeIframeAPIReady = () => {
    console.log('✅ YouTube IFrame API Ready');
};

const PlayerBar = ({ currentSong, isPlaying, onPlayPause, onNext, onPrevious }) => {
    const [currentTime, setCurrentTime] = React.useState(0);
    const [duration, setDuration] = React.useState(0);
    const [volume, setVolume] = React.useState(70);
    const [isMuted, setIsMuted] = React.useState(false);
    const [showVolume, setShowVolume] = React.useState(false);
    const [playerState, setPlayerState] = React.useState(-1);
    const [isBuffering, setIsBuffering] = React.useState(false);
    const [isLoadingSong, setIsLoadingSong] = React.useState(false);
    const [loadError, setLoadError] = React.useState(false);
    const [retryCount, setRetryCount] = React.useState(0);
    const [showNowPlaying, setShowNowPlaying] = React.useState(false);
    const progressRef = React.useRef(null);
    const intervalRef = React.useRef(null);
    const playerContainerId = 'youtube-player-container';
    const maxRetries = 3;

    // Cleanup
    React.useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            if (loadTimeout) {
                clearTimeout(loadTimeout);
            }
        };
    }, []);

    // Update player ketika currentSong berubah
    React.useEffect(() => {
        if (currentSong && currentSong.id) {
            setLoadError(false);
            setRetryCount(0);
            setIsLoadingSong(true);
            loadVideo(currentSong.id);
        }
    }, [currentSong?.id]);

    // Handle play/pause dari parent
    React.useEffect(() => {
        if (youtubePlayer && playerReady) {
            if (isPlaying) {
                youtubePlayer.unMute();
                youtubePlayer.playVideo();
            } else {
                youtubePlayer.pauseVideo();
            }
        }
    }, [isPlaying]);

    // Set volume
    React.useEffect(() => {
        if (youtubePlayer && playerReady) {
            youtubePlayer.setVolume(isMuted ? 0 : volume);
            if (isMuted) {
                youtubePlayer.mute();
            } else {
                youtubePlayer.unMute();
            }
        }
    }, [volume, isMuted]);

    // Fungsi untuk load video dengan retry
    const loadVideo = (videoId) => {
        if (!videoId) return;

        if (loadTimeout) {
            clearTimeout(loadTimeout);
        }

        loadTimeout = setTimeout(() => {
            if (isLoadingSong && !loadError) {
                console.warn('⚠️ Loading stuck detected, retrying...');
                handleRetry();
            }
        }, 8000);

        if (!playerReady || !youtubePlayer) {
            pendingVideoId = videoId;
            createPlayer(videoId);
            return;
        }

        setCurrentTime(0);
        setIsLoadingSong(true);
        setLoadError(false);
        
        try {
            youtubePlayer.loadVideoById({
                videoId: videoId,
                startSeconds: 0
            });
            youtubePlayer.setVolume(isMuted ? 0 : volume);
            youtubePlayer.unMute();
            
            if (isPlaying) {
                youtubePlayer.playVideo();
            }
        } catch (e) {
            console.error('Load video error:', e);
            handleRetry();
        }
    };

    // Retry mechanism
    const handleRetry = () => {
        if (retryCount < maxRetries && currentSong) {
            console.log(`🔄 Retry attempt ${retryCount + 1}/${maxRetries}`);
            setRetryCount(prev => prev + 1);
            setIsLoadingSong(true);
            setLoadError(false);
            
            if (retryCount >= 2) {
                if (youtubePlayer) {
                    youtubePlayer.destroy();
                }
                playerReady = false;
                youtubePlayer = null;
                createPlayer(currentSong.id);
            } else {
                setTimeout(() => {
                    if (youtubePlayer && playerReady) {
                        youtubePlayer.loadVideoById(currentSong.id);
                        youtubePlayer.unMute();
                        if (isPlaying) {
                            youtubePlayer.playVideo();
                        }
                    }
                }, 500);
            }
        } else {
            console.error('❌ Max retries reached, skipping song');
            setLoadError(true);
            setIsLoadingSong(false);
            setIsBuffering(false);
            
            if (onNext) {
                setTimeout(() => onNext(), 1000);
            }
        }
    };

    // Buat YouTube player
    const createPlayer = (videoId) => {
        if (youtubePlayer) {
            youtubePlayer.destroy();
        }

        let container = document.getElementById(playerContainerId);
        if (!container) {
            container = document.createElement('div');
            container.id = playerContainerId;
            container.style.display = 'none';
            document.body.appendChild(container);
        }

        try {
            youtubePlayer = new YT.Player(playerContainerId, {
                videoId: videoId,
                playerVars: {
                    autoplay: 0,
                    controls: 0,
                    disablekb: 1,
                    enablejsapi: 1,
                    iv_load_policy: 3,
                    modestbranding: 1,
                    playsinline: 1,
                    rel: 0,
                    showinfo: 0,
                    fs: 0,
                    origin: window.location.origin
                },
                events: {
                    onReady: onPlayerReady,
                    onStateChange: onPlayerStateChange,
                    onError: onPlayerError
                }
            });
        } catch (e) {
            console.error('Create player error:', e);
            handleRetry();
        }
    };

    // Callback player ready
    const onPlayerReady = (event) => {
        console.log('🎵 YouTube Player Ready');
        playerReady = true;
        
        if (loadTimeout) {
            clearTimeout(loadTimeout);
        }
        
        event.target.setVolume(isMuted ? 0 : volume);
        event.target.unMute();
        
        const videoDuration = event.target.getDuration();
        setDuration(videoDuration);
        
        if (isPlaying) {
            event.target.playVideo();
        }
        
        startTimeUpdate();
        
        setTimeout(() => {
            setIsLoadingSong(false);
            setLoadError(false);
        }, 500);
    };

    // Callback state change
    const onPlayerStateChange = (event) => {
        setPlayerState(event.data);
        
        if (loadTimeout && event.data !== YT.PlayerState.UNSTARTED) {
            clearTimeout(loadTimeout);
        }
        
        switch(event.data) {
            case YT.PlayerState.PLAYING:
                startTimeUpdate();
                setIsBuffering(false);
                setIsLoadingSong(false);
                setLoadError(false);
                break;
                
            case YT.PlayerState.PAUSED:
                stopTimeUpdate();
                setIsBuffering(false);
                break;
                
            case YT.PlayerState.BUFFERING:
                setIsBuffering(true);
                break;
                
            case YT.PlayerState.ENDED:
                stopTimeUpdate();
                setIsBuffering(false);
                setCurrentTime(duration);
                if (onNext) {
                    setTimeout(() => onNext(), 500);
                }
                break;
                
            case YT.PlayerState.CUED:
                if (youtubePlayer) {
                    setDuration(youtubePlayer.getDuration());
                }
                setIsLoadingSong(false);
                if (isPlaying) {
                    setTimeout(() => {
                        youtubePlayer?.playVideo();
                    }, 100);
                }
                break;
                
            case YT.PlayerState.UNSTARTED:
                setIsLoadingSong(true);
                break;
        }
    };

    // Callback error
    const onPlayerError = (event) => {
        console.error('❌ YouTube Player Error:', event.data);
        
        if (loadTimeout) {
            clearTimeout(loadTimeout);
        }
        
        setIsLoadingSong(false);
        setIsBuffering(false);
        
        if (event.data === 101 || event.data === 150) {
            setLoadError(true);
            alert('⚠️ Video ini tidak dapat diputar karena dibatasi oleh pemiliknya.\nMelanjutkan ke lagu berikutnya...');
            if (onNext) {
                setTimeout(() => onNext(), 500);
            }
        } else {
            handleRetry();
        }
    };

    // Time update
    const startTimeUpdate = () => {
        stopTimeUpdate();
        intervalRef.current = setInterval(() => {
            if (youtubePlayer && playerReady) {
                try {
                    const time = youtubePlayer.getCurrentTime();
                    const dur = youtubePlayer.getDuration();
                    
                    if (!isNaN(time) && !isNaN(dur)) {
                        setCurrentTime(time);
                        setDuration(dur);
                        
                        const state = youtubePlayer.getPlayerState();
                        if (state === YT.PlayerState.BUFFERING) {
                            setIsBuffering(true);
                        } else if (state === YT.PlayerState.PLAYING) {
                            setIsBuffering(false);
                            setIsLoadingSong(false);
                            setLoadError(false);
                        }
                    }
                } catch (e) {
                    // Player mungkin belum siap
                }
            }
        }, 500);
    };

    const stopTimeUpdate = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    // Seek
    const handleProgressClick = (e) => {
        if (!progressRef.current || !duration || !youtubePlayer || !playerReady) return;
        
        const rect = progressRef.current.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        const newTime = Math.max(0, Math.min(duration, percent * duration));
        
        youtubePlayer.seekTo(newTime, true);
        setCurrentTime(newTime);
    };

    // Volume
    const handleVolumeChange = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        const newVolume = Math.max(0, Math.min(100, percent * 100));
        setVolume(newVolume);
        setIsMuted(false);
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    // Play/Pause
    const handlePlayPauseClick = () => {
        if (youtubePlayer && playerReady) {
            if (playerState === YT.PlayerState.PLAYING) {
                youtubePlayer.pauseVideo();
            } else {
                youtubePlayer.unMute();
                youtubePlayer.playVideo();
            }
        }
        if (onPlayPause) onPlayPause();
    };

    // Manual retry
    const handleManualRetry = () => {
        if (currentSong) {
            setRetryCount(0);
            setLoadError(false);
            setIsLoadingSong(true);
            loadVideo(currentSong.id);
        }
    };

    const handlePreviousClick = () => {
        setIsLoadingSong(true);
        setLoadError(false);
        if (onPrevious) onPrevious();
    };

    const handleNextClick = () => {
        setIsLoadingSong(true);
        setLoadError(false);
        if (onNext) onNext();
    };

    const toggleVolumePanel = () => {
        setShowVolume(!showVolume);
    };

    // Handle seek from NowPlaying page
    const handleSeek = (time) => {
        if (youtubePlayer && playerReady) {
            youtubePlayer.seekTo(time, true);
            setCurrentTime(time);
        }
    };

    // Buka Now Playing Page
    const openNowPlaying = () => {
        setShowNowPlaying(true);
    };

    if (!currentSong) return null;

    const isCurrentlyPlaying = playerState === YT.PlayerState.PLAYING;
    const progressPercent = duration ? (currentTime / duration) * 100 : 0;

    const getThumbnailStyle = () => {
        const thumbColor = currentSong.thumbnailColor || 'linear-gradient(135deg, #667eea, #764ba2)';
        
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

    return (
        <>
            <div className="player-bar">
                <div className="player-content">
                    {/* Thumbnail - Bisa diklik */}
                    <div 
                        className="player-thumb" 
                        style={getThumbnailStyle()}
                        onClick={openNowPlaying}
                    >
                        {isLoadingSong && <div className="thumbnail-shimmer"></div>}
                    </div>
                    
                    {/* Info Area - Bisa diklik untuk buka Now Playing */}
                    <div 
                        className="player-info" 
                        onClick={openNowPlaying}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="player-title">
                            {currentSong.title}
                            {isLoadingSong && <span className="loading-dots"></span>}
                        </div>
                        <div className="player-artist">{currentSong.artist}</div>
                    </div>
                    
                    <div className="player-controls">
                        <i className="fas fa-step-backward" onClick={handlePreviousClick}></i>
                        <i 
                            className={`fas ${isCurrentlyPlaying ? 'fa-pause-circle' : 'fa-play-circle'}`}
                            onClick={handlePlayPauseClick}
                            style={{ opacity: isLoadingSong && !loadError ? 0.5 : 1 }}
                        ></i>
                        <i className="fas fa-step-forward" onClick={handleNextClick}></i>
                    </div>
                </div>
                
                <div className="player-progress-container">
                    <div 
                        className={`progress-bar-wrapper ${isBuffering || isLoadingSong ? 'buffering' : ''}`}
                        ref={progressRef}
                        onClick={handleProgressClick}
                    >
                        <div 
                            className="progress-bar-fill"
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                        
                        {(isBuffering || isLoadingSong) && !loadError && (
                            <div className="progress-shimmer-container">
                                <div className="progress-shimmer"></div>
                            </div>
                        )}
                        
                        {isBuffering && (
                            <div 
                                className="progress-buffer"
                                style={{ width: `${Math.min(progressPercent + 15, 95)}%` }}
                            ></div>
                        )}
                    </div>
                    
                    <div className="time-display">
                        <span className="current-time">
                            {isLoadingSong && !loadError ? (
                                <span className="time-shimmer"></span>
                            ) : (
                                formatDuration(currentTime)
                            )}
                        </span>
                        <span className="duration-time">
                            {duration > 0 ? formatDuration(duration) : '--:--'}
                        </span>
                    </div>
                </div>
                
                {showVolume && (
                    <div className="player-volume">
                        <i 
                            className={`fas fa-volume-${isMuted || volume === 0 ? 'mute' : volume < 50 ? 'down' : 'up'} volume-icon`}
                            onClick={toggleMute}
                        ></i>
                        <div className="volume-slider" onClick={handleVolumeChange}>
                            <div 
                                className="volume-fill"
                                style={{ width: `${isMuted ? 0 : volume}%` }}
                            ></div>
                        </div>
                        <span style={{ color: '#aaa', fontSize: '0.75rem', minWidth: '35px' }}>
                            {Math.round(isMuted ? 0 : volume)}%
                        </span>
                    </div>
                )}
                
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '4px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {(isBuffering || isLoadingSong) && !loadError && (
                            <div className="status-loading">
                                <div className="loading-spinner-small"></div>
                                <span className="status-loading-text">
                                    {isLoadingSong ? 'Memuat...' : 'Buffering...'}
                                    {retryCount > 0 && ` (${retryCount}/${maxRetries})`}
                                </span>
                            </div>
                        )}
                        
                        {loadError && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <i className="fas fa-exclamation-circle" style={{ color: '#ff4444', fontSize: '0.9rem' }}></i>
                                <span style={{ color: '#ff8888', fontSize: '0.7rem' }}>Gagal memuat</span>
                                <button onClick={handleManualRetry}>
                                    <i className="fas fa-redo-alt"></i> Coba Lagi
                                </button>
                            </div>
                        )}
                    </div>
                    <i 
                        className="fas fa-volume-up" 
                        style={{ 
                            color: '#aaaaaa', 
                            fontSize: '0.9rem', 
                            cursor: 'pointer',
                            opacity: 0.7
                        }}
                        onClick={toggleVolumePanel}
                    ></i>
                </div>
            </div>
            
            {/* Now Playing Page */}
            {showNowPlaying && (
                <NowPlayingPage 
                    currentSong={currentSong}
                    isPlaying={isCurrentlyPlaying}
                    currentTime={currentTime}
                    duration={duration}
                    volume={volume}
                    isMuted={isMuted}
                    isBuffering={isBuffering}
                    isLoadingSong={isLoadingSong}
                    progressPercent={progressPercent}
                    onPlayPause={handlePlayPauseClick}
                    onNext={handleNextClick}
                    onPrevious={handlePreviousClick}
                    onVolumeChange={handleVolumeChange}
                    onToggleMute={toggleMute}
                    onSeek={handleSeek}
                    onClose={() => setShowNowPlaying(false)}
                />
            )}
        </>
    );
};
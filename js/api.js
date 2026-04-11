// ============================================
// YOUTUBE API FUNCTIONS
// ============================================

// Cek apakah API Key valid
const isApiKeyValid = () => {
    return CONFIG.YOUTUBE_API_KEY && CONFIG.YOUTUBE_API_KEY !== 'YOUR_YOUTUBE_API_KEY';
};

// Search videos
const searchVideos = async (query, maxResults = 20) => {
    if (!isApiKeyValid()) {
        console.warn('Using mock data - API Key not set');
        return getMockSearchResults(query);
    }
    
    try {
        const response = await fetch(
            `${CONFIG.YOUTUBE_API_BASE}/search?part=snippet&maxResults=${maxResults}&q=${encodeURIComponent(query)}&type=video&videoCategoryId=10&regionCode=${CONFIG.DEFAULT_REGION}&key=${CONFIG.YOUTUBE_API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Get video details (duration, statistics)
        const videoIds = data.items.map(item => item.id.videoId).join(',');
        const detailsResponse = await fetch(
            `${CONFIG.YOUTUBE_API_BASE}/videos?part=contentDetails,statistics&id=${videoIds}&key=${CONFIG.YOUTUBE_API_KEY}`
        );
        
        const detailsData = await detailsResponse.json();
        
        // Merge data
        return data.items.map((item, index) => {
            const details = detailsData.items[index];
            return {
                id: item.id.videoId,
                title: item.snippet.title,
                artist: item.snippet.channelTitle,
                thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium.url,
                thumbnailColor: `url(${item.snippet.thumbnails.medium.url})`,
                publishedAt: item.snippet.publishedAt,
                duration: details ? parseDuration(details.contentDetails.duration) : 0,
                durationFormatted: details ? formatDuration(parseDuration(details.contentDetails.duration)) : '0:00',
                views: details ? formatNumber(parseInt(details.statistics.viewCount || 0)) : '0',
                likes: details ? formatNumber(parseInt(details.statistics.likeCount || 0)) : '0'
            };
        });
        
    } catch (error) {
        console.error('YouTube API Error:', error);
        return getMockSearchResults(query);
    }
};

// Get trending music videos
const getTrendingMusic = async (maxResults = 10) => {
    if (!isApiKeyValid()) {
        return getMockTrending();
    }
    
    try {
        const response = await fetch(
            `${CONFIG.YOUTUBE_API_BASE}/videos?part=snippet,contentDetails,statistics&chart=mostPopular&videoCategoryId=10&regionCode=${CONFIG.DEFAULT_REGION}&maxResults=${maxResults}&key=${CONFIG.YOUTUBE_API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        return data.items.map(item => ({
            id: item.id,
            title: item.snippet.title,
            artist: item.snippet.channelTitle,
            thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium.url,
            thumbnailColor: `url(${item.snippet.thumbnails.medium.url})`,
            publishedAt: item.snippet.publishedAt,
            duration: parseDuration(item.contentDetails.duration),
            durationFormatted: formatDuration(parseDuration(item.contentDetails.duration)),
            views: formatNumber(parseInt(item.statistics.viewCount || 0)),
            likes: formatNumber(parseInt(item.statistics.likeCount || 0))
        }));
        
    } catch (error) {
        console.error('YouTube API Error:', error);
        return getMockTrending();
    }
};

// Get music playlists
const getMusicPlaylists = async (maxResults = 6) => {
    if (!isApiKeyValid()) {
        return getMockPlaylists();
    }
    
    try {
        const response = await fetch(
            `${CONFIG.YOUTUBE_API_BASE}/playlists?part=snippet,contentDetails&channelId=UC-9-kyTW8ZkZNDHQJ6FgpwQ&maxResults=${maxResults}&key=${CONFIG.YOUTUBE_API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        return data.items.map(item => ({
            id: item.id,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.medium.url,
            thumbnailColor: `url(${item.snippet.thumbnails.medium.url})`,
            songCount: item.contentDetails.itemCount,
            type: 'playlist'
        }));
        
    } catch (error) {
        console.error('YouTube API Error:', error);
        return getMockPlaylists();
    }
};

// Get channel info
const getChannelInfo = async (channelId) => {
    if (!isApiKeyValid()) {
        return null;
    }
    
    try {
        const response = await fetch(
            `${CONFIG.YOUTUBE_API_BASE}/channels?part=snippet,statistics&id=${channelId}&key=${CONFIG.YOUTUBE_API_KEY}`
        );
        
        const data = await response.json();
        if (data.items && data.items.length > 0) {
            const item = data.items[0];
            return {
                id: item.id,
                name: item.snippet.title,
                thumbnail: item.snippet.thumbnails.medium.url,
                subscribers: formatNumber(parseInt(item.statistics.subscriberCount || 0))
            };
        }
        return null;
    } catch (error) {
        console.error('YouTube API Error:', error);
        return null;
    }
};
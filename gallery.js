function isStrictHappyCelebration(photo) {
    const combinedText = [
        photo.alt || '',
        photo.photographer || '',
        photo.avg_color || ''
    ].join(' ').toLowerCase();

    const peopleKeywords = [
        'people', 'person', 'group', 'friends', 'family', 'crowd', 'children', 'child',
        'kids', 'kid', 'boy', 'girl', 'man', 'woman', 'baby'
    ];

    const celebrationKeywords = [
        'celebration', 'celebrate', 'celebrating', 'party', 'birthday', 'confetti', 'balloon',
        'gift', 'candle', 'cake', 'cheer', 'cheering', 'cheerful', 'joy', 'joyful',
        'laugh', 'laughing', 'smile', 'smiling', 'happy', 'festive', 'applause'
    ];

    const blockedKeywords = [
        'mountain', 'lake', 'river', 'waterfall', 'forest', 'tree', 'trees', 'ocean', 'sea',
        'beach', 'coast', 'desert', 'cityscape', 'building', 'road', 'animal', 'dog', 'cat',
        'bird', 'flower', 'flowers', 'food', 'dish', 'plate', 'drink', 'coffee', 'landscape',
        'sunset', 'sunrise', 'bedroom', 'office', 'workspace', 'couple kissing', 'wedding ring'
    ];

    const hasPeople = peopleKeywords.some(keyword => combinedText.includes(keyword));
    const hasCelebration = celebrationKeywords.some(keyword => combinedText.includes(keyword));

    if (!hasPeople || !hasCelebration) {
        return false;
    }

    return !blockedKeywords.some(keyword => combinedText.includes(keyword));
}

function isStrictPeacefulScene(photo) {
    const combinedText = [
        photo.alt || '',
        photo.photographer || '',
        photo.avg_color || ''
    ].join(' ').toLowerCase();

    const allowedKeywords = [
        'snow mountain', 'snow mountains', 'snowy mountain', 'snowy mountains', 'mountain peak', 'mountain peaks',
        'snowy peak', 'snowy peaks', 'alpine peak', 'alpine peaks', 'alpine mountain', 'alpine mountains',
        'glacier mountain', 'glacier ridge', 'snow covered mountain', 'snow capped mountain', 'winter mountain',
        'summit', 'summits', 'ridge', 'ridges'
    ];

    const blockedKeywords = [
        'party', 'celebration', 'crowd', 'city', 'urban', 'street', 'road', 'building', 'buildings', 'office',
        'car', 'traffic', 'sports', 'concert', 'festival', 'wedding', 'fight', 'violence', 'fire',
        'disaster', 'blood', 'weapon', 'gun', 'sad', 'crying', 'funeral',
        'person', 'people', 'man', 'woman', 'men', 'women', 'child', 'children', 'kid', 'kids', 'group', 'friends', 'family',
        'house', 'hotel', 'cabin', 'village', 'town', 'bridge', 'church', 'temple',
        'lake', 'lakes', 'lakeside', 'lakefront', 'river', 'rivers', 'waterfall', 'water', 'ocean', 'sea', 'beach', 'coast', 'shore',
        'forest', 'tree', 'trees', 'woods', 'flower', 'flowers', 'garden', 'meadow', 'field', 'desert'
    ];

    const hasAllowed = allowedKeywords.some(keyword => combinedText.includes(keyword));
    if (!hasAllowed) {
        return false;
    }

    return !blockedKeywords.some(keyword => combinedText.includes(keyword));
}

function isStrictHopefulSunrise(photo) {
    const combinedText = [
        photo.alt || '',
        photo.photographer || '',
        photo.avg_color || ''
    ].join(' ').toLowerCase();

    const allowedKeywords = [
        'sunrise', 'sun rise', 'dawn', 'daybreak', 'morning sun', 'morning light', 'early morning',
        'sunlit horizon', 'sun horizon', 'golden sunrise', 'sunrise sky', 'sunrise over', 'first light'
    ];

    const blockedKeywords = [
        'sunset', 'sun set', 'squirrel', 'animal', 'wildlife', 'bird', 'cat', 'dog', 'horse', 'deer',
        'flower', 'flowers', 'food', 'coffee', 'city', 'urban', 'street', 'building', 'office', 'bedroom',
        'portrait', 'selfie', 'product', 'car', 'indoor', 'close up', 'macro'
    ];

    const hasAllowed = allowedKeywords.some(keyword => combinedText.includes(keyword));
    if (!hasAllowed) {
        return false;
    }

    return !blockedKeywords.some(keyword => combinedText.includes(keyword));
}

function isStrictRelaxedResort(photo) {
    const combinedText = [
        photo.alt || '',
        photo.photographer || '',
        photo.avg_color || ''
    ].join(' ').toLowerCase();

    const allowedKeywords = [
        'resort', 'luxury resort', 'beach resort', 'island resort', 'tropical resort', 'spa resort',
        'villa', 'overwater', 'overwater villa', 'bungalow', 'pool villa', 'infinity pool',
        'poolside', 'private pool', 'water villa', 'lagoon villa', 'palm resort'
    ];

    const blockedKeywords = [
        'people', 'person', 'man', 'woman', 'men', 'women', 'child', 'children', 'kid', 'kids',
        'couple', 'friends', 'family', 'crowd', 'portrait', 'selfie', 'wedding', 'bride', 'groom',
        'swim', 'swimming', 'surfer', 'surfing', 'surf', 'boat', 'kayak', 'jet ski', 'party',
        'city', 'urban', 'street', 'traffic', 'restaurant', 'food', 'drink', 'cocktail',
        'animal', 'dog', 'cat', 'bird', 'sunset'
    ];

    const hasAllowed = allowedKeywords.some(keyword => combinedText.includes(keyword));
    if (!hasAllowed) {
        return false;
    }

    return !blockedKeywords.some(keyword => combinedText.includes(keyword));
}

// ==================== Image Filter by Mood ====================
function filterImagesByMood(images, mood) {
    if (!images || images.length === 0) return images;
    
    // Keywords for filtering
    const filterRules = {
        'happy': {
            // Only these types of images are allowed
            allow: ['birthday', 'celebration', 'party', 'confetti', 'balloon', 'gift', 'cake', 'candle', 'smiling', 'smile', 'happy person', 'happy people', 'happy child', 'happy baby', 'happy man', 'happy woman', 'happy girl', 'happy boy', 'joy', 'joyful', 'laughter', 'laughing', 'festive', 'cheerful'],
            // Block clearly inappropriate or unrelated
            block: ['sad', 'cry', 'crying', 'funeral', 'dark', 'scary', 'horror', 'accident', 'injury', 'blood', 'violence', 'war', 'disaster']
        },
        'peaceful': {
            allow: ['snow mountain', 'snow mountains', 'snowy mountain', 'snowy mountains', 'mountain peak', 'mountain peaks', 'snowy peak', 'snowy peaks', 'alpine peak', 'alpine peaks', 'alpine mountain', 'alpine mountains', 'glacier mountain', 'glacier ridge', 'snow covered mountain', 'snow capped mountain', 'winter mountain', 'summit', 'summits', 'ridge', 'ridges'],
            block: ['party', 'celebration', 'crowd', 'city', 'urban', 'street', 'road', 'building', 'buildings', 'traffic', 'violence', 'disaster', 'person', 'people', 'man', 'woman', 'men', 'women', 'child', 'children', 'kid', 'kids', 'group', 'friends', 'family', 'house', 'hotel', 'cabin', 'village', 'town', 'bridge', 'church', 'temple', 'lake', 'lakes', 'lakeside', 'lakefront', 'river', 'rivers', 'waterfall', 'water', 'ocean', 'sea', 'beach', 'coast', 'shore', 'forest', 'tree', 'trees', 'woods', 'flower', 'flowers', 'garden', 'meadow', 'field', 'desert']
        },
        'relaxed': {
            include: ['tropical', 'island', 'resort', 'beach resort', 'beach vacation', 'island vacation', 'palm', 'palm trees', 'lagoon', 'overwater', 'villa', 'hammock', 'coast', 'shore'],
            exclude: ['crowd', 'city', 'urban', 'wave', 'waves', 'storm', 'surf', 'surfing']
        },
        'romantic': {
            include: ['couple', 'love', 'romantic', 'heart', 'kiss', 'embrace', 'sunset couple', 'romance', 'valentine', 'wedding'],
            exclude: ['single', 'alone', 'sad']
        }
    };
    
    const rules = filterRules[mood];
    if (!rules) return images;

    if (mood === 'happy') {
        return images.filter(isStrictHappyCelebration);
    }

    if (mood === 'peaceful') {
        return images.filter(isStrictPeacefulScene);
    }

    if (mood === 'hopeful') {
        return images.filter(isStrictHopefulSunrise);
    }

    if (mood === 'relaxed') {
        return images.filter(isStrictRelaxedResort);
    }
    
    return images.filter(photo => {
        const altText = (photo.alt || '').toLowerCase();
        const photographer = (photo.photographer || '').toLowerCase();
        const combinedText = altText + ' ' + photographer;
        
        // For happy mood, use "allow" list (must match at least one) + block list
        if (mood === 'happy') {
            const hasAllowed = rules.allow.some(keyword => combinedText.includes(keyword.toLowerCase()));
            if (!hasAllowed) {
                return false;
            }
            for (const block of rules.block) {
                if (combinedText.includes(block)) {
                    return false;
                }
            }
            return true;
        }

        const excludeRules = Array.isArray(rules.exclude) ? rules.exclude : [];

        // For other moods, check exclude list
        for (const exclude of excludeRules) {
            if (altText.includes(exclude)) {
                return false;
            }
        }
        
        return true;
    });
}

// ==================== Pexels API Config ====================
console.log('=== gallery.js loaded ===');
const PEXELS_API_KEY = 'kng8vqaVKvDQgmymj28XRTHcvhQoTtcVGgllNbiLFt1wXbQXzjQI915i';
const PEXELS_API_URL = 'https://api.pexels.com/v1/search';
const PEXELS_CURATED_URL = 'https://api.pexels.com/v1/curated';
const GALLERY_CACHE_PREFIX = 'moodGalleryCache:';
const GALLERY_CACHE_TTL = 10 * 60 * 1000;

// ==================== State Variables ====================
let allImages = [];
let currentSlideIndex = 0;
let carouselInterval = null;
let currentPage = 1;
let isLoadingMore = false;
let isMusicPlaying = false;
let currentMusicIndex = 0;
let isFetchingMore = false;
let activeMood = '';

// ==================== Performance Optimizations ====================

// Use smaller image sizes for better performance
const IMAGE_SIZES = {
    main: 'large',      // Main carousel: use 'large' (not large2x) for balance
    thumb: 'tiny',      // Thumbnails: use smallest available
    preload: 'medium'   // Preload: use medium for quick display
};

// Async image decoding for faster rendering
const IMAGE_DECODE = 'async';

function getCacheKey(mood, query) {
    const filterVersion = window.moodConfig?.filterVersion || 'v1';
    return `${GALLERY_CACHE_PREFIX}${mood || 'default'}:${query || 'default'}:${filterVersion}`;
}

function readCachedImages(mood, query) {
    try {
        const cached = localStorage.getItem(getCacheKey(mood, query));
        if (!cached) return null;
        const data = JSON.parse(cached);
        if (!data.timestamp || Date.now() - data.timestamp > GALLERY_CACHE_TTL) {
            localStorage.removeItem(getCacheKey(mood, query));
            return null;
        }

        const images = Array.isArray(data.images) ? data.images : null;
        const requiredCount = window.moodConfig?.per_page || 1;

        if (!images || images.length < requiredCount) {
            localStorage.removeItem(getCacheKey(mood, query));
            return null;
        }

        return images;
    } catch (e) {
        return null;
    }
}

function writeCachedImages(mood, query, images) {
    try {
        const requiredCount = window.moodConfig?.per_page || 1;
        if (!Array.isArray(images) || images.length < requiredCount) return;
        localStorage.setItem(getCacheKey(mood, query), JSON.stringify({
            timestamp: Date.now(),
            images
        }));
    } catch (e) {}
}

// Preconnect to external domains for faster connection
function addPreconnects() {
    const links = [
        'https://images.pexels.com',
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com'
    ];
    
    links.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = href;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    });
}

// Call preconnects on load
document.addEventListener('DOMContentLoaded', addPreconnects);
document.addEventListener('DOMContentLoaded', init);

// ==================== Initialize Gallery ====================
function init() {
    console.log('=== Gallery Init Start ===');
    console.log('Current URL:', window.location.href);
    
    const stored = localStorage.getItem('moodGallerySubscription');
    let isSubscribed = false;
    let trialExpired = false;
    console.log('Stored subscription:', stored);
    
    if (stored) {
        try {
            const data = JSON.parse(stored);
            console.log('Parsed subscription data:', data);
            const now = new Date();
            const endDate = data.subscriptionEndDate ? new Date(data.subscriptionEndDate) : null;
            const trialEndsAt = data.trialEndsAt ? new Date(data.trialEndsAt) : null;
            console.log('End date:', endDate, 'Now:', now);
            console.log('Trial ends at:', trialEndsAt);
            isSubscribed = data.isSubscribed && endDate && endDate > now;
            trialExpired = trialEndsAt ? trialEndsAt <= now : false;
        } catch(e) {
            console.error('Parse error:', e);
        }
    }
    
    // Get current page mood
    const pageMood = (document.body.dataset.mood || '').trim().toLowerCase();
    activeMood = pageMood;
    
    // Current page filename as a second source of truth
    const currentPageFile = window.location.pathname.split('/').pop().toLowerCase();
    
    // Free moods that don't need subscription
    const freeMoods = ['happy', 'peaceful', 'relaxed', 'romantic'];
    const freePages = ['happy.html', 'peaceful.html', 'relaxed.html', 'romantic.html'];
    const isFreeMood = freeMoods.includes(pageMood) || freePages.includes(currentPageFile);
    console.log('Page mood:', pageMood);
    console.log('Current page filename:', currentPageFile);
    console.log('Is free mood/page:', isFreeMood);
    console.log('Trial expired:', trialExpired);
    
    // Premium moods only require payment after the 12-hour countdown ends
    if (!isSubscribed && !isFreeMood && trialExpired) {
        console.log('REDIRECTING: Premium mood, trial expired, not subscribed');
        window.location.href = 'index.html';
        return;
    }
    
    console.log('Proceeding to load images...');
    
    // Get mood config from page
    const config = window.moodConfig || { query: pageMood, per_page: 4 };
    const preferredCount = Math.min(config.per_page || 3, 3);
    
    console.log('Mood config:', config);
    
    // Setup event listeners
    setupEventListeners();
    
    // Don't auto-enter fullscreen, let user click to enter
    
    // Start loading
    showLoading(true);
    
    // Reset state for fresh load
    currentPage = 1;
    allImages = [];

    const cachedImages = readCachedImages(pageMood, config.query);
    if (cachedImages && cachedImages.length > 0) {
        console.log('Using cached images:', cachedImages.length);
        allImages = cachedImages;
        renderCarousel(cachedImages);
        startAutoplay();
        setupMusic(config);
        showFullscreenHint();
        showLoading(false);
        return;
    }
    
    // Check if page wants curated photos
    if (config.useCurated && window.curatedPhotos && window.curatedPhotos.length > 0) {
        loadCuratedImages();
    } else {
        // Generate random page number from a smaller range for faster relevant hits
        const randomPage = Math.floor(Math.random() * 50) + 1;
        
        // Fetch fewer images for faster first paint
        loadImagesWithFallback(config.query, randomPage, preferredCount);
    }
}

async function loadCuratedImages() {
    const config = window.moodConfig || {};
    const curatedList = window.curatedPhotos || [];
    
    console.log('Loading curated photos, total:', curatedList.length);
    
    try {
        // Shuffle curated list for variety, take per_page count
        const shuffled = [...curatedList].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, config.per_page || 3);
        
        const images = normalizePhotos(await fetchCuratedPhotos(selected));
        const filteredImages = typeof filterImagesByMood === 'function'
            ? filterImagesByMood(images, activeMood)
            : images;
        
        if (filteredImages.length > 0) {
            allImages = filteredImages;
            writeCachedImages(activeMood, config.query, filteredImages);
            renderCarousel(filteredImages);
            startAutoplay();
            setupMusic(config);
            showFullscreenHint();
        } else {
            // Fallback to normal loading if curated fails
            console.warn('Curated photos failed, falling back to search...');
            const randomPage = Math.floor(Math.random() * 500) + 1;
            loadImagesWithFallback(config.query || 'nature', randomPage, 3);
        }
    } catch (err) {
        console.error('Error loading curated images:', err);
        showError();
    }
    
    showLoading(false);
}

async function loadImagesWithFallback(query, page, perPage) {
    // Get current mood from page
    const pageMood = document.body.dataset.mood || '';
    const preferredCount = Math.min(perPage || 3, 3);
    
    try {
        let images = normalizePhotos(await fetchImages(query, page, preferredCount, 2));
        
        // Filter images by mood if filter function exists
        if (images.length > 0 && typeof filterImagesByMood === 'function') {
            const filteredImages = filterImagesByMood(images, pageMood);
            console.log('After filtering:', filteredImages.length, 'images from', images.length);
            images = filteredImages;
        }
        
        if (images.length > 0) {
            console.log('Images loaded:', images.length, 'from page', page);
            allImages = images;
            writeCachedImages(pageMood, query, images);
            renderCarousel(images);
            startAutoplay();
            setupMusic(window.moodConfig || { query });
            showFullscreenHint();
        } else {
            // Try with different page if first attempt failed or all filtered out
            console.log('No images, trying different page...');
            let fallbackPage = Math.floor(Math.random() * 20) + 1;
            let fallbackImages = normalizePhotos(await fetchImages(query, fallbackPage, preferredCount, 1));
            
            // Filter fallback images too
            if (fallbackImages.length > 0 && typeof filterImagesByMood === 'function') {
                fallbackImages = filterImagesByMood(fallbackImages, pageMood);
            }
            
            if (fallbackImages.length > 0) {
                allImages = fallbackImages;
                writeCachedImages(pageMood, query, fallbackImages);
                renderCarousel(fallbackImages);
                startAutoplay();
                setupMusic(window.moodConfig || { query });
                showFullscreenHint();
            } else {
                showError();
            }
        }
    } catch (err) {
        console.error('Error loading images:', err);
        showError();
    }
    
    showLoading(false);
}

function showFullscreenHint() {
    const hint = document.createElement('div');
    hint.id = 'fullscreenHint';
    hint.innerHTML = 'Click anywhere to enter fullscreen';
    hint.style.cssText = `
        position: fixed;
        bottom: 120px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.7);
        color: white;
        padding: 12px 24px;
        border-radius: 25px;
        font-size: 0.9rem;
        z-index: 9998;
        animation: fadeInOut 4s ease-in-out forwards;
        pointer-events: none;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; }
            10% { opacity: 1; }
            80% { opacity: 1; }
            100% { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(hint);
    setTimeout(() => hint.remove(), 4000);
}

// ==================== Event Listeners ====================
function setupEventListeners() {
    document.getElementById('prevBtn').addEventListener('click', prevSlide);
    document.getElementById('nextBtn').addEventListener('click', nextSlide);
    document.getElementById('refreshBtn').addEventListener('click', loadNewBatch);
    document.getElementById('downloadBtn').addEventListener('click', downloadCurrentImage);
    
    const musicBtn = document.getElementById('musicBtn');
    if (musicBtn) musicBtn.addEventListener('click', toggleMusic);
    
    const volumeSlider = document.getElementById('volumeSlider');
    if (volumeSlider) volumeSlider.addEventListener('input', handleVolume);
    
    // Click anywhere on carousel to enter fullscreen (except buttons)
    const carousel = document.getElementById('fullscreenCarousel');
    carousel.addEventListener('click', (e) => {
        // Don't trigger fullscreen on these elements
        const excludedTags = ['BUTTON', 'A', 'INPUT', 'SVG', 'PATH', 'LINE', 'POLYLINE'];
        const excludedClasses = ['download-btn', 'refresh-btn', 'back-btn', 'music-btn', 'carousel-nav', 'thumbnail-dot', 'thumbnail-item', 'thumbnail-dots', 'thumbnail-bar'];
        
        let target = e.target;
        while (target && target !== carousel) {
            if (excludedTags.includes(target.tagName) || 
                excludedClasses.some(cls => target.classList && target.classList.contains(cls))) {
                return;
            }
            target = target.parentElement;
        }
        
        // Trigger fullscreen
        enterFullscreen();
    });
    
    // Touch support
    let touchStartX = 0;
    document.getElementById('fullscreenCarousel').addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
    });
    document.getElementById('fullscreenCarousel').addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? nextSlide() : prevSlide();
        }
    });
    
    // Keyboard
    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'Escape') window.location.href = 'index.html';
        if (e.key === 'd' || e.key === 'D') downloadCurrentImage();
        if (e.key === 'f' || e.key === 'F') toggleFullscreen();
    });
}

// Toggle fullscreen
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        enterFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// ==================== SEO Alt Text Generator ====================
function generateAltText(photo, mood) {
    // Pexels provides photographer and description data
    const photographer = photo.photographer || '';
    const alt = photo.alt || '';
    
    // Build SEO-friendly alt text
    let altText = '';
    
    if (alt && alt.length > 20) {
        // Use Pexels alt if available and descriptive enough
        altText = alt;
    } else {
        // Generate alt from mood + photographer + common keywords
        const moodKeywords = {
            'happy': 'happy joyful celebration smiling people happiness',
            'healing': 'healing nature wellness restoration green',
            'focused': 'focused concentration productivity work',
            'relaxed': 'relaxed tropical island resort beach vacation palm trees lagoon',
            'hopeful': 'hopeful sunrise new beginning dawn optimism',
            'amazed': 'amazed stunning cosmic views spectacular',
            'peaceful': 'peaceful calm nature lake forest ocean mountain sunset tranquility',
            'romantic': 'romantic love couple sunset flowers',
            'sleepy': 'sleepy mountain snow moon dream'
        };
        
        const keywords = moodKeywords[mood] || mood;
        altText = `${capitalizeWords(keywords)} - ${photographer} photography`;
    }
    
    // Ensure alt is not too long (max 125 chars for SEO)
    if (altText.length > 125) {
        altText = altText.substring(0, 120) + '...';
    }
    
    return altText;
}

function capitalizeWords(text) {
    return String(text || '')
        .split(/\s+/)
        .filter(Boolean)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function normalizePhoto(photo) {
    if (!photo) return null;

    const id = photo.id || Date.now();
    const photographer = photo.photographer || '';
    const alt = photo.alt || photographer || 'Mood gallery image';

    if (photo.src && (photo.src.large2x || photo.src.large || photo.src.medium || photo.src.tiny)) {
        return {
            ...photo,
            id,
            photographer,
            alt,
            src: {
                original: photo.src.original || photo.src.large2x || photo.src.large || photo.src.medium || photo.src.tiny,
                large2x: photo.src.large2x || photo.src.original || photo.src.large || photo.src.medium || photo.src.tiny,
                large: photo.src.large || photo.src.large2x || photo.src.medium || photo.src.tiny,
                medium: photo.src.medium || photo.src.large || photo.src.large2x || photo.src.tiny,
                small: photo.src.small || photo.src.medium || photo.src.large || photo.src.tiny,
                portrait: photo.src.portrait || photo.src.large2x || photo.src.large || photo.src.medium || photo.src.tiny,
                landscape: photo.src.landscape || photo.src.large || photo.src.medium || photo.src.tiny,
                tiny: photo.src.tiny || photo.src.small || photo.src.medium || photo.src.large
            }
        };
    }

    return buildDirectPexelsPhoto(id, photographer, alt);
}

function normalizePhotos(images) {
    return (images || []).map(normalizePhoto).filter(Boolean);
}

async function fetchImages(query, page, perPage, retries = 3) {
    const url = `${PEXELS_API_URL}?query=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}&orientation=landscape`;
    
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const response = await fetch(url, {
                headers: { 'Authorization': PEXELS_API_KEY }
            });
            
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }
            
            const data = await response.json();
            return data.photos || [];
        } catch (error) {
            console.error(`Fetch attempt ${attempt + 1} failed:`, error);
            if (attempt < retries - 1) {
                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
            }
        }
    }
    
    // Return empty array if all retries failed
    return [];
}

// ==================== Curated Photos (by Pexels Photo ID) ====================
async function fetchCuratedPhotos(photoIds, retries = 2) {
    const results = await Promise.all(photoIds.map(async ({ id, photographer, alt }) => {
        const directPhoto = buildDirectPexelsPhoto(id, photographer, alt);
        if (directPhoto) {
            return directPhoto;
        }

        for (let attempt = 0; attempt < retries; attempt++) {
            try {
                const response = await fetch(`https://api.pexels.com/v1/photos/${id}`, {
                    headers: { 'Authorization': PEXELS_API_KEY }
                });
                if (response.ok) {
                    return await response.json();
                }
            } catch (err) {
                console.warn(`Failed to fetch photo ${id} (attempt ${attempt + 1}):`, err.message);
            }
        }
        return null;
    }));

    return results.filter(Boolean);
}

function buildDirectPexelsPhoto(id, photographer = '', alt = '') {
    if (!id) return null;

    const base = `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg`;
    return {
        id,
        photographer,
        alt: alt || photographer || 'Mood gallery image',
        src: {
            original: `${base}?auto=compress&cs=tinysrgb&w=1600`,
            large2x: `${base}?auto=compress&cs=tinysrgb&w=1600`,
            large: `${base}?auto=compress&cs=tinysrgb&w=1200`,
            medium: `${base}?auto=compress&cs=tinysrgb&w=900`,
            small: `${base}?auto=compress&cs=tinysrgb&w=600`,
            portrait: `${base}?auto=compress&cs=tinysrgb&h=1200&w=800`,
            landscape: `${base}?auto=compress&cs=tinysrgb&h=627&w=1200`,
            tiny: `${base}?auto=compress&cs=tinysrgb&w=280`
        }
    };
}

// ==================== Render Carousel ====================
function renderCarousel(images) {
    const inner = document.getElementById('carouselInner');
    const dots = document.getElementById('thumbnailDots');
    const bar = document.getElementById('thumbnailBar');
    
    // Get mood from page body data attribute
    const pageMood = document.body.dataset.mood || 'nature';
    
    inner.innerHTML = '';
    dots.innerHTML = '';
    bar.innerHTML = '';
    
    images.forEach((photo, i) => {
        // Use optimized image sizes for performance
        const imgUrl = photo.src[IMAGE_SIZES.main] || photo.src.medium;
        
        // Generate SEO-friendly alt text from photo metadata
        const altText = generateAltText(photo, pageMood);
        
        const slide = document.createElement('div');
        slide.className = `carousel-slide ${i === 0 ? 'active' : ''}`;
        const img = document.createElement('img');
        img.src = imgUrl;
        img.alt = altText;
        img.decoding = IMAGE_DECODE;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        // First image loads immediately with fetchpriority, others lazy
        img.loading = i === 0 ? 'eager' : 'lazy';
        img.fetchPriority = i === 0 ? 'high' : 'auto';
        // Add dimensions for CLS optimization
        img.width = 1920;
        img.height = 1080;
        slide.appendChild(img);
        inner.appendChild(slide);
        
        const dot = document.createElement('div');
        dot.className = `thumbnail-dot ${i === 0 ? 'active' : ''}`;
        dot.onclick = () => goToSlide(i);
        dots.appendChild(dot);
        
        const thumb = document.createElement('div');
        thumb.className = `thumbnail-item ${i === 0 ? 'active' : ''}`;
        const thumbImg = document.createElement('img');
        thumbImg.src = photo.src[IMAGE_SIZES.thumb];
        thumbImg.alt = altText + ' thumbnail';
        thumbImg.loading = 'lazy';
        thumbImg.decoding = IMAGE_DECODE;
        thumb.appendChild(thumbImg);
        thumb.onclick = () => goToSlide(i);
        bar.appendChild(thumb);
    });
    
    document.getElementById('currentSlide').textContent = '1';
    document.getElementById('totalSlides').textContent = images.length;
    currentSlideIndex = 0;
}

// ==================== Navigation ====================
function nextSlide() {
    if (!allImages.length) return;
    goToSlide((currentSlideIndex + 1) % allImages.length);
}

function prevSlide() {
    if (!allImages.length) return;
    goToSlide((currentSlideIndex - 1 + allImages.length) % allImages.length);
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.thumbnail-dot');
    const thumbs = document.querySelectorAll('.thumbnail-item');
    
    if (!slides.length) return;
    
    // Safety check
    if (index < 0) index = 0;
    if (index >= slides.length) index = slides.length - 1;
    if (currentSlideIndex < 0) currentSlideIndex = 0;
    if (currentSlideIndex >= slides.length) currentSlideIndex = 0;
    
    slides[currentSlideIndex].classList.remove('active');
    dots[currentSlideIndex].classList.remove('active');
    thumbs[currentSlideIndex].classList.remove('active');
    
    currentSlideIndex = index;
    
    slides[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');
    thumbs[currentSlideIndex].classList.add('active');
    
    document.getElementById('currentSlide').textContent = currentSlideIndex + 1;
    resetAutoplay();
    
    // Auto load more when approaching end
    if (currentSlideIndex >= allImages.length - 3 && !isFetchingMore) {
        loadMoreImages();
    }
}

// ==================== Auto Load More ====================
async function loadMoreImages() {
    if (isFetchingMore) return;
    isFetchingMore = true;
    currentPage++;
    
    const config = window.moodConfig || { query: 'nature' };
    const pageMood = document.body.dataset.mood || '';
    
    try {
        let newImages = normalizePhotos(await fetchImages(config.query, currentPage, 3));
        
        // Filter images by mood
        if (newImages.length > 0 && typeof filterImagesByMood === 'function') {
            newImages = filterImagesByMood(newImages, pageMood);
        }
        
        if (newImages.length > 0) {
            allImages = allImages.concat(newImages);
            addNewSlides(newImages);
            document.getElementById('totalSlides').textContent = allImages.length;
        }
    } catch (err) {
        console.error(err);
        currentPage--;
    }
    
    isFetchingMore = false;
}

// ==================== Add New Slides ====================
function addNewSlides(newImages) {
    const inner = document.getElementById('carouselInner');
    const dots = document.getElementById('thumbnailDots');
    const bar = document.getElementById('thumbnailBar');
    
    const startIndex = allImages.length - newImages.length;
    
    // Get mood from page body data attribute
    const pageMood = document.body.dataset.mood || 'nature';
    
    newImages.forEach((photo, i) => {
        const idx = startIndex + i;
        const imgUrl = photo.src[IMAGE_SIZES.main] || photo.src.medium;
        const altText = generateAltText(photo, pageMood);
        
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        const img = document.createElement('img');
        img.src = imgUrl;
        img.alt = altText;
        img.decoding = IMAGE_DECODE;
        img.loading = 'lazy';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.width = 1920;
        img.height = 1080;
        slide.appendChild(img);
        inner.appendChild(slide);
        
        const dot = document.createElement('div');
        dot.className = 'thumbnail-dot';
        dot.onclick = () => goToSlide(idx);
        dots.appendChild(dot);
        
        const thumb = document.createElement('div');
        thumb.className = 'thumbnail-item';
        const thumbImg = document.createElement('img');
        thumbImg.src = photo.src[IMAGE_SIZES.thumb];
        thumbImg.alt = altText + ' thumbnail';
        thumbImg.loading = 'lazy';
        thumbImg.decoding = IMAGE_DECODE;
        thumb.appendChild(thumbImg);
        thumb.onclick = () => goToSlide(idx);
        bar.appendChild(thumb);
    });
}

// ==================== New Batch ====================
async function loadNewBatch() {
    const btn = document.getElementById('refreshBtn');
    btn.classList.add('loading');
    
    const config = window.moodConfig || { query: 'nature' };
    
    try {
        let images;
        
        if (config.useCurated && window.curatedPhotos && window.curatedPhotos.length > 0) {
            // Shuffle and get new random curated photos
            const shuffled = [...window.curatedPhotos].sort(() => Math.random() - 0.5);
            const selected = shuffled.slice(0, config.per_page || 3);
            images = normalizePhotos(await fetchCuratedPhotos(selected));
        } else {
            const pageMood = document.body.dataset.mood || '';
            const randomPage = Math.floor(Math.random() * 50) + 1;
            images = await fetchImages(config.query, randomPage, 3);
            
            if (images.length > 0 && typeof filterImagesByMood === 'function') {
                images = filterImagesByMood(images, pageMood);
            }
        }
        
        if (images && images.length > 0) {
            allImages = images;
            renderCarousel(images);
            resetAutoplay();
        }
    } catch (err) {
        console.error(err);
    }
    
    btn.classList.remove('loading');
}

// ==================== Autoplay ====================
function startAutoplay() {
    stopAutoplay();
    carouselInterval = setInterval(nextSlide, 4000);
}

function stopAutoplay() {
    if (carouselInterval) clearInterval(carouselInterval);
}

function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
}

// ==================== Fullscreen ====================
function enterFullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    }
}

// ==================== Music ====================
function setupMusic(config) {
    const audio = document.getElementById('bgAudio');
    const control = document.getElementById('musicControl');
    const mood = document.body.dataset.mood || '';
    
    // Online music
    if (window.musicConfig && window.musicConfig[mood]) {
        audio.src = window.musicConfig[mood];
        if (control) control.style.display = 'flex';
        audio.play().catch(() => {});
        isMusicPlaying = true;
    }
    // Local music playlist
    else if (config.hasMusic && window.localMusicPlaylist && window.localMusicPlaylist.length > 0) {
        currentMusicIndex = 0;
        audio.src = window.localMusicPlaylist[0];
        if (control) control.style.display = 'flex';
        
        audio.onended = () => {
            currentMusicIndex = (currentMusicIndex + 1) % window.localMusicPlaylist.length;
            audio.src = window.localMusicPlaylist[currentMusicIndex];
            audio.play();
        };
        
        audio.play().catch(() => {});
        isMusicPlaying = true;
    }
}

function toggleMusic() {
    const audio = document.getElementById('bgAudio');
    if (isMusicPlaying) {
        audio.pause();
        isMusicPlaying = false;
    } else {
        audio.play().catch(() => {});
        isMusicPlaying = true;
    }
}

function handleVolume(e) {
    document.getElementById('bgAudio').volume = e.target.value / 100;
}

// ==================== Download Image ====================
async function downloadCurrentImage() {
    const btn = document.getElementById('downloadBtn');
    if (!btn || currentSlideIndex < 0 || currentSlideIndex >= allImages.length) {
        alert('No image to download');
        return;
    }
    
    const photo = allImages[currentSlideIndex];
    const mood = document.body.dataset.mood || 'mood';
    const photographer = photo.photographer?.replace(/\s+/g, '_') || 'photographer';
    const filename = `mood-gallery-${mood}-${photographer}.jpg`;
    
    // Show downloading state
    const originalText = btn.textContent;
    btn.textContent = 'Downloading...';
    btn.disabled = true;
    
    try {
        // Use high quality image URL
        const imageUrl = photo.src.large2x || photo.src.large || photo.src.medium;
        
        // Fetch the image
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        // Success feedback
        btn.textContent = 'Downloaded!';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
        }, 2000);
        
    } catch (error) {
        console.error('Download error:', error);
        alert('Failed to download image. Please try again.');
        btn.textContent = originalText;
        btn.disabled = false;
    }
}

// ==================== UI Helpers ====================
function showLoading(show) {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.toggle('hidden', !show);
    }
}

function showError(message = 'Failed to load images. Please check your connection.') {
    const carouselInner = document.getElementById('carouselInner');
    const dots = document.getElementById('thumbnailDots');
    const bar = document.getElementById('thumbnailBar');
    if (dots) dots.innerHTML = '';
    if (bar) bar.innerHTML = '';
    showLoading(false);
    carouselInner.innerHTML = `
        <div class="error-message">
            <p class="error-icon">😢</p>
            <p>${message}</p>
        </div>
    `;
}

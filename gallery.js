// ==================== Pexels API Config ====================
const PEXELS_API_KEY = 'kng8vqaVKvDQgmymj28XRTHcvhQoTtcVGgllNbiLFt1wXbQXzjQI915i';
const PEXELS_API_URL = 'https://api.pexels.com/v1/search';

// ==================== State Variables ====================
let allImages = [];
let currentSlideIndex = 0;
let carouselInterval = null;
let currentPage = 1;
let isLoadingMore = false;
let isMusicPlaying = false;
let currentMusicIndex = 0;
let isFetchingMore = false;

// ==================== Performance Optimizations ====================

// Use smaller image sizes for better performance
const IMAGE_SIZES = {
    main: 'large',      // Main carousel: use 'large' (not large2x) for balance
    thumb: 'tiny',      // Thumbnails: use smallest available
    preload: 'medium'   // Preload: use medium for quick display
};

// Async image decoding for faster rendering
const IMAGE_DECODE = 'async';

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
    console.log('Gallery initialized');
    
    // Check subscription status
    const stored = localStorage.getItem('moodGallerySubscription');
    let isSubscribed = false;
    if (stored) {
        try {
            const data = JSON.parse(stored);
            isSubscribed = data.isSubscribed && new Date(data.subscriptionEndDate) > new Date();
        } catch(e) {}
    }
    
    // If not subscribed, redirect to home
    if (!isSubscribed) {
        window.location.href = 'index.html';
        return;
    }
    
    // Get mood config from page
    const pageMood = document.body.dataset.mood || 'nature';
    const config = window.moodConfig || { query: pageMood, per_page: 4 };
    
    console.log('Mood config:', config);
    
    // Setup event listeners
    setupEventListeners();
    
    // Don't auto-enter fullscreen, let user click to enter
    
    // Start loading
    showLoading(true);
    
    // Reset state for fresh load
    currentPage = 1;
    allImages = [];
    
    // Generate truly random page number each time (1-500)
    const randomPage = Math.floor(Math.random() * 500) + 1;
    
    // Fetch images - load 3 for fast display
    loadImagesWithFallback(config.query, randomPage, 3);
}

async function loadImagesWithFallback(query, page, perPage) {
    try {
        const images = await fetchImages(query, page, perPage);
        
        if (images.length > 0) {
            console.log('Images loaded:', images.length, 'from page', page);
            allImages = images;
            renderCarousel(images);
            startAutoplay();
            setupMusic(window.moodConfig || { query });
            showFullscreenHint();
        } else {
            // Try with different page if first attempt failed
            console.log('No images from first attempt, trying different page...');
            const fallbackPage = Math.floor(Math.random() * 200) + 1;
            const fallbackImages = await fetchImages(query, fallbackPage, perPage);
            
            if (fallbackImages.length > 0) {
                allImages = fallbackImages;
                renderCarousel(fallbackImages);
                startAutoplay();
                setupMusic(window.moodConfig || { query });
                showFullscreenHint();
            } else {
                // Final fallback: use a different but related query
                const relatedQueries = {
                    'relaxed': ['ocean beach', 'sea waves', 'calm water'],
                    'peaceful': ['nature landscape', 'forest', 'mountain'],
                    'happy': ['sunshine', 'smiling people', 'joy'],
                    'healing': ['flowers garden', 'spring nature', 'green plants'],
                    'focused': ['workspace desk', 'office', 'laptop'],
                    'hopeful': ['sunrise dawn', 'new beginning', 'light'],
                    'amazed': ['galaxy stars', 'northern lights', 'aurora'],
                    'romantic': ['couple sunset', 'love flowers', 'romance'],
                    'sleepy': ['moonlight night', 'stars sky', 'peaceful night'],
                    'empty': ['clear sky', 'minimalist', 'space']
                };
                
                const alternatives = relatedQueries[query] || ['beautiful nature'];
                const altQuery = alternatives[Math.floor(Math.random() * alternatives.length)];
                const altImages = await fetchImages(altQuery, 1, perPage);
                
                if (altImages.length > 0) {
                    allImages = altImages;
                    renderCarousel(altImages);
                    startAutoplay();
                    setupMusic(window.moodConfig || { query });
                    showFullscreenHint();
                } else {
                    showError();
                }
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
            'peaceful': 'peaceful calm nature landscape serenity',
            'healing': 'healing nature wellness restoration green',
            'focused': 'focused concentration productivity work',
            'relaxed': 'relaxed ocean waves beach tranquility',
            'hopeful': 'hopeful sunrise new beginning dawn optimism',
            'amazed': 'amazed stunning cosmic views spectacular',
            'empty': 'empty clear blue sky minimal peaceful',
            'romantic': 'romantic love couple sunset flowers',
            'sleepy': 'sleepy peaceful night stars moon dream'
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

function capitalizeWords(str) {
    return str.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// ==================== API Call ====================
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
    
    // Add cache buster to prevent cached images
    const cacheBuster = Date.now();
    
    images.forEach((photo, i) => {
        // Use optimized image sizes for performance
        const imgUrl = photo.src[IMAGE_SIZES.main] || photo.src.medium;
        // Add cache buster to URL
        const cachedImgUrl = imgUrl + (imgUrl.includes('?') ? '&' : '?') + 'cb=' + cacheBuster;
        
        // Generate SEO-friendly alt text from photo metadata
        const altText = generateAltText(photo, pageMood);
        
        const slide = document.createElement('div');
        slide.className = `carousel-slide ${i === 0 ? 'active' : ''}`;
        const img = document.createElement('img');
        img.src = cachedImgUrl;
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
        // Add cache buster to thumbnail
        const thumbUrl = photo.src[IMAGE_SIZES.thumb] + (photo.src[IMAGE_SIZES.thumb].includes('?') ? '&' : '?') + 'cb=' + cacheBuster;
        thumbImg.src = thumbUrl;
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
    
    try {
        const newImages = await fetchImages(config.query, currentPage, 3);
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
    
    // Add cache buster
    const cacheBuster = Date.now();
    
    newImages.forEach((photo, i) => {
        const idx = startIndex + i;
        const imgUrl = photo.src[IMAGE_SIZES.main] || photo.src.medium;
        const cachedImgUrl = imgUrl + (imgUrl.includes('?') ? '&' : '?') + 'cb=' + cacheBuster;
        const altText = generateAltText(photo, pageMood);
        
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        const img = document.createElement('img');
        img.src = cachedImgUrl;
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
        const thumbUrl = photo.src[IMAGE_SIZES.thumb] + (photo.src[IMAGE_SIZES.thumb].includes('?') ? '&' : '?') + 'cb=' + cacheBuster;
        thumbImg.src = thumbUrl;
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
    const randomPage = Math.floor(Math.random() * 50) + 1;
    
    try {
        const images = await fetchImages(config.query, randomPage, 3);
        if (images.length) {
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

function showError() {
    const carouselInner = document.getElementById('carouselInner');
    carouselInner.innerHTML = `
        <div class="error-message">
            <p class="error-icon">😢</p>
            <p>Failed to load images. Please check your connection.</p>
        </div>
    `;
}

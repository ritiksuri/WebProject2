const newsContainer = document.getElementById('news-container');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const backToTopBtn = document.getElementById('backToTop');
const categoryNav = document.getElementById('category-nav');
const themeToggle = document.getElementById('themeToggle');
const carouselSlides = document.getElementById('carousel-slides');
let carouselIndex = 0;
let carouselItems = [];

const RSS_BASE = 'https://api.rss2json.com/v1/api.json?rss_url=';
const RSS_FEEDS = {
    general: 'https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en',
    business: 'https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=en-IN&gl=IN&ceid=IN:en',
    technology: 'https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=en-IN&gl=IN&ceid=IN:en',
    sports: 'https://news.google.com/rss/headlines/section/topic/SPORTS?hl=en-IN&gl=IN&ceid=IN:en',
    entertainment: 'https://news.google.com/rss/headlines/section/topic/ENTERTAINMENT?hl=en-IN&gl=IN&ceid=IN:en'
};

let currentCategory = 'general';
let allItems = [];
let itemsPerPage = 8;
let loadedCount = 0;

// ================= Carousel =================
function initCarousel(items){
    carouselItems = items.slice(0,5);
    carouselSlides.innerHTML = '';
    carouselItems.forEach(item=>{
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        const image = item.enclosure?.link || 'https://via.placeholder.com/800x400';
        slide.innerHTML = `
            <img src="${image}" loading="lazy" alt="News Image">
            <div class="carousel-slide-content">
                <h2>${item.title}</h2>
                <p>${item.description || ''}</p>
                <a href="${item.link}" target="_blank">Read more</a>
            </div>
        `;
        carouselSlides.appendChild(slide);
    });
    carouselIndex = 0;
    updateCarousel();
}

// Carousel controls
function updateCarousel(){
    carouselSlides.style.transform = `translateX(-${carouselIndex*100}%)`;
}

document.getElementById('next').addEventListener('click', ()=>{
    carouselIndex = (carouselIndex+1)%carouselItems.length;
    updateCarousel();
});
document.getElementById('prev').addEventListener('click', ()=>{
    carouselIndex = (carouselIndex-1+carouselItems.length)%carouselItems.length;
    updateCarousel();
});

setInterval(()=>{
    if(carouselItems.length>0){
        carouselIndex = (carouselIndex+1)%carouselItems.length;
        updateCarousel();
    }
},5000);

// ================= Fetch News =================
async function fetchNews(category='general'){
    currentCategory = category;
    if(!allItems.length || category !== currentCategory) newsContainer.innerHTML = '<div class="spinner">Loading news...</div>';
    loadedCount = 0;

    try {
        const res = await fetch(`${RSS_BASE}${encodeURIComponent(RSS_FEEDS[category])}`);
        const data = await res.json();
        allItems = data.items || [];
        newsContainer.innerHTML = '';
        if(allItems.length > 0) initCarousel(allItems); // Initialize carousel top 5
        loadMoreNews();
    } catch(e) {
        newsContainer.innerHTML = "<p>Failed to load news.</p>";
        console.error(e);
    }
}

// ================= Display News =================
function loadMoreNews(){
    const nextItems = allItems.slice(loadedCount, loadedCount + itemsPerPage);
    nextItems.forEach((item, index)=>{
        const card = document.createElement('div');
        card.className = 'news-card';
        const image = item.enclosure?.link || 'https://via.placeholder.com/250x150';
        card.innerHTML = `
            <img src="${image}" loading="lazy" alt="News Image">
            <div class="news-card-content">
                <h3>${item.title}</h3>
                <p>${item.description || ''}</p>
                <a href="${item.link}" target="_blank">Read more</a>
            </div>
        `;
        newsContainer.appendChild(card);
        setTimeout(()=> card.classList.add('show'), index*100);
    });
    loadedCount += nextItems.length;
}

// ================= Infinite Scroll =================
let scrollTimeout;
window.addEventListener('scroll', ()=>{
    // Back to top button
    if(window.scrollY > 300) backToTopBtn.style.display = 'block';
    else backToTopBtn.style.display = 'none';

    // Debounced load more
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(()=>{
        if((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10){
            if(loadedCount < allItems.length) loadMoreNews();
        }
    }, 200);
});

// ================= Category Navigation =================
categoryNav.querySelectorAll('button').forEach(btn=>{
    btn.addEventListener('click', ()=>{
        categoryNav.querySelectorAll('button').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        fetchNews(btn.dataset.category);
    });
});

// ================= Search =================
searchBtn.addEventListener('click', ()=>{
    const query = searchInput.value.trim();
    if(!query) return;
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=nws&gl=IN`;
    window.open(url,'_blank');
});

// ================= Back to Top =================
backToTopBtn.addEventListener('click', ()=>{window.scrollTo({top:0, behavior:'smooth'});});

// ================= Dark Mode =================
themeToggle.addEventListener('click', ()=>{
    document.body.classList.toggle('dark-mode');
    themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️ Light Mode' : '🌙 Dark Mode';
});

// ================= Initial Load =================
fetchNews(currentCategory);
const popularContainer = document.getElementById('popular-news-container');
const recommendedContainer = document.getElementById('recommended-news-container');

async function fetchPopularNews() {
    popularContainer.innerHTML = '<div class="spinner">Loading popular news...</div>';
    try {
        const res = await fetch(`${RSS_BASE}${encodeURIComponent(RSS_FEEDS['general'])}`);
        const data = await res.json();
        const items = data.items.slice(0, 8); // top 8 popular
        popularContainer.innerHTML = '';
        displayNewsItems(items, popularContainer);
    } catch(e) { popularContainer.innerHTML = "<p>Failed to load popular news.</p>"; }
}

async function fetchRecommendedNews() {
    recommendedContainer.innerHTML = '<div class="spinner">Loading recommended news...</div>';
    try {
        const res = await fetch(`${RSS_BASE}${encodeURIComponent(RSS_FEEDS['technology'])}`);
        const data = await res.json();
        const items = data.items.slice(0, 8); // top 8 recommended
        recommendedContainer.innerHTML = '';
        displayNewsItems(items, recommendedContainer);
    } catch(e) { recommendedContainer.innerHTML = "<p>Failed to load recommended news.</p>"; }
}

function displayNewsItems(items, container){
    items.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'news-card';
        const image = item.enclosure?.link || 'https://via.placeholder.com/250x150';
        card.innerHTML = `
            <img src="${image}" loading="lazy" alt="News Image">
            <div class="news-card-content">
                <h3>${item.title}</h3>
                <p>${item.description || ''}</p>
                <a href="${item.link}" target="_blank">Read more</a>
            </div>
        `;
        container.appendChild(card);
        setTimeout(()=> card.classList.add('show'), index*100);
    });
}

// Initialize extra sections
fetchPopularNews();
fetchRecommendedNews();

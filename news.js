// const themeToggle = document.getElementById('themeToggle');

// // Fade-in effect when adding cards
// function displayNews(items){
//     items.forEach((item, index) => {
//         const card = document.createElement('div');
//         card.className = 'news-card';
//         const image = item.enclosure?.link || 'https://via.placeholder.com/250x150';
//         card.innerHTML = `
//             <img src="${image}" alt="News Image">
//             <div class="news-card-content">
//                 <h3>${item.title}</h3>
//                 <p>${item.description || ''}</p>
//                 <a href="${item.link}" target="_blank">Read more</a>
//             </div>
//         `;
//         newsContainer.appendChild(card);
//         // Trigger fade-in after a slight delay for staggered effect
//         setTimeout(() => card.classList.add('show'), index * 100);
//     });
// }

// // Dark mode toggle
// themeToggle.addEventListener('click', () => {
//     document.body.classList.toggle('dark-mode');
//     themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️ Light Mode' : '🌙 Dark Mode';
// });
// const newsContainer = document.getElementById('news-container');
// const searchInput = document.getElementById('searchInput');
// const searchBtn = document.getElementById('searchBtn');
// const backToTopBtn = document.getElementById('backToTop');
// const categoryNav = document.getElementById('category-nav');

// const RSS_BASE = 'https://api.rss2json.com/v1/api.json?rss_url=';
// const RSS_FEEDS = {
//     general: 'https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en',
//     business: 'https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=en-IN&gl=IN&ceid=IN:en',
//     technology: 'https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=en-IN&gl=IN&ceid=IN:en',
//     sports: 'https://news.google.com/rss/headlines/section/topic/SPORTS?hl=en-IN&gl=IN&ceid=IN:en',
//     entertainment: 'https://news.google.com/rss/headlines/section/topic/ENTERTAINMENT?hl=en-IN&gl=IN&ceid=IN:en'
// };

// let currentCategory = 'general';
// let allItems = [];
// let itemsPerPage = 8;
// let loadedCount = 0;

// // Fetch news
// async function fetchNews(category='general'){
//     currentCategory = category;
//     newsContainer.innerHTML = '<div class="spinner">Loading news...</div>';
//     loadedCount = 0;
//     try {
//         const res = await fetch(`${RSS_BASE}${encodeURIComponent(RSS_FEEDS[category])}`);
//         const data = await res.json();
//         allItems = data.items || [];
//         newsContainer.innerHTML = '';
//         loadMoreNews();
//     } catch(e) {
//         newsContainer.innerHTML = "<p>Failed to load news.</p>";
//         console.error(e);
//     }
// }

// // Display limited news
// function loadMoreNews() {
//     const nextItems = allItems.slice(loadedCount, loadedCount + itemsPerPage);
//     nextItems.forEach(item => {
//         const card = document.createElement('div');
//         card.className = 'news-card';
//         const image = item.enclosure?.link || 'https://via.placeholder.com/250x150';
//         card.innerHTML = `
//             <img src="${image}" alt="News Image">
//             <div class="news-card-content">
//                 <h3>${item.title}</h3>
//                 <p>${item.description || ''}</p>
//                 <a href="${item.link}" target="_blank">Read more</a>
//             </div>
//         `;
//         newsContainer.appendChild(card);
//     });
//     loadedCount += nextItems.length;
// }

// // Infinite scroll
// window.addEventListener('scroll', () => {
//     // Back to top button
//     if(window.scrollY > 300) backToTopBtn.style.display = 'block';
//     else backToTopBtn.style.display = 'none';

//     // Load more news
//     if((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10){
//         if(loadedCount < allItems.length){
//             loadMoreNews();
//         }
//     }
// });

// // Category buttons click
// categoryNav.querySelectorAll('button').forEach(btn => {
//     btn.addEventListener('click', () => {
//         categoryNav.querySelectorAll('button').forEach(b => b.classList.remove('active'));
//         btn.classList.add('active');
//         fetchNews(btn.dataset.category);
//     });
// });

// // Search Google News
// searchBtn.addEventListener('click', () => {
//     const query = searchInput.value.trim();
//     if(!query) return;
//     const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=nws&gl=IN`;
//     window.open(url,'_blank');
// });

// // Back to top
// backToTopBtn.addEventListener('click', () => {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
// });

// // Load default category
// fetchNews(currentCategory);

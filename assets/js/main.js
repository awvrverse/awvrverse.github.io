// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const html = document.documentElement;

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    if (themeIcon) {
        themeIcon.textContent = theme === 'light' ? 'dark_mode' : 'light_mode';
    }
}

// Mobile Navigation
const menuBtn = document.getElementById('menuBtn');
const mobileNav = document.getElementById('mobileNav');
const closeMobileNav = document.getElementById('closeMobileNav');
const navOverlay = document.getElementById('navOverlay');

function openMobileNav() {
    mobileNav.classList.add('active');
    navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMobileNavFn() {
    mobileNav.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

if (menuBtn) menuBtn.addEventListener('click', openMobileNav);
if (closeMobileNav) closeMobileNav.addEventListener('click', closeMobileNavFn);
if (navOverlay) navOverlay.addEventListener('click', closeMobileNavFn);

// Search Modal
const searchBtn = document.getElementById('searchBtn');
const searchModal = document.getElementById('searchModal');
const closeSearch = document.getElementById('closeSearch');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        searchModal.classList.add('active');
        setTimeout(() => searchInput.focus(), 100);
    });
}

if (closeSearch) {
    closeSearch.addEventListener('click', () => {
        searchModal.classList.remove('active');
        searchInput.value = '';
        searchResults.innerHTML = '';
    });
}

// Close search on overlay click
searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) {
        searchModal.classList.remove('active');
        searchInput.value = '';
        searchResults.innerHTML = '';
    }
});

// Search functionality
if (searchInput) {
    searchInput.addEventListener('input', debounce(handleSearch, 300));
}

async function handleSearch(e) {
    const query = e.target.value.trim();
    
    if (query.length < 2) {
        searchResults.innerHTML = '';
        return;
    }
    
    try {
        const response = await fetch('/search.json');
        const posts = await response.json();
        
        const filtered = posts.filter(post => 
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.content.toLowerCase().includes(query.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(query.toLowerCase())
        );
        
        displaySearchResults(filtered.slice(0, 5));
    } catch (error) {
        console.error('Search error:', error);
    }
}

function displaySearchResults(results) {
    if (results.length === 0) {
        searchResults.innerHTML = '<p style="padding: 1rem; text-align: center; color: var(--md-sys-color-on-surface-variant);">Tidak ada hasil ditemukan</p>';
        return;
    }
    
    searchResults.innerHTML = results.map(post => `
        <a href="${post.url}" class="search-result-item" style="display: block; padding: 1rem; border-radius: 8px; margin-bottom: 0.5rem; transition: background-color 0.2s;">
            <h4 style="margin-bottom: 0.25rem; color: var(--md-sys-color-on-surface);">${highlightText(post.title, searchInput.value)}</h4>
            <p style="font-size: 0.875rem; color: var(--md-sys-color-on-surface-variant);">${post.excerpt.substring(0, 100)}...</p>
        </a>
    `).join('');
}

function highlightText(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark style="background-color: var(--md-sys-color-primary-container); padding: 0 2px;">$1</mark>');
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Infinite Scroll
let currentPage = 1;
let isLoading = false;
let hasMorePosts = true;

const paginationInfo = document.querySelector('.pagination-info');
const loadingIndicator = document.getElementById('loadingIndicator');
const noMorePosts = document.getElementById('noMorePosts');
const postsGrid = document.getElementById('postsGrid');

if (paginationInfo) {
    const totalPages = parseInt(paginationInfo.dataset.totalPages);
    currentPage = parseInt(paginationInfo.dataset.currentPage);
    hasMorePosts = currentPage < totalPages;
    
    if (hasMorePosts) {
        window.addEventListener('scroll', handleScroll);
    }
}

async function handleScroll() {
    if (isLoading || !hasMorePosts) return;
    
    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.body.offsetHeight - 1000;
    
    if (scrollPosition >= threshold) {
        await loadMorePosts();
    }
}

async function loadMorePosts() {
    isLoading = true;
    currentPage++;
    
    if (loadingIndicator) loadingIndicator.style.display = 'flex';
    
    try {
        const response = await fetch(`/page/${currentPage}/`);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newPosts = doc.querySelectorAll('.post-card');
        
        if (newPosts.length === 0) {
            hasMorePosts = false;
            if (noMorePosts) noMorePosts.style.display = 'block';
        } else {
            newPosts.forEach(post => {
                postsGrid.appendChild(post);
            });
        }
    } catch (error) {
        console.error('Error loading more posts:', error);
        hasMorePosts = false;
    } finally {
        isLoading = false;
        if (loadingIndicator) loadingIndicator.style.display = 'none';
    }
}

// Back to Top Button
const backToTop = document.getElementById('backToTop');

if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Filter Posts
const filterBtns = document.querySelectorAll('.filter-btn');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.dataset.filter;
        const posts = document.querySelectorAll('.post-card');
        
        posts.forEach(post => {
            if (filter === 'all') {
                post.style.display = 'flex';
            } else {
                const category = post.querySelector('.post-category');
                if (category && category.textContent === filter) {
                    post.style.display = 'flex';
                } else {
                    post.style.display = 'none';
                }
            }
        });
    });
});

// Header Scroll Effect
const appHeader = document.getElementById('appHeader');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 100) {
        appHeader.style.boxShadow = 'var(--md-sys-elevation-3)';
    } else {
        appHeader.style.boxShadow = 'var(--md-sys-elevation-2)';
    }
    
    lastScroll = currentScroll;
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered:', registration);
            })
            .catch(error => {
                console.log('SW registration failed:', error);
            });
    });
}

// Console Message
console.log('%c Blog Portal Modern ', 'background: #6750A4; color: white; font-size: 20px; padding: 10px; border-radius: 5px;');
console.log('%c Built with Jekyll & Material Design 3 ', 'color: #6750A4; font-size: 12px;');

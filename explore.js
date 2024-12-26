// DOM Elements
const searchInput = document.querySelector('.search-box input');
const trendsList = document.querySelector('.trends-list');
const exploreFeed = document.querySelector('.explore-feed');
const followSuggestions = document.querySelector('.follow-suggestions');

// Default images
const DEFAULT_AVATAR = './assets/default-avatar.svg';
const DEFAULT_COVER = './assets/default-banner.svg';

// Initialize explore page
function initializeExplore() {
    // Check authentication
    const user = localStorage.getItem('user');
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Load trending topics
    loadTrendingTopics();
    
    // Load explore feed
    loadExploreFeed();
    
    // Load follow suggestions
    loadFollowSuggestions();
    
    // Initialize search functionality
    initializeSearch();
}

// Load trending topics
function loadTrendingTopics() {
    const trends = [
        {
            category: 'Technology · Trending',
            name: '#WebDevelopment',
            tweets: '125K'
        },
        {
            category: 'Sports · Trending',
            name: '#WorldCup2026',
            tweets: '85.5K'
        },
        {
            category: 'Entertainment · Trending',
            name: '#NewMusic',
            tweets: '50K'
        },
        {
            category: 'Business · Trending',
            name: '#Startups',
            tweets: '32.1K'
        },
        {
            category: 'Science · Trending',
            name: '#SpaceExploration',
            tweets: '28.7K'
        }
    ];
    
    trendsList.innerHTML = trends.map(trend => `
        <div class="trend-item">
            <div class="trend-category">${trend.category}</div>
            <div class="trend-name">${trend.name}</div>
            <div class="trend-tweets">${trend.tweets} Tweets</div>
        </div>
    `).join('');
}

// Load explore feed
function loadExploreFeed() {
    const sections = [
        {
            title: 'What\'s happening',
            items: [
                {
                    title: 'Tech Conference 2024',
                    description: 'Join the biggest tech conference of the year',
                    image: DEFAULT_COVER,
                    category: 'Technology'
                },
                {
                    title: 'New Space Discovery',
                    description: 'Scientists announce groundbreaking findings',
                    image: DEFAULT_COVER,
                    category: 'Science'
                }
            ]
        },
        {
            title: 'Popular in your area',
            items: [
                {
                    title: 'Local Food Festival',
                    description: 'Experience the best local cuisine',
                    image: DEFAULT_COVER,
                    category: 'Events'
                },
                {
                    title: 'Community Meetup',
                    description: 'Connect with people in your area',
                    image: DEFAULT_COVER,
                    category: 'Community'
                }
            ]
        }
    ];
    
    exploreFeed.innerHTML = sections.map(section => `
        <div class="explore-section">
            <h3>${section.title}</h3>
            <div class="explore-grid">
                ${section.items.map(item => `
                    <div class="explore-card">
                        <img src="${item.image}" alt="${item.title}">
                        <div class="explore-card-content">
                            <div class="explore-card-title">${item.title}</div>
                            <div class="explore-card-description">${item.description}</div>
                            <div class="explore-card-meta">
                                <span>${item.category}</span>
                                <span>·</span>
                                <span>Trending</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// Load follow suggestions
function loadFollowSuggestions() {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const userProfile = JSON.parse(localStorage.getItem('userProfile')) || {};
    
    const suggestions = [
        { name: 'Tech News', username: '@technews', avatar: DEFAULT_AVATAR },
        { name: 'Sports Update', username: '@sports', avatar: DEFAULT_AVATAR },
        { name: 'Entertainment', username: '@entertainment', avatar: DEFAULT_AVATAR }
    ].filter(user => user.username !== currentUser.username);

    followSuggestions.innerHTML = suggestions.map(user => `
        <div class="follow-suggestion">
            <img src="${user.avatar}" alt="Profile" class="profile-pic">
            <div class="user-info">
                <span class="name">${user.name}</span>
                <span class="username">${user.username}</span>
            </div>
            <button class="follow-btn ${userProfile.following?.includes(user.username) ? 'following' : ''}"
                    onclick="toggleFollow(this, '${user.username}')">
                ${userProfile.following?.includes(user.username) ? 'Following' : 'Follow'}
            </button>
        </div>
    `).join('');
}

// Initialize search functionality
function initializeSearch() {
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.toLowerCase();
        
        // Add debounce to prevent too many searches
        searchTimeout = setTimeout(() => {
            if (query.length > 0) {
                searchContent(query);
            }
        }, 300);
    });
}

// Search content
function searchContent(query) {
    // This would typically be an API call to search tweets and users
    // For now, we'll just filter the explore feed content
    const sections = document.querySelectorAll('.explore-section');
    
    sections.forEach(section => {
        const cards = section.querySelectorAll('.explore-card');
        let hasVisibleCards = false;
        
        cards.forEach(card => {
            const title = card.querySelector('.explore-card-title').textContent.toLowerCase();
            const description = card.querySelector('.explore-card-description').textContent.toLowerCase();
            
            if (title.includes(query) || description.includes(query)) {
                card.style.display = 'block';
                hasVisibleCards = true;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Show/hide section based on whether it has visible cards
        section.style.display = hasVisibleCards ? 'block' : 'none';
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', initializeExplore); 
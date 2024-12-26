// DOM Elements
const bookmarksFeed = document.querySelector('.bookmarks-feed');
const emptyBookmarks = document.querySelector('.empty-bookmarks');
const moreOptionsBtn = document.querySelector('.more-options-btn');
const optionsMenu = document.querySelector('.options-menu');
const clearBookmarksBtn = document.querySelector('.clear-bookmarks');
const followSuggestions = document.querySelector('.follow-suggestions');

// Default images
const DEFAULT_AVATAR = './assets/default-avatar.svg';
const DEFAULT_COVER = './assets/default-banner.svg';

// Initialize bookmarks page
function initializeBookmarks() {
    // Check authentication
    const user = localStorage.getItem('user');
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Update username
    document.querySelector('.header-content .username').textContent = 
        JSON.parse(user).username;

    // Load bookmarks
    loadBookmarks();
    
    // Load follow suggestions
    loadFollowSuggestions();
    
    // Initialize event listeners
    initializeEventListeners();
}

// Load bookmarks
function loadBookmarks() {
    const bookmarks = getBookmarks();
    
    if (bookmarks.length === 0) {
        bookmarksFeed.style.display = 'none';
        emptyBookmarks.style.display = 'flex';
        return;
    }
    
    bookmarksFeed.style.display = 'block';
    emptyBookmarks.style.display = 'none';
    
    bookmarksFeed.innerHTML = bookmarks.map(tweet => `
        <div class="tweet" data-tweet-id="${tweet.id}">
            <img src="${tweet.avatar || DEFAULT_AVATAR}" alt="Profile" class="profile-pic">
            <div class="tweet-content">
                <div class="tweet-header">
                    <span class="name">${tweet.name}</span>
                    <span class="username">${tweet.username}</span>
                    <span class="timestamp">· ${formatTime(tweet.timestamp)}</span>
                </div>
                <p class="tweet-text">${tweet.text}</p>
                ${tweet.image ? `<img src="${tweet.image}" alt="Tweet image" style="width: 100%; border-radius: 15px; margin-top: 10px;">` : ''}
                <div class="tweet-actions">
                    <button onclick="handleInteraction(this, 'comment')" data-tweet-id="${tweet.id}">
                        <i class="far fa-comment"></i>
                        <span>${tweet.comments || 0}</span>
                    </button>
                    <button onclick="handleInteraction(this, 'retweet')" data-tweet-id="${tweet.id}">
                        <i class="fas fa-retweet"></i>
                        <span>${tweet.retweets || 0}</span>
                    </button>
                    <button onclick="handleInteraction(this, 'like')" data-tweet-id="${tweet.id}">
                        <i class="far fa-heart"></i>
                        <span>${tweet.likes || 0}</span>
                    </button>
                    <button onclick="handleInteraction(this, 'bookmark')" data-tweet-id="${tweet.id}" class="bookmarked">
                        <i class="fas fa-bookmark"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Get bookmarked tweets
function getBookmarks() {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const userProfile = JSON.parse(localStorage.getItem('userProfile')) || {};
    const tweets = JSON.parse(localStorage.getItem('tweets')) || [];
    
    const bookmarkedTweets = tweets.filter(tweet => 
        userProfile.bookmarks?.includes(tweet.id)
    );
    
    return bookmarkedTweets;
}

// Format timestamp
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = (now - date) / 1000; // difference in seconds
    
    if (diff < 60) {
        return `${Math.floor(diff)}s`;
    } else if (diff < 3600) {
        return `${Math.floor(diff / 60)}m`;
    } else if (diff < 86400) {
        return `${Math.floor(diff / 3600)}h`;
    } else if (date.getFullYear() === now.getFullYear()) {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
}

// Handle tweet interactions
function handleInteraction(button, type) {
    const tweetId = button.dataset.tweetId;
    const tweets = JSON.parse(localStorage.getItem('tweets')) || [];
    const userProfile = JSON.parse(localStorage.getItem('userProfile')) || {};
    
    if (type === 'bookmark') {
        userProfile.bookmarks = userProfile.bookmarks || [];
        const index = userProfile.bookmarks.indexOf(tweetId);
        
        if (index === -1) {
            userProfile.bookmarks.push(tweetId);
            button.classList.add('bookmarked');
        } else {
            userProfile.bookmarks.splice(index, 1);
            button.classList.remove('bookmarked');
            // Remove tweet from feed if unbookmarked
            const tweetElement = button.closest('.tweet');
            tweetElement.remove();
            
            // Show empty state if no bookmarks left
            if (userProfile.bookmarks.length === 0) {
                bookmarksFeed.style.display = 'none';
                emptyBookmarks.style.display = 'flex';
            }
        }
        
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
    } else {
        const tweet = tweets.find(t => t.id === tweetId);
        if (tweet) {
            switch(type) {
                case 'like':
                    tweet.likes = (tweet.likes || 0) + 1;
                    button.querySelector('i').classList.remove('far');
                    button.querySelector('i').classList.add('fas');
                    button.querySelector('span').textContent = tweet.likes;
                    break;
                case 'retweet':
                    tweet.retweets = (tweet.retweets || 0) + 1;
                    button.classList.add('active');
                    button.querySelector('span').textContent = tweet.retweets;
                    break;
                case 'comment':
                    // Implement comment functionality
                    break;
            }
            localStorage.setItem('tweets', JSON.stringify(tweets));
        }
    }
}

// Clear all bookmarks
function clearAllBookmarks() {
    const userProfile = JSON.parse(localStorage.getItem('userProfile')) || {};
    userProfile.bookmarks = [];
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    
    // Update UI
    bookmarksFeed.style.display = 'none';
    emptyBookmarks.style.display = 'flex';
    optionsMenu.style.display = 'none';
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

// Initialize event listeners
function initializeEventListeners() {
    // More options button
    moreOptionsBtn.addEventListener('click', () => {
        optionsMenu.style.display = optionsMenu.style.display === 'none' ? 'block' : 'none';
    });
    
    // Clear bookmarks button
    clearBookmarksBtn.addEventListener('click', clearAllBookmarks);
    
    // Close options menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.more-options-btn') && !e.target.closest('.options-menu')) {
            optionsMenu.style.display = 'none';
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', initializeBookmarks); 
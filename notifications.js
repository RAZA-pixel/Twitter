// DOM Elements
const notificationsFeed = document.querySelector('.notifications-feed');
const notificationTabs = document.querySelector('.notification-tabs');
const followSuggestions = document.querySelector('.follow-suggestions');

// Default images
const DEFAULT_AVATAR = './assets/default-avatar.svg';
const DEFAULT_COVER = './assets/default-banner.svg';

// Initialize notifications page
function initializeNotifications() {
    // Check authentication
    const user = localStorage.getItem('user');
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Load notifications
    loadNotifications('all');
    
    // Load follow suggestions
    loadFollowSuggestions();
    
    // Initialize tab functionality
    initializeTabs();
}

// Load notifications based on type
function loadNotifications(type) {
    const notifications = getNotifications();
    const filteredNotifications = type === 'all' ? 
        notifications : 
        notifications.filter(notif => notif.type === type);

    notificationsFeed.innerHTML = filteredNotifications.length > 0 ? 
        filteredNotifications.map(notification => createNotificationHTML(notification)).join('') :
        '<div class="no-notifications">No notifications yet</div>';
}

// Create notification HTML
function createNotificationHTML(notification) {
    const getIcon = (type) => {
        switch(type) {
            case 'like': return '<i class="fas fa-heart"></i>';
            case 'retweet': return '<i class="fas fa-retweet"></i>';
            case 'follow': return '<i class="fas fa-user"></i>';
            case 'mention': return '<i class="fas fa-at"></i>';
            default: return '<i class="fas fa-bell"></i>';
        }
    };

    return `
        <div class="notification-item">
            <div class="notification-icon ${notification.type}">
                ${getIcon(notification.type)}
            </div>
            <div class="notification-content">
                <div class="notification-users">
                    ${notification.users.map(user => `
                        <img src="${user.avatar || DEFAULT_AVATAR}" alt="${user.name}" class="profile-pic">
                    `).join('')}
                </div>
                <div class="notification-text">
                    ${notification.users.map(user => `
                        <a href="profile.html?username=${user.username}">${user.name}</a>
                    `).join(', ')}
                    ${notification.text}
                </div>
                ${notification.tweet ? `
                    <div class="notification-tweet">
                        <p>${notification.tweet.text}</p>
                        ${notification.tweet.image ? `
                            <img src="${notification.tweet.image}" alt="Tweet image" style="width: 100%; border-radius: 10px; margin-top: 10px;">
                        ` : ''}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// Get notifications (simulated data for now)
function getNotifications() {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    return [
        {
            type: 'like',
            users: [
                { name: 'John Doe', username: '@johndoe', avatar: DEFAULT_AVATAR },
                { name: 'Jane Smith', username: '@janesmith', avatar: DEFAULT_AVATAR }
            ],
            text: 'liked your Tweet',
            tweet: {
                text: 'This is a sample tweet that was liked',
                timestamp: new Date()
            }
        },
        {
            type: 'retweet',
            users: [
                { name: 'Bob Wilson', username: '@bobwilson', avatar: DEFAULT_AVATAR }
            ],
            text: 'retweeted your Tweet',
            tweet: {
                text: 'Another sample tweet that was retweeted',
                timestamp: new Date()
            }
        },
        {
            type: 'follow',
            users: [
                { name: 'Alice Brown', username: '@alicebrown', avatar: DEFAULT_AVATAR }
            ],
            text: 'followed you'
        },
        {
            type: 'mention',
            users: [
                { name: 'Charlie Davis', username: '@charlie', avatar: DEFAULT_AVATAR }
            ],
            text: 'mentioned you in a Tweet',
            tweet: {
                text: `Hey @${currentUser.username.slice(1)}, check this out!`,
                timestamp: new Date()
            }
        }
    ];
}

// Initialize tab functionality
function initializeTabs() {
    const tabs = notificationTabs.querySelectorAll('a');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Load notifications based on tab
            const type = tab.textContent.toLowerCase();
            loadNotifications(type);
        });
    });
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

// Initialize
document.addEventListener('DOMContentLoaded', initializeNotifications); 
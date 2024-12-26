// DOM Elements
const editProfileBtn = document.querySelector('.edit-profile-btn');
const editProfileModal = document.getElementById('edit-profile-modal');
const closeModalBtn = document.querySelector('.close-modal');
const cancelBtn = document.querySelector('.cancel-btn');
const editProfileForm = document.getElementById('edit-profile-form');
const editAvatarBtn = document.querySelector('.edit-avatar-btn');
const editCoverBtn = document.querySelector('.edit-cover-btn');
const accountSuggestions = document.querySelector('.account-suggestions');
const tweetFeed = document.querySelector('.tweet-feed');

// Default images
const DEFAULT_AVATAR = './assets/default-avatar.svg';
const DEFAULT_COVER = './assets/default-banner.svg';

// Current user data
let currentUser = JSON.parse(localStorage.getItem('user')) || {};
let userProfile = JSON.parse(localStorage.getItem('userProfile')) || {
    bio: '',
    location: '',
    joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    following: [],
    followers: [],
    coverPhoto: DEFAULT_COVER,
    avatar: DEFAULT_AVATAR,
    tweets: []
};

// Initialize profile
function initializeProfile() {
    if (!currentUser || !currentUser.name) {
        window.location.href = 'login.html';
        return;
    }

    // Update profile information
    document.querySelector('.profile-name').textContent = currentUser.name;
    document.querySelector('.profile-username').textContent = currentUser.username;
    document.querySelector('.profile-bio p').textContent = userProfile.bio || 'Edit profile to add your bio';
    document.querySelector('.profile-metadata span:first-child').innerHTML = 
        `<i class="fas fa-map-marker-alt"></i> ${userProfile.location || 'Add location'}`;
    document.querySelector('.join-date').textContent = userProfile.joinDate;
    
    // Update stats
    document.querySelector('.profile-stats .stat:first-child .stat-value').textContent = 
        userProfile.following.length;
    document.querySelector('.profile-stats .stat:last-child .stat-value').textContent = 
        userProfile.followers.length;
    
    // Update images with fallback to defaults
    updateProfileImages();
    
    // Load similar accounts
    loadSimilarAccounts();
    
    // Load user's tweets
    loadUserTweets();
}

// Update all profile images
function updateProfileImages() {
    // Update all profile pictures
    const profileImages = document.querySelectorAll('.profile-pic');
    profileImages.forEach(img => {
        img.src = userProfile.avatar || DEFAULT_AVATAR;
        img.onerror = () => { img.src = DEFAULT_AVATAR; };
    });

    // Update cover photo
    const coverImg = document.querySelector('.profile-cover img');
    if (coverImg) {
        coverImg.src = userProfile.coverPhoto || DEFAULT_COVER;
        coverImg.onerror = () => { coverImg.src = DEFAULT_COVER; };
    }

    // Update profile avatar
    const avatarImg = document.querySelector('.profile-avatar img');
    if (avatarImg) {
        avatarImg.src = userProfile.avatar || DEFAULT_AVATAR;
        avatarImg.onerror = () => { avatarImg.src = DEFAULT_AVATAR; };
    }
}

// Handle image uploads
function handleAvatarUpload() {
    const imageUrl = prompt('Enter the URL of your profile picture:');
    if (imageUrl) {
        // Test if the image URL is valid
        const tempImg = new Image();
        tempImg.onload = function() {
            userProfile.avatar = imageUrl;
            localStorage.setItem('userProfile', JSON.stringify(userProfile));
            updateProfileImages();
        };
        tempImg.onerror = function() {
            alert('Invalid image URL. Please try again.');
        };
        tempImg.src = imageUrl;
    }
}

function handleCoverUpload() {
    const imageUrl = prompt('Enter the URL of your cover photo:');
    if (imageUrl) {
        // Test if the image URL is valid
        const tempImg = new Image();
        tempImg.onload = function() {
            userProfile.coverPhoto = imageUrl;
            localStorage.setItem('userProfile', JSON.stringify(userProfile));
            updateProfileImages();
        };
        tempImg.onerror = function() {
            alert('Invalid image URL. Please try again.');
        };
        tempImg.src = imageUrl;
    }
}

// Handle profile form submission
function handleProfileSubmit(event) {
    event.preventDefault();
    
    // Update user data
    currentUser.name = document.getElementById('edit-name').value;
    userProfile.bio = document.getElementById('edit-bio').value;
    userProfile.location = document.getElementById('edit-location').value;
    
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(currentUser));
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    
    // Update UI
    initializeProfile();
    closeModal();
}

// Modal handlers
function openModal() {
    editProfileModal.classList.add('show');
    // Populate form with current data
    document.getElementById('edit-name').value = currentUser.name || '';
    document.getElementById('edit-bio').value = userProfile.bio || '';
    document.getElementById('edit-location').value = userProfile.location || '';
}

function closeModal() {
    editProfileModal.classList.remove('show');
}

// Load user's tweets
function loadUserTweets() {
    const tweets = JSON.parse(localStorage.getItem('tweets')) || [];
    const userTweets = tweets.filter(tweet => tweet.username === currentUser.username);
    
    tweetFeed.innerHTML = userTweets.map(tweet => `
        <div class="tweet">
            <img src="${userProfile.avatar || DEFAULT_AVATAR}" alt="Profile" class="profile-pic">
            <div class="tweet-content">
                <div class="tweet-header">
                    <span class="name">${currentUser.name}</span>
                    <span class="username">${currentUser.username}</span>
                    <span class="timestamp">· ${new Date(tweet.timestamp).toLocaleDateString()}</span>
                </div>
                <p class="tweet-text">${tweet.text}</p>
                ${tweet.image ? `<img src="${tweet.image}" alt="Tweet image" style="width: 100%; border-radius: 15px; margin-top: 10px;">` : ''}
                <div class="tweet-actions-buttons">
                    <button onclick="handleInteraction(this, 'comment')" data-tweet-id="${tweet.id}">
                        <i class="far fa-comment"></i> <span>${tweet.comments || 0}</span>
                    </button>
                    <button onclick="handleInteraction(this, 'retweet')" data-tweet-id="${tweet.id}">
                        <i class="fas fa-retweet"></i> <span>${tweet.retweets || 0}</span>
                    </button>
                    <button onclick="handleInteraction(this, 'like')" data-tweet-id="${tweet.id}">
                        <i class="far fa-heart"></i> <span>${tweet.likes || 0}</span>
                    </button>
                    <button onclick="handleInteraction(this, 'share')" data-tweet-id="${tweet.id}">
                        <i class="far fa-share-square"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('') || '<div class="no-tweets">No tweets yet</div>';
}

// Similar accounts functionality
function loadSimilarAccounts() {
    const similarUsers = [
        { name: 'John Doe', username: '@johndoe', avatar: DEFAULT_AVATAR },
        { name: 'Jane Smith', username: '@janesmith', avatar: DEFAULT_AVATAR },
        { name: 'Bob Wilson', username: '@bobwilson', avatar: DEFAULT_AVATAR }
    ].filter(user => user.username !== currentUser.username);
    
    accountSuggestions.innerHTML = similarUsers.map(user => `
        <div class="account-suggestion">
            <img src="${user.avatar}" alt="Profile" class="profile-pic">
            <div class="account-info">
                <div class="account-name">${user.name}</div>
                <div class="account-username">${user.username}</div>
            </div>
            <button class="follow-btn ${userProfile.following.includes(user.username) ? 'following' : ''}" 
                    onclick="toggleFollow(this, '${user.username}')">
                ${userProfile.following.includes(user.username) ? 'Following' : 'Follow'}
            </button>
        </div>
    `).join('');
}

// Follow functionality
function toggleFollow(button, username) {
    const isFollowing = button.classList.contains('following');
    
    if (isFollowing) {
        button.classList.remove('following');
        button.textContent = 'Follow';
        userProfile.following = userProfile.following.filter(u => u !== username);
    } else {
        button.classList.add('following');
        button.textContent = 'Following';
        userProfile.following.push(username);
    }
    
    // Update localStorage and UI
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    document.querySelector('.profile-stats .stat:first-child .stat-value').textContent = 
        userProfile.following.length;
}

// Event listeners
editProfileBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);
editProfileForm.addEventListener('submit', handleProfileSubmit);
editAvatarBtn.addEventListener('click', handleAvatarUpload);
editCoverBtn.addEventListener('click', handleCoverUpload);

// Initialize
document.addEventListener('DOMContentLoaded', initializeProfile); 
// DOM Elements
const tweetTextarea = document.querySelector('.tweet-input-area textarea');
const tweetButton = document.querySelector('.tweet-btn-small');
const tweetFeed = document.querySelector('.tweet-feed');
const imageInput = document.querySelector('.tweet-attachments i.fa-image');
let imageUrl = '';

// Default images
const DEFAULT_AVATAR = './assets/default-avatar.svg';
const DEFAULT_COVER = './assets/default-banner.svg';

// Check authentication
function checkAuth() {
    const user = localStorage.getItem('user');
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    // Update UI with user info
    const userData = JSON.parse(user);
    const userProfile = JSON.parse(localStorage.getItem('userProfile')) || {
        avatar: DEFAULT_AVATAR
    };
    updateUserInterface(userData, userProfile);
}

// Update UI with user information
function updateUserInterface(user, profile) {
    // Update profile pictures
    const profilePics = document.querySelectorAll('.profile-pic');
    profilePics.forEach(pic => {
        pic.src = profile.avatar || DEFAULT_AVATAR;
        pic.onerror = function() { this.src = DEFAULT_AVATAR; };
    });

    // Update username in sidebar
    const nameElement = document.querySelector('.sidebar-left .profile-info .name');
    const usernameElement = document.querySelector('.sidebar-left .profile-info .username');
    if (nameElement && usernameElement) {
        nameElement.textContent = user.name;
        usernameElement.textContent = user.username;
    }
}

// Event Listeners
tweetButton.addEventListener('click', createTweet);
tweetTextarea.addEventListener('input', handleTextareaInput);
imageInput.addEventListener('click', handleImageUpload);

// Handle textarea input
function handleTextareaInput() {
    const tweetLength = tweetTextarea.value.length;
    tweetButton.disabled = tweetLength === 0;
    tweetButton.style.opacity = tweetLength === 0 ? '0.5' : '1';
}

// Handle image upload
function handleImageUpload() {
    const imageUrl = prompt('Enter the URL of your tweet image:');
    if (imageUrl) {
        // Test if the image URL is valid
        const tempImg = new Image();
        tempImg.onload = function() {
            imageUrl = tempImg.src;
            // Add a preview if desired
            const previewArea = document.createElement('div');
            previewArea.innerHTML = `<img src="${imageUrl}" alt="Tweet image preview" style="max-width: 100%; border-radius: 15px; margin-top: 10px;">`;
            tweetTextarea.parentElement.appendChild(previewArea);
        };
        tempImg.onerror = function() {
            alert('Invalid image URL. Please try again.');
        };
        tempImg.src = imageUrl;
    }
}

// Create new tweet
function createTweet() {
    const tweetText = tweetTextarea.value;
    if (!tweetText.trim()) return;

    const user = JSON.parse(localStorage.getItem('user'));
    const userProfile = JSON.parse(localStorage.getItem('userProfile')) || { avatar: DEFAULT_AVATAR };
    
    // Create tweet data
    const tweetData = {
        id: Date.now(),
        text: tweetText,
        image: imageUrl,
        username: user.username,
        name: user.name,
        avatar: userProfile.avatar,
        timestamp: new Date().toISOString(),
        likes: 0,
        retweets: 0,
        comments: 0
    };
    
    // Save tweet to localStorage
    const tweets = JSON.parse(localStorage.getItem('tweets')) || [];
    tweets.unshift(tweetData);
    localStorage.setItem('tweets', JSON.stringify(tweets));
    
    // Create tweet element
    const tweet = document.createElement('div');
    tweet.className = 'tweet';
    tweet.innerHTML = `
        <img src="${userProfile.avatar || DEFAULT_AVATAR}" alt="Profile" class="profile-pic">
        <div class="tweet-content">
            <div class="tweet-header">
                <span class="name">${user.name}</span>
                <span class="username">${user.username}</span>
                <span class="timestamp">· ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
            </div>
            <p class="tweet-text">${escapeHtml(tweetText)}</p>
            ${imageUrl ? `<img src="${imageUrl}" alt="Tweet image" style="width: 100%; border-radius: 15px; margin-top: 10px;">` : ''}
            <div class="tweet-actions-buttons">
                <button onclick="handleInteraction(this, 'comment')" data-tweet-id="${tweetData.id}">
                    <i class="far fa-comment"></i> <span>0</span>
                </button>
                <button onclick="handleInteraction(this, 'retweet')" data-tweet-id="${tweetData.id}">
                    <i class="fas fa-retweet"></i> <span>0</span>
                </button>
                <button onclick="handleInteraction(this, 'like')" data-tweet-id="${tweetData.id}">
                    <i class="far fa-heart"></i> <span>0</span>
                </button>
                <button onclick="handleInteraction(this, 'share')" data-tweet-id="${tweetData.id}">
                    <i class="far fa-share-square"></i>
                </button>
            </div>
            <div class="comment-section" style="display: none;">
                <div class="comment-input">
                    <img src="${userProfile.avatar || DEFAULT_AVATAR}" alt="Profile" class="profile-pic">
                    <textarea placeholder="Tweet your reply"></textarea>
                    <button onclick="submitComment(this)" data-tweet-id="${tweetData.id}">Reply</button>
                </div>
                <div class="comments-list"></div>
            </div>
        </div>
    `;

    // Add tweet to feed
    tweetFeed.insertBefore(tweet, tweetFeed.firstChild);
    
    // Clear input
    tweetTextarea.value = '';
    imageUrl = '';
    handleTextareaInput();
}

// Load tweets
function loadTweets() {
    const tweets = JSON.parse(localStorage.getItem('tweets')) || [];
    tweetFeed.innerHTML = tweets.map(tweet => `
        <div class="tweet">
            <img src="${tweet.avatar || DEFAULT_AVATAR}" alt="Profile" class="profile-pic">
            <div class="tweet-content">
                <div class="tweet-header">
                    <span class="name">${tweet.name}</span>
                    <span class="username">${tweet.username}</span>
                    <span class="timestamp">· ${new Date(tweet.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
                </div>
                <p class="tweet-text">${escapeHtml(tweet.text)}</p>
                ${tweet.image ? `<img src="${tweet.image}" alt="Tweet image" style="width: 100%; border-radius: 15px; margin-top: 10px;">` : ''}
                <div class="tweet-actions-buttons">
                    <button onclick="handleInteraction(this, 'comment')" data-tweet-id="${tweet.id}">
                        <i class="far fa-comment"></i> <span>${tweet.comments}</span>
                    </button>
                    <button onclick="handleInteraction(this, 'retweet')" data-tweet-id="${tweet.id}">
                        <i class="fas fa-retweet"></i> <span>${tweet.retweets}</span>
                    </button>
                    <button onclick="handleInteraction(this, 'like')" data-tweet-id="${tweet.id}">
                        <i class="far fa-heart"></i> <span>${tweet.likes}</span>
                    </button>
                    <button onclick="handleInteraction(this, 'share')" data-tweet-id="${tweet.id}">
                        <i class="far fa-share-square"></i>
                    </button>
                </div>
                <div class="comment-section" style="display: none;">
                    <div class="comment-input">
                        <img src="${tweet.avatar || DEFAULT_AVATAR}" alt="Profile" class="profile-pic">
                        <textarea placeholder="Tweet your reply"></textarea>
                        <button onclick="submitComment(this)" data-tweet-id="${tweet.id}">Reply</button>
                    </div>
                    <div class="comments-list"></div>
                </div>
            </div>
        </div>
    `).join('') || '<div class="no-tweets">No tweets yet</div>';
}

// Handle tweet interactions
function handleInteraction(button, type) {
    const tweetId = button.getAttribute('data-tweet-id');
    const tweets = JSON.parse(localStorage.getItem('tweets')) || [];
    const tweetIndex = tweets.findIndex(t => t.id.toString() === tweetId);
    
    if (tweetIndex === -1) return;
    
    const countSpan = button.querySelector('span');
    const icon = button.querySelector('i');
    
    if (type === 'like') {
        const isLiked = icon.classList.contains('fas');
        icon.classList.toggle('far', isLiked);
        icon.classList.toggle('fas', !isLiked);
        icon.style.color = isLiked ? '#6e767d' : '#e0245e';
        const newCount = isLiked ? tweets[tweetIndex].likes - 1 : tweets[tweetIndex].likes + 1;
        tweets[tweetIndex].likes = newCount;
        countSpan.textContent = newCount;
    } else if (type === 'retweet') {
        const isRetweeted = icon.style.color === 'rgb(0, 186, 124)';
        icon.style.color = isRetweeted ? '#6e767d' : '#00ba7c';
        const newCount = isRetweeted ? tweets[tweetIndex].retweets - 1 : tweets[tweetIndex].retweets + 1;
        tweets[tweetIndex].retweets = newCount;
        countSpan.textContent = newCount;
    } else if (type === 'comment') {
        const tweet = button.closest('.tweet');
        const commentSection = tweet.querySelector('.comment-section');
        commentSection.style.display = commentSection.style.display === 'none' ? 'block' : 'none';
    }
    
    localStorage.setItem('tweets', JSON.stringify(tweets));
}

// Submit a comment
function submitComment(button) {
    const tweetId = button.getAttribute('data-tweet-id');
    const tweets = JSON.parse(localStorage.getItem('tweets')) || [];
    const tweetIndex = tweets.findIndex(t => t.id.toString() === tweetId);
    
    if (tweetIndex === -1) return;
    
    const user = JSON.parse(localStorage.getItem('user'));
    const userProfile = JSON.parse(localStorage.getItem('userProfile')) || { avatar: DEFAULT_AVATAR };
    const commentSection = button.closest('.comment-section');
    const commentText = commentSection.querySelector('textarea').value;
    
    if (!commentText.trim()) return;
    
    // Create comment data
    const comment = {
        id: Date.now(),
        text: commentText,
        username: user.username,
        name: user.name,
        avatar: userProfile.avatar,
        timestamp: new Date().toISOString()
    };
    
    // Add comment to tweet
    if (!tweets[tweetIndex].comments) tweets[tweetIndex].comments = [];
    if (typeof tweets[tweetIndex].comments === 'number') tweets[tweetIndex].comments = [];
    tweets[tweetIndex].comments.push(comment);
    
    // Update comment count
    const commentCount = tweets[tweetIndex].comments.length;
    const commentButton = button.closest('.tweet').querySelector('button[onclick*="comment"] span');
    commentButton.textContent = commentCount;
    
    // Save to localStorage
    localStorage.setItem('tweets', JSON.stringify(tweets));
    
    // Add comment to UI
    const commentsList = commentSection.querySelector('.comments-list');
    const commentElement = document.createElement('div');
    commentElement.className = 'comment';
    commentElement.innerHTML = `
        <img src="${userProfile.avatar || DEFAULT_AVATAR}" alt="Profile" class="profile-pic">
        <div class="comment-content">
            <div class="comment-header">
                <span class="name">${user.name}</span>
                <span class="username">${user.username}</span>
                <span class="timestamp">· ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
            </div>
            <p class="comment-text">${escapeHtml(commentText)}</p>
        </div>
    `;
    
    commentsList.appendChild(commentElement);
    commentSection.querySelector('textarea').value = '';
}

// Utility function to escape HTML and prevent XSS
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Add logout functionality
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Initialize
checkAuth();
handleTextareaInput();
loadTweets(); 
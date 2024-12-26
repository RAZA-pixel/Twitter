// DOM Elements
const conversationsList = document.querySelector('.conversations-list');
const chatArea = document.querySelector('.chat-area');
const noChatSelected = document.querySelector('.no-chat-selected');
const chatContainer = document.querySelector('.chat-container');
const chatMessages = document.querySelector('.chat-messages');
const chatInput = document.querySelector('.chat-input input');
const sendButton = document.querySelector('.send-btn');
const newMessageButtons = document.querySelectorAll('.new-message-btn');
const newMessageModal = document.querySelector('.new-message-modal');
const closeModalButton = document.querySelector('.close-modal');
const searchInput = document.querySelector('.messages-search input');
const userSearchInput = document.querySelector('.search-users input');
const suggestedUsers = document.querySelector('.suggested-users');

// Default images
const DEFAULT_AVATAR = './assets/default-avatar.svg';
const DEFAULT_COVER = './assets/default-banner.svg';

// Current chat
let currentChat = null;

// Initialize messages page
function initializeMessages() {
    // Check authentication
    const user = localStorage.getItem('user');
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Load conversations
    loadConversations();
    
    // Initialize event listeners
    initializeEventListeners();
}

// Load conversations
function loadConversations() {
    const conversations = getConversations();
    
    conversationsList.innerHTML = conversations.map(conversation => `
        <div class="conversation-item" data-username="${conversation.username}">
            <img src="${conversation.avatar || DEFAULT_AVATAR}" alt="Profile" class="profile-pic">
            <div class="conversation-content">
                <div class="conversation-header">
                    <span class="conversation-name">${conversation.name}</span>
                    <span class="conversation-time">${formatTime(conversation.lastMessage.timestamp)}</span>
                </div>
                <div class="conversation-preview">${conversation.lastMessage.text}</div>
            </div>
        </div>
    `).join('');
}

// Get conversations (simulated data for now)
function getConversations() {
    return [
        {
            name: 'John Doe',
            username: '@johndoe',
            avatar: DEFAULT_AVATAR,
            lastMessage: {
                text: 'Hey, how are you?',
                timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
            }
        },
        {
            name: 'Jane Smith',
            username: '@janesmith',
            avatar: DEFAULT_AVATAR,
            lastMessage: {
                text: 'Did you see the latest update?',
                timestamp: new Date(Date.now() - 1000 * 60 * 60) // 1 hour ago
            }
        }
    ];
}

// Load chat messages
function loadChat(username) {
    const chat = getChatHistory(username);
    currentChat = chat;
    
    // Update chat header
    document.querySelector('.chat-user-info .name').textContent = chat.name;
    document.querySelector('.chat-user-info .username').textContent = chat.username;
    document.querySelector('.chat-user-info .profile-pic').src = chat.avatar || DEFAULT_AVATAR;
    
    // Load messages
    chatMessages.innerHTML = chat.messages.map(message => `
        <div class="message ${message.sent ? 'sent' : 'received'}">
            <div class="message-content">${message.text}</div>
            <div class="message-time">${formatTime(message.timestamp)}</div>
        </div>
    `).join('');
    
    // Show chat container
    noChatSelected.style.display = 'none';
    chatContainer.style.display = 'flex';
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Get chat history (simulated data for now)
function getChatHistory(username) {
    return {
        name: 'John Doe',
        username: '@johndoe',
        avatar: DEFAULT_AVATAR,
        messages: [
            {
                text: 'Hey!',
                timestamp: new Date(Date.now() - 1000 * 60 * 60),
                sent: false
            },
            {
                text: 'Hi! How are you?',
                timestamp: new Date(Date.now() - 1000 * 60 * 30),
                sent: true
            },
            {
                text: 'I\'m good, thanks! How about you?',
                timestamp: new Date(Date.now() - 1000 * 60 * 5),
                sent: false
            }
        ]
    };
}

// Send message
function sendMessage() {
    const text = chatInput.value.trim();
    if (!text || !currentChat) return;
    
    // Create message element
    const messageHTML = `
        <div class="message sent">
            <div class="message-content">${text}</div>
            <div class="message-time">${formatTime(new Date())}</div>
        </div>
    `;
    
    // Add message to chat
    chatMessages.insertAdjacentHTML('beforeend', messageHTML);
    
    // Clear input
    chatInput.value = '';
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Format timestamp
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    
    if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
}

// Initialize event listeners
function initializeEventListeners() {
    // Conversation click
    conversationsList.addEventListener('click', (e) => {
        const conversationItem = e.target.closest('.conversation-item');
        if (conversationItem) {
            const username = conversationItem.dataset.username;
            loadChat(username);
        }
    });
    
    // Send message
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // New message modal
    newMessageButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            newMessageModal.classList.add('show');
            loadSuggestedUsers();
        });
    });
    
    closeModalButton.addEventListener('click', () => {
        newMessageModal.classList.remove('show');
    });
    
    // Search conversations
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const conversations = document.querySelectorAll('.conversation-item');
        
        conversations.forEach(conversation => {
            const name = conversation.querySelector('.conversation-name').textContent.toLowerCase();
            const username = conversation.dataset.username.toLowerCase();
            const preview = conversation.querySelector('.conversation-preview').textContent.toLowerCase();
            
            if (name.includes(query) || username.includes(query) || preview.includes(query)) {
                conversation.style.display = 'flex';
            } else {
                conversation.style.display = 'none';
            }
        });
    });
    
    // Search users in modal
    userSearchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        loadSuggestedUsers(query);
    });
}

// Load suggested users
function loadSuggestedUsers(query = '') {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const suggestions = [
        { name: 'John Doe', username: '@johndoe', avatar: DEFAULT_AVATAR },
        { name: 'Jane Smith', username: '@janesmith', avatar: DEFAULT_AVATAR },
        { name: 'Bob Wilson', username: '@bobwilson', avatar: DEFAULT_AVATAR }
    ].filter(user => 
        user.username !== currentUser.username &&
        (query === '' || 
         user.name.toLowerCase().includes(query) || 
         user.username.toLowerCase().includes(query))
    );
    
    suggestedUsers.innerHTML = suggestions.map(user => `
        <div class="user-item" onclick="startChat('${user.username}')">
            <img src="${user.avatar}" alt="Profile" class="profile-pic">
            <div class="user-info">
                <span class="name">${user.name}</span>
                <span class="username">${user.username}</span>
            </div>
        </div>
    `).join('');
}

// Start new chat
function startChat(username) {
    newMessageModal.classList.remove('show');
    loadChat(username);
}

// Initialize
document.addEventListener('DOMContentLoaded', initializeMessages); 
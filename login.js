// Default images
const DEFAULT_AVATAR = './assets/default-avatar.svg';
const DEFAULT_COVER = './assets/default-banner.svg';

// Toggle between login and signup forms
function toggleForms() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    }
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Here you'll connect to your PHP backend
    // For now, we'll just simulate a successful login
    console.log('Login attempt:', { email, password });
    
    // Get existing user data or create new profile
    const existingProfile = localStorage.getItem('userProfile');
    if (!existingProfile) {
        const userProfile = {
            bio: '',
            location: '',
            joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            following: [],
            followers: [],
            coverPhoto: DEFAULT_COVER,
            avatar: DEFAULT_AVATAR,
            tweets: []
        };
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
    }
    
    // Simulate successful login
    localStorage.setItem('user', JSON.stringify({
        name: 'Demo User',
        username: '@demouser',
        email: email
    }));
    
    // Redirect to main page
    window.location.href = 'index.html';
}

// Handle signup form submission
function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    // Here you'll connect to your PHP backend
    // For now, we'll just simulate a successful signup
    console.log('Signup attempt:', { name, username, email, password });
    
    // Create user profile with default images
    const userProfile = {
        bio: '',
        location: '',
        joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        following: [],
        followers: [],
        coverPhoto: DEFAULT_COVER,
        avatar: DEFAULT_AVATAR,
        tweets: []
    };
    
    // Save user data
    localStorage.setItem('user', JSON.stringify({
        name: name,
        username: '@' + username,
        email: email
    }));
    
    // Save profile data
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    
    // Redirect to main page
    window.location.href = 'index.html';
}

// Check if user is already logged in
function checkAuth() {
    const user = localStorage.getItem('user');
    if (user && window.location.pathname.includes('login.html')) {
        window.location.href = 'index.html';
    }
}

// Initialize
checkAuth(); 
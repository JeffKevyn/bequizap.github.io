// Formata a data do tweet
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffMinutes < 1) return 'agora';
    if (diffMinutes < 60) return `${diffMinutes}m`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes/60)}h`;
    return `${Math.floor(diffMinutes/1440)}d`;
}

// Adiciona tweet ao feed
function addTweetToFeed(tweet) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const isLiked = tweet.likedBy && tweet.likedBy.includes(currentUser?.username);

    const tweetHtml = `
        <div class="tweet" data-id="${tweet.id}">
            <img src="placeholder.jpg" alt="Profile" class="profile-pic">
            <div class="tweet-content">
                <div class="tweet-header">
                    <span class="name">${tweet.author.name}</span>
                    <span class="username">@${tweet.author.username}</span>
                    <span class="timestamp">${formatDate(tweet.timestamp)}</span>
                </div>
                <div class="tweet-text">${tweet.content}</div>
                <div class="tweet-actions">
                    <span onclick="likeTweet('${tweet.id}')" class="like-btn ${isLiked ? 'liked' : ''}">
                        <i class="far fa-heart"></i>
                        <span class="like-count">${tweet.likes || 0}</span>
                    </span>
                </div>
            </div>
        </div>
    `;

    const feed = document.getElementById('tweet-feed');
    if (feed.firstChild) {
        feed.insertAdjacentHTML('afterbegin', tweetHtml);
    } else {
        feed.innerHTML = tweetHtml;
    }
}

// Posta novo tweet
async function postTweet() {
    const tweetText = document.getElementById('tweetText').value;
    if (!tweetText.trim()) return;

    const newTweet = await TWEETS.addTweet(tweetText);
    if (newTweet) {
        document.getElementById('tweetText').value = '';
    }
}

// Curte/Descurte tweet
async function likeTweet(tweetId) {
    const updatedTweet = await TWEETS.toggleLike(tweetId);
    if (!updatedTweet) return;

    const tweetElement = document.querySelector(`.tweet[data-id="${tweetId}"]`);
    const likeBtn = tweetElement.querySelector('.like-btn');
    const likeCount = tweetElement.querySelector('.like-count');

    likeBtn.classList.toggle('liked');
    likeCount.textContent = updatedTweet.likes || 0;
}

// Carrega tweets quando a página abre
window.onload = () => {
    if (!localStorage.getItem('currentUser')) {
        window.location.href = 'login.html';
        return;
    }
    TWEETS.getAllTweets((tweets) => {
        const feed = document.getElementById('tweet-feed');
        feed.innerHTML = '';
        tweets.forEach(tweet => addTweetToFeed(tweet));
    });
};

// Carrega tweets em tempo real
function loadTweets() {
    TWEETS.listenToTweets(tweets => {
        const feed = document.getElementById('tweet-feed');
        feed.innerHTML = '';
        tweets.forEach(tweet => renderTweet(tweet));
    });
}

// Renderiza um tweet
function renderTweet(tweet) {
    const user = AUTH.getCurrentUser();
    const isLiked = tweet.likes && tweet.likes[user?.username];
    const likesCount = tweet.likes ? Object.keys(tweet.likes).length : 0;

    const tweetHtml = `
        <article class="tweet" data-id="${tweet.id}">
            <img src="${tweet.authorPhoto}" alt="" class="profile-pic">
            <div class="tweet-content">
                <div class="tweet-header">
                    <div class="tweet-user-info">
                        <span class="name">${tweet.authorName}</span>
                        <span class="username">@${tweet.authorId}</span>
                        <span class="time">${formatTime(tweet.timestamp)}</span>
                    </div>
                </div>
                <div class="tweet-text">${tweet.content}</div>
                <div class="tweet-actions">
                    <button class="like ${isLiked ? 'active' : ''}" onclick="handleLike('${tweet.id}')">
                        <i class="${isLiked ? 'fas' : 'far'} fa-heart"></i>
                        <span>${likesCount}</span>
                    </button>
                </div>
            </div>
        </article>
    `;

    const feed = document.getElementById('tweet-feed');
    feed.insertAdjacentHTML('beforeend', tweetHtml);
}

// Formata o tempo
function formatTime(timestamp) {
    const now = new Date();
    const date = new Date(timestamp);
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);

    if (seconds < 60) return 'agora';
    if (seconds < 3600) return `${Math.floor(seconds/60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds/3600)}h`;
    return `${Math.floor(seconds/86400)}d`;
}

// Handlers
async function handleTweetSubmit() {
    const textarea = document.querySelector('.tweet-input-area textarea');
    const content = textarea.value.trim();
    
    if (!content) return;
    
    const success = await TWEETS.postTweet(content);
    if (success) {
        textarea.value = '';
    }
}

async function handleLike(tweetId) {
    await TWEETS.toggleLike(tweetId);
}

// Inicia o app
document.addEventListener('DOMContentLoaded', () => {
    if (!AUTH.isLoggedIn()) {
        window.location.href = '/login.html';
        return;
    }
    
    loadTweets();
    
    // Event listeners
    document.querySelector('.tweet-submit-btn').addEventListener('click', handleTweetSubmit);
});  
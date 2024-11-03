// Seleciona elementos do DOM
const tweetTextarea = document.querySelector('.tweet-input textarea');
const tweetButton = document.querySelector('.tweet-input button');
const feed = document.querySelector('.feed');

// Adicione estas funções no início do script.js
function getUserProfile() {
    return JSON.parse(localStorage.getItem('userProfile')) || {
        name: 'Nome do Usuário',
        username: 'usuario',
        profilePic: 'https://via.placeholder.com/50'
    };
}

function updateProfileElements() {
    const profile = getUserProfile();
    // Atualiza a foto de perfil na área de tweet
    const tweetBoxProfilePic = document.querySelector('.tweet-box .profile-pic');
    if (tweetBoxProfilePic) {
        tweetBoxProfilePic.src = profile.profilePic;
    }
}

// Função para criar um novo tweet
function createTweet(text) {
    const profile = getUserProfile();
    const now = new Date();
    const timeString = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    const tweet = document.createElement('div');
    tweet.className = 'tweet';
    
    tweet.innerHTML = `
        <img src="${profile.profilePic}" alt="Profile" class="profile-pic">
        <div class="tweet-content">
            <div class="tweet-header">
                <span class="name">${profile.name}</span>
                <span class="username">@${profile.username}</span>
                <span class="timestamp">· ${timeString}</span>
            </div>
            <p class="tweet-text">${text}</p>
            <div class="tweet-actions">
                <span><i class="far fa-comment"></i> 0</span>
                <span><i class="fas fa-retweet"></i> 0</span>
                <span><i class="far fa-heart"></i> 0</span>
                <span><i class="far fa-share-square"></i></span>
            </div>
        </div>
    `;
    
    // Adiciona interatividade ao botão de curtir
    const likeButton = tweet.querySelector('.fa-heart');
    let liked = false;
    let likeCount = 0;
    
    likeButton.addEventListener('click', () => {
        liked = !liked;
        likeCount = liked ? likeCount + 1 : likeCount - 1;
        likeButton.className = liked ? 'fas fa-heart' : 'far fa-heart';
        likeButton.parentElement.textContent = ` ${likeCount}`;
        likeButton.parentElement.prepend(likeButton);
    });

    return tweet;
}

// Função para postar um novo tweet
function postTweet() {
    const tweetText = tweetTextarea.value.trim();
    
    if (tweetText) {
        // Cria e insere o novo tweet no feed
        const newTweet = createTweet(tweetText);
        feed.insertBefore(newTweet, feed.firstChild);
        
        // Salva o tweet no localStorage
        const tweets = JSON.parse(localStorage.getItem('userTweets')) || [];
        tweets.unshift({
            text: tweetText,
            timestamp: new Date().toLocaleString()
        });
        localStorage.setItem('userTweets', JSON.stringify(tweets));
        
        // Limpa a textarea
        tweetTextarea.value = '';
    }
}

// Adiciona eventos aos elementos
tweetButton.addEventListener('click', postTweet);

// Permite postar com Enter (Shift + Enter para nova linha)
tweetTextarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        postTweet();
    }
});

// Ajusta automaticamente a altura da textarea
tweetTextarea.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
});

// Adicione um listener para atualizar os elementos quando o perfil mudar
window.addEventListener('storage', function(e) {
    if (e.key === 'userProfile') {
        updateProfileElements();
    }
});

// Chame updateProfileElements quando a página carregar
document.addEventListener('DOMContentLoaded', updateProfileElements); 
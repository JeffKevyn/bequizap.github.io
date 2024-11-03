const TWEETS = {
    // Pega todos os tweets
    getAllTweets(callback) {
        db.ref('tweets').on('value', (snapshot) => {
            const tweets = [];
            if (snapshot.exists()) {
                snapshot.forEach((child) => {
                    tweets.unshift({...child.val(), id: child.key});
                });
            }
            callback(tweets);
        });
    },

    // Adiciona novo tweet
    async addTweet(tweet) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return null;
        
        const newTweet = {
            content: tweet,
            author: {
                username: currentUser.username,
                name: currentUser.name
            },
            likes: 0,
            timestamp: new Date().toISOString(),
            likedBy: []
        };

        try {
            const ref = await db.ref('tweets').push(newTweet);
            return {...newTweet, id: ref.key};
        } catch (error) {
            console.error('Erro ao adicionar tweet:', error);
            return null;
        }
    },

    // Curte/Descurte tweet
    async toggleLike(tweetId) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return null;

        const tweetRef = db.ref(`tweets/${tweetId}`);
        
        try {
            const snapshot = await tweetRef.once('value');
            const tweet = snapshot.val();

            if (!tweet) return null;

            const likedBy = tweet.likedBy || [];
            const userIndex = likedBy.indexOf(currentUser.username);

            if (userIndex === -1) {
                likedBy.push(currentUser.username);
                tweet.likes = (tweet.likes || 0) + 1;
            } else {
                likedBy.splice(userIndex, 1);
                tweet.likes = Math.max(0, (tweet.likes || 0) - 1);
            }

            tweet.likedBy = likedBy;
            await tweetRef.update(tweet);
            return {...tweet, id: tweetId};
        } catch (error) {
            console.error('Erro ao atualizar like:', error);
            return null;
        }
    }
}; 
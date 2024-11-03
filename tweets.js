const TWEETS = {
    listenToTweets(callback) {
        const tweetsRef = db.ref('tweets');
        
        tweetsRef
            .orderByChild('timestamp')
            .on('value', snapshot => {
                const tweets = [];
                snapshot.forEach(child => {
                    tweets.unshift({
                        id: child.key,
                        ...child.val()
                    });
                });
                callback(tweets);
            });
    },

    async postTweet(content) {
        const user = AUTH.getCurrentUser();
        if (!user) return null;

        const newTweet = {
            authorId: user.username,
            authorName: user.name,
            authorPhoto: user.profilePic,
            content,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            likes: {},
            retweets: {}
        };

        try {
            await db.ref('tweets').push(newTweet);
            return true;
        } catch (error) {
            console.error('Erro ao postar tweet:', error);
            return false;
        }
    },

    async toggleLike(tweetId) {
        const user = AUTH.getCurrentUser();
        if (!user) return;

        const tweetRef = db.ref(`tweets/${tweetId}`);
        const likeRef = db.ref(`tweets/${tweetId}/likes/${user.username}`);

        try {
            const snapshot = await likeRef.once('value');
            if (snapshot.exists()) {
                await likeRef.remove();
            } else {
                await likeRef.set(true);
            }
        } catch (error) {
            console.error('Erro ao curtir tweet:', error);
        }
    }
}; 
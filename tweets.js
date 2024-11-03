const TWEETS = {
    listenToTweets(callback) {
        db.ref('tweets')
            .orderByChild('timestamp')
            .limitToLast(50)
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
            content: content,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            likes: {},
            retweets: {},
            replies: {}
        };

        try {
            const ref = await db.ref('tweets').push(newTweet);
            return ref.key;
        } catch (error) {
            console.error('Erro ao postar tweet:', error);
            return null;
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
                const tweet = (await tweetRef.once('value')).val();
                if (tweet.authorId !== user.username) {
                    this.createNotification(tweet.authorId, 'like', tweetId);
                }
            }
        } catch (error) {
            console.error('Erro ao curtir tweet:', error);
        }
    },

    async toggleRetweet(tweetId) {
        const user = AUTH.getCurrentUser();
        if (!user) return;

        const tweetRef = db.ref(`tweets/${tweetId}`);
        const retweetRef = db.ref(`tweets/${tweetId}/retweets/${user.username}`);

        try {
            const snapshot = await retweetRef.once('value');
            if (snapshot.exists()) {
                await retweetRef.remove();
            } else {
                await retweetRef.set(true);
                const tweet = (await tweetRef.once('value')).val();
                if (tweet.authorId !== user.username) {
                    this.createNotification(tweet.authorId, 'retweet', tweetId);
                }
            }
        } catch (error) {
            console.error('Erro ao retweetar:', error);
        }
    },

    async createNotification(userId, type, tweetId) {
        const user = AUTH.getCurrentUser();
        const notification = {
            type,
            fromUser: user.username,
            tweetId,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            read: false
        };

        try {
            await db.ref(`notifications/${userId}`).push(notification);
        } catch (error) {
            console.error('Erro ao criar notificação:', error);
        }
    }
}; 
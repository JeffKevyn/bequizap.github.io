const TWEETS = {
    async post(content) {
        const user = AUTH.getCurrentUser();
        if (!user) return null;

        const newTweet = {
            authorId: user.username,
            content,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            likes: {},
            retweets: {},
            replies: {}
        };

        const tweetRef = await db.ref('tweets').push(newTweet);
        return tweetRef.key;
    },

    async like(tweetId) {
        const user = AUTH.getCurrentUser();
        if (!user) return;

        const likeRef = db.ref(`tweets/${tweetId}/likes/${user.username}`);
        const snapshot = await likeRef.once('value');

        if (snapshot.exists()) {
            await likeRef.remove();
            return false;
        } else {
            await likeRef.set(true);
            this.createNotification(tweetId, 'like');
            return true;
        }
    },

    async retweet(tweetId) {
        const user = AUTH.getCurrentUser();
        if (!user) return;

        const retweetRef = db.ref(`tweets/${tweetId}/retweets/${user.username}`);
        const snapshot = await retweetRef.once('value');

        if (snapshot.exists()) {
            await retweetRef.remove();
            return false;
        } else {
            await retweetRef.set(true);
            this.createNotification(tweetId, 'retweet');
            return true;
        }
    },

    async reply(tweetId, content) {
        const user = AUTH.getCurrentUser();
        if (!user) return;

        const reply = {
            authorId: user.username,
            content,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        };

        const replyRef = await db.ref(`tweets/${tweetId}/replies`).push(reply);
        this.createNotification(tweetId, 'reply');
        return replyRef.key;
    },

    async createNotification(tweetId, type) {
        const user = AUTH.getCurrentUser();
        const tweet = await db.ref(`tweets/${tweetId}`).once('value');
        const tweetData = tweet.val();

        if (user.username === tweetData.authorId) return;

        const notification = {
            type,
            from: user.username,
            tweetId,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            read: false
        };

        await db.ref(`notifications/${tweetData.authorId}`).push(notification);
    },

    listenToFeed(callback) {
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
    }
}; 
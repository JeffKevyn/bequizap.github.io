// Sistema simples de autenticação
const AUTH = {
    // Registra usuário
    async register(username, password, name, email) {
        try {
            // Verifica se username já existe
            const userSnapshot = await db.ref(`users/${username}`).once('value');
            if (userSnapshot.exists()) {
                return { error: 'Nome de usuário já existe' };
            }

            // Cria novo usuário
            const newUser = {
                username,
                name,
                email,
                password, // Em produção, use hash!
                profilePic: '/images/default-avatar.png',
                coverPhoto: '/images/default-cover.png',
                bio: '',
                location: '',
                joinDate: new Date().toISOString(),
                following: {},
                followers: {}
            };

            await db.ref(`users/${username}`).set(newUser);
            return { success: true };
        } catch (error) {
            return { error: error.message };
        }
    },

    // Faz login
    async login(username, password) {
        try {
            const snapshot = await db.ref(`users/${username}`).once('value');
            const user = snapshot.val();

            if (user && user.password === password) {
                localStorage.setItem('currentUser', JSON.stringify({
                    username,
                    name: user.name,
                    profilePic: user.profilePic
                }));
                return { success: true };
            }
            return { error: 'Usuário ou senha incorretos' };
        } catch (error) {
            return { error: error.message };
        }
    },

    // Faz logout
    logout() {
        localStorage.removeItem('currentUser');
        window.location.href = '/login.html';
    },

    // Verifica se está logado
    isLoggedIn() {
        return !!this.getCurrentUser();
    },

    // Pega usuário atual
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser'));
    }
}; 
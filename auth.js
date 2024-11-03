// Sistema simples de autenticação
const AUTH = {
    // Registra usuário
    async register(username, password, name, email) {
        try {
            const usersRef = db.ref('users');
            const snapshot = await usersRef.child(username).once('value');
            
            if (snapshot.exists()) {
                return { error: 'Usuário já existe' };
            }

            await usersRef.child(username).set({
                password, // Em produção, use hash!
                name,
                email,
                profilePic: 'placeholder.jpg',
                coverPhoto: '',
                bio: 'Olá! Estou no Twitter!',
                location: ''
            });

            return { success: true };
        } catch (error) {
            return { error: 'Erro ao registrar usuário' };
        }
    },

    // Faz login
    async login(username, password) {
        try {
            const snapshot = await db.ref(`users/${username}`).once('value');
            const user = snapshot.val();

            if (user && user.password === password) {
                const userData = {
                    username,
                    name: user.name,
                    email: user.email,
                    profilePic: user.profilePic,
                    coverPhoto: user.coverPhoto,
                    bio: user.bio,
                    location: user.location,
                    verified: isUserVerified(username)
                };

                localStorage.setItem('currentUser', JSON.stringify(userData));
                return { success: true };
            }

            return { error: 'Usuário ou senha incorretos' };
        } catch (error) {
            return { error: 'Erro ao fazer login' };
        }
    },

    // Faz logout
    logout() {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    },

    // Verifica se está logado
    isLoggedIn() {
        return localStorage.getItem('currentUser') !== null;
    },

    // Pega usuário atual
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser'));
    }
}; 
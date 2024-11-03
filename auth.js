// Sistema simples de autenticação
const AUTH = {
    // Usuários cadastrados
    users: {
        'admin': {
            password: 'admin123',
            name: 'Administrador',
            email: 'admin@email.com'
        },
        'jeffin': {
            password: '123456',
            name: 'Jefferson',
            email: 'jeff@email.com'
        }
    },

    // Verifica se está logado
    isLoggedIn() {
        return localStorage.getItem('currentUser') !== null;
    },

    // Faz login
    login(username, password) {
        const user = this.users[username];
        if (user && user.password === password) {
            localStorage.setItem('currentUser', JSON.stringify({
                username,
                name: user.name,
                email: user.email
            }));
            return true;
        }
        return false;
    },

    // Faz logout
    logout() {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    },

    // Registra novo usuário
    register(username, password, name, email) {
        if (this.users[username]) {
            return false; // Usuário já existe
        }

        this.users[username] = {
            password,
            name,
            email
        };

        return true;
    },

    // Pega usuário atual
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser'));
    }
}; 
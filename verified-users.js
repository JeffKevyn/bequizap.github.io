// Tipos de verificação e suas cores
const VERIFICATION_TYPES = {
    DEVELOPER: {
        color: '#00BA7C', // Verde
        title: 'DESENVOLVEDOR'
    },
    BEQUINHOS: {
        color: '#FFD700', // Dourado
        title: 'BEQUINHOS'
    },
    AMIGOS: {
        color: '#1DA1F2', // Azul
        title: 'AMIGOS'
    }
};

// Lista de usuários verificados com seus tipos
const verifiedUsers = {
    'jeffin1': {
        reason: 'DEVELOPER',
        verifiedDate: '2024-01-15',
        title: 'Desenvolvedor Oficial'
    },
    'jeffin': {
        reason: 'BEQUINHOS',
        verifiedDate: '2024-01-16',
        title: 'Bequinho'
    },
    'jeffin2': {
        reason: 'AMIGOS',
        verifiedDate: '2024-01-17',
        title: 'Amigo'
    }
};

// Função para verificar se um usuário está verificado
function isUserVerified(username) {
    return username.toLowerCase() in verifiedUsers;
}

// Função para obter informações de verificação
function getVerificationInfo(username) {
    const userInfo = verifiedUsers[username.toLowerCase()];
    if (!userInfo) return null;

    const type = VERIFICATION_TYPES[userInfo.reason];
    return {
        ...userInfo,
        color: type.color,
        title: type.title
    };
} 
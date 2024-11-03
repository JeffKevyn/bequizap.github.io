// Tipos de verificação e suas cores
const VERIFICATION_TYPES = {
    DEVELOPER: {
        color: '#00BA7C',
        title: 'Desenvolvedor Oficial'
    },
    BEQUINHOS: {
        color: '#FFD700',
        title: 'Bequinho'
    },
    AMIGOS: {
        color: '#1DA1F2',
        title: 'Amigo'
    }
};

// Lista de usuários verificados
const verifiedUsers = {
    'jeffin': {
        type: 'DEVELOPER',
        verifiedDate: '2024-01-15'
    },
    'maria': {
        type: 'BEQUINHOS',
        verifiedDate: '2024-01-16'
    },
    'joao': {
        type: 'AMIGOS',
        verifiedDate: '2024-01-17'
    }
};

// Função para verificar se um usuário está verificado
function isUserVerified(username) {
    return username.toLowerCase() in verifiedUsers;
}

// Função para obter informações de verificação
function getVerificationInfo(username) {
    const userVerification = verifiedUsers[username.toLowerCase()];
    if (!userVerification) return null;

    const type = VERIFICATION_TYPES[userVerification.type];
    return {
        ...type,
        date: userVerification.verifiedDate
    };
} 
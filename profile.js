document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const editModal = document.getElementById('editModal');
    const editForm = document.getElementById('edit-profile-form');
    const closeModal = document.querySelector('.close-modal');
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    const photoUpload = document.getElementById('photo-upload');
    const bannerUpload = document.getElementById('banner-upload');
    const profilePreview = document.getElementById('profile-preview');
    const bannerPreview = document.getElementById('banner-preview');
    const coverPhoto = document.querySelector('.cover-photo');
    const verifiedBadge = document.getElementById('verified-badge');
    const verifiedCheckbox = document.getElementById('verified-checkbox');

    // Carrega o perfil inicial
    loadProfile();

    // Event Listeners
    editProfileBtn.addEventListener('click', () => {
        editModal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        editModal.style.display = 'none';
    });

    // Handler para upload de foto de perfil
    photoUpload.addEventListener('change', function(e) {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                updateAllProfilePictures(e.target.result);
                profilePreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Handler para upload do banner
    bannerUpload.addEventListener('change', function(e) {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageUrl = e.target.result;
                bannerPreview.style.backgroundImage = `url(${imageUrl})`;
                coverPhoto.style.backgroundImage = `url(${imageUrl})`;
            };
            reader.readAsDataURL(file);
        }
    });

    // Handler para salvar o formulário
    editForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const profile = {
            name: document.getElementById('edit-name').value,
            username: document.getElementById('edit-username').value,
            bio: document.getElementById('edit-bio').value,
            location: document.getElementById('edit-location').value,
            profilePic: profilePreview.src,
            coverPhoto: bannerPreview.style.backgroundImage.replace(/^url\(['"](.+)['"]\)/, '$1') || '',
            verified: verifiedCheckbox.checked
        };

        saveProfile(profile);
        updateProfileInTweets();
        editModal.style.display = 'none';
    });
});

// Função para atualizar todas as fotos de perfil
function updateAllProfilePictures(imageUrl) {
    document.querySelectorAll('.profile-pic').forEach(img => {
        img.src = imageUrl;
    });
    
    const profilePreview = document.getElementById('profile-preview');
    if (profilePreview) {
        profilePreview.src = imageUrl;
    }
}

// Função para carregar o perfil (atualizada)
function loadProfile() {
    const profile = JSON.parse(localStorage.getItem('userProfile')) || {
        name: 'Nome do Usuário',
        username: 'usuario',
        bio: 'Sua bio aparecerá aqui',
        location: 'Localização',
        profilePic: 'https://via.placeholder.com/150',
        coverPhoto: ''
    };

    // Atualiza os elementos da página
    document.querySelector('.profile-name').textContent = profile.name;
    document.querySelector('.profile-username').textContent = '@' + profile.username;
    document.querySelector('.profile-bio').textContent = profile.bio;
    document.querySelector('.profile-meta span:first-child').innerHTML = 
        `<i class="fas fa-map-marker-alt"></i> ${profile.location}`;

    // Atualiza o badge de verificação
    updateVerificationBadge(profile.username);

    // Remove o checkbox de verificação do modal
    const verifiedCheckboxContainer = document.querySelector('.checkbox-container');
    if (verifiedCheckboxContainer) {
        verifiedCheckboxContainer.style.display = 'none';
    }

    // Atualiza todas as fotos de perfil
    if (profile.profilePic) {
        updateAllProfilePictures(profile.profilePic);
    }

    // Atualiza o banner
    if (profile.coverPhoto) {
        const coverPhoto = document.querySelector('.cover-photo');
        const bannerPreview = document.getElementById('banner-preview');
        if (coverPhoto) coverPhoto.style.backgroundImage = `url(${profile.coverPhoto})`;
        if (bannerPreview) bannerPreview.style.backgroundImage = `url(${profile.coverPhoto})`;
    }

    // Preenche o formulário
    document.getElementById('edit-name').value = profile.name;
    document.getElementById('edit-username').value = profile.username;
    document.getElementById('edit-bio').value = profile.bio;
    document.getElementById('edit-location').value = profile.location;
}

// Função para salvar o perfil (atualizada)
function saveProfile(profile) {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    
    // Atualiza a interface
    document.querySelector('.profile-name').textContent = profile.name;
    document.querySelector('.profile-username').textContent = '@' + profile.username;
    document.querySelector('.profile-bio').textContent = profile.bio;
    document.querySelector('.profile-meta span:first-child').innerHTML = 
        `<i class="fas fa-map-marker-alt"></i> ${profile.location}`;
    
    // Atualiza o badge de verificação
    updateVerificationBadge(profile.username);

    // Atualiza todas as fotos de perfil
    updateAllProfilePictures(profile.profilePic);

    // Atualiza o banner
    if (profile.coverPhoto) {
        const coverPhoto = document.querySelector('.cover-photo');
        if (coverPhoto) coverPhoto.style.backgroundImage = `url(${profile.coverPhoto})`;
    }
}

// Função para atualizar o badge de verificação
function updateVerificationBadge(username) {
    const verifiedBadge = document.getElementById('verified-badge');
    if (!verifiedBadge) return;

    const verificationInfo = getVerificationInfo(username);
    
    if (verificationInfo) {
        verifiedBadge.style.display = 'inline-block';
        verifiedBadge.innerHTML = `
            <div class="verified-certificate" style="color: ${verificationInfo.color}">
                <i class="fas fa-certificate"></i>
                <i class="fas fa-check"></i>
            </div>
            <div class="verified-tooltip">${verificationInfo.title}</div>
        `;
    } else {
        verifiedBadge.style.display = 'none';
    }
}

// Função para atualizar os badges nos tweets
function updateProfileInTweets() {
    const profile = JSON.parse(localStorage.getItem('userProfile'));
    const verificationInfo = getVerificationInfo(profile.username);
    const tweetHeaders = document.querySelectorAll('.tweet-header .name');
    
    tweetHeaders.forEach(header => {
        const nameText = header.textContent;
        if (verificationInfo) {
            header.innerHTML = `${nameText} 
                <span class="verified-badge">
                    <div class="verified-certificate" style="color: ${verificationInfo.color}">
                        <i class="fas fa-certificate"></i>
                        <i class="fas fa-check"></i>
                    </div>
                </span>`;
        } else {
            header.textContent = nameText;
        }
    });
}

const PROFILE = {
    // Carrega perfil
    async loadProfile(username) {
        try {
            const snapshot = await db.ref(`users/${username}`).once('value');
            const profile = snapshot.val();
            
            if (!profile) return null;

            const verificationInfo = getVerificationInfo(username);
            
            return {
                ...profile,
                username,
                verified: !!verificationInfo,
                verificationInfo
            };
        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
            return null;
        }
    },

    // Atualiza perfil
    async updateProfile(username, updates) {
        try {
            await db.ref(`users/${username}`).update(updates);
            
            // Atualiza usuário local
            const currentUser = AUTH.getCurrentUser();
            const updatedUser = {...currentUser, ...updates};
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));

            return true;
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            return false;
        }
    }
};
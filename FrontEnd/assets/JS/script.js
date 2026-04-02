async function getWorks() {
    // envoie une requête GET à l'API pour récupérer la liste des travaux
    const reponse = await fetch('http://localhost:5678/api/works');
    return await reponse.json();
}

async function getCategories() {
    // envoie une requête GET à l'API pour récupérer la liste des catégories, retourne un tableau d'objets représentant les catégories
    const reponse = await fetch('http://localhost:5678/api/categories');
    return await reponse.json();
}


function generateWorks(works) {
    // génère le contenu de la galerie en fonction des travaux passés en paramètre
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = ''; 
    
    // pour chaque travail, on crée un élément figure contenant une image et une légende, puis on l'ajoute à la galerie
    works.forEach(work => {
        const workElement = document.createElement('figure');
        workElement.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <figcaption>${work.title}</figcaption>
        `;
        gallery.appendChild(workElement);
    });
}

async function init() {
    const works = await getWorks();
    const categories = await getCategories();
    generateWorks(works);
    setupFilters(works, categories);
    adminDisplay();
    Logout();
    loadPopup(works);
}


function setupFilters(works, categories) {
    // génère les boutons de filtre en fonction des catégories passées en paramètre
    const filterContainer = document.querySelector('.filters');

    const btnTous = document.createElement('button');
    btnTous.classList.add('btn-filter', 'filter-active');
    btnTous.innerText = 'Tous';
    filterContainer.appendChild(btnTous);

    // pour chaque catégorie, on crée un bouton de filtre
    categories.forEach(category => {
        const btn = document.createElement('button');
        btn.classList.add('btn-filter');
        btn.innerText = category.name;
        btn.dataset.id = category.id;
        filterContainer.appendChild(btn);
    });

    const btns = document.querySelectorAll('.btn-filter');

    // au clic sur un bouton de filtre, on met à jour la galerie pour n'afficher que les travaux correspondant à la catégorie sélectionnée
    btns.forEach(btn => {
        btn.addEventListener('click', () => {

            btns.forEach(btn => btn.classList.remove('active'));
            btn.classList.add('active');

            const categoryName = btn.innerText;

            let filteredWorks;

            if (categoryName === 'Tous') {
                filteredWorks = works;
            } else {
                filteredWorks = works.filter(work => work.categoryId === parseInt(btn.dataset.id));
            }

            generateWorks(filteredWorks);
            
        });
    });
}

function Logout() { 
    const token = localStorage.getItem('token');
    const loginLink = document.querySelector('.login-link');

    if (token) {
        // si un token est présent on change le texte du lien de connexion en "logout"
        loginLink.innerText = 'logout';
        loginLink.href = '#';
        // au clic sur le lien de logout, on supprime le token du localStorage et on recharge la page pour revenir à l'état non connecté
        loginLink.addEventListener('click', (event) => {
            event.preventDefault();
            localStorage.removeItem('token');
            window.location.reload();
        });
    }
}

init();


//POPUP//


const popup = document.querySelector('.popup');
const popupContent = document.querySelector('.popup-content');
const popupForm = document.querySelector('.popup-form');

function closePopup() {
    const btnsClose = document.querySelectorAll('.fa-xmark');
    btnsClose.forEach(btn => {
        btn.addEventListener('click', () => {
            popup.classList.remove('active');
            popup.classList.add('inactive');
            popupContent.classList.remove('active');
            popupContent.classList.add('inactive');
            popupForm.classList.remove('active');
            popupForm.classList.add('inactive');
        });
    })

    popup.addEventListener('click', (event) => {
        if (event.target === popup) {
            popup.classList.remove('active');
            popup.classList.add('inactive');
            popupContent.classList.remove('active');
            popupContent.classList.add('inactive');
            popupForm.classList.remove('active');
            popupForm.classList.add('inactive');
        }
    })
}

function adminDisplay() {
    // si un token est présent dans le localStorage, on affiche les éléments d'admin et on masque les filtres
    const token = localStorage.getItem('token');
    const edit = document.querySelector('.edit');
    const filterContainer = document.querySelector('.filters');
    const btnEdit = document.querySelector('.btn-edit');
    if (token) {
        edit.classList.remove('inactive');
        edit.classList.add('active');
        filterContainer.classList.add('inactive');
        filterContainer.classList.remove('active');
        btnEdit.classList.remove('inactive');
        btnEdit.classList.add('active');
    }

    btnEdit.addEventListener('click', (event) => {
        popup.classList.add('active');
        popupContent.classList.add('active');
    });
}

function loadPopup(works) {

    loadPopupGallery(works);
    changePage(works);
    closePopup();
}

function changePage(works) {
    // au clic sur le bouton "Ajouter une photo", on change le contenu de la popup pour afficher le formulaire d'ajout de photo
    const btnAddPhoto = document.querySelector('.btn-add-photo');
    btnAddPhoto.addEventListener('click', () => {
        popupContent.classList.remove('active');
        popupContent.classList.add('inactive');
        popupForm.classList.remove('inactive');
        popupForm.classList.add('active');

        // ajout des eventListener pour les boutons
        const btnBack = document.querySelector('.fa-arrow-left');
        btnBack.addEventListener('click', () => {
            popupForm.classList.remove('active');
            popupForm.classList.add('inactive');
            popupContent.classList.remove('inactive');
            popupContent.classList.add('active');
        });
    });
}

function loadPopupGallery(works) {
    //ajout des éléments de la galerie dans la popup
    const popupGallery = document.querySelector('.popup-gallery');
    popupGallery.innerHTML = '';
    works.forEach(work => {
        const workElement = document.createElement('figure');
        workElement.innerHTML = `
            <i class="fa-solid fa-trash-can"></i>
            <img src="${work.imageUrl}" alt="${work.title}">
        `;
        popupGallery.appendChild(workElement);

        // au clic sur l'icône de poubelle, on supprime le travail correspondant et on rafraîchit la galerie
        const btnDelete = workElement.querySelector('.fa-trash-can');
        btnDelete.addEventListener('click', async () => {
            const success = await deleteWork(work.id);
            if (success) {
                refreshAllGalleries();
            }
        });
    });

}

async function deleteWork(workId) {
    // envoie une requête DELETE à l'API pour supprimer un travail, retourne true si la suppression a réussi
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.ok;
}

async function refreshAllGalleries() {
    // récupère la liste des travaux à jour, régénère la galerie principale et la galerie de la popup
    const updatedWorks = await getWorks();
    generateWorks(updatedWorks)
    loadPopupGallery(updatedWorks);
}
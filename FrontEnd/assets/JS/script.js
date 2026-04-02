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
    btnTous.classList.add('btn-filter', 'active');
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

function closePopup() {
    popup.style.visibility = 'hidden';
}

function adminDisplay() {
    // si un token est présent dans le localStorage, on affiche les éléments d'admin et on masque les filtres
    const token = localStorage.getItem('token');
    const edit = document.querySelector('.edit');
    const filterContainer = document.querySelector('.filters');
    const btnEdit = document.querySelector('.btn-edit');
    if (token) {
        edit.style.display = 'flex';
        filterContainer.style.visibility = 'hidden';
        btnEdit.style.display = 'flex';
    }

    btnEdit.addEventListener('click', (event) => {
        popup.style.visibility = 'visible';
    });
}

function loadPopup(works) {

    loadPopupGallery(works);
    changePage(works);

    popup.addEventListener('click', (event) => {
        if (event.target === popup) {
            closePopup();
        }
    })
}

function changePage(works) {
    // au clic sur le bouton "Ajouter une photo", on change le contenu de la popup pour afficher le formulaire d'ajout de photo
    const btnAddPhoto = document.querySelector('.btn-add-photo');
    btnAddPhoto.addEventListener('click', () => {
        popupContent.innerHTML = '';
        popupContent.innerHTML = `
        <i class="fa-solid fa-arrow-left"></i>
        <i class="fa-solid fa-xmark"></i>
        <h2>Ajout image</h2>
        <div class="ajout-img">
        <i class="fa-solid fa-image"></i>
        <button class="btn-photo">+ Ajouter photo</button>
        <p>jpg, png : 4mo max</p>
        </div>
        <form action="">
        <label for="title">Titre</label>
        <input type="text" name="title" id="title">
        <label for="category">Catégorie</label>
        <select name="category" id="category">
        <option value="0"></option>
        <option value="1">Objets</option>
        <option value="2">Appartements</option>
        <option value="3">Hôtels & restaurants</option>
        </select>
        </form>
        <span class="popup-border"></span>
        <button class="btn-valider">Valider</button>`;

        // ajout des eventListener pour les boutons
        const btnBack = document.querySelector('.fa-arrow-left');
        btnBack.addEventListener('click', () => {
            loadPopupGallery(works);
        });
        const btnClose = document.querySelector('.fa-xmark');
        btnClose.addEventListener('click', () => {
            closePopup();
        });
    });
}

function loadPopupGallery(works) {

    // génération du contenu de la popup
    popupContent.innerHTML = `
    <i class="fa-solid fa-xmark"></i>
    <h2>Galerie photo</h2>
    <div class="popup-gallery">
    </div>
    <span class="popup-border"></span>
    <button class="btn-add-photo">Ajouter une photo</button>
    `;

    // ajout des eventListener pour les boutons
    const btnClose = document.querySelector('.fa-xmark');
        btnClose.addEventListener('click', () => {
            closePopup();
        });

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
            const deleteResponse = await deleteWork(work.id);
            if (deleteResponse) {
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
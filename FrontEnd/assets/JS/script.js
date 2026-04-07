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
    works.forEach((work) => {
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
    setupCategory(works, categories);
    adminDisplay();
    Logout();
    loadPopup(works);
}

function setupCategory(works, categories) {
    // génère les boutons de filtre en fonction des catégories passées en paramètre
    const filterContainer = document.querySelector('.filters');
    const selectedCategory = document.querySelector('select');

    const btnTous = document.createElement('button');
    btnTous.classList.add('btn-filter', 'filter-active');
    btnTous.innerText = 'Tous';
    filterContainer.appendChild(btnTous);

    // pour chaque catégorie, on crée un bouton de filtre
    categories.forEach((category) => {
        const btn = document.createElement('button');
        const option = document.createElement('option');
        option.value = category.id;
        option.innerText = category.name;
        selectedCategory.appendChild(option);
        btn.classList.add('btn-filter');
        btn.innerText = category.name;
        btn.dataset.id = category.id;
        filterContainer.appendChild(btn);
    });

    const btns = document.querySelectorAll('.btn-filter');

    // au clic sur un bouton de filtre, on met à jour la galerie pour n'afficher que les travaux correspondant à la catégorie sélectionnée
    btns.forEach((btn) => {
        btn.addEventListener('click', () => {
            btns.forEach((btn) => btn.classList.remove('active'));
            btn.classList.add('active');

            const categoryName = btn.innerText;

            let filteredWorks;

            if (categoryName === 'Tous') {
                filteredWorks = works;
            } else {
                filteredWorks = works.filter(
                    (work) => work.categoryId === parseInt(btn.dataset.id)
                );
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
        popup.classList.replace('active', 'inactive');
        popupContent.classList.replace('active', 'inactive');
        popupForm.classList.replace('active', 'inactive');
        document.querySelector('body').classList.remove('noscroll');

    popup.addEventListener('click', (event) => {
        if (event.target === popup) {

        }
    });
}

function adminDisplay() {
    // si un token est présent dans le localStorage, on affiche les éléments d'admin et on masque les filtres
    const token = localStorage.getItem('token');
    const edit = document.querySelector('.edit');
    const filterContainer = document.querySelector('.filters');
    const btnEdit = document.querySelector('.btn-edit');
    if (token) {
        edit.classList.replace('inactive', 'active');
        filterContainer.classList.replace('active', 'inactive');
        btnEdit.classList.replace('inactive', 'active');
    }

    btnEdit.addEventListener('click', (event) => {
        popup.classList.add('active');
        popupContent.classList.add('active');
        document.querySelector('body').classList.add('noscroll');
    });
}

function loadPopup(works) {
    loadPopupGallery(works);
    changePage(works);
    closePopup();
    addWorks();

    const btnsClose = document.querySelectorAll('.fa-xmark');
    btnsClose.forEach((btn) => {
        btn.addEventListener('click', () => {
            closePopup();
        });
    });

    popup.addEventListener('click', (event) => {
        if (event.target === popup) {
            closePopup();
        }
    });
}

function changePage(works) {
    // au clic sur le bouton "Ajouter une photo", on change le contenu de la popup pour afficher le formulaire d'ajout de photo
    const btnAddPhoto = document.querySelector('.btn-add-photo');
    btnAddPhoto.addEventListener('click', () => {
        popupContent.classList.replace('active', 'inactive');
        popupForm.classList.replace('inactive', 'active');

        // ajout des eventListener pour les boutons
        const btnBack = document.querySelector('.fa-arrow-left');
        btnBack.addEventListener('click', () => {
            popupForm.classList.replace('active', 'inactive');
            popupContent.classList.replace('inactive', 'active');
        });
    });
}

function loadPopupGallery(works) {
    //ajout des éléments de la galerie dans la popup
    const popupGallery = document.querySelector('.popup-gallery');
    popupGallery.innerHTML = '';
    works.forEach((work) => {
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
            Authorization: `Bearer ${token}`,
        },
    });
    return response.ok;
}

async function refreshAllGalleries() {
    // récupère la liste des travaux à jour, régénère la galerie principale et la galerie de la popup
    const updatedWorks = await getWorks();
    generateWorks(updatedWorks);
    loadPopupGallery(updatedWorks);
}

function addWorks() {
    const btnAddWorks = document.getElementById('btn-photo');
    const titleInput = document.getElementById('title');
    const categorySelect = document.getElementById('category');
    const submitBtn = document.querySelector('.btn-valider');

    let fichier = null;

    btnAddWorks.addEventListener('change', (e) => {
        //recuperation du fichier
        fichier = e.target.files[0];
        if (fichier) {
            //si il y a un ficher on met a jour le formulaire pour afficher un aperçu de l'image
            const addWorksContainer = document.querySelector('.ajout-img');
            const newWorks = document.querySelector('.new-works');

            newWorks.innerHTML = `<img src="${URL.createObjectURL(fichier)}" alt="Aperçu">`;
            newWorks.classList.replace('form-inactive', 'form-active');
            addWorksContainer.classList.replace('form-active', 'form-inactive');
        }
        //verrification du formulaire pour activer ou désactiver le bouton de validation
        checkFormValidity(fichier, titleInput, categorySelect, submitBtn);
    });

    [titleInput, categorySelect].forEach((input) => {
        input.addEventListener('input', () => {
            checkFormValidity(fichier, titleInput, categorySelect, submitBtn);
        });
    });

    submitBtn.addEventListener('click', async (e) => {
        e.preventDefault(); // Prevent page reload

        if (submitBtn.classList.contains('btn-active')) {
            //recuperation des informations du formulaire
            const formData = new FormData();
            formData.append('image', fichier);
            formData.append('title', titleInput.value);
            formData.append('category', categorySelect.value);

            //requete POST pour ajouter un nouveau travail à l'API
            const response = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: formData,
            });

            if (response.ok) {
                //si la reponse est ok, on rafraichit les galeries et on réinitialise le formulaire
                fichier = null;
                refreshAllGalleries();
                resetForm(titleInput, categorySelect, submitBtn);
            }
        }
    });
}

function checkFormValidity(fichier, titleInput, categorySelect, submitBtn) {
    //si tous les champs du formulaire sont remplis, on active le bouton de validation, sinon on le désactive
    if (fichier && titleInput.value() !== '' && categorySelect.value > 0) {
        submitBtn.classList.replace('btn-inactive', 'btn-active');
    } else {
        submitBtn.classList.replace('btn-active', 'btn-inactive');
    }
}

//fonction pour reinitialiser le formulaire
function resetForm(title, category, submitBtn) {
    title.value = '';
    category.value = 0;

    const addWorksContainer = document.querySelector('.ajout-img');
    const newWorks = document.querySelector('.new-works');

    newWorks.innerHTML = '';
    newWorks.classList.replace('form-active', 'form-inactive');
    addWorksContainer.classList.replace('form-inactive', 'form-active');
    submitBtn.classList.replace('btn-active', 'btn-inactive');
}

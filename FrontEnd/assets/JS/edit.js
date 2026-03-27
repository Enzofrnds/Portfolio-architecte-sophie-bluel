let popupActive = false;

const popup = document.querySelector('.popup');
const popupContent = document.querySelector('.popup-content');
const page = document.querySelector('.page-content');
const pageSections = document.querySelectorAll('header, main, footer, .edit');

function closePopup() {
    popup.style.visibility = 'hidden';
    pageSections.forEach((section) => {
        section.style.pointerEvents = 'auto';
    });
    popupActive = false;
}

export function adminDisplay() {
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
        event.stopPropagation();
        popup.style.visibility = 'visible';
        popupActive = true;
        pageSections.forEach((section) => {
            section.style.pointerEvents = 'none';
        });
    });
}

export function loadPopup(works) {

    loadPopupGallery(works);

    page.addEventListener('click', () => {
        if (!popupActive) {
            return;
        }
        closePopup();
    });

    popupContent.addEventListener('click', (event) => {
        if (!event.target.closest('.fa-xmark')) {
            return;
        }
        event.stopPropagation();
        closePopup();
    });

    changePage(works);

}

function changePage(works) {
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
    });

    popupContent.addEventListener('click', (event) => {
        if (event.target.closest('.fa-arrow-left')) {
            popupContent.innerHTML = '';
            loadPopupGallery(works);
            changePage(works);
        }
    });
}

function loadPopupGallery(works) {
    popupContent.innerHTML = `
    <i class="fa-solid fa-xmark"></i>
    <h2>Galerie photo</h2>
    <div class="popup-gallery">
    </div>
    <span class="popup-border"></span>
    <button class="btn-add-photo">Ajouter une photo</button>
    `;

    const popupGallery = document.querySelector('.popup-gallery');
    popupGallery.innerHTML = '';
    works.forEach(work => {
        const workElement = document.createElement('figure');
        workElement.innerHTML = `
            <i class="fa-solid fa-trash-can"></i>
            <img src="${work.imageUrl}" alt="${work.title}">
        `;
        popupGallery.appendChild(workElement);
    });
}

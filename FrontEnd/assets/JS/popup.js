let popupActive = false;

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
        const popup = document.querySelector('.popup');
        popup.style.visibility = 'visible';
        popupActive = true;
        const pageSections = document.querySelectorAll('header, main, footer, .edit');
        pageSections.forEach((section) => {
            section.style.pointerEvents = 'none';
        });
    });
}

export function loadPopup(works) {
    const popup = document.querySelector('.popup');
    const popupContent = document.querySelector('.popup-content');

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

    const pageSections = document.querySelectorAll('header, main, footer, .edit');
    const page = document.querySelector('.page-content');
    page.addEventListener('click', () => {
        if (!popupActive) {
            return;
        }

        popup.style.visibility = 'hidden';
        pageSections.forEach((section) => {
            section.style.pointerEvents = 'auto';
        });
        popupActive = false;
    });

    const btnClose = document.querySelector('.fa-xmark');
    btnClose.addEventListener('click', (event) => {
        event.stopPropagation();
        popup.style.visibility = 'hidden';

        pageSections.forEach((section) => {
            section.style.pointerEvents = 'auto';
        });
        popupActive = false;
    });
}


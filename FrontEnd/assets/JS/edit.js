const popup = document.querySelector('.popup');
const popupContent = document.querySelector('.popup-content');

function closePopup() {
    popup.style.visibility = 'hidden';
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
        popup.style.visibility = 'visible';
    });
}

export function loadPopup(works) {

    loadPopupGallery(works);
    changePage(works);

    popup.addEventListener('click', (event) => {
        if (event.target === popup) {
            closePopup();
        }
    })

    popupContent.addEventListener('click', (event) => {
        if (event.target.classList.contains('fa-xmark')) {
            closePopup();
        }

        if (event.target.classList.contains('fa-arrow-left')) {
            loadPopupGallery(works);
            changePage(works);
        }
    });

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
    const reponse = await fetch('http://localhost:5678/api/works');
    const updatedWorks = await reponse.json();

    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = '';
    updatedWorks.forEach(work => {
        const workElement = document.createElement('figure');
        workElement.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <figcaption>${work.title}</figcaption>
        `;
        gallery.appendChild(workElement);
    });

    loadPopupGallery(updatedWorks);
}

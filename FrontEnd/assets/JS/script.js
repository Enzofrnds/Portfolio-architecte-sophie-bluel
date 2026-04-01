async function getWorks() {
    const reponse = await fetch('http://localhost:5678/api/works');
    return await reponse.json();
}

async function getCategories() {
    const reponse = await fetch('http://localhost:5678/api/categories');
    return await reponse.json();
}


function generateWorks(works) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = ''; 
    
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
    const filterContainer = document.querySelector('.filters');

    const btnTous = document.createElement('button');
    btnTous.classList.add('btn-filter', 'active');
    btnTous.innerText = 'Tous';
    filterContainer.appendChild(btnTous);

    categories.forEach(category => {
        const btn = document.createElement('button');
        btn.classList.add('btn-filter');
        btn.innerText = category.name;
        btn.dataset.id = category.id;
        filterContainer.appendChild(btn);
    });

    const btns = document.querySelectorAll('.btn-filter');

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
        loginLink.innerText = 'logout';
        loginLink.href = '#';
        loginLink.addEventListener('click', (event) => {
            event.preventDefault();
            localStorage.removeItem('token');
            window.location.reload();
        });
    }
}

init();


//EDIT MODE//


const popup = document.querySelector('.popup');
const popupContent = document.querySelector('.popup-content');

function closePopup() {
    popup.style.visibility = 'hidden';
}

function adminDisplay() {
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
    const updatedWorks = await getWorks();
    generateWorks(updatedWorks)
    loadPopupGallery(updatedWorks);
}
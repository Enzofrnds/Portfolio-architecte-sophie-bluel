import { adminDisplay, loadPopup } from './popup.js';

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

async function getWorks() {
    const reponse = await fetch('http://localhost:5678/api/works');
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
    generateWorks(works);
    setupFilters(works);
}


function setupFilters(works) {
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
                filteredWorks = works.filter(work => work.category.name === categoryName);
            }

            generateWorks(filteredWorks);
            
        });
    });
}

init();
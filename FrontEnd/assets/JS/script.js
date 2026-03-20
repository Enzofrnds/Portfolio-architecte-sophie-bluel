async function generateWorks() {
    const reponse = await fetch('http://localhost:5678/api/works');
    const works = await reponse.json();

    for (let i = 0; i < works.length; i++) {
        const work = works[i];
        const workElement = document.createElement('figure');
        workElement.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <figcaption>${work.title}</figcaption>
        `;
        document.querySelector('.gallery').appendChild(workElement);
    }
}

generateWorks();

async function fliterByCategory() {
    const reponse = await fetch(`http://localhost:5678/api/works`);
    const work = await reponse.json();
    const btns = document.querySelectorAll('.btn-filter');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(btn => btn.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.innerText;

            if (category === 'Tous'){
                document.querySelector('.gallery').innerHTML = '';
                generateWorks();
            }
            else{
                const filteredWorks = work.filter(work => work.category.name === category);
                document.querySelector('.gallery').innerHTML = '';
                filteredWorks.forEach(work => {
                    const workElement = document.createElement('figure');
                    workElement.innerHTML = `
                        <img src="${work.imageUrl}" alt="${work.title}">
                        <figcaption>${work.title}</figcaption>
                    `;
                    document.querySelector('.gallery').appendChild(workElement);
                });
            }
        })
    })
}

fliterByCategory();
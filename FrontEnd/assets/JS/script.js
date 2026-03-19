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



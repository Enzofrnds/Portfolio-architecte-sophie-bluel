const email = document.getElementById("email");
const password = document.getElementById("password");
const btn = document.getElementById("btn-login");
const errorMessage = document.getElementById("error-message");

btn.addEventListener("click", async (event) => {
    event.preventDefault();
    errorMessage.textContent = ""; // Réinitialise le message d'erreur
    const response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email.value,
            password: password.value,
        })
    });
    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        window.location.href = 'index.html';
    } else {
        errorMessage.textContent = "Erreur dans l’identifiant ou le mot de passe !";
    }
});
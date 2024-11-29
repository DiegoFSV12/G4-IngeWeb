// Verificar si hay una sesión iniciada
fetch("http://localhost:3000/check-session", { credentials: "include" })
    .then(response => response.json())
    .then(data => {
        if (!data.loggedIn) {
            // Si no hay sesión, redirige al usuario al index
            window.location.href = "index.html";
        } else {
            // Si hay sesión, habilita la funcionalidad de cierre de sesión
            
        }
    })
    .catch(error => console.error("Error al verificar la sesión:", error));

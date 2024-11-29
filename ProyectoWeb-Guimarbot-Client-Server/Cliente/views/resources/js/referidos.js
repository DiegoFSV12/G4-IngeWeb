document.addEventListener("DOMContentLoaded", async () => {
    // Verificar si hay una sesión iniciada
    fetch("http://localhost:3000/check-session", { credentials: "include" })
    .then(response => response.json())
    .then(async data => {
        if (!data.loggedIn) {
            // Si no hay sesión, redirige al usuario al index
            window.location.href = "index.html";
        } else {
            // Si hay sesión, habilita la funcionalidad de cierre de sesión
            try {
                const response = await fetch('http://localhost:3000/perfil', {
                    credentials: 'include'
                });
                const data = await response.json();
        
                if (data.success) {
                    document.getElementById('user-full-name').innerText = `${data.firstName} ${data.lastName}`;
                    document.getElementById('user-username').innerText = `@${data.username}`;
                    //document.getElementById('user-points').innerText = `${data.points} puntos`;
                    //document.getElementById('user-plan').innerText = `Plan: ${data.plan}`;
                } else {
                    console.error("Error: Usuario no autenticado.");
                }
            } catch (error) {
                console.error("Error al obtener los datos del perfil:", error);
            }
        }
    })
    .catch(error => console.error("Error al verificar la sesión:", error));
    
});


// Manejar el cierre de sesión
document.getElementById("logout-btn").addEventListener("click", (event) => {
    event.preventDefault(); // Evita la navegación del enlace
    fetch("http://localhost:3000/logout", { 
        method: "POST", 
        credentials: "include" 
    })
    .then(response => {
        if (response.ok) {
            window.location.href = "index.html"; // Redirige a index.html después de cerrar la sesión
        } else {
            console.error("Error al cerrar la sesión");
        }
    })
    .catch(error => console.error("Error en el cierre de sesión:", error));
});

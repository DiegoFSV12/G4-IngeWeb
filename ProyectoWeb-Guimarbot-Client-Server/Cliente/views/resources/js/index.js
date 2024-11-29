document.addEventListener("DOMContentLoaded", () => {
    cargarCursos();
    const navBtnContainer = document.getElementById("nav-btn-container");

    // Verificar el estado de la sesión
    fetch("http://localhost:3000/check-session", {
        method: "GET",
        credentials: "include" // Asegura el envío de cookies
    })
    .then(response => response.json())
    .then(data => {
        if (data.loggedIn) {
            // Si está logueado, mostrar nombre y botón de cierre de sesión
            navBtnContainer.innerHTML = `
                <a href="perfilusuario.html">${data.name}</a>
                <a href="logout" id="logout-btn">Cerrar sesión</a>
            `;

            // Manejar el cierre de sesión
            document.getElementById("logout-btn").addEventListener("click", (event) => {
                event.preventDefault();
                fetch("http://localhost:3000/logout", { method: "POST", credentials: "include" })
                .then(response => {
                    if (response.ok) {
                        window.location.href = "index.html"; // Redirige a index.html después de cerrar la sesión
                    } else {
                        console.error("Error al cerrar la sesión");
                    }
                });
            });
        } else {
            // Si no está logueado, mostrar botones de inicio de sesión y registro
            navBtnContainer.innerHTML = `
                <a href="login.html">Iniciar sesión</a>
                <a href="register.html">Registrarse</a>
            `;
        }
    })
    .catch(error => console.error("Error al verificar la sesión:", error));
});

// Función para cargar y mostrar los cursos desde la API
async function cargarCursos() {
    const cursosContainer = document.querySelector('.cursos-container .row');

    try {
        // Llamar a la API para obtener los cursos
        const response = await fetch('http://localhost:3000/cursosMenu');
        const cursos = await response.json();

        // Limpiar el contenedor antes de agregar los cursos
        cursosContainer.innerHTML = '';

        // Insertar cada curso en el HTML
        cursos.forEach(curso => {
            const cursoHTML = `
                <div class="col-12 col-md-6 col-lg-3">
                    <div class="curso">
                        <img src="${curso.curso_img}" alt="Curso: ${curso.curso_name}">
                        <div class="overlay">
                            <p>Curso: ${curso.curso_name}</p>
                            <div class="icon-container">
                                <a href="curso.html?id=${curso.curso_id}">
                                    <i class="bi bi-collection-play-fill"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            // Agregar el HTML generado al contenedor de cursos
            cursosContainer.innerHTML += cursoHTML;
        });
    } catch (error) {
        console.error('Error al cargar los cursos:', error);
    }
}

document.getElementById("search-btn").addEventListener("click", () => {
    buscar();
});

// Función para búsqueda
function buscar() {
    const search = document.getElementById('search-bar').value.trim();
    if (search) {
        window.location.href = `curso-buscar.html?query=${search}`;
    } else {
        alert("Por favor, ingresa un término de búsqueda.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Obtener la consulta de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("query");
    cargarCursos(query);


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
                <a href="perfilusuario.html" style="color:#000;text-decoration: none;">${data.name}</a>
                <a href="logout" id="logout-btn" style="color:#000;text-decoration: none;">Cerrar sesión</a>
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
                <a href="login.html" style="color:#000;text-decoration: none;">Iniciar sesión</a>
                <a href="register.html" style="color:#000;text-decoration: none;">Registrarse</a>
            `;
        }
    })
    .catch(error => console.error("Error al verificar la sesión:", error));
});

async function cargarCursos(consulta) {
    try {
        const response = await fetch(`http://localhost:3000/buscarCursos/${consulta}`);
        const data = await response.json();

        // Seleccionar el contenedor donde mostrar la información
        const cursoContainer = document.querySelector('.courses');
        cursoContainer.innerHTML = '';

        data.forEach(curso => {
            cursoContainer.innerHTML += `
                <div class="course-card">
                <img src=${curso.curso_img} alt="Curso Definitivo de HTML y CSS">
                <div class="course-info">
                    <h2>${curso.curso_name}</h2>
                    <p>${curso.curso_descripction}</p>
                    <p><strong>Edad:</strong> Adolescentes (13-17 años)</p>
                    <p><strong>Profesor:</strong>Undefined</p>
                    <a href="curso.html?id=${curso.curso_id}" class="add-route">
                        Ver Curso
                    </a>
                </div>
            </div>
            `;
        });
        actualizarConteoDeCursos();
    } catch (error) {
        console.error('Error al cargar la información del curso:', error);
    }
}

function actualizarConteoDeCursos() {
    const cursos = document.querySelectorAll('.course-card');
    const cantidad = cursos.length;
    const titulo = document.querySelector('h1');
    if (titulo) {
        titulo.textContent = `Total de cursos: ${cantidad}`;
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

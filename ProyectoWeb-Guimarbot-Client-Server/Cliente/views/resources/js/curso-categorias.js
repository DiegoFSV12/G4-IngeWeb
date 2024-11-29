document.addEventListener("DOMContentLoaded", () => {
    cargarRutasConCursos();
});

async function cargarRutasConCursos() {
    const rutasContainer = document.querySelector('.courses');

    try {
        // Llamar a la API para obtener todas las rutas con sus cursos
        const response = await fetch('http://localhost:3000/rutas-con-cursos');
        const rutas = await response.json();

        // Limpiar el contenedor antes de agregar las rutas
        rutasContainer.innerHTML = '';

        // Insertar cada ruta y sus cursos en el HTML
        rutas.forEach(ruta => {
            const rutaHTML = `
                <div class="course-name">
                    <img src="resources/img/course-icon-1.webp" class="course-icon" alt="Icono del curso">
                    <h2>${ruta.ruta_name}</h2>
                </div>
                <a href="ruta.html?id=${ruta.ruta_id}" class="add-route">Ver ruta</a>
            </div>
            <p>${ruta.ruta_description}</p>
                    <div class="course-list">
                        ${ruta.cursos.map(curso => `
                            <div class="course">
                    <span class="course-title">${curso.curso_name}</span>
                    <p class="course-description">${curso.curso_descripction}</p>
                    <img src="${curso.curso_img}" alt="Imagen del curso" class="course-icon">
                                <p>Precio: ${curso.curso_price}$</p>
                    <div class="course-actions">
                        <button class="course-pref">
                            ${curso.curso_descripction}
                        </button>
                    </div>
                </div>
                        `).join('')}
                    </div>
                </div>
            `;
            rutasContainer.innerHTML += rutaHTML;
        });
    } catch (error) {
        console.error('Error al cargar las rutas con cursos:', error);
    }
}

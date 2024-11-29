document.addEventListener("DOMContentLoaded", async () => {
    checkSession();
    addRuta();
    addCurso();
    addResource();
    try {
        const response = await fetch('http://localhost:3000/perfil', {
            method: 'GET',
            credentials: 'include' // Esto permite enviar cookies en la solicitud
        });

        if (!response.ok) {
            throw new Error("No ha iniciado sesión");
        }

        const data = await response.json();

        if (data.success) {
            // Rellenar los campos en el HTML con los datos obtenidos
            document.querySelector('.nombre').textContent = `${data.username}`;
            document.querySelector('.email').textContent = data.email;
        } else {
            console.error(data.message);
        }
    } catch (error) {
        console.error("Error al recuperar los datos del perfil:", error);
    }
});

// Función para verificar si hay una sesión activa
async function checkSession() {
    try {
        const response = await fetch('http://localhost:3000/check-session', {
            method: 'GET',
            credentials: 'include' // Incluye cookies para autenticación
        });

        const data = await response.json();
        
        // Redirige al usuario al index.html si no está logueado
        if (!data.loggedIn) {
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Error al verificar la sesión:', error);
        alert('Ocurrió un error al verificar la sesión.');
    }
}

 // Cerrar sesión
document.getElementById('logout-link').addEventListener('click', async (event) => {
    event.preventDefault(); // Evita la redirección

    try {
        const logoutResponse = await fetch('http://localhost:3000/logout', {
            method: 'POST',
            credentials: 'include' // Enviar cookies para la sesión
        });

        if (logoutResponse.ok) {
            alert('Sesión cerrada exitosamente.');
            // Opcional: Redirigir al usuario a la página de inicio de sesión o actualizar la interfaz
            window.location.href = "index.html";
        } else {
            console.error('Error al cerrar la sesión');
        }
    } catch (error) {
        console.error('Error en la solicitud de cierre de sesión:', error);
    }
});


// Abrir modal de agregar recurso
document.getElementById('newResourceBtn').addEventListener('click', () => {
    loadCourseComboBox();
    document.getElementById('addResourceModal').style.display = 'flex';
});

function addResource() {
    const resourceBtn = document.getElementById("addResourceSubmit");
    const resourceForm = document.getElementById("resourceForm");

    // Manejar el envío del formulario
    resourceBtn.addEventListener("click", (event) => {
        event.preventDefault(); // Evita el envío del formulario por defecto

        const courseId = document.getElementById("resourceCourse").value;
        const chapterName = document.getElementById("resourceChapterName").value;
        const chapterOrder = document.getElementById("resourceChapterOrder").value;
        const resourceDescription = document.getElementById("resourceDescription").value;
        const resourceURL = document.getElementById("resourceFile").value;
        
        fetch("http://localhost:3000/AddResource", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                courseId: courseId,
                chapterName: chapterName,
                chapterOrder: chapterOrder,
                resourceDescription: resourceDescription,
                resourceURL: resourceURL
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Recurso guardado con éxito");
                // Limpiar campos del formulario
                document.getElementById("resourceCourse").value = "";
                document.getElementById("resourceChapterName").value = "";
                document.getElementById("resourceChapterOrder").value = "";
                document.getElementById("resourceDescription").value = "";
                document.getElementById("resourceFile").value = "";
                cargarDatos();
            } else {
                console.error("Error al guardar recurso");
            }
        })
        .catch(error => console.error("Error en la solicitud:", error));
    });
}




// Abrir modal de agregar ruta
document.getElementById('newRouteBtn').addEventListener('click', () => {
    document.getElementById('routeModalTitle').textContent = 'Agregar Ruta';
    document.getElementById('routeModal').style.display = 'flex';
});

function addRuta() {
    const routeModal = document.getElementById("routeModal");
    const routeForm = document.getElementById("routeForm");
    // Manejar el envío del formulario
    routeForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const routeName = document.getElementById("routeName").value;

        fetch("http://localhost:3000/routes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ routeName: routeName}) // Ajusta según tus atributos
        })
        .then(response => {
            if (response.ok) {
                routeModal.style.display = "none";
                alert("Ruta guardada con éxito");
                document.getElementById("routeName").value = "";
                cargarDatos();
            } else {
                console.error("Error al guardar la ruta");
            }
        })
        .catch(error => console.error("Error en la solicitud:", error));
    });
};






    const selectedRoutes = []; // Array para almacenar los ID de las rutas seleccionadas
    // Funcionalidad para agregar rutas a la lista
    document.querySelectorAll('.add-content-btn').forEach(button => {
        button.addEventListener('click', () => {
            const select = document.querySelector(".courseSelect"); // El combobox justo antes del botón "+"
            const selectedRouteId = select.value; // Obtener el ID de la ruta seleccionada
            const selectedRouteName = select.options[select.selectedIndex].text; // Obtener el nombre de la ruta seleccionada

            // Verificar si la ruta ya está en la lista
            const routeList = document.getElementById('courseList');
            if (!selectedRoutes.includes(selectedRouteId)) {
                const newItem = document.createElement('li'); // Crear un nuevo elemento de lista
                newItem.textContent = selectedRouteName;
                newItem.dataset.id = selectedRouteId; // Guardar el ID de la ruta en un atributo de datos
                routeList.appendChild(newItem);
                selectedRoutes.push(selectedRouteId); // Agregar el ID de la ruta al array
            } else {
                alert('Esta ruta ya está en la lista.');
            }
        });
    });

    // Función para eliminar una ruta de la lista
    document.querySelectorAll('.remove-content-btn').forEach(button => {
        button.addEventListener('click', () => {
            const select = document.querySelector(".courseSelect"); // El combobox justo antes del botón "-"
            const selectedRouteId = select.value; // Obtener el ID de la ruta seleccionada

            const routeList = document.getElementById('courseList');
            const routeItems = Array.from(routeList.children);
            const routeToRemove = routeItems.find(item => item.dataset.id === selectedRouteId);

            if (routeToRemove) {
                routeList.removeChild(routeToRemove); // Eliminar la ruta de la lista
                const index = selectedRoutes.indexOf(selectedRouteId);
                if (index > -1) {
                    selectedRoutes.splice(index, 1); // Eliminar el ID de la ruta del array
                }
            } else {
                alert('La ruta no está en la lista.');
            }
        });
    });


// Función para inicializar los eventos de los botones en los items existentes
function attachContentButtonEvents(contentItem) {
    contentItem.querySelector('.add-content-btn').addEventListener('click', () => {
        const select = contentItem.querySelector('.courseSelect');
        const selectedCourse = select.options[select.selectedIndex].text;

        const courseList = contentItem.querySelector('#courseList');
        if (!Array.from(courseList.children).some(item => item.textContent === selectedCourse)) {
            const newItem = document.createElement('li');
            newItem.textContent = selectedCourse;
            courseList.appendChild(newItem);
        } else {
            alert('Este curso ya está en la lista.');
        }
    });

    contentItem.querySelector('.remove-content-btn').addEventListener('click', () => {
        const select = contentItem.querySelector('.courseSelect');
        const selectedCourse = select.options[select.selectedIndex].text;

        const courseList = contentItem.querySelector('#courseList');
        const courseItems = Array.from(courseList.children);
        const courseToRemove = courseItems.find(item => item.textContent === selectedCourse);

        if (courseToRemove) {
            courseList.removeChild(courseToRemove);
        } else {
            alert('El curso no está en la lista.');
        }
    });
}


// Cerrar el modal cuando se haga clic en el botón de cerrar
document.querySelectorAll('.close-modal').forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        modal.style.display = 'none';
    });
});



// Cerrar el modal cuando se hace clic en la X
document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
        document.getElementById('editRouteModal').style.display = 'none';
    });
});


// Variables de modales
const addCourseModal = document.getElementById("addCourseModal");
const viewCourseModal = document.getElementById("viewCourseModal");
const editCourseModal = document.getElementById("editCourseModal");
const closeModalButtons = document.querySelectorAll(".close-modal");

// Abrir modal de agregar curso
document.getElementById("newCourceBtn").addEventListener("click", () => {
    loadComboBox();
    addCourseModal.style.display = "block";
});

// Cerrar modales
closeModalButtons.forEach(button => {
    button.addEventListener("click", () => {
        addCourseModal.style.display = "none";
        viewCourseModal.style.display = "none";
        editCourseModal.style.display = "none";
    });
});

// Agregar curso
function addCurso() {
    const cursobtn = document.getElementById("addCourseSubmit");
    const cursoForm = document.getElementById("cursoForm");

    // Manejar el envío del formulario
    cursobtn.addEventListener("click", (event) => {
        event.preventDefault(); // Evita el envío del formulario por defecto
        const courseName = document.getElementById("courseName").value;
        const courseDescription = document.getElementById("courseDescription").value;

        fetch("http://localhost:3000/AddCurso", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cursoName: courseName, cursoDescription: courseDescription })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Asegúrate de definir cursoModal si estás usando esta variable
                alert("Curso guardado con éxito");
                if (selectedRoutes.length > 0) {
                    addCourseRoutes(data.courseId, selectedRoutes);
                }
                window.location.href = 'resource.html';
                
            } else {
                console.error("Error al guardar curso");
            }
        })
        .catch(error => console.error("Error en la solicitud:", error));
    });
}


function loadComboBox(){
    const courseSelect = document.querySelector(".courseSelect");

    // Obtener las rutas desde el servidor
    fetch("http://localhost:3000/LoadRoutes", {
        method: "GET"
    })
    .then(response => response.json())
    .then(data => {
        // Limpiar el select antes de agregar las opciones
        courseSelect.innerHTML = "";
        
        // Agregar las opciones al select
        data.routes.forEach(route => {
            const option = document.createElement("option");
            option.value = route.ruta_id; // Almacenar el ID de la ruta
            option.textContent = route.ruta_name; // Mostrar el nombre de la ruta
            courseSelect.appendChild(option);
        });
    })
    .catch(error => console.error("Error al obtener las rutas:", error));
}
function loadCourseComboBox() {
    const courseSelect = document.getElementById("resourceCourse");

    // Obtener los cursos desde el servidor
    fetch("http://localhost:3000/LoadCourses", {
        method: "GET"
    })
    .then(response => response.json())
    .then(data => {
        // Limpiar el select antes de agregar las opciones
        courseSelect.innerHTML = "";

        // Agregar las opciones al select
        data.courses.forEach(course => {
            const option = document.createElement("option");
            option.value = course.curso_id; // Almacenar el ID del curso
            option.textContent = course.curso_name; // Mostrar el nombre del curso
            courseSelect.appendChild(option);
        });
    })
    .catch(error => console.error("Error al obtener los cursos:", error));
}


// Función para agregar las rutas al curso 
function addCourseRoutes(courseId, routes) { 
    routes.forEach(routeId => { 
        fetch("http://localhost:3000/AddCourseRoute", { 
            method: "POST", 
            headers: { "Content-Type": "application/json" }, 
            body: JSON.stringify({ courseId: courseId, routeId: routeId }) }) 
            .then(response => { 
                if (!response.ok) { 
                    console.error("Error al asociar ruta con curso"); 
                } 
            }) 
            .catch(error => console.error("Error en la solicitud de asociación de ruta:", error)); 
        }); 
    }



// Actualizar curso
document.getElementById("editCourseSubmit").addEventListener("click", () => {
    const courseName = document.getElementById("editCourseName").value;
    const courseDescription = document.getElementById("editCourseDescription").value;
    // Aquí agregar la lógica para actualizar el curso en la base de datos
    alert(`Curso "${courseName}" actualizado exitosamente.`);
    editCourseModal.style.display = "none";
});




var modal = document.getElementById("editRouteModal");
var closeButton = document.getElementsByClassName("close-btn")[0];

// Abrir el modal
function openEditRouteModal() {
    modal.style.display = "block";
}

// Cerrar el modal
closeButton.onclick = function () {
    modal.style.display = "none";
}



document.addEventListener("DOMContentLoaded", function () {
    // Inicializar Sortable para la lista de cursos
    var section1CoursesList = document.getElementById('section1CoursesList');

    Sortable.create(section1CoursesList, {
        animation: 150,
        onEnd: function (evt) {
            // Callback cuando termina de arrastrar y soltar
            console.log("Nuevo orden:", Array.from(section1CoursesList.children).map(function (course) {
                return course.getAttribute('data-value');
            }));
        }
    });
});


async function cargarDatos() {
    try {
        const responseRutas = await fetch('http://localhost:3000/rutas', {
            method: 'GET',
            credentials: 'include'
        });

        const responseCursos = await fetch('http://localhost:3000/cursos', {
            method: 'GET',
            credentials: 'include'
        });

        const responseRecursos = await fetch('http://localhost:3000/recursos', {
            method: 'GET',
            credentials: 'include'
        });

        if (!responseRutas.ok || !responseCursos.ok || !responseRecursos.ok) {
            throw new Error("Error al recuperar los datos de rutas, cursos o recursos");
        }

        const dataRutas = await responseRutas.json();
        const dataCursos = await responseCursos.json();
        const dataRecursos = await responseRecursos.json();

        if (dataRutas.success && dataCursos.success && dataRecursos.success) {
            const rutas = dataRutas.rutas;
            const cursos = dataCursos.cursos;
            const recursos = dataRecursos.recursos;
            const tableBody = document.querySelector('table tbody');

            // Limpiar la tabla antes de agregar nuevos datos
            tableBody.innerHTML = "";

            // Agregar cada recurso a la tabla
            recursos.forEach(recurso => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${recurso.recurso_id}</td>
                    <td>${recurso.recurso_name}</td>
                    <td>Recurso</td>
                    <td>${recurso.recurso_description}</td>
                    <td class="actions-table">
                        <button class="view-btn" data-id="${recurso.recurso_id}">Ver</button>
                        <button class="edit-btn" data-id="${recurso.recurso_id}">Editar</button>
                        <button class="delete-btn" data-id="${recurso.recurso_id}">Eliminar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            // Agregar cada curso a la tabla
            cursos.forEach(curso => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${curso.curso_id}</td>
                    <td>${curso.curso_name}</td>
                    <td>Curso</td>
                    <td>${curso.curso_descripction}</td>
                    <td class="actions-table">
                        <button class="view-course-btn" data-id="${curso.curso_id}">Ver</button>
                        <button class="edit-course-btn" data-id="${curso.curso_id}">Editar</button>
                        <button class="delete-btn" data-id="${curso.curso_id}">Eliminar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            // Agregar cada ruta a la tabla
            rutas.forEach(ruta => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${ruta.ruta_id}</td>
                    <td>${ruta.ruta_name}</td>
                    <td>Ruta</td>
                    <td>${ruta.ruta_description}</td>
                    <td class="actions-table">
                        <button class="view-route-btn" data-id="${ruta.ruta_id}">Ver</button>
                        <button class="edit-route-btn" data-id="${ruta.ruta_id}">Editar</button>
                        <button class="delete-btn" data-id="${ruta.ruta_id}">Eliminar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            // Asignar eventos a los botones generados
            openViewResourceModal();
            openEditResourceModal();
            openDeleteResourceModal();
            deleteResource();
            openEditRouteModal();
            openViewRouteModal();
            viewCourse();
            editCourse();
        } else {
            console.error("No se pudieron obtener los datos de rutas, cursos o recursos");
        }
    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}
// Llamar a la función al cargar el contenido del documento
document.addEventListener('DOMContentLoaded', cargarDatos);

// Función para abrir el modal de ver recurso
function openViewResourceModal() {
    document.querySelectorAll('.view-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.getElementById('viewResourceModal').style.display = 'flex';
        });
    });
}

// Función para abrir el modal de editar recurso
function openEditResourceModal() {
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.getElementById('updateResourceModal').style.display = 'flex';
        });
    });
}

// Función para abrir el modal de eliminar recurso
function openDeleteResourceModal() {
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.getElementById('deleteResourceModal').style.display = 'flex';
        });
    });
}

// Función para manejar el botón de eliminar recurso
function deleteResource() {
    document.getElementById('deleteResource').addEventListener('click', () => {
        alert("Recurso eliminado.");
        document.getElementById('deleteResourceModal').style.display = 'none';
    });
}

// Función para abrir el modal de editar ruta
function openEditRouteModal() {
    document.querySelectorAll('.edit-route-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.getElementById('editRouteModal').style.display = 'flex';
            // Aquí puedes cargar los datos de la ruta a editar
        });
    });
}

// Función para abrir el modal de ver ruta
function openViewRouteModal() {
    document.querySelectorAll('.view-route-btn').forEach(button => {
        button.addEventListener('click', () => {
            const viewRouteModal = document.getElementById('viewRouteModal');
            viewRouteModal.style.display = 'block';
            // Aquí puedes obtener dinámicamente los detalles de la ruta si los estás cargando desde un servidor o base de datos
        });
    });
}

// Función para ver curso con datos estáticos (simulación)
function viewCourse() {
    document.querySelectorAll(".view-course-btn").forEach(button => {
        button.addEventListener("click", () => {
            document.getElementById("viewCourseId").textContent = "1";
            document.getElementById("viewCourseName").textContent = "Curso de Java";
            document.getElementById("viewCourseDescription").textContent = "Introducción a la programación en Java.";
            viewCourseModal.style.display = "block";
        });
    });
}

// Función para editar curso con datos estáticos (simulación)
function editCourse() {
    document.querySelectorAll(".edit-course-btn").forEach(button => {
        button.addEventListener("click", () => {
            document.getElementById("editCourseName").value = "Curso de Java";
            document.getElementById("editCourseDescription").value = "Introducción a la programación en Java.";
            editCourseModal.style.display = "block";
        });
    });
}





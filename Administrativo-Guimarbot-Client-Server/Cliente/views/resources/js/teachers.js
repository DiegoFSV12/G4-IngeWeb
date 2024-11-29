document.addEventListener("DOMContentLoaded", async () => {
    checkSession();
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



// Abrir modal de nuevo docente
const newTeacherBtn = document.getElementById('newAdminBtn');  // Conserva el id 'newAdminBtn' para el botón
const addTeacherModal = document.getElementById('addTeacherModal');
const viewTeacherModal = document.getElementById('viewTeacherModal');
const updateTeacherModal = document.getElementById('updateTeacherModal');
const deleteTeacherModal = document.getElementById('deleteTeacherModal');
const closeModalButtons = document.querySelectorAll('.close-modal');

newTeacherBtn.addEventListener('click', () => {
    addTeacherModal.style.display = 'flex';
});

// Cerrar modales
closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        addTeacherModal.style.display = 'none';
        viewTeacherModal.style.display = 'none';
        updateTeacherModal.style.display = 'none';
        deleteTeacherModal.style.display = 'none';
    });
});

// Abrir modal de ver detalles del docente
document.querySelectorAll('.view-btn').forEach(button => {
    button.addEventListener('click', () => {
        viewTeacherModal.style.display = 'flex';
    });
});

// Abrir modal de actualizar docente
document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', () => {
        updateTeacherModal.style.display = 'flex';
    });
});

// Abrir modal de eliminar docente
document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', () => {
        deleteTeacherModal.style.display = 'flex';
    });
});


// Inicializar los eventos de los botones "+" y "-" al cargar la página
document.querySelectorAll('.content-item').forEach(item => {
    attachContentButtonEvents(item);
});

// Función para inicializar los eventos de los botones en los items existentes
function attachContentButtonEvents(contentItem) {
    contentItem.querySelector('.add-content-btn').addEventListener('click', () => {
        const select = contentItem.querySelector('.materiaSelect');
        const selectedCourse = select.options[select.selectedIndex].text;

        const courseList = contentItem.querySelector('.materiaList');
        if (!Array.from(courseList.children).some(item => item.textContent === selectedCourse)) {
            const newItem = document.createElement('li');
            newItem.textContent = selectedCourse;
            courseList.appendChild(newItem);
        } else {
            alert('Esta materia ya está en la lista.');
        }
    });

    contentItem.querySelector('.remove-content-btn').addEventListener('click', () => {
        const select = contentItem.querySelector('.materiaSelect');
        const selectedCourse = select.options[select.selectedIndex].text;

        const courseList = contentItem.querySelector('.materiaList');
        const courseItems = Array.from(courseList.children);
        const courseToRemove = courseItems.find(item => item.textContent === selectedCourse);

        if (courseToRemove) {
            courseList.removeChild(courseToRemove);
        } else {
            alert('La materia no está en la lista.');
        }
    });
}
// Mostrar alerta solo al agregar un nuevo docente
document.getElementById('addTeacherSubmit').addEventListener('click', () => {
    alert('¡Nuevo docente agregado con éxito! - Se envio el usario y contraseña a su correo');
    // Aquí puedes agregar más lógica si es necesario, como enviar los datos a un servidor
});
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
















//--------------------------FUNCIONES------------------------------
let currentSender, currentSubject; // Variables para almacenar el correo actual

        // Función para abrir el modal y mostrar los detalles del correo
        function openModal(sender, subject, message) {
            currentSender = sender;
            currentSubject = subject;

            document.getElementById('modalTitle').innerText = sender + " - " + subject;
            document.getElementById('modalBody').innerText = message;
            document.getElementById('emailModal').style.display = "block";
        }

        // Función para cerrar el modal
        function closeModal() {
            document.getElementById('emailModal').style.display = "none";
            document.getElementById('responseText').value = '';
        }

        // Simular envío de respuesta
        function sendResponse() {
            const responseText = document.getElementById('responseText').value;

            if (responseText.trim() === '') {
                alert('Por favor, escribe una respuesta antes de enviar.');
                return;
            }

            alert(`Respuesta enviada a ${currentSender} sobre el asunto: "${currentSubject}"\n\nRespuesta: ${responseText}`);
            closeModal(); // Cerrar modal después de enviar
        }

        // Cerrar el modal si se hace clic fuera del contenido
        window.onclick = function(event) {
            if (event.target == document.getElementById('emailModal')) {
                closeModal();
            }
        }
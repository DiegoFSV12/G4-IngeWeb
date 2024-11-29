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


// Obtener referencia al modal de detalles y los botones para cerrar el modal
const viewPaymentModal = document.getElementById('viewPaymentModal');
const closeModalButtons = document.querySelectorAll('.close-modal');

// Abrir modal de ver detalles
document.querySelectorAll('.view-btn').forEach(button => {
    button.addEventListener('click', () => {
        viewPaymentModal.style.display = 'flex';
    });
});

// Cerrar modal
closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        viewPaymentModal.style.display = 'none';
    });
});

// Mostrar alert cuando se haga clic en Emitir Recibo
document.querySelectorAll('.receipt-btn').forEach(button => {
    button.addEventListener('click', () => {
        alert('Recibo emitido exitosamente');
    });
});

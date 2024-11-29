document.addEventListener("DOMContentLoaded", async () => {
    checkSession();
    addButton();
    // Cargar administradores
    try {
        const response = await fetch('http://localhost:3000/admins', {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error("Error al recuperar los datos de administradores");
        }

        const data = await response.json();

        if (data.success) {
            const admins = data.admins;
            const tableBody = document.getElementById('admin-table-body');

            // Agregar cada administrador a la tabla
            admins.forEach(admin => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${admin.admin_id}</td>
                    <td>${admin.admin_fname}</td>
                    <td>${admin.admin_lname}</td>
                    <td>${admin.admin_email}</td>
                    <td>${new Date(admin.admin_birth).toLocaleDateString()}</td>
                    <td>${admin.admin_dni}</td>
                    <td class="actions-table">
                        <button class="view-btn" data-id="${admin.admin_id}">Ver</button>
                        <button class="edit-btn" data-id="${admin.admin_id}">Editar</button>
                        <button class="delete-btn" data-id="${admin.admin_id}">Desactivar Cuenta</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            // Asignar eventos a los botones generados
            viewButtons();
            editButtons();
            deleteButtons();
            closeBtn();
        } else {
            console.error("No se pudieron obtener los datos de administradores");
        }
    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }

    // Cargar datos del perfil
    try {
        const response = await fetch('http://localhost:3000/perfil', {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error("No ha iniciado sesión");
        }

        const data = await response.json();

        if (data.success) {
            document.querySelector('.nombre').textContent = `${data.username}`;
            document.querySelector('.email').textContent = data.email;
        } else {
            console.error(data.message);
        }
    } catch (error) {
        console.error("Error al recuperar los datos del perfil:", error);
    }
    
    // Cerrar sesión
    document.getElementById('logout-link').addEventListener('click', async (event) => {
        event.preventDefault();

        try {
            const logoutResponse = await fetch('http://localhost:3000/logout', {
                method: 'POST',
                credentials: 'include'
            });

            if (logoutResponse.ok) {
                alert('Sesión cerrada exitosamente.');
                window.location.href = "index.html";
            } else {
                console.error('Error al cerrar la sesión');
            }
        } catch (error) {
            console.error('Error en la solicitud de cierre de sesión:', error);
        }
    });
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

function addButton() {
    const addAdminForm = document.getElementById('addAdminModal').querySelector('form');
    const newAdminBtn = document.getElementById('newAdminBtn');
    const addAdminModal = document.getElementById('addAdminModal');

    newAdminBtn.addEventListener('click', () => {
        addAdminModal.style.display = 'flex';
    });

    addAdminForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Previene el envío tradicional del formulario

        // Recolectar los datos del formulario
        const formData = {
            addFName: document.getElementById('adminName').value,
            addLName: document.getElementById('adminLastName').value,
            addEmail: document.getElementById('adminEmail').value,
            addBirth: document.getElementById('adminDOB').value,
            addDNI: document.getElementById('adminDNI').value
        };

        try {
            // Enviar los datos a la ruta '/registerAdmin'
            const response = await fetch('http://localhost:3000/registerAdmin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('¡Nuevo administrador agregado con éxito!');
                window.location.href = "admins.html";
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || 'No se pudo agregar el administrador'}`);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            alert('Ocurrió un error al agregar el administrador');
        }
    });
}

// Función para cerrar modales
function closeBtn(){
    const closeModalButtons = document.querySelectorAll('.close-modal');
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.getElementById('addAdminModal').style.display = 'none';
            document.getElementById('viewAdminModal').style.display = 'none';
            document.getElementById('updateAdminModal').style.display = 'none';
            document.getElementById('deleteAdminModal').style.display = 'none';
        });
    });
}

// Función para abrir el modal de detalles de administrador
function viewButtons() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const viewAdminModal = document.getElementById('viewAdminModal');
    const modalContent = viewAdminModal.querySelector('.modal-content');

    viewButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const adminId = button.getAttribute('data-id');
            try {
                const response = await fetch(`http://localhost:3000/admin/${adminId}`);
                const data = await response.json();
                
                modalContent.innerHTML = `
                    <h3>Detalles del Administrador</h3>
                    <p><strong>ID:</strong> ${data.admin_id}</p>
                    <p><strong>Nombre:</strong> ${data.admin_fname}</p>
                    <p><strong>Apellido:</strong> ${data.admin_lname}</p>
                    <p><strong>Username:</strong> ${data.admin_username}</p>
                    <p><strong>Correo:</strong> ${data.admin_email}</p>
                    <p><strong>Fecha de Nacimiento:</strong> ${new Date(data.admin_birth).toLocaleDateString()}</p>
                    <p><strong>DNI:</strong> ${data.admin_dni}</p>
                    <button class="close-modal">Cerrar</button>
                `;
                
                viewAdminModal.style.display = 'flex';
                closeBtn();
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        });
    });
}

// Función para abrir el modal de edición de administrador
function editButtons() {
    const editButtons = document.querySelectorAll('.edit-btn');
    const editAdminModal = document.getElementById('updateAdminModal');
    const modalContent = editAdminModal.querySelector('.modal-content');
    
    editButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const adminId = button.getAttribute('data-id');
            try {
                const response = await fetch(`http://localhost:3000/admin/${adminId}`);
                const data = await response.json();

                modalContent.innerHTML = `
                    <form id="editAdminForm">
                        <h3>Actualizar Administrador</h3>
                        <input type="text" id="editFname" name="editFname" placeholder="Nombre" value="${data.admin_fname}">
                        <input type="text" id="editLname" name="editLname" placeholder="Apellido" value="${data.admin_lname}">
                        <input type="email" id="editEmail" name="editEmail" placeholder="Correo" value="${data.admin_email}">
                        <input type="date" id="editBirth" name="editBirth" value="${new Date(data.admin_birth).toISOString().split('T')[0]}">
                        <input type="text" id="editDNI" name="editDNI" placeholder="DNI" value="${data.admin_dni}">                
                        <input type="submit" id="updateAdmin" value="Actualizar">
                        <button class="close-modal">Cancelar</button>
                    </form>
                `;
                
                editAdminModal.style.display = 'flex';
                
                document.getElementById('editAdminForm').addEventListener('submit', async (event) => {
                    event.preventDefault();
                    await updateAdmin(adminId);
                });
                closeBtn();
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        });
    });
}

// Función para actualizar administrador
async function updateAdmin(adminId) {
    const data = {
        editFname: document.getElementById('editFname').value,
        editLname: document.getElementById('editLname').value,
        editEmail: document.getElementById('editEmail').value,
        editBirth: document.getElementById('editBirth').value,
        editDNI: document.getElementById('editDNI').value
    };

    try {
        const response = await fetch(`http://localhost:3000/updateAdmin/${adminId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            window.location.href = "admins.html";
        }
    } catch (error) {
        console.error('Error al actualizar el administrador:', error);
    }
}

// Función para abrir el modal de eliminación de administrador
function deleteButtons() {
    const deleteAdminModal = document.getElementById('deleteAdminModal');
    const deleteButtons = document.querySelectorAll('.delete-btn');

    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            deleteAdminModal.style.display = 'flex';
            closeBtn();
        });
    });
}

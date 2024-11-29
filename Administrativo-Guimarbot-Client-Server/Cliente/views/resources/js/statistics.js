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


// Función para abrir el modal
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

// Función para cerrar el modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Datos para los gráficos (puedes modificar con datos reales)
let cuentasData = [50, 100, 150, 200];
let docentesData = [5, 10, 15, 20];
let suscripcionesData = [20, 30, 40, 50];
let ingresoDiarioData = [200, 300, 400, 500];
let becadasData = [2, 4, 6, 8];

// Cargar gráficos cuando se abra el modal
document.addEventListener("DOMContentLoaded", function() {
    let cuentasCtx = document.getElementById('cuentasChart').getContext('2d');
    new Chart(cuentasCtx, {
        type: 'line',
        data: {
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril'],
            datasets: [{
                label: 'Cuentas creadas',
                data: cuentasData,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        }
    });

    let docentesCtx = document.getElementById('docentesChart').getContext('2d');
    new Chart(docentesCtx, {
        type: 'bar',
        data: {
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril'],
            datasets: [{
                label: 'Docentes registrados',
                data: docentesData,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        }
    });

    let suscripcionesCtx = document.getElementById('suscripcionesChart').getContext('2d');
    new Chart(suscripcionesCtx, {
        type: 'line',
        data: {
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril'],
            datasets: [{
                label: 'Suscripciones anuales',
                data: suscripcionesData,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        }
    });

    let ingresoDiarioCtx = document.getElementById('ingresoDiarioChart').getContext('2d');
    new Chart(ingresoDiarioCtx, {
        type: 'bar',
        data: {
            labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves'],
            datasets: [{
                label: 'Ingreso diario',
                data: ingresoDiarioData,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        }
    });

    let becadasCtx = document.getElementById('becadasChart').getContext('2d');
    new Chart(becadasCtx, {
        type: 'line',
        data: {
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril'],
            datasets: [{
                label: 'Cuentas becadas',
                data: becadasData,
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1
            }]
        }
    });

});

const ctx = document.getElementById('myChart').getContext('2d');

// Datos iniciales (semanales)
let chartData = {
    labels: ['1-10-2024', '2-10-2024', '3-10-2024', '4-10-2024', '5-10-2024', '6-10-2024', '7-10-2024'],
    datasets: [{
        label: 'Ganancias',
        data: [100, 200, 300, 400, 500, 600, 700],
        borderColor: 'blue',
        fill: false,
        tension: 0.1
    }]
};

// Crear gráfico
let myChart = new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Cambiar datos según filtro
document.getElementById('filter').addEventListener('change', function() {
    const filterValue = this.value;

    if (filterValue === 'weekly') {
        updateChart(['1-10-2024', '2-10-2024', '3-10-2024', '4-10-2024', '5-10-2024', '6-10-2024', '7-10-2024'], 
                    [100, 200, 300, 400, 500, 600, 700]);
    } else if (filterValue === 'monthly') {
        updateChart(['1-10-2024', '7-10-2024', '14-10-2024', '21-10-2024', '28-10-2024'], 
                    [1000, 2000, 2000, 4000, 5000]);
    } else if (filterValue === 'semiannual') {
        updateChart(['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'], 
                    [8000, 9000, 10000, 11000, 12000, 12500]);
    } else if (filterValue === 'annual') {
        updateChart(['2023', '2024'], 
                    [50000, 80000]);
    }
});

// Actualizar el gráfico
function updateChart(labels, data) {
    myChart.data.labels = labels;
    myChart.data.datasets[0].data = data;
    myChart.update();
}

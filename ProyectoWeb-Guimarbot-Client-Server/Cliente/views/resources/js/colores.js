// Definimos los colores por rango de edad
const colorsFor5Years = {
    '--primario1': '#f0f8ff',
    '--black': '#2e2e2e',
    '--primario2': '#b0c4de',
    '--terciario1': '#7b68ee',
    '--terciario2': '#6a5acd',
    '--secundario1': '#ff4500',
    '--secundario2': '#ff6347',
    '--secundario3': '#ff7f50',
    '--white': '#fdfdfd',
    '--dark': '#2c3e50',
    '--carousel-overlay': 'rgba(34, 34, 34, 0.7)',
    '--light-gray-translucent': '#d3d3d34d',
    '--grayish-white': '#dcdcdc'
};

const colorsFor10Years = {
    '--primario1': '#fff',
    '--black': '#000',
    '--primario2': '#ccc',
    '--terciario1': '#555',
    '--terciario2': '#656060',
    '--secundario1': '#48e',
    '--secundario2': '#1b1464',
    '--secundario3': '#0012ff',
    '--white': 'rgb(243, 243, 243)',
    '--dark': '#1b1b32',
    '--carousel-overlay': 'rgba(0, 0, 0, 0.5)',
    '--light-gray-translucent': '#8080804d',
    '--grayish-white': '#aeaeae'
};

const colorsForOver10Years = {
    '--primario1': '#f5f5f5',
    '--black': '#1c1c1c',
    '--primario2': '#b8b8b8',
    '--terciario1': '#4a4a4a',
    '--terciario2': '#3c3c3c',
    '--secundario1': '#8b4513',
    '--secundario2': '#5a2e0c',
    '--secundario3': '#c19a6b',
    '--white': '#fafafa',
    '--dark': '#2b2b2b',
    '--carousel-overlay': 'rgba(0, 0, 0, 0.6)',
    '--light-gray-translucent': '#a9a9a94d',
    '--grayish-white': '#d3d3d3'
};

// Función para determinar la paleta de colores según la edad
function getColorsByAge(age) {
    if (age >= 18) {
        return colorsForOver10Years;
    } else if (age >= 10) {
        return colorsFor10Years;
    } else {
        return colorsFor5Years;
    }
}

// Función para aplicar los colores al estilo del documento
function applyColors(colors) {
    for (const [key, value] of Object.entries(colors)) {
        document.documentElement.style.setProperty(key, value);
    }
}

// Función para calcular la edad a partir de la fecha de nacimiento
function calculateAge(birthDate) {
    const currentDate = new Date();
    const birth = new Date(birthDate);
    let age = currentDate.getFullYear() - birth.getFullYear();
    const monthDiff = currentDate.getMonth() - birth.getMonth();
    const dayDiff = currentDate.getDate() - birth.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }
    return age;
}

// Función principal para obtener el perfil y aplicar los colores según la edad
async function initThemeByAge() {
    try {
        const response = await fetch('http://localhost:3000/perfil', {
            method: 'GET',
            credentials: 'include' // Permite incluir cookies en la solicitud
        });
        const data = await response.json();

        if (data.success) {
            const age = calculateAge(data.birthdate);
            const colors = getColorsByAge(age);
            applyColors(colors);
        } else {
            colors = getColorsByAge(17);
            applyColors(colors);
        }
    } catch (error) {
        console.error('Error al aplicar tema por edad:', error);
    }
}

// Inicializar el cambio de color cuando el documento esté listo
document.addEventListener('DOMContentLoaded', initThemeByAge);

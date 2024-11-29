// Ejemplo de asignación de evento a un botón o enlace para ver la ruta
document.addEventListener("DOMContentLoaded", () => {
    // Obtener el curso_id de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const ruta = urlParams.get("id");
    verRuta(ruta);
    verCursos(ruta);
    initComentarios(ruta);
});

// Función para ver los detalles de una ruta específica
async function verRuta(ruta_id) {
    try {
        const response = await fetch(`http://localhost:3000/ver-ruta-esp/${ruta_id}`);
        const data = await response.json();

        // Seleccionar el contenedor donde mostrar la información
        const rutaContainer = document.querySelector('.curso-portada');
        rutaContainer.innerHTML = '';

        rutaContainer.innerHTML = `               
            <div class="container">
            <h1>${data.ruta_name}</h1>
            <div class="static-rating" data-rating="4">
                <span>☆</span><span>☆</span><span>☆</span><span>☆</span><span>☆</span>
            </div>
            <h4>Ultima actualización el 5 de octubre de 2024</h4>
            <p>${data.ruta_description}</p>
            <div class="first-class">
                <p>Desbloquea todos los curos de la ruta!</p>
                <a href="carrito.html"><button>ADQUIRIR CURSOS</button></a>
            </div>
        </div>
                <div class="container-img">
                    <img src=${data.ruta_img} alt="Imagen del curso">
               
                </div>         
            
        `;
    } catch (error) {
        console.error('Error al cargar la información de la ruta:', error);
    }
}

async function verCursos(ruta_id) {
    try {
        const response = await fetch(`http://localhost:3000/ver-ruta-esp/${ruta_id}`);
        const data = await response.json();

        // Seleccionar el contenedor donde mostrar la información
        const rutaContainer = document.querySelector('.course-list');
        rutaContainer.innerHTML = '';

        data.cursos.forEach(curso => {
            rutaContainer.innerHTML += `
                <div class="course">
                    <a href="curso.html?id=${curso.curso_id}">
                        <span class="course-title">${curso.curso_name}</span>
                        <p class="course-description">${curso.curso_descripction}</p>
                        <div class="course-actions">
                            <button class="course-pref">
                                Por ${curso.curso_price}
                            </button>
                        </div>
                    </a>
                </div>
            `;
        });

    } catch (error) {
        console.error('Error al cargar la información de la ruta:', error);
    }
}

async function verComentarios(ruta_id) {
    const commentContainer = document.querySelector('.comments');
    commentContainer.innerHTML = '';

    try {
        const response = await fetch(`http://localhost:3000/ruta/${ruta_id}/comentarios`);

        if (response.status == 404) {
            commentContainer.innerHTML = '<p>No hay comentarios</p>';
            return;
        }

        const data = await response.json();

        if (data.length === 0) {
            commentContainer.innerHTML = '<p>No hay comentarios</p>';
            return;
        }

        data.forEach(comentario => {
            commentContainer.innerHTML += `
                <div class="comment">
                    <div class="user">
                        <img src="resources/img/logo_guimarbot.webp" alt="Usuario-foto">
                        <p>${comentario.user_FirstName} ${comentario.user_LastName}</p>
                    </div>
                    <div class="rating" data-rating="5">
                        ${renderStars(5)}
                    </div>
                    <p class="comment-text">${comentario.comentario}</p>
                </div>
            `;
        });

    } catch (error) {
        console.error('Error al cargar los comentarios:', error);
    }
}

async function initComentarios(ruta_id) {
    try {
        const sessionResponse = await fetch("http://localhost:3000/check-session", { credentials: "include" });
        const sessionData = await sessionResponse.json();

        const commentContainer = document.querySelector('.container-comment');

        if (sessionData.loggedIn) {
            if (!document.querySelector('.add-comment')) {
                const addCommentSection = document.createElement('div');
                addCommentSection.classList.add('add-comment');
                addCommentSection.innerHTML = `
                    <textarea id="comment-input" placeholder="Escribe tu comentario..." rows="3"></textarea>
                    <button id="send-comment">Enviar</button>
                `;
                commentContainer.appendChild(addCommentSection);
                
                commentContainer.addEventListener('click', async (event) => {
                    if (event.target.id === 'send-comment') {
                
                        const comentario = document.getElementById('comment-input').value.trim();
                
                        if (comentario === '') {
                            alert('El comentario no puede estar vacío.');
                            return;
                        }
                
                        const payload = {
                            user_id: sessionData.user_id,
                            ruta_id: ruta_id,
                            comentario: comentario
                        };
                
                        try {
                            const response = await fetch(`http://localhost:3000/ruta/${ruta_id}/comentarios`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(payload)
                            });
                
                            if (response.ok) {
                                alert('Comentario enviado correctamente.');
                                document.getElementById('comment-input').value = '';
                                await verComentarios(ruta_id);
                            } else {
                                alert('Error al enviar el comentario.');
                            }
                        } catch (error) {
                            console.error('Error al enviar el comentario:', error);
                        }
                    }
                });
            }

        }

        await verComentarios(ruta_id);

    } catch (error) {
        console.error('Error al inicializar comentarios:', error);
    }
}


function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<span>${i <= rating ? '★' : '☆'}</span>`;
    }
    return stars;
}
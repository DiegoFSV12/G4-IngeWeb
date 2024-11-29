document.addEventListener("DOMContentLoaded", () => {
    // Obtener el curso_id de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const curso = urlParams.get("id");
    cursoinfo(curso);
    verRecursos(curso);
    initComentarios(curso);
});

async function cursoinfo(curso_id) {
    try {
        const response = await fetch(`http://localhost:3000/curso-rec/${curso_id}`);
        const data = await response.json();

        // Seleccionar el contenedor donde mostrar la información
        const cursoContainer = document.querySelector('.curso-portada');
        cursoContainer.innerHTML = '';

        cursoContainer.innerHTML = `               
                <div class="container">
            <h1>${data.curso_name}</h1>
            <div class="static-rating" data-rating="4">
                <span>☆</span><span>☆</span><span>☆</span><span>☆</span><span>☆</span>
            </div>
            <h4>Publicado el 5 de octubre de 2024</h4>
            <p>${data.curso_descripction}</p>
            <div class="first-class">
                <p>Mira la primera clase de este curso!</p>
                <a href="carrito.html"><button>ADQUIRIR CURSO</button></a>
            </div>
        </div>
        <div class="container-img">
            <img src=${data.curso_img} alt="Imagen del curso">
        </div>       
                
            `;
    } catch (error) {
        console.error('Error al cargar la información de la ruta:', error);
    }
}

async function verRecursos(ruta_id) {
    try {
        const response = await fetch(`http://localhost:3000/curso-rec/${ruta_id}`);
        const data = await response.json();

        const recursoContainer = document.querySelector('.container-temario');
        recursoContainer.innerHTML = '';

        data.recursos.forEach(recurso => {
            const youtubeID = recurso.recurso_url.split('v=')[1]?.split('&')[0];

            recursoContainer.innerHTML += `
                <div class="tema">
                    <h2>${recurso.recurso_name}</h2>
                    <ul>
                        <li>
                            <a href="javascript:void(0)" class="recurso-toggle">
                                <span class="material-symbols-outlined g-icon">play_arrow</span>
                                ${recurso.recurso_description}
                            </a>
                            <div class="recurso-video" style="display: none; margin-top: 10px;">
                                ${youtubeID ? `
                                    <iframe
                                        width="100%"
                                        height="315"
                                        src="https://www.youtube.com/embed/${youtubeID}"
                                        title="${recurso.recurso_name}"
                                        frameborder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowfullscreen>
                                    </iframe>
                                ` : '<p>El video no está disponible.</p>'}
                            </div>
                        </li>
                    </ul>
                </div>
            `;
        });
        
        document.querySelectorAll('.recurso-toggle').forEach(toggle => {
            toggle.addEventListener('click', (event) => {
                event.preventDefault();
                const videoContainer = toggle.nextElementSibling;
                videoContainer.style.display = videoContainer.style.display === 'none' ? 'block' : 'none';
            });
        });

    } catch (error) {
        console.error('Error al cargar los recursos:', error);
    }
}

async function verComentarios(curso_id) {
    const commentContainer = document.querySelector('.comments');
    commentContainer.innerHTML = '';

    try {
        const response = await fetch(`http://localhost:3000/curso/${curso_id}/comentarios`);

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

async function initComentarios(curso_id) {
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
                            curso_id: curso_id,
                            comentario: comentario
                        };
                
                        try {
                            const response = await fetch(`http://localhost:3000/curso/${curso_id}/comentarios`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(payload)
                            });
                
                            if (response.ok) {
                                alert('Comentario enviado correctamente.');
                                document.getElementById('comment-input').value = '';
                                await verComentarios(curso_id);
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

        await verComentarios(curso_id);

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
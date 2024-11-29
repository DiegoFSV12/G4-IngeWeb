
// Verificar si hay una sesión iniciada
fetch("http://localhost:3000/check-session", { credentials: "include" })
    .then(response => response.json())
    .then(data => {
        if (!data.loggedIn) {
            // Si no hay sesión
            document.getElementById("user-form-login").addEventListener("submit", function(event) {
                event.preventDefault(); // Evita el envío del formulario por defecto
            
                const email = document.getElementById("email").value;
                const password = document.getElementById("txtpassword").value;
            
                // Realiza la solicitud POST a la ruta de login
                fetch("http://localhost:3000/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: email, txtpassword: password }),
                    credentials: "include"
                })
                
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        window.location.href = "index.html"; // Redirige a index.html si el login es exitoso
                    } else {
                        // Muestra el mensaje de error en caso de fallo en el login
                        document.getElementById("login-error-message").textContent = data.message;
                    }
                })
                .catch(error => console.error("Error en la solicitud de login:", error));
            });
        } else {
            // Si hay sesión
            window.location.href = "index.html";
        }
    })
    .catch(error => console.error("Error al verificar la sesión:", error));

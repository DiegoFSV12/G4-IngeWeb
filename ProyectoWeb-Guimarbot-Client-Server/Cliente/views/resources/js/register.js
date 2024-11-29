
// Verificar si hay una sesión iniciada
fetch("http://localhost:3000/check-session", { credentials: "include" })
    .then(response => response.json())
    .then(data => {
        if (!data.loggedIn) {
            // Si no hay sesión
            document.getElementById("user-form-register").addEventListener("submit", function(event) {
                event.preventDefault(); // Evita el envío del formulario por defecto
            
                const fname = document.getElementById("txtusername").value;
                const lname = document.getElementById("txtapellidos").value;
                const email = document.getElementById("txtemail").value;
                const password = document.getElementById("txtpassword").value;
                const birthdate = document.getElementById("birthdate").value;
            
                // Realiza la solicitud POST a la ruta de registro
                fetch("http://localhost:3000/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ txtusername: fname, txtapellidos: lname, txtemail: email, txtpassword: password, birthdate: birthdate })
                })
                .then(response => {
                    if (response.ok) {
                        window.location.href = "login.html"; // Redirige a la página de login si el registro es exitoso
                    } else {
                        console.error("Error al registrar el usuario");
                    }
                })
                .catch(error => console.error("Error en la solicitud de registro:", error));
            });
        } else {
            // Si hay sesión
            window.location.href = "index.html";
        }
    })
    .catch(error => console.error("Error al verificar la sesión:", error));

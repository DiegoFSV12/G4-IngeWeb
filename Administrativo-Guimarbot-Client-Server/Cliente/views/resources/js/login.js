document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault(); // Evita la recarga de la página

    const email = document.getElementById("email").value;
    const password = document.getElementById("pass").value;
    const loginMessage = document.getElementById("loginMessage");

    try {
        // Hacer la solicitud POST al servidor para autenticación
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: email, txtpassword: password }),
            credentials: "include"
        });

        const data = await response.json();

        if (data.success) {
            // Redireccionar al usuario al index si el inicio de sesión es exitoso
            window.location.href = "inbox.html";
        } else {
            // Mostrar el mensaje de error si el inicio de sesión falla
            loginMessage.textContent = data.message || "Error en el inicio de sesión";
        }
    } catch (error) {
        console.error("Error al intentar iniciar sesión:", error);
        loginMessage.textContent = "Error al conectarse al servidor";
    }
});
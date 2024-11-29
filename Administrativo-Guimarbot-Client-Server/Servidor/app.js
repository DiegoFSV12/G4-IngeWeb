const express = require('express');
const bcryptjs = require('bcryptjs');


const app = express();
const port = 3000;

const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:5500', // Dirección de tu frontend
    credentials: true // Asegura que las cookies se manejen adecuadamente
}));


//El paquete dotenv carga variables de entorno desde un archivo .env. Este archivo suele contener datos sensibles como las credenciales de la base de datos.
const dotenv = require('dotenv');
dotenv.config({ path: './env/.env' });

//Conexion a la bd
const connection = require('./database/db');

// Middleware para procesar datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Este bloque inicializa el manejo de sesiones en la aplicación. Cada usuario tendrá una sesión única con un secreto (clave) para proteger los datos de la sesión.
const session = require('express-session');
app.use(session({
    secret: 'secret',//contraseña secreta
    resave: true,//forma de guardar sesiones
    saveUninitialized: true
}));


app.post('/login', async (req, res) => {
    const email = req.body.email;
    const pass = req.body.txtpassword;

    if (email && pass) {
        connection.query('SELECT * FROM admins WHERE admin_email = ?', [email], async (error, results) => {
            if (results.length === 0 || !(await bcryptjs.compare(pass, results[0].admin_pass))) {
                res.json({ success: false, message: 'Usuario o contraseña incorrectos' }); // Login fallido
            } else {
                req.session.loggedin = true;
                req.session.id = results[0].admin_id;
                req.session.fname = results[0].admin_fname;
                req.session.lname = results[0].admin_lname;
                req.session.username = results[0].admin_username;
                req.session.email = results[0].admin_email;
                req.session.birthdate = results[0].admin_birth;
                req.session.dni = results[0].admin_dni;
                req.session.state = results[0].admin_state;
                res.json({ success: true }); // Login exitoso
            }
        });
    } else {
        res.json({ success: false, message: 'Ingrese un usuario o contraseña' });
    }
});


app.get('/perfil', (req, res) => {
    // Verificar si el usuario ha iniciado sesión
    if (req.session.loggedin) {
        // Devolver los datos del usuario de la sesión
        res.json({
            success: true,
            id: req.session.id,
            firstName: req.session.fName,
            lastName: req.session.lName,
            username: req.session.username,
            email: req.session.email,
            birthdate: req.session.birthdate,
        });
    } else {
        // Si no está autenticado, devolver un mensaje de error
        res.status(401).json({ success: false, message: 'No ha iniciado sesión' });
    }
});




app.get('/check-session', (req, res) => {
    if (req.session.loggedin) {
        res.json({ loggedIn: true });
    } else {
        res.json({ loggedIn: false });
    }
});

// Esta ruta cierra la sesión del usuario sin redirigir
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).send('Error al cerrar la sesión');
        } else {
            res.sendStatus(200); // Envía una respuesta de éxito
        }
    });
});

// Servicio web para obtener la lista de administradores
app.get('/admins', (req, res) => {
    // Consulta a la base de datos para obtener los administradores
    connection.query('SELECT admin_id, admin_fname, admin_lname, admin_email, admin_birth, admin_dni FROM admins', (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Error en la base de datos');
        }

        // Devolver los datos de los administradores como JSON
        res.json({
            success: true,
            admins: results // Pasar los datos de administradores en el campo 'admins'
        });
    });
});


//ruta del modal ver admins
app.get('/admin/:id', (req, res) => {
    const adminId = req.params.id;
    connection.query('SELECT * FROM admins WHERE admin_id = ?', [adminId], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Error en la base de datos');
        }
        if (results.length > 0) {
            res.json(results[0]); // Devuelve los datos del administrador como JSON
        } else {
            res.status(404).send('Administrador no encontrado');
        }
    });
});

app.post('/updateAdmin/:id', async (req, res) => {
    const adminId = req.params.id;
    const fname = req.body.editFname;
    const lname = req.body.editLname;
    const birth = req.body.editBirth;
    const email = req.body.editEmail;
    const dni = req.body.editDNI;
    const pass = '10002000';

    // Encriptar password
    let passHash = await bcryptjs.hash(pass, 8);

    // Separar apellido paterno y materno usando el espacio
    const nameParts = lname.split(' ');
    const paternalSurname = nameParts[0];
    const maternalSurname = nameParts[1] || '';

    // Generar username
    const username = `${fname.charAt(0)}${paternalSurname}${maternalSurname.slice(0, 3)}`.toLowerCase();

    // Actualizar en la base de datos
    connection.query(
        'UPDATE admins SET ? WHERE admin_id = ?', 
        [
            {
                admin_fname: fname,
                admin_lname: lname,
                admin_username: username,
                admin_email: email,
                admin_birth: birth,
                admin_dni: dni,
                admin_pass: passHash
            },
            adminId
        ],
        (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Error updating admin' });
            }

            // Verificar si se realizó la actualización y responder al cliente
            if (results.affectedRows > 0) {
                return res.status(200).json({ success: true, message: 'Admin updated successfully' });
            } else {
                return res.status(404).json({ success: false, message: 'Admin not found' });
            }
        }
    );
});

//Esta ruta procesa el formulario de registro de usuarios. Los datos del formulario se reciben, se encripta la contraseña, y luego se inserta la información del usuario en la base de datos.
app.post('/registerAdmin', async (req, res) => {
    const fname = req.body.addFName; // Nombre
    const lname = req.body.addLName; // Apellido paterno y materno juntos
    const birth = req.body.addBirth;
    const email = req.body.addEmail;
    const dni = req.body.addDNI;
    const pass = '10002000';
    const state = '1';
    // Encriptar password
    let passHash = await bcryptjs.hash(pass, 8);

    // Separar apellido paterno y materno usando el espacio
    const nameParts = lname.split(' ');
    const paternalSurname = nameParts[0]; // Apellido paterno
    const maternalSurname = nameParts[1] || ''; // Apellido materno, si existe

    // Generar username: Primera letra del nombre + Apellido paterno + 3 primeras letras del apellido materno
    const username = `${fname.charAt(0)}${paternalSurname}${maternalSurname.slice(0, 3)}`.toLowerCase();

    // Insertar en la base de datos
    connection.query('INSERT INTO admins SET ?', {
        admin_fname: fname,
        admin_lname: lname,
        admin_username: username,
        admin_email: email,
        admin_birth: birth,
        admin_dni: dni,
        admin_pass: passHash,
        admin_state: state
    }, async (error, results) => {
        if (error) {
            console.log(error);
        } else {
            res.redirect('admins')
        }
    });
});


// Ruta para guardar una nueva ruta 
app.post('/routes', async (req, res) => { 
    const routeName = req.body.routeName; 
    // Insertar en la base de datos 
    connection.query('INSERT INTO rutas SET ?', { 
        ruta_name: routeName, 
        ruta_description: "lorem",	
        ruta_creator:"PLACEHOLDER",	
        ruta_img:"resources/img/fondo-guimarbot.jpg"
        }, async (error, results) => { 
            if (error) { 
                console.log(error); 
                res.status(500).send("Error al guardar la ruta"); 
            } else { 
                res.sendStatus(200); // Enviar una respuesta de éxito 
                }
            });
        });

// Ruta para obtener las rutas
app.get('/LoadRoutes', (req, res) => {
    connection.query('SELECT ruta_id, ruta_name FROM rutas', (error, results) => {
        if (error) {
            console.error("Error al obtener las rutas:", error);
            res.status(500).send("Error al obtener las rutas");
        } else {
            res.json({ routes: results });
        }
    });
});
// Ruta para obtener los cursos 
app.get('/LoadCourses', (req, res) => { 
    connection.query('SELECT curso_id, curso_name FROM curso', (error, results) => { 
        if (error) { 
            console.error("Error al obtener los cursos:", error); 
            res.status(500).send("Error al obtener los cursos"); 
        } else { 
            res.json({ courses: results }); 
        } 
    }); 
});


// Ruta para guardar un nuevo curso
app.post('/AddCurso', async (req, res) => { 
    const cursoName = req.body.cursoName;
    const cursoDescription = req.body.cursoDescription;  
    // Insertar en la base de datos 
    connection.query('INSERT INTO curso SET ?', { 
        curso_name: cursoName,
        curso_descripction: cursoDescription,
        curso_teacherID: "1",
        curso_img:"resources/img/fondo-guimarbot.jpg",
        curso_price: "50"	
        }, 
        async (error, results) => { 
        if (error) { 
            console.log(error); 
            res.status(500).send("Error al guardar la ruta"); 
        } else { 
            res.json({ success: true, courseId: results.insertId });
            }
        });
    });
// Ruta para asociar rutas al curso 
app.post('/AddCourseRoute', (req, res) => { 
    const courseId = req.body.courseId; 
    const routeId = req.body.routeId; 
    connection.query('INSERT INTO ruta_curso (ruta_ID, curso_ID) VALUES (?, ?)', [routeId, courseId], (error, results) => { 
        if (error) { 
            console.error("Error al asociar ruta con curso:", error); 
            res.status(500).send("Error al asociar ruta con curso"); 
        } else { 
            res.sendStatus(200); 
        } 
    }); 
});
// Ruta para agregar un recurso 
app.post('/AddResource', (req, res) => { 
    const courseId = req.body.courseId; 
    const chapterName = req.body.chapterName; 
    const chapterOrder = req.body.chapterOrder; 
    const resourceDescription = req.body.resourceDescription;
    const resourceURL = req.body.resourceURL; 
    const resourceIMG = "resources/img/fondo-guimarbot.jpg"; // Insertar en la base de datos 
    connection.query('INSERT INTO recursos (recurso_name, recurso_description, recurso_url, recurso_img, recurso_cursoID, recurso_order) VALUES (?, ?, ?, ?, ?, ?)', [chapterName, resourceDescription, resourceURL, resourceIMG, courseId, chapterOrder], (error, results) => { 
        if (error) { 
            console.error("Error al agregar el recurso:", error); 
            res.status(500).send("Error al agregar el recurso"); 
        } else { 
            res.json({ success: true }); 
        } 
    }); 
});

// Ruta para obtener las rutas 
app.get('/rutas', (req, res) => { 
    connection.query('SELECT * FROM rutas', (error, results) => { 
        if (error) { console.error("Error al obtener las rutas:", error); 
            res.status(500).send("Error al obtener las rutas"); 
        } else { 
            res.json({ success: true, rutas: results }); 
        } 
    }); 
}); 
// Ruta para obtener los cursos 
app.get('/cursos', (req, res) => { 
    connection.query('SELECT * FROM curso', (error, results) => { 
        if (error) { console.error("Error al obtener los cursos:", error); 
            res.status(500).send("Error al obtener los cursos"); 
        } else { 
            res.json({ success: true, cursos: results }); 
        } 
    }); 
}); 
// Ruta para obtener los recursos 
app.get('/recursos', (req, res) => { 
    connection.query('SELECT * FROM recursos', (error, results) => { 
        if (error) { console.error("Error al obtener los recursos:", error); 
            res.status(500).send("Error al obtener los recursos"); 
        } else { 
            res.json({ success: true, recursos: results }); 
        } 
    }); 
});


// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

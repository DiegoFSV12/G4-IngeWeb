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

app.post('/register', async (req, res) => {
    try {
        // Verificar que req.body contiene los datos esperados
        console.log("Datos recibidos:", req.body);

        const { txtusername: fname, txtapellidos: lname, birthdate: birth, txtemail: email, txtpassword: pass } = req.body;

        // Crear hash de la contraseña
        const passHash = await bcryptjs.hash(pass, 8);

        // Procesar apellidos
        const nameParts = lname.split(' ');
        const paternalSurname = nameParts[0];
        const maternalSurname = nameParts[1] || '';

        // Generar nombre de usuario
        const username = `${fname.charAt(0)}${paternalSurname}${maternalSurname.slice(0, 3)}`.toLowerCase();

        // Insertar datos en la base de datos
        connection.query('INSERT INTO users SET ?', {
            user_FirstName: fname,
            user_LastName: lname,
            user_name: username,
            user_email: email,
            user_birth: birth,
            user_pass: passHash
        }, (error, results) => {
            if (error) {
                console.error("Error en la consulta SQL:", error);
                res.status(500).send("Error en el registro");
            } else {
                res.sendStatus(200); // Enviar una respuesta de éxito
            }
        });
    } catch (err) {
        console.error("Error en el proceso de registro:", err);
        res.status(500).send("Error en el proceso de registro");
    }
});


app.post('/login', async (req, res) => {
    const email = req.body.email;
    const pass = req.body.txtpassword;

    if (email && pass) {
        connection.query('SELECT * FROM users WHERE user_email = ?', [email], async (error, results) => {
            if (results.length === 0 || !(await bcryptjs.compare(pass, results[0].user_pass))) {
                res.json({ success: false, message: 'Usuario o contraseña incorrectos' }); // Login fallido
            } else {
                req.session.loggedin = true;
                req.session.user_id = results[0].user_id;
                req.session.name = results[0].user_name;
                req.session.email = results[0].user_email;
                req.session.firstName = results[0].user_FirstName;
                req.session.lastName = results[0].user_LastName;
                req.session.birthdate = results[0].user_birth;
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
            firstName: req.session.firstName,
            lastName: req.session.lastName,
            username: req.session.name,
            email: req.session.email,
            birthdate: req.session.birthdate,
            points: 120, // Ejemplo de puntos, puedes cambiarlo según tu sistema
            plan: "Premium" // Ejemplo de plan, puedes cambiarlo según tu sistema
        });

    } else {
        // Si no está autenticado, devolver un mensaje de error
        res.status(401).json({ success: false, message: 'No ha iniciado sesión' });
    }
});


// Ruta para obtener los cursos desde la base de datos
app.get('/cursosMenu', (req, res) => {
    const query = 'SELECT curso_id, curso_name, curso_descripction, curso_teacherID, curso_img, curso_price FROM curso LIMIT 4';

    connection.query(query, (error, results) => {
        if (error) {
            console.error("Error en la consulta SQL:", error);
            res.status(500).send("Error al obtener los cursos");
        } else {
            res.json(results); // Enviar los cursos obtenidos al frontend
        }
    });
});

// Ruta para obtener la ruta desde y cursos la base de datos
app.get('/ruta-cursos', (req, res) => {
    const query = 'SELECT ruta_id, ruta_name, ruta_description, ruta_creator, ruta_img FROM rutas';

    connection.query(query, (error, results) => {
        if (error) {
            console.error("Error en la consulta SQL:", error);
            res.status(500).send("Error al obtener los cursos");
        } else {
            res.json(results); // Enviar los cursos obtenidos al frontend
        }
    });
});

//ruta para obtener los cursos con la id de la ruta
app.get('/rutas-con-cursos', (req, res) => {
    const query = `
        SELECT rutas.ruta_id, rutas.ruta_name, rutas.ruta_description, rutas.ruta_img, 
               curso.curso_id, curso.curso_name, curso.curso_descripction, curso.curso_img, curso.curso_price
        FROM rutas
        LEFT JOIN ruta_curso ON rutas.ruta_id = ruta_curso.ruta_ID
        LEFT JOIN curso ON ruta_curso.curso_ID = curso.curso_id
    `;

    connection.query(query, (error, results) => {
        if (error) {
            console.error("Error en la consulta SQL:", error);
            res.status(500).send("Error al obtener las rutas con sus cursos");
        } else {
            // Agrupar cursos por cada ruta
            const rutasConCursos = results.reduce((acc, row) => {
                const rutaId = row.ruta_id;
                if (!acc[rutaId]) {
                    acc[rutaId] = {
                        ruta_id: row.ruta_id,
                        ruta_name: row.ruta_name,
                        ruta_description: row.ruta_description,
                        ruta_img: row.ruta_img,
                        cursos: []
                    };
                }

                if (row.curso_id) {
                    acc[rutaId].cursos.push({
                        curso_id: row.curso_id,
                        curso_name: row.curso_name,
                        curso_descripction: row.curso_descripction,
                        curso_img: row.curso_img,
                        curso_price: row.curso_price
                    });
                }
                return acc;
            }, {});

            res.json(Object.values(rutasConCursos)); // Enviar todas las rutas con sus cursos al frontend
        }
    });
});

// Ruta para ver los detalles de una ruta específica con sus cursos
app.get('/ver-ruta-esp/:id', (req, res) => {
    const ruta_id = req.params.id;

    // Consulta para obtener los detalles de la ruta y sus cursos
    const query = `
        SELECT r.ruta_id, r.ruta_name, r.ruta_description, r.ruta_img, 
               c.curso_id, c.curso_name, c.curso_descripction, c.curso_img, c.curso_price
        FROM rutas r
        LEFT JOIN ruta_curso rc ON r.ruta_id = rc.ruta_ID
        LEFT JOIN curso c ON rc.curso_ID = c.curso_id
        WHERE r.ruta_id = ?`;

    connection.query(query, [ruta_id], (error, results) => {
        if (error) {
            console.error("Error en la consulta SQL:", error);
            return res.status(500).send("Error al obtener los detalles de la ruta");
        }

        if (results.length > 0) {
            // Agrupar los cursos de la ruta
            const ruta = {
                ruta_id: results[0].ruta_id,
                ruta_name: results[0].ruta_name,
                ruta_description: results[0].ruta_description,
                ruta_img: results[0].ruta_img,
                cursos: results.map(result => ({
                    curso_id: result.curso_id,
                    curso_name: result.curso_name,
                    curso_descripction: result.curso_descripction,
                    curso_price: result.curso_price,
                    curso_img: result.curso_img
                }))
            };
            res.json(ruta); // Enviar la información de la ruta y sus cursos
        } else {
            res.status(404).send("Ruta no encontrada");
        }
    });
});

//obtener recursos y curso a traves de id
app.get('/curso-rec/:id', (req, res) => {
    const curso_id = req.params.id;

    const query = `
        SELECT c.curso_id, c.curso_name, c.curso_descripction, c.curso_img, c.curso_price,
               r.recurso_id, r.recurso_name, r.recurso_description, r.recurso_url, r.recurso_img, r.recurso_order
        FROM curso c
        LEFT JOIN recursos r ON c.curso_id = r.recurso_cursoID
        WHERE c.curso_id = ?`;

    connection.query(query, [curso_id], (error, results) => {
        if (error) {
            console.error("Error en la consulta SQL:", error);
            return res.status(500).send("Error al obtener los detalles del curso");
        }

        if (results.length > 0) {
            const curso = {
                curso_id: results[0].curso_id,
                curso_name: results[0].curso_name,
                curso_descripction: results[0].curso_descripction,
                curso_img: results[0].curso_img,
                curso_price: results[0].curso_price,
                recursos: results.map(result => ({
                    recurso_id: result.recurso_id,
                    recurso_name: result.recurso_name,
                    recurso_description: result.recurso_description,
                    recurso_url: result.recurso_url,
                    recurso_img: result.recurso_img,
                    recurso_order: result.recurso_order
                }))
            };
            res.json(curso);
        } else {
            res.status(404).send("Curso no encontrado");
        }
    });
});

//comentarios de los cursos
app.get('/curso/:id/comentarios', (req, res) => {
    const cursoID = req.params.id;

    const queryComments = `
    SELECT 
        cc.comentario_id, cc.comentario, cc.created_At,
        u.user_FirstName, u.user_LastName
    FROM curso_comentarios cc
    LEFT JOIN users u ON cc.user_id = u.user_id
    WHERE cc.cursoID = ?
    ORDER BY cc.created_At ASC`;

    connection.query(queryComments, [cursoID], (error, results) => {
        if (error) {
            console.error("Error al obtener los comentarios:", error);
            return res.status(500).send("Error al obtener los comentarios");
        }

        if (results.length > 0) {
            const comentarios = results.map(result => ({
                comentario_id: result.comentario_id,
                comentario: result.comentario,
                created_At: result.created_At,
                user_FirstName: result.user_FirstName,
                user_LastName: result.user_LastName
            }));
            res.json(comentarios); // Enviar comentarios en formato JSON
        } else {
            res.status(404).send("No hay comentarios para este curso");
        }
    });
});

app.post('/curso/:id/comentarios', (req, res) => {
    const curso_id = req.params.id;
    const { user_id, comentario } = req.body;

    if (!user_id || !comentario) {
        return res.status(400).json({ error: 'Datos incompletos' });
    }

    const query = `
        INSERT INTO curso_comentarios (user_id, cursoID, comentario)
        VALUES (?, ?, ?)
    `;

    connection.query(query, [user_id, curso_id, comentario], (error, results) => {
        if (error) {
            console.error("Error al insertar el comentario:", error);
            return res.status(500).json({ error: 'Error al guardar el comentario' });
        }
        res.status(201).json({ message: 'Comentario agregado correctamente' });
    });
});

//comentarios de las rutas
app.get('/ruta/:id/comentarios', (req, res) => {
    const rutaID = req.params.id;

    const queryComments = `
    SELECT 
        rc.comentario_id, rc.comentario, rc.created_At,
        u.user_FirstName, u.user_LastName
    FROM ruta_comentarios rc
    LEFT JOIN users u ON rc.user_id = u.user_id
    WHERE rc.ruta_id = ?
    ORDER BY rc.created_At ASC`;

    connection.query(queryComments, [rutaID], (error, results) => {
        if (error) {
            console.error("Error al obtener los comentarios:", error);
            return res.status(500).send("Error al obtener los comentarios");
        }

        if (results.length > 0) {
            const comentarios = results.map(result => ({
                comentario_id: result.comentario_id,
                comentario: result.comentario,
                created_At: result.created_At,
                user_FirstName: result.user_FirstName,
                user_LastName: result.user_LastName
            }));
            res.json(comentarios); // Enviar comentarios en formato JSON
        } else {
            res.status(404).send("No hay comentarios para esta ruta");
        }
    });
});

app.post('/ruta/:id/comentarios', (req, res) => {
    const ruta_id = req.params.id;
    const { user_id, comentario } = req.body;

    if (!user_id || !comentario) {
        return res.status(400).json({ error: 'Datos incompletos' });
    }

    const query = `
        INSERT INTO ruta_comentarios (user_id, ruta_id, comentario)
        VALUES (?, ?, ?)
    `;

    connection.query(query, [user_id, ruta_id, comentario], (error, results) => {
        if (error) {
            console.error("Error al insertar el comentario:", error);
            return res.status(500).json({ error: 'Error al guardar el comentario' });
        }
        res.status(201).json({ message: 'Comentario agregado correctamente' });
    });
});

app.get('/check-session', (req, res) => {
    if (req.session.loggedin) {
        res.json({ loggedIn: true, user_id: req.session.user_id, name: req.session.name });
    } else {
        res.json({ loggedIn: false });
    }
});




// Ruta para obtener los cursos buscados
app.get('/buscarCursos/:query', (req, res) => {
    const consulta = req.params.query;
    const query = `SELECT * FROM curso WHERE curso_name LIKE ?`;
    connection.query(query, [`%${consulta}%`], (error, results) => {
        if (error) {
            console.error("Error en la consulta SQL:", error);
            res.status(500).send("Error al obtener los cursos");
        } else {
            res.json(results); // Enviar los cursos obtenidos
        }
    });
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




// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
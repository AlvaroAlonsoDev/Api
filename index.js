// Importamos los módulos necesarios
const express = require('express');
const mysql = require('mysql');
const cors = require("cors");
const dotenv = require("dotenv");

// Creamos una instancia de express
const app = express();

// Configuramos CORS
app.use(cors());

// Configuramos dotenv
dotenv.config();

// Creamos la conexión con la base de datos utilizando los datos de acceso en el archivo .env
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// Conectamos a la base de datos y verificamos si la conexión fue exitosa
connection.connect((err) => {
    if (err) throw err;
    console.log('Conectado a la base de datos MySQL');

    // Elimina la tabla Usuarios (opcional)
    // const dropTableSql = `DROP TABLE IF EXISTS Usuarios`;
    // connection.query(dropTableSql, (err, result) => {
    //     if (err) throw err;
    //     console.log('Tabla Usuarios eliminada');
    // });

    // Creamos la tabla Usuarios si no existe
    const createTableSql = `
    CREATE TABLE IF NOT EXISTS Usuarios (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    codigo_usuario VARCHAR(50) NOT NULL,
    nombre_usuario VARCHAR(50) NOT NULL,
    contrasena VARCHAR(50) NOT NULL,
    fecha_alta DATE NOT NULL,
    activo BOOLEAN NOT NULL
    )`;
    connection.query(createTableSql, (err, result) => {
        if (err) throw err;
        console.log('Tabla Usuarios creada o ya existente');


        // Inserta algunos registros en la tabla Usuarios (opcional)
        // const insertSql = `
        //     INSERT INTO Usuarios (codigo_usuario, nombre_usuario, contrasena, fecha_alta, activo)
        //     VALUES
        //         ('007', 'Juan', 'contrasena123', '2022-01-01', true),
        //         ('008', 'Pedro', 'contrasena456', '2022-02-01', true),
        //         ('009', 'Ana', 'contrasena789', '2022-03-01', false),
        //         ('010', 'Alvaro', 'contrasena123', '2022-05-01', true),
        //         ('011', 'Lorena', 'contrasena456', '2022-06-01', false),
        //         ('0', 'Erica', 'contrasena789', '2022-07-01', true)
        //     `;
        // connection.query(insertSql, (err, result) => {
        //     if (err) throw err;
        //     console.log(`${result.affectedRows} registros insertados en la tabla Usuarios`);

        // Recupera todos los registros de la tabla Usuarios (opcional)
        const selectSql = `SELECT * FROM Usuarios`;
        connection.query(selectSql, (err, result) => {
            if (err) throw err;
            console.log('Registros en la tabla Usuarios: ');
            console.log(result);
        });
        // });
    });
});


// Definimos una ruta que devuelve todos los registros de la tabla Usuarios
app.get('/api/user/getall', (req, res) => {
    connection.query('SELECT * FROM Usuarios', (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return;
        }
        res.send(results);
    });
});

// Configuramos el servidor para escuchar en el puerto definido en el archivo .env
app.listen(process.env.PORT, () => {
    console.log(`API escuchando en el puerto ${process.env.PORT}`);
}).on('error', (err) => {
    console.log('Error al iniciar el servidor:', err.message);
});
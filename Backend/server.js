const express = require('express');
const { Pool } = require('pg');
const cors = require('cors')

const app = express();
const port = 3000;

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'milagrosa',
    password: '',
    port: 5432,
});

// Middleware para manejar JSON
app.use(express.json());

app.use(cors());

// Rutas
// Insertar datos en estudiantes
app.post('/estudiantes', async (req, res) => {
    const { nombre, apellido, tipo_id, numero_id, programa, semestre, edad, fecha_nacimiento, tipo_sangre } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO estudiantes (nombre, apellido, tipo_id, numero_id, programa, semestre, edad, fecha_nacimiento, tipo_sangre)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [nombre, apellido, tipo_id, numero_id, programa, semestre, edad, fecha_nacimiento, tipo_sangre]
        );
        res.status(201).json(result.rows[0]);
        console.log('Estudiane Insertado Correctamente')
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al insertar el estudiante' });
    }
});

app.post('/profesores',async(req,res)=>{
    const {
        numero,
        nombre,
        apellido,
        tipo_id,
        numero_id,
        programa,
        semestre,
        edad,
        fecha_nacimiento,
        tipo_sangre,
        experiencia,
        jornada,
        salario_mensual,
        tipo_vinculacion
    } = req.body;
    
    if (!salario_mensual || !tipo_vinculacion) {
        return res.status(400).json({ error: 'Salario mensual y tipo de vinculación son obligatorios para los profesores.' });
    }

    try{

        const exists =  await pool.query(
            `SELECT * FROM profesores WHERE numero_id = $1`,
            [numero_id]
        )

        if (exists.rows.length > 0) {
            return res.status(400).json({ error: 'El profesor con este número de identificación ya existe.' });
        }
        const profesorResult = await pool.query(
            `INSERT INTO profesores(numero,nombre,apellido,tipo_id,numero_id,programa,semestre,edad,fecha_nacimiento,tipo_sangre,experiencia,jornada)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
            [numero,nombre,apellido,tipo_id,numero_id,programa,semestre,edad,fecha_nacimiento,tipo_sangre,experiencia,jornada]
        );

        const profesorNumero = profesorResult.rows[0].numero

        await pool.query(   `INSERT INTO nomina( salario_mensual, tipo_vinculacion,profesor_numero)  
            VALUES ($1, $2, $3) RETURNING *`,
           [salario_mensual, tipo_vinculacion,profesorNumero])

        res.status(201).json({
                message: 'Profesor y nómina insertados correctamente',
                profesor:  profesorResult.rows[0]
        });
        console.log('Profesor Insertado Correctamente')   

    }catch(err){
        console.log(err);

        if (err.code === '23505') {
            return res.status(400).json({ error: `Error: ${err.detail}` });
        }
        res.status(500).json({error: 'Error al insertar el profesor' })
    }

})

// Listar estudiantes
app.get('/estudiantes', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM estudiantes');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener los estudiantes' });
    }
});

//listar profesores
app.get('/profesores', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query(
            `SELECT p.*, n.salario_mensual, n.tipo_vinculacion 
             FROM profesores p
             INNER JOIN nomina n 
             ON p.numero = n.profesor_numero`
        );
        client.release();
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Error al obtener los profesores' });
    }
});


// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

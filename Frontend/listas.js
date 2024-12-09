const listarEstudiantesBtn = document.getElementById('listar-estudiantes');
const listarProfesoresBtn = document.getElementById('listar-profesores');
const tablaEstudiantes = document.getElementById('tabla-estudiantes');
const tablaProfesores = document.getElementById('tabla-profesores');



listarEstudiantesBtn.addEventListener('click', async () => {
    tablaEstudiantes.style.display = 'block';
    tablaProfesores.style.display = 'none';
    try {
        const response = await fetch('http://localhost:3000/estudiantes');
        const estudiantes = await response.json();
        const tbody = tablaEstudiantes.querySelector('tbody');
        tbody.innerHTML = estudiantes.map(e => `
            <tr>
                <td>${e.numero}</td>
                <td>${e.nombre}</td>
                <td>${e.apellido}</td>
                <td>${e.programa}</td>
                <td>${e.semestre}</td>
            </tr>
        `).join('');
    } catch (err) {
        console.error(err);
        alert('Error al obtener los estudiantes');
    }
});

listarProfesoresBtn.addEventListener('click', async () => {
    tablaProfesores.style.display = 'block';
    tablaEstudiantes.style.display = 'none';
    try {
        const response = await fetch('http://localhost:3000/profesores');
        const profesores = await response.json();
        const tbody = tablaProfesores.querySelector('tbody');
        tbody.innerHTML = profesores.map(p => `
            <tr>
                <td>${p.numero}</td>
                <td>${p.nombre}</td>
                <td>${p.apellido}</td>
                <td>${p.salario_mensual}</td>
                <td>${p.tipo_vinculacion}</td>
            </tr>
        `).join('');
    } catch (err) {
        console.error(err);
        alert('Error al obtener los profesores');
    }
});

        const tipoPersonaSelect = document.getElementById('tipo-persona');
        const nominaFields = document.getElementById('nomina-fields');
        const semestre = document.getElementById('semestre')
        const programa = document.getElementById('programa')
        const jornada = document.getElementById('jornada')
        const formRegistro = document.getElementById('form-registro');
       
        const experiencia= document.getElementById('experiencia')



        tipoPersonaSelect.addEventListener('change', () => {
            if (tipoPersonaSelect.value === 'profesor') {
                nominaFields.style.display = 'block';
                jornada.style.display='block';
                document.getElementById('salario').setAttribute('required', true);
                document.getElementById('tipo-vinculacion').setAttribute('required', true);
                experiencia.style.display='block'
                
            } else {

                nominaFields.style.display = 'none';
                jornada.style.display='none';
                experiencia.style.display='none'

            }
        });

        formRegistro.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(formRegistro);
            const data = Object.fromEntries(formData.entries());
            console.log(data)
            const fechaNacimiento = new Date(data.fecha_nacimiento);
            const hoy = new Date()
            const edad = hoy.getFullYear()- fechaNacimiento.getFullYear()
            const esMenorDe18 = edad < 18 || (edad=== 18 && hoy < new Date(fechaNacimiento.setFullYear(hoy.getFullYear()-18)))

            // Validacion 1: Si es menor de 18 el tipo de ID no puede ser cedula 
            if (data.tipo_id === 'CC' && esMenorDe18) {
                alert('La fecha de nacimiento indica que la persona tiene menos de 18 años. No puede usar Cédula como tipo de ID.');
                return;
            }
        
            // Validación 2: Si es profesor, el tipo_id no puede ser 'TI' (Tarjeta de Identidad).
            if (data['tipo-persona'] === 'profesor' && data.tipo_id === 'TI') {
                alert('Un profesor no puede tener Tarjeta de Identidad como tipo de ID.');
                return;
            }


            const url = data['tipo-persona'] === 'estudiante' ? 'http://localhost:3000/estudiantes' : 'http://localhost:3000/profesores';


            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                if(!response.ok){
                    const errorData = await response.json();
                    alert(`Error: ${errorData.error || 'Error desconocido al registrar.'}`);
                }else{
                    const result = await response.json();
                    alert('Registro exitoso')
                    formRegistro.reset();
                }
                
                
                
            } catch (err) {
                console.error(err);
                alert('Error al enviar los datos. Verifique su conexión o intente más tarde.');
            }
        });

 

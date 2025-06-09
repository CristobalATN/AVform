// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar Select2 para los select
    $('.select2').select2({
        width: '100%',
        placeholder: 'Seleccione una opción',
        allowClear: true,
        tags: true
    });

    // Referencias a elementos del DOM
    const form = document.getElementById('declaracionForm');
    const tipoFormato = document.getElementById('tipoFormato');
    const seccionEpisodios = document.getElementById('seccionEpisodios');
    const bloquesEpisodios = document.getElementById('bloquesEpisodios');
    const btnAgregarBloque = document.getElementById('agregarBloque');
    const btnAgregarTitulo = document.getElementById('agregarTitulo');
    const otrosTitulos = document.getElementById('otrosTitulos');
    
    // Plantillas
    const templateBloqueEpisodio = document.getElementById('template-bloque-episodio');
    const templateLineaParticipacion = document.getElementById('template-linea-participacion');

    // Contador para bloques de episodios
    let contadorBloques = 0;

    // Mostrar/ocultar sección de episodios según el tipo de formato
    tipoFormato.addEventListener('change', function() {
        const formatoSeleccionado = this.value;
        if (formatoSeleccionado === 'Serie' || formatoSeleccionado === 'Telenovela') {
            seccionEpisodios.style.display = 'block';
        } else {
            seccionEpisodios.style.display = 'none';
        }
    });

    // Agregar un nuevo bloque de episodios
    btnAgregarBloque.addEventListener('click', function() {
        agregarBloqueEpisodio();
    });

    // Agregar un nuevo título
    btnAgregarTitulo.addEventListener('click', function() {
        agregarOtroTitulo();
    });

    // Delegación de eventos para botones de eliminar
    document.addEventListener('click', function(e) {
        // Eliminar bloque de episodios
        if (e.target.closest('.btn-eliminar-bloque')) {
            const bloque = e.target.closest('.bloque-episodio');
            if (bloque && confirm('¿Está seguro de eliminar este bloque de episodios?')) {
                bloque.remove();
                actualizarNumerosBloques();
            }
        }
        
        // Eliminar línea de participación
        if (e.target.closest('.btn-eliminar-linea')) {
            const linea = e.target.closest('.linea-participacion');
            if (linea) {
                linea.remove();
            }
        }
        
        // Agregar línea de participación
        if (e.target.closest('.btn-agregar-linea')) {
            const contenedorLineas = e.target.closest('.lineas-episodio').querySelector('.lineas-container');
            agregarLineaParticipacion(contenedorLineas);
        }
    });

    // Función para agregar un nuevo bloque de episodios
    function agregarBloqueEpisodio() {
        contadorBloques++;
        const nuevoBloque = document.importNode(templateBloqueEpisodio.content, true);
        
        // Actualizar el número de bloque
        nuevoBloque.querySelector('.numero-bloque').textContent = contadorBloques;
        
        // Agregar el bloque al contenedor
        bloquesEpisodios.appendChild(nuevoBloque);
        
        // Inicializar Select2 en los select del nuevo bloque
        $(bloquesEpisodios.lastElementChild).find('.select2').select2({
            width: '100%',
            placeholder: 'Seleccione una opción',
            allowClear: true,
            tags: true
        });
        
        // Agregar una línea de participación por defecto
        const contenedorLineas = bloquesEpisodios.lastElementChild.querySelector('.lineas-container');
        agregarLineaParticipacion(contenedorLineas);
    }

    // Función para agregar una nueva línea de participación
    function agregarLineaParticipacion(contenedor) {
        const nuevaLinea = document.importNode(templateLineaParticipacion.content, true);
        contenedor.appendChild(nuevaLinea);
        
        // Inicializar Select2 en los select de la nueva línea
        $(contenedor.lastElementChild).find('.select2').select2({
            width: '100%',
            placeholder: 'Seleccione una opción',
            allowClear: true,
            tags: true
        });
    }

    // Función para agregar otro título
    function agregarOtroTitulo() {
        const nuevoTitulo = document.createElement('div');
        nuevoTitulo.className = 'otro-titulo';
        nuevoTitulo.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label>País</label>
                    <select class="select2" multiple>
                        <!-- Se llenará dinámicamente -->
                    </select>
                </div>
                <div class="form-group">
                    <label>Otros títulos</label>
                    <input type="text">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Idioma</label>
                    <select class="select2" multiple>
                        <!-- Se llenará dinámicamente -->
                    </select>
                </div>
                <div class="form-group">
                    <label>Canal / Plataforma / Sala</label>
                    <input type="text">
                </div>
                <div class="form-group">
                    <label>Fecha</label>
                    <input type="date">
                </div>
                <div class="form-group">
                    <button type="button" class="btn btn-danger btn-sm btn-eliminar-titulo">
                        <i class="fas fa-times"></i> Eliminar
                    </button>
                </div>
            </div>
        `;
        
        otrosTitulos.appendChild(nuevoTitulo);
        
        // Inicializar Select2 en los select del nuevo título
        $(nuevoTitulo).find('.select2').select2({
            width: '100%',
            placeholder: 'Seleccione una opción',
            allowClear: true,
            tags: true
        });
    }

    // Actualizar números de bloques
    function actualizarNumerosBloques() {
        const bloques = document.querySelectorAll('.bloque-episodio');
        bloques.forEach((bloque, index) => {
            bloque.querySelector('.numero-bloque').textContent = index + 1;
        });
        contadorBloques = bloques.length;
    }

    // Manejar el envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar el formulario
        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add('was-validated');
            return;
        }
        
        // Recolectar datos del formulario
        const datos = {
            datosGenerales: {
                tituloOriginal: document.getElementById('tituloOriginal').value,
                tipoFormato: document.getElementById('tipoFormato').value,
                empresaProductora: document.getElementById('empresaProductora').value,
                paisProduccion: document.getElementById('paisProduccion').value,
                anioProduccion: document.getElementById('anioProduccion').value,
                idioma: document.getElementById('idioma').value
            },
            bloquesEpisodios: [],
            otrosTitulos: []
        };
        
        // Recolectar bloques de episodios
        document.querySelectorAll('.bloque-episodio').forEach(bloque => {
            const bloqueData = {
                desdeEpisodio: bloque.querySelector('.desde-episodio').value,
                hastaEpisodio: bloque.querySelector('.hasta-episodio').value,
                temporada: bloque.querySelector('.temporada').value,
                actores: bloque.querySelector('.actores').value,
                lineas: []
            };
            
            // Recolectar líneas de participación
            bloque.querySelectorAll('.linea-participacion').forEach(linea => {
                const roles = Array.from(linea.querySelectorAll('select:first-child option:checked')).map(opt => opt.value);
                const directores = Array.from(linea.querySelectorAll('select:nth-child(2) option:checked')).map(opt => opt.value);
                const guionistas = Array.from(linea.querySelectorAll('select:nth-child(3) option:checked')).map(opt => opt.value);
                const porcentaje = linea.querySelector('.porcentaje').value;
                
                bloqueData.lineas.push({
                    roles,
                    directores,
                    guionistas,
                    porcentaje
                });
            });
            
            datos.bloquesEpisodios.push(bloqueData);
        });
        
        // Recolectar otros títulos
        document.querySelectorAll('.otro-titulo').forEach(titulo => {
            const pais = Array.from(titulo.querySelector('select:first-child option:checked')).map(opt => opt.value);
            const tituloTexto = titulo.querySelector('input[type="text"]').value;
            const idioma = Array.from(titulo.querySelector('select:nth-child(2) option:checked')).map(opt => opt.value);
            const canal = titulo.querySelectorAll('input[type="text"]')[1]?.value || '';
            const fecha = titulo.querySelector('input[type="date"]')?.value || '';
            
            datos.otrosTitulos.push({
                pais,
                titulo: tituloTexto,
                idioma,
                canal,
                fecha
            });
        });
        
        // Generar el archivo Excel
        generarExcel(datos);
    });
    
    // Función para generar el archivo Excel
    function generarExcel(datos) {
        // Crear un nuevo libro de trabajo
        const wb = XLSX.utils.book_new();
        
        // Crear una hoja de cálculo con los datos
        const ws_data = [];
        
        // Encabezados
        const headers = [
            'Título Original',
            'Tipo de Formato',
            'Empresa Productora',
            'País de Producción',
            'Año de Producción',
            'Idioma',
            'Temporada',
            'Episodio',
            'Actores',
            'Roles',
            'Directores',
            'Guionistas',
            'Porcentaje de Participación',
            'Otros Títulos',
            'País (Otros Títulos)',
            'Idioma (Otros Títulos)',
            'Canal / Plataforma / Sala',
            'Fecha'
        ];
        
        ws_data.push(headers);
        
        // Si hay bloques de episodios, generar una fila por episodio
        if (datos.bloquesEpisodios.length > 0) {
            datos.bloquesEpisodios.forEach(bloque => {
                const desde = parseInt(bloque.desdeEpisodio) || 1;
                const hasta = parseInt(bloque.hastaEpisodio) || 1;
                
                // Generar una fila por cada episodio en el rango
                for (let i = desde; i <= hasta; i++) {
                    // Si hay líneas, crear una fila por línea
                    if (bloque.lineas.length > 0) {
                        bloque.lineas.forEach(linea => {
                            const row = [
                                datos.datosGenerales.tituloOriginal,
                                datos.datosGenerales.tipoFormato,
                                datos.datosGenerales.empresaProductora,
                                datos.datosGenerales.paisProduccion,
                                datos.datosGenerales.anioProduccion,
                                datos.datosGenerales.idioma,
                                bloque.temporada,
                                i, // Número de episodio
                                bloque.actores,
                                linea.roles.join(', '),
                                linea.directores.join(', '),
                                linea.guionistas.join(', '),
                                linea.porcentaje ? `${linea.porcentaje}%` : '',
                                '', // Otros títulos
                                '', // País (otros títulos)
                                '', // Idioma (otros títulos)
                                '', // Canal/Plataforma/Sala
                                ''  // Fecha
                            ];
                            
                            ws_data.push(row);
                        });
                    } else {
                        // Si no hay líneas, crear una sola fila para el episodio
                        const row = [
                            datos.datosGenerales.tituloOriginal,
                            datos.datosGenerales.tipoFormato,
                            datos.datosGenerales.empresaProductora,
                            datos.datosGenerales.paisProduccion,
                            datos.datosGenerales.anioProduccion,
                            datos.datosGenerales.idioma,
                            bloque.temporada,
                            i, // Número de episodio
                            bloque.actores,
                            '', // Roles
                            '', // Directores
                            '', // Guionistas
                            '', // Porcentaje
                            '', // Otros títulos
                            '', // País (otros títulos)
                            '', // Idioma (otros títulos)
                            '', // Canal/Plataforma/Sala
                            ''  // Fecha
                        ];
                        
                        ws_data.push(row);
                    }
                }
            });
        } else {
            // Si no hay bloques de episodios, crear una sola fila con los datos generales
            const row = [
                datos.datosGenerales.tituloOriginal,
                datos.datosGenerales.tipoFormato,
                datos.datosGenerales.empresaProductora,
                datos.datosGenerales.paisProduccion,
                datos.datosGenerales.anioProduccion,
                datos.datosGenerales.idioma,
                '', // Temporada
                '', // Episodio
                '', // Actores
                '', // Roles
                '', // Directores
                '', // Guionistas
                '', // Porcentaje
                '', // Otros títulos
                '', // País (otros títulos)
                '', // Idioma (otros títulos)
                '', // Canal/Plataforma/Sala
                ''  // Fecha
            ];
            
            ws_data.push(row);
        }
        
        // Agregar otros títulos como filas adicionales
        if (datos.otrosTitulos.length > 0) {
            datos.otrosTitulos.forEach(titulo => {
                const row = [
                    datos.datosGenerales.tituloOriginal,
                    datos.datosGenerales.tipoFormato,
                    datos.datosGenerales.empresaProductora,
                    datos.datosGenerales.paisProduccion,
                    datos.datosGenerales.anioProduccion,
                    datos.datosGenerales.idioma,
                    '', // Temporada
                    '', // Episodio
                    '', // Actores
                    '', // Roles
                    '', // Directores
                    '', // Guionistas
                    '', // Porcentaje
                    titulo.titulo,
                    titulo.pais.join(', '),
                    titulo.idioma.join(', '),
                    titulo.canal,
                    titulo.fecha
                ];
                
                ws_data.push(row);
            });
        }
        
        // Crear la hoja de cálculo
        const ws = XLSX.utils.aoa_to_sheet(ws_data);
        
        // Ajustar el ancho de las columnas
        const wscols = [
            { wch: 25 }, // Título Original
            { wch: 20 }, // Tipo de Formato
            { wch: 25 }, // Empresa Productora
            { wch: 20 }, // País de Producción
            { wch: 15 }, // Año de Producción
            { wch: 15 }, // Idioma
            { wch: 15 }, // Temporada
            { wch: 10 }, // Episodio
            { wch: 30 }, // Actores
            { wch: 25 }, // Roles
            { wch: 25 }, // Directores
            { wch: 25 }, // Guionistas
            { wch: 20 }, // Porcentaje
            { wch: 25 }, // Otros Títulos
            { wch: 20 }, // País (Otros Títulos)
            { wch: 20 }, // Idioma (Otros Títulos)
            { wch: 20 }, // Canal / Plataforma / Sala
            { wch: 15 }  // Fecha
        ];
        ws['!cols'] = wscols;
        
        // Agregar la hoja al libro
        XLSX.utils.book_append_sheet(wb, ws, 'Declaración Obra');
        
        // Generar el archivo Excel y descargarlo
        XLSX.writeFile(wb, 'declaracion_obra.xlsx');
        
        // Mostrar mensaje de éxito
        alert('El archivo Excel se ha generado correctamente.');
    }
    
    // Cargar datos iniciales (países, idiomas, etc.)
    cargarDatosIniciales();
});

// Función para cargar datos iniciales
function cargarDatosIniciales() {
    // Lista de países (ejemplo)
    const paises = [
        'Argentina', 'Brasil', 'Chile', 'Colombia', 'Costa Rica', 'Cuba', 
        'Ecuador', 'El Salvador', 'España', 'Estados Unidos', 'Guatemala', 
        'Honduras', 'México', 'Nicaragua', 'Panamá', 'Paraguay', 'Perú', 
        'Puerto Rico', 'República Dominicana', 'Uruguay', 'Venezuela'
    ];
    
    // Lista de idiomas (ejemplo)
    const idiomas = [
        'Español', 'Inglés', 'Portugués', 'Francés', 'Alemán', 'Italiano', 
        'Catalán', 'Euskera', 'Gallego', 'Quechua', 'Guaraní', 'Maya', 
        'Náhuatl', 'Aimara', 'Mapudungun'
    ];
    
    // Lista de roles (ejemplo)
    const roles = [
        'Actor principal', 'Actor de reparto', 'Actor de doblaje', 'Actor de voz',
        'Director', 'Director de fotografía', 'Director de arte', 'Director de casting',
        'Guionista', 'Diseñador de producción', 'Editor', 'Músico', 'Compositor',
        'Productor', 'Productor ejecutivo', 'Diseñador de vestuario', 'Maquillador',
        'Peluquero', 'Efectos visuales', 'Efectos especiales', 'Stunt', 'Doble'
    ];
    
    // Llenar select de países
    const selectPaises = document.getElementById('paisProduccion');
    paises.forEach(pais => {
        const option = document.createElement('option');
        option.value = pais;
        option.textContent = pais;
        selectPaises.appendChild(option);
    });
    
    // Llenar select de idiomas
    const selectIdiomas = document.getElementById('idioma');
    idiomas.forEach(idioma => {
        const option = document.createElement('option');
        option.value = idioma;
        option.textContent = idioma;
        selectIdiomas.appendChild(option);
    });
    
    // Inicializar Select2 después de agregar las opciones
    $(document).ready(function() {
        $('.select2').select2({
            width: '100%',
            placeholder: 'Seleccione una opción',
            allowClear: true,
            tags: true
        });
    });
}

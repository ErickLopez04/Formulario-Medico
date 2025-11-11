// Datos del formulario
let currentRecord = {
    datosPersonales: {},
    familiares: [],
    condicionesSalud: [],
    internamientos: []
};

let records = [];
let currentPage = 1;

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    loadRecords();
    updateNavigation();
});

// Navegación
function nextPage() {
    if (validateCurrentPage()) {
        if (currentPage < 5) {
            currentPage++;
            showPage(currentPage);
            updateNavigation();
        }
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        showPage(currentPage);
        updateNavigation();
    }
}

function showPage(pageNumber) {
    document.querySelectorAll('.form-page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(`page-${pageNumber}`).classList.add('active');
    
    // Actualizar barra de progreso
    document.querySelectorAll('.progress-step').forEach(step => {
        const stepNum = parseInt(step.getAttribute('data-step'));
        step.classList.toggle('active', stepNum === pageNumber);
    });
}

function updateNavigation() {
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const btnSave = document.getElementById('btn-save');
    
    btnPrev.style.display = currentPage > 1 ? 'block' : 'none';
    btnNext.style.display = currentPage < 5 ? 'block' : 'none';
    btnSave.style.display = currentPage === 5 ? 'block' : 'none';
    
    if (currentPage === 5) {
        generateResumen();
    }
}

// Validación
function validateCurrentPage() {
    switch(currentPage) {
        case 1:
            const form = document.getElementById('personal-form');
            if (!form.checkValidity()) {
                alert('Complete todos los campos obligatorios');
                return false;
            }
            return true;
        case 2:
            if (currentRecord.familiares.length === 0) {
                alert('Agregue al menos un familiar');
                return false;
            }
            return true;
        case 3:
            if (currentRecord.condicionesSalud.length === 0) {
                alert('Agregue al menos una condición de salud');
                return false;
            }
            return true;
        case 4:
            if (currentRecord.internamientos.length === 0) {
                alert('Agregue al menos un internamiento');
                return false;
            }
            return true;
        default:
            return true;
    }
}

// Modal Functions
function showFamiliarModal(familiar = null, index = null) {
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <h3>${familiar ? 'Editar' : 'Agregar'} Familiar</h3>
        <form class="modal-form" onsubmit="saveFamiliar(event, ${index})">
            <div class="form-group">
                <label>Nombre *</label>
                <input type="text" id="familiar-nombre" value="${familiar ? familiar.nombre : ''}" required>
            </div>
            <div class="form-group">
                <label>Parentesco *</label>
                <input type="text" id="familiar-parentesco" value="${familiar ? familiar.parentesco : ''}" required>
            </div>
            <div class="form-group">
                <label>Edad *</label>
                <input type="number" id="familiar-edad" value="${familiar ? familiar.edad : ''}" required>
            </div>
            <button type="submit" class="btn-primary">Guardar</button>
        </form>
    `;
    document.getElementById('modal').style.display = 'block';
}

function showCondicionModal(condicion = null, index = null) {
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <h3>${condicion ? 'Editar' : 'Agregar'} Condición</h3>
        <form class="modal-form" onsubmit="saveCondicion(event, ${index})">
            <div class="form-group">
                <label>Enfermedad *</label>
                <input type="text" id="condicion-enfermedad" value="${condicion ? condicion.enfermedad : ''}" required>
            </div>
            <div class="form-group">
                <label>Tiempo *</label>
                <input type="text" id="condicion-tiempo" value="${condicion ? condicion.tiempo : ''}" required>
            </div>
            <div class="form-group">
                <label>Detalles</label>
                <textarea id="condicion-detalles">${condicion ? condicion.detalles || '' : ''}</textarea>
            </div>
            <button type="submit" class="btn-primary">Guardar</button>
        </form>
    `;
    document.getElementById('modal').style.display = 'block';
}

function showInternamientoModal(internamiento = null, index = null) {
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <h3>${internamiento ? 'Editar' : 'Agregar'} Internamiento</h3>
        <form class="modal-form" onsubmit="saveInternamiento(event, ${index})">
            <div class="form-group">
                <label>Fecha *</label>
                <input type="date" id="internamiento-fecha" value="${internamiento ? internamiento.fecha : ''}" required>
            </div>
            <div class="form-group">
                <label>Centro Médico *</label>
                <input type="text" id="internamiento-centro" value="${internamiento ? internamiento.centro : ''}" required>
            </div>
            <div class="form-group">
                <label>Diagnóstico *</label>
                <textarea id="internamiento-diagnostico" required>${internamiento ? internamiento.diagnostico : ''}</textarea>
            </div>
            <button type="submit" class="btn-primary">Guardar</button>
        </form>
    `;
    document.getElementById('modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Guardar datos modales
function saveFamiliar(event, index = null) {
    event.preventDefault();
    const familiar = {
        nombre: document.getElementById('familiar-nombre').value,
        parentesco: document.getElementById('familiar-parentesco').value,
        edad: document.getElementById('familiar-edad').value
    };
    
    if (index !== null) {
        currentRecord.familiares[index] = familiar;
    } else {
        currentRecord.familiares.push(familiar);
    }
    
    renderFamiliares();
    closeModal();
}

function saveCondicion(event, index = null) {
    event.preventDefault();
    const condicion = {
        enfermedad: document.getElementById('condicion-enfermedad').value,
        tiempo: document.getElementById('condicion-tiempo').value,
        detalles: document.getElementById('condicion-detalles').value
    };
    
    if (index !== null) {
        currentRecord.condicionesSalud[index] = condicion;
    } else {
        currentRecord.condicionesSalud.push(condicion);
    }
    
    renderCondiciones();
    closeModal();
}

function saveInternamiento(event, index = null) {
    event.preventDefault();
    const internamiento = {
        fecha: document.getElementById('internamiento-fecha').value,
        centro: document.getElementById('internamiento-centro').value,
        diagnostico: document.getElementById('internamiento-diagnostico').value
    };
    
    if (index !== null) {
        currentRecord.internamientos[index] = internamiento;
    } else {
        currentRecord.internamientos.push(internamiento);
    }
    
    renderInternamientos();
    closeModal();
}

// Renderizar listas
function renderFamiliares() {
    const container = document.getElementById('familiares-list');
    if (currentRecord.familiares.length === 0) {
        container.innerHTML = '<p class="empty-message">No hay familiares agregados</p>';
        return;
    }
    
    container.innerHTML = currentRecord.familiares.map((familiar, index) => `
        <div class="item-card">
            <div class="item-info">
                <h4>${familiar.nombre}</h4>
                <p>${familiar.parentesco} - ${familiar.edad} años</p>
            </div>
            <div class="item-actions">
                <button class="btn-edit" onclick="showFamiliarModal(${JSON.stringify(familiar).replace(/"/g, '&quot;')}, ${index})">Editar</button>
                <button class="btn-delete" onclick="deleteFamiliar(${index})">Eliminar</button>
            </div>
        </div>
    `).join('');
}

function renderCondiciones() {
    const container = document.getElementById('condiciones-list');
    if (currentRecord.condicionesSalud.length === 0) {
        container.innerHTML = '<p class="empty-message">No hay condiciones agregadas</p>';
        return;
    }
    
    container.innerHTML = currentRecord.condicionesSalud.map((condicion, index) => `
        <div class="item-card">
            <div class="item-info">
                <h4>${condicion.enfermedad}</h4>
                <p>${condicion.tiempo}</p>
                ${condicion.detalles ? `<p><small>${condicion.detalles}</small></p>` : ''}
            </div>
            <div class="item-actions">
                <button class="btn-edit" onclick="showCondicionModal(${JSON.stringify(condicion).replace(/"/g, '&quot;')}, ${index})">Editar</button>
                <button class="btn-delete" onclick="deleteCondicion(${index})">Eliminar</button>
            </div>
        </div>
    `).join('');
}

function renderInternamientos() {
    const container = document.getElementById('internamientos-list');
    if (currentRecord.internamientos.length === 0) {
        container.innerHTML = '<p class="empty-message">No hay internamientos agregados</p>';
        return;
    }
    
    container.innerHTML = currentRecord.internamientos.map((internamiento, index) => `
        <div class="item-card">
            <div class="item-info">
                <h4>${formatDate(internamiento.fecha)} - ${internamiento.centro}</h4>
                <p>${internamiento.diagnostico}</p>
            </div>
            <div class="item-actions">
                <button class="btn-edit" onclick="showInternamientoModal(${JSON.stringify(internamiento).replace(/"/g, '&quot;')}, ${index})">Editar</button>
                <button class="btn-delete" onclick="deleteInternamiento(${index})">Eliminar</button>
            </div>
        </div>
    `).join('');
}

// Eliminar elementos
function deleteFamiliar(index) {
    if (confirm('¿Eliminar este familiar?')) {
        currentRecord.familiares.splice(index, 1);
        renderFamiliares();
    }
}

function deleteCondicion(index) {
    if (confirm('¿Eliminar esta condición?')) {
        currentRecord.condicionesSalud.splice(index, 1);
        renderCondiciones();
    }
}

function deleteInternamiento(index) {
    if (confirm('¿Eliminar este internamiento?')) {
        currentRecord.internamientos.splice(index, 1);
        renderInternamientos();
    }
}

// Resumen
function generateResumen() {
    // Guardar datos personales
    const formData = new FormData(document.getElementById('personal-form'));
    currentRecord.datosPersonales = Object.fromEntries(formData);
    
    const container = document.getElementById('resumen-content');
    container.innerHTML = `
        <div class="resumen-section">
            <h3>Datos Personales</h3>
            <div class="resumen-item">
                <p><strong>Nombre:</strong> ${currentRecord.datosPersonales.nombres} ${currentRecord.datosPersonales.apellidos}</p>
                <p><strong>Cédula:</strong> ${currentRecord.datosPersonales.cedula}</p>
                <p><strong>Fecha Nacimiento:</strong> ${formatDate(currentRecord.datosPersonales.fechaNacimiento)}</p>
                <p><strong>Teléfono:</strong> ${currentRecord.datosPersonales.telefono}</p>
            </div>
        </div>
        
        <div class="resumen-section">
            <h3>Familiares (${currentRecord.familiares.length})</h3>
            ${currentRecord.familiares.map(f => `
                <div class="resumen-item">
                    <p><strong>${f.nombre}</strong> - ${f.parentesco} - ${f.edad} años</p>
                </div>
            `).join('')}
        </div>
        
        <div class="resumen-section">
            <h3>Condiciones de Salud (${currentRecord.condicionesSalud.length})</h3>
            ${currentRecord.condicionesSalud.map(c => `
                <div class="resumen-item">
                    <p><strong>${c.enfermedad}</strong> - ${c.tiempo}</p>
                    ${c.detalles ? `<p><em>${c.detalles}</em></p>` : ''}
                </div>
            `).join('')}
        </div>
        
        <div class="resumen-section">
            <h3>Internamientos (${currentRecord.internamientos.length})</h3>
            ${currentRecord.internamientos.map(i => `
                <div class="resumen-item">
                    <p><strong>${formatDate(i.fecha)}</strong> - ${i.centro}</p>
                    <p>Diagnóstico: ${i.diagnostico}</p>
                </div>
            `).join('')}
        </div>
    `;
}

// Guardar registro
function saveRecord() {
    const formData = new FormData(document.getElementById('personal-form'));
    currentRecord.datosPersonales = Object.fromEntries(formData);
    
    // Crear registro completo
    const record = {
        id: Date.now(),
        fecha: new Date().toISOString(),
        ...currentRecord
    };
    
    records.push(record);
    localStorage.setItem('medicalRecords', JSON.stringify(records));
    
    // Resetear formulario
    resetForm();
    loadRecords();
    alert('Registro guardado exitosamente');
}

// Cargar registros
function loadRecords() {
    const saved = localStorage.getItem('medicalRecords');
    if (saved) {
        records = JSON.parse(saved);
        renderRecordsList();
    }
}

function renderRecordsList() {
    const container = document.getElementById('records-list');
    if (records.length === 0) {
        container.innerHTML = '<p class="empty-message">No hay registros guardados</p>';
        return;
    }
    
    container.innerHTML = records.map(record => `
        <div class="record-item" onclick="loadRecord(${record.id})">
            <strong>${record.datosPersonales.nombres} ${record.datosPersonales.apellidos}</strong>
            <br>
            <small>Cédula: ${record.datosPersonales.cedula}</small>
        </div>
    `).join('');
}

function loadRecord(id) {
    const record = records.find(r => r.id === id);
    if (record) {
        currentRecord = {
            datosPersonales: record.datosPersonales,
            familiares: record.familiares,
            condicionesSalud: record.condicionesSalud,
            internamientos: record.internamientos
        };
        
        // Llenar formulario
        document.getElementById('nombres').value = record.datosPersonales.nombres || '';
        document.getElementById('apellidos').value = record.datosPersonales.apellidos || '';
        document.getElementById('cedula').value = record.datosPersonales.cedula || '';
        document.getElementById('fecha-nacimiento').value = record.datosPersonales.fechaNacimiento || '';
        document.getElementById('telefono').value = record.datosPersonales.telefono || '';
        
        renderFamiliares();
        renderCondiciones();
        renderInternamientos();
        
        currentPage = 1;
        showPage(currentPage);
        updateNavigation();
    }
}

function resetForm() {
    document.getElementById('personal-form').reset();
    currentRecord = {
        datosPersonales: {},
        familiares: [],
        condicionesSalud: [],
        internamientos: []
    };
    renderFamiliares();
    renderCondiciones();
    renderInternamientos();
    currentPage = 1;
    showPage(currentPage);
    updateNavigation();
}

// Utilidades
function formatDate(dateString) {
    if (!dateString) return 'No especificada';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
}
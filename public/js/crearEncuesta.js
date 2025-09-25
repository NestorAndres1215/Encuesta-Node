let preguntas = [];
let opcionesTemp = [];

// Elementos DOM
const modalPregunta = document.getElementById("modalPregunta");
const preguntasContainer = document.getElementById("preguntas");
const noPreguntas = document.getElementById("noPreguntas");
const opcionesContainer = document.getElementById("opcionesContainer");
const preguntasInput = document.getElementById("preguntasInput");

// Funciones
function abrirModalPregunta() {
  document.getElementById("textoPregunta").value = "";
  opcionesTemp = [];
  renderizarOpciones();
  modalPregunta.classList.add("show");
}

function cerrarModalPregunta() {
  modalPregunta.classList.remove("show");
}

function agregarOpcion() {
  opcionesTemp.push({
    texto: "",
    es_correcta: false,
  });
  renderizarOpciones();
}

function renderizarOpciones() {
  opcionesContainer.innerHTML = "";

  if (opcionesTemp.length === 0) {
    opcionesContainer.innerHTML =
      "<p>No hay opciones. Agrega al menos una opción.</p>";
    return;
  }

  opcionesTemp.forEach((opcion, index) => {
    const opcionRow = document.createElement("div");
    opcionRow.className = "opcion-row";

    const inputGroup = document.createElement("div");
    inputGroup.className = "form-group opcion-input";

    const input = document.createElement("input");
    input.className = "form-control";
    input.type = "text";
    input.value = opcion.texto;
    input.placeholder = `Opción ${index + 1}`;
    input.onchange = (e) => {
      opcionesTemp[index].texto = e.target.value;
    };

    inputGroup.appendChild(input);
    opcionRow.appendChild(inputGroup);

    const radioLabel = document.createElement("label");
    radioLabel.style.display = "flex";
    radioLabel.style.alignItems = "center";

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "opcionCorrecta";
    radio.checked = opcion.es_correcta;
    radio.onchange = () => {
      opcionesTemp.forEach((op, i) => {
        op.es_correcta = i === index;
      });
    };

    const radioText = document.createTextNode(" Correcta");

    radioLabel.appendChild(radio);
    radioLabel.appendChild(radioText);
    opcionRow.appendChild(radioLabel);

    const btnEliminar = document.createElement("button");
    btnEliminar.className = "btn btn-danger";
    btnEliminar.style.marginLeft = "8px";
    btnEliminar.innerHTML = '<i class="fas fa-trash"></i>';
    btnEliminar.type = "button";
    btnEliminar.onclick = () => {
      opcionesTemp.splice(index, 1);
      renderizarOpciones();
    };

    opcionRow.appendChild(btnEliminar);
    opcionesContainer.appendChild(opcionRow);
  });
}

function guardarPregunta() {
  const textoPregunta = document.getElementById("textoPregunta").value;

  if (!textoPregunta) {
    alert("Por favor, ingresa el texto de la pregunta.");
    return;
  }

  if (opcionesTemp.length === 0) {
    alert("Por favor, agrega al menos una opción.");
    return;
  }

  const opcionesValidas = opcionesTemp.filter((op) => op.texto.trim() !== "");
  if (opcionesValidas.length === 0) {
    alert("Por favor, ingresa texto para al menos una opción.");
    return;
  }

  const tieneOpcionCorrecta = opcionesTemp.some((op) => op.es_correcta);
  if (!tieneOpcionCorrecta) {
    alert("Por favor, selecciona una opción correcta.");
    return;
  }

  // Filtrar opciones vacías
  const opcionesFiltradas = opcionesTemp.filter((op) => op.texto.trim() !== "");

  preguntas.push({
    texto: textoPregunta,
    opciones: opcionesFiltradas,
  });

  cerrarModalPregunta();
  renderizarPreguntas();
}

function renderizarPreguntas() {
  if (preguntas.length === 0) {
    noPreguntas.style.display = "block";
    preguntasInput.value = JSON.stringify([]);
    return;
  }

  noPreguntas.style.display = "none";
  preguntasContainer.innerHTML = "";

  preguntas.forEach((pregunta, index) => {
    const preguntaCard = document.createElement("div");
    preguntaCard.className = "pregunta-card fade-in";

    const preguntaHeader = document.createElement("div");
    preguntaHeader.className = "pregunta-header";

    const preguntaTitulo = document.createElement("div");
    preguntaTitulo.className = "pregunta-titulo";
    preguntaTitulo.textContent = `${index + 1}. ${pregunta.texto}`;

    const preguntaAcciones = document.createElement("div");
    preguntaAcciones.className = "pregunta-acciones";

    const btnEliminar = document.createElement("button");
    btnEliminar.className = "btn btn-danger";
    btnEliminar.innerHTML = '<i class="fas fa-trash"></i>';
    btnEliminar.title = "Eliminar pregunta";
    btnEliminar.type = "button";
    btnEliminar.onclick = () => eliminarPregunta(index);

    preguntaAcciones.appendChild(btnEliminar);
    preguntaHeader.appendChild(preguntaTitulo);
    preguntaHeader.appendChild(preguntaAcciones);
    preguntaCard.appendChild(preguntaHeader);

    const opcionesList = document.createElement("div");
    opcionesList.className = "opciones-list";

    pregunta.opciones.forEach((opcion) => {
      const opcionItem = document.createElement("div");
      opcionItem.className = `opcion-item ${
        opcion.es_correcta ? "correcta" : ""
      }`;

      const opcionTexto = document.createElement("div");
      opcionTexto.className = "opcion-texto";
      opcionTexto.textContent = opcion.texto;

      opcionItem.appendChild(opcionTexto);

      if (opcion.es_correcta) {
        const badge = document.createElement("span");
        badge.className = "badge-correcta";
        badge.innerHTML = '<i class="fas fa-check"></i> Correcta';
        opcionItem.appendChild(badge);
      }

      opcionesList.appendChild(opcionItem);
    });

    preguntaCard.appendChild(opcionesList);
    preguntasContainer.appendChild(preguntaCard);
  });

  // Actualizar campo hidden con las preguntas en formato JSON
  preguntasInput.value = JSON.stringify(preguntas);
}

function eliminarPregunta(index) {
  const card = document.querySelectorAll(".pregunta-card")[index];
  card.classList.add("fade-out");

  setTimeout(() => {
    preguntas.splice(index, 1);
    renderizarPreguntas();
  }, 300);
}

// Inicializar
renderizarPreguntas();
renderizarOpciones();

// Validar formulario antes de enviar
document
  .getElementById("formEncuesta")
  .addEventListener("submit", function (e) {
    if (preguntas.length === 0) {
      e.preventDefault();
      alert("Por favor, agrega al menos una pregunta a la encuesta.");
    }
  });

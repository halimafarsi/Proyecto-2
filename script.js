let preguntas = [];
let indicePreguntaActual = 0;
let temporizadorJuego;
let temporizadorExplicacion;
let temporizadorContador;
let categoriaSeleccionada = "";
let subcategoriaSeleccionada = "";
let puntuacion = 0;
let tiempoRestante = 10; // Tiempo en segundos para ver la respuesta y la explicación

// Función para seleccionar categoría
function seleccionarCategoria(categoria) {
    categoriaSeleccionada = categoria;
    document.getElementById('categoria-seleccion').style.display = 'none';
    document.getElementById('subcategoria-seleccion').style.display = 'block';
}

// Función para seleccionar subcategoría
function seleccionarSubcategoria(subcategoria) {
    subcategoriaSeleccionada = subcategoria;
    cargarPreguntas();
}

// Función para cargar preguntas desde el archivo JSON correspondiente
function cargarPreguntas() {
    fetch(`${categoriaSeleccionada}.json`)
        .then(response => response.json())
        .then(data => {
            preguntas = data[subcategoriaSeleccionada];
            mostrarRespuestasPrevias();
        });
}

// Función para mostrar todas las respuestas antes de comenzar
function mostrarRespuestasPrevias() {
    let respuestas = preguntas.map(p => p.answer).join(', ');
    document.getElementById('juego').style.display = 'block';
    document.getElementById('pregunta').innerText = "Revisa estos conceptos antes de empezar:";
    document.getElementById('resultado').innerText = respuestas;
    document.getElementById('explicacion').innerText = '';
    
    temporizadorJuego = setTimeout(empezarJuego, 30000); // Espera 30 segundos antes de comenzar
}

// Función para comenzar el juego
function empezarJuego() {
    document.getElementById('pregunta').innerText = preguntas[indicePreguntaActual].question;
    document.getElementById('resultado').innerText = '';
    document.getElementById('respuesta-input').value = '';
    document.getElementById('respuesta-input').focus();
    
    tiempoRestante = 10; // Reiniciar el tiempo
    actualizarContador();

    clearTimeout(temporizadorJuego); // Limpia el temporizador de respuestas previas
}

// Función para validar respuesta
function validarRespuesta() {
    let respuestaJugador = document.getElementById('respuesta-input').value;
    let respuestaCorrecta = preguntas[indicePreguntaActual].answer;
    let explicacion = preguntas[indicePreguntaActual].explicacion;

    if (respuestaJugador.trim().toLowerCase() === respuestaCorrecta.toLowerCase()) {
        document.getElementById('resultado').innerText = "¡Correcto!";
        puntuacion++;
        document.getElementById('score').innerText = `Puntuación: ${puntuacion}`;
        setTimeout(cargarSiguientePregunta, 10000); // 10 segundos para mostrar el resultado correcto
    } else {
        document.getElementById('resultado').innerText = `Incorrecto. La respuesta correcta es: ${respuestaCorrecta}`;
        if (explicacion) {
            document.getElementById('explicacion').innerText = `Explicación: ${explicacion}`;
        }
        temporizadorExplicacion = setTimeout(cargarSiguientePregunta, 10000); // 10 segundos para mostrar la explicación
    }
}

// Función para cargar la siguiente pregunta
function cargarSiguientePregunta() {
    clearTimeout(temporizadorExplicacion); // Limpia el temporizador de explicación
    indicePreguntaActual++;
    if (indicePreguntaActual < preguntas.length) {
        empezarJuego();
    } else {
        mostrarResultadoFinal();
    }
}

// Función para mostrar el resultado final
function mostrarResultadoFinal() {
    document.getElementById('juego').style.display = 'none';
    document.getElementById('resultado-final').style.display = 'block';
    document.getElementById('final-score').innerText = `Puntuación Final: ${puntuacion}`;
}

// Función para reiniciar el juego
function reiniciarJuego() {
    puntuacion = 0;
    indicePreguntaActual = 0;
    document.getElementById('categoria-seleccion').style.display = 'block';
    document.getElementById('subcategoria-seleccion').style.display = 'none';
    document.getElementById('juego').style.display = 'none';
    document.getElementById('resultado-final').style.display = 'none';
    clearTimeout(temporizadorJuego);
    clearTimeout(temporizadorExplicacion);
    clearTimeout(temporizadorContador);
}

// Función para actualizar la barra de progreso del temporizador
function actualizarContador() {
    let barra = document.getElementById('contador');
    let tiempoDisplay = document.getElementById('tiempo-restante');
    
    let interval = setInterval(() => {
        if (tiempoRestante <= 0) {
            clearInterval(interval);
            if (indicePreguntaActual < preguntas.length) {
                cargarSiguientePregunta();
            }
        } else {
            tiempoDisplay.innerText = `Tiempo restante: ${tiempoRestante}s`;
            barra.style.width = `${(tiempoRestante / 10) * 100}%`;
            tiempoRestante--;
        }
    }, 1000);
}

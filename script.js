// VARIABLES
var hayPartidaComenzada = false;

var COLORES = ["rgb(255, 0, 0)",
    "rgb(0, 128, 0)",
    "rgb(255, 255, 0)",
    "rgb(0, 0, 255)",
    "rgb(128, 0, 128)",
    "rgb(255, 192, 203)",
    "rgb(255, 165, 0)",
    "rgb(165, 91, 42)"];
var COLORES_POR_RONDA = [];
var SECUENCIA_COLORES = [];

var RONDAS_TOTALES = 12;

var clicksRonda = [];
var rondasCompletas = 0;
var rondaComenzada = false;
var rondaTerminada = false;
var mensajeActivo = false;
var clicksEnTexto = 0;
var pantalla = document.getElementById('pantalla');
var coloresClickeados = document.querySelectorAll(".color");
var botonComenzarPartida = document.getElementById('empezar');

// MÉTODOS
// 1. Funciones
function func() 
{  
  return 0.5 - Math.random();
};

function ActualizarNumeroClicks()
{
    clicksEnTexto++;
    document.getElementById('numeroclicks').textContent = `${clicksEnTexto}`;
};

function restaurarElementosRonda() 
{
    SECUENCIA_COLORES = [];
    clicksRonda = [];
    rondaTerminada = false;

    clicksEnTexto = 0;
    document.body.removeChild(document.getElementById('ventanaclicks'));
};

function generarSecuenciaColores() 
{
    rondasCompletas++;
    COLORES_POR_RONDA.push(rondasCompletas);
    COLORES = COLORES.sort(func);
    for (i = 0; i < COLORES_POR_RONDA[rondasCompletas - 1]; i++) {
        SECUENCIA_COLORES.push(COLORES[i]);
    }
};

function mostrarNombreColor(nombreColor) {
    switch (nombreColor)
    {
        case "rgb(255, 0, 0)":
            pantalla.textContent = "ROJO";
            break;
        case "rgb(0, 128, 0)":
            pantalla.textContent = "VERDE";
            break;
        case "rgb(255, 255, 0)":
            pantalla.textContent = "AMARILLO";
            break;
        case "rgb(0, 0, 255)":
            pantalla.textContent = "AZUL";
            break;
        case "rgb(128, 0, 128)":
            pantalla.textContent = "MORADO";
            break;
        case "rgb(255, 192, 203)":
            pantalla.textContent = "ROSA";
            break;
        case "rgb(255, 165, 0)":
            pantalla.textContent = "NARANJA";
            break;
        case "rgb(165, 91, 42)":
            pantalla.textContent = "MARRON";
            break;
        case "gray":
            pantalla.textContent = "";
            break;
    }
};

function mostrarColoresPantalla() 
{
    contador = 0;
    rondaComenzada = false;

    intervaloColoresPantalla = setInterval(() => {
        contador++;
        pantalla.style.backgroundColor = `${SECUENCIA_COLORES[contador - 1]}`;
        mostrarNombreColor(`${SECUENCIA_COLORES[contador - 1]}`);

        if (contador >= SECUENCIA_COLORES.length) {
            clearInterval(intervaloColoresPantalla);

            setTimeout(() => {
                rondaComenzada = true;
                CrearMensajeFlotante("gold", `RONDA ${rondasCompletas} HA COMENZADO`, 1);
                pantalla.style.backgroundColor = "gray";
                mostrarNombreColor("gray");
            }, 1000);
        }
    }, 1000);
};

function detectarClicksColores(colorTocado) 
{
    if (clicksRonda.length == SECUENCIA_COLORES.length - 1) {
        ActualizarNumeroClicks();
        clicksRonda.push(colorTocado);
        rondaTerminada = true;

        correcto = (arr1, arr2) => { return JSON.stringify(arr1) === JSON.stringify(arr2); };

        if (correcto(clicksRonda, SECUENCIA_COLORES)) {
            CrearMensajeFlotante("green", "RONDA COMPLETADA", 1);
            setTimeout(() => {
                restaurarElementosRonda();
                generarRonda();
            }, 1000)
            return;
        }
        
        if (!correcto(clicksRonda, SECUENCIA_COLORES)) {
            CrearMensajeFlotante("red", "HAS FALLADO", 1);

            setTimeout(() => {
                // Restauración de variables
                hayPartidaComenzada = false;
                rondasCompletas = 0;
                COLORES_POR_RONDA = [];

                restaurarElementosRonda();
            }, 1000)
            return;
        }
        return;
    } 
    
    if (!rondaTerminada) {
        ActualizarNumeroClicks();
        clicksRonda.push(colorTocado);
        return;
    }
};

function generarRonda() 
{
    generarSecuenciaColores();
    mostrarColoresPantalla();
    CrearVentanaClicks();
};

// 2. Constructores
function CrearMensajeFlotante(color, texto, segundosVisible)
{
    // ENTRADA
    var ventana = document.createElement("div");
    ventana.setAttribute("class", "ventanaflotante");
    ventana.textContent = texto;
    ventana.style.textAlign = "center";
    ventana.style.fontSize = "20px";
    ventana.style.alignContent = "center";
    ventana.style.color = "black";
    ventana.style.backgroundColor = color;
    ventana.style.justifySelf = "center";
    ventana.style.bottom = "20px";
    ventana.style.right = "20px";
    ventana.style.borderStyle = "solid";
    ventana.style.borderColor = "black";
    ventana.style.borderWidth = "3px";
    ventana.style.borderRadius = "12px";
    ventana.style.width = "300px";
    ventana.style.height = "50px";
    ventana.style.position = "absolute";

    // PROCESO - SALIDA
    segundosVisible = segundosVisible * 1000;
    document.body.appendChild(ventana);

    setTimeout(() => {
        document.body.removeChild(ventana);
    }, segundosVisible);
};

function CrearMensajeClick(color, texto, segundosVisible)
{
    if (!mensajeActivo)
    {
        // VARIABLES
        mensajeActivo = true;

        // ENTRADA
        CrearMensajeFlotante(color, texto, segundosVisible);

        // PROCESO - SALIDA
        segundosVisible = segundosVisible * 1000;

        setTimeout(() => {
            mensajeActivo = false;
        }, segundosVisible + 200);
    }
}

function CrearVentanaClicks() {
    // ENTRADA
    var ventanaclicks = document.createElement("div");
    ventanaclicks.setAttribute("id", "ventanaclicks");
    ventanaclicks.style = 
    `justify-items: center;
    align-items: center;
    display: grid;
    grid-template-columns: 85px 20px;
    grid-template-rows: 40px;
    position: absolute;
    right: 10px;
    top: 10px;`;

    var numclicks = document.createElement("div");
    numclicks.setAttribute("id", "numeroclicks");
    numclicks.textContent = "0";
    numclicks.style = `font-size: 20px;`;

    var textoclicks = document.createElement("div");
    textoclicks.textContent = "CLICKS:";
    textoclicks.style = `font-size: 20px;`;

    // SALIDA
    document.body.appendChild(ventanaclicks);
    ventanaclicks.appendChild(textoclicks);
    ventanaclicks.appendChild(numclicks);
};

// DETECTORES DE EVENTOS
botonComenzarPartida.addEventListener("click", function() {
    if (!hayPartidaComenzada) {
        hayPartidaComenzada = true;
        CrearMensajeClick("gold", "GENERANDO PARTIDA...", 1);
        generarRonda();
    } else {
        CrearMensajeClick("gold", "SI HAY PARTIDA COMENZADA", 1);
    }
});

coloresClickeados.forEach((cc) => {
    cc.addEventListener("click", function() {
        if (!hayPartidaComenzada) {
            CrearMensajeClick("red", "NO HAY PARTIDA COMENZADA", 1);
            return;
        } 

        colorClickeado = window.getComputedStyle(cc).backgroundColor;

        if (rondaComenzada) {
            detectarClicksColores(colorClickeado);
        } else {
            CrearMensajeClick("red", "LA RONDA NO HA COMENZADO TODAVIA", 1);
        }
    });
});

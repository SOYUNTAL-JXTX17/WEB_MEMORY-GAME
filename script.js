// VARIABLES
var hayPartidaComenzada = false;

var COLORES = ["rgb(255, 0, 0)", "rgb(0, 128, 0)", "rgb(255, 255, 0)", "rgb(0, 0, 255)", "rgb(128, 0, 128)", "rgb(255, 192, 203)", "rgb(255, 165, 0)", "rgb(165, 42, 42)"];
var COLORES_POR_RONDA = [2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 8];
var SECUENCIA_COLORES = [];

var RONDAS_TOTALES = 12;

var clicksRonda = [];
var rondasCompletas = 0;
var rondaComenzada = false;
var rondaTerminada = false;
var mensajeActivo = false;
var clicksEnTexto = 0;

var pantallas = document.querySelectorAll(".pantalla");
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
    COLORES = COLORES.sort(func);
    for (i = 0; i < COLORES_POR_RONDA[rondasCompletas - 1]; i++) {
        SECUENCIA_COLORES.push(COLORES[i]);
    }
};

function mostrarColoresPantalla() 
{
    contador = 0;
    rondaComenzada = false;

    intervaloColoresPantalla = setInterval(() => {
        contador++;
        pantallas.forEach((pantallaColor) => {
            pantallaColor.style.backgroundColor = `${SECUENCIA_COLORES[contador - 1]}`;
        });

        if (contador >= SECUENCIA_COLORES.length) {
            clearInterval(intervaloColoresPantalla);

            setTimeout(() => {
                rondaComenzada = true;
                CrearMensajeFlotante("gold", `RONDA ${rondasCompletas} HA COMENZADO`, 1);
                pantallas.forEach((pantallaColor) => {
                    pantallaColor.style.backgroundColor = "gray";
                });
            }, 1000);
        }
    }, 1000);
};

function detectarClicksColores(colorTocado) 
{
    if (clicksRonda.length == SECUENCIA_COLORES.length - 1) {
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
            hayPartidaComenzada = false;
            rondasCompletas = 0;
            restaurarElementosRonda();
            return;
        }
        return;
    } 
    
    if (!rondaTerminada) {
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
    // VARIABLES
    if (!mensajeActivo)
    {
        segundosVisible = segundosVisible * 1000;
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
        ventana.style.bottom = "50px";
        ventana.style.borderStyle = "solid";
        ventana.style.borderColor = "black";
        ventana.style.borderWidth = "3px";
        ventana.style.borderRadius = "12px";
        ventana.style.width = "300px";
        ventana.style.height = "50px";
        ventana.style.position = "absolute";

        mensajeActivo = true;
        document.body.appendChild(ventana);

        setTimeout(() => {
            document.body.removeChild(ventana);

            setTimeout(() => {
                mensajeActivo = false;
            }, 200);
        }, segundosVisible);
    }
};

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
        generarRonda();
    } else {
        CrearMensajeFlotante("gold", "SI HAY PARTIDA COMENZADA", 1);
    }
});

coloresClickeados.forEach((cc) => {
    cc.addEventListener("click", function() {
        if (!hayPartidaComenzada) {
            CrearMensajeFlotante("red", "NO HAY PARTIDA COMENZADA", 1);
            return;
        } 

        colorClickeado = window.getComputedStyle(cc).backgroundColor;

        if (rondaComenzada) {
            detectarClicksColores(colorClickeado);
            ActualizarNumeroClicks();
        } else {
            CrearMensajeFlotante("red", "LA RONDA NO HA COMENZADO TODAVIA", 1);
        }
    });
});

// VARIABLES
hayPartidaComenzada = false;

COLORES = ["rgb(255, 0, 0)", "rgb(0, 128, 0)", "rgb(255, 255, 0)", "rgb(0, 0, 255)", "rgb(128, 0, 128)", "rgb(255, 192, 203)", "rgb(255, 165, 0)", "rgb(165, 42, 42)"];
COLORES_POR_RONDA = [2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 8];
SECUENCIA_COLORES = [];

RONDAS_TOTALES = 12;

clicksRonda = [];
rondasCompletas = 0;
rondaComenzada = false;
rondaTerminada = false;

pantallas = document.querySelectorAll(".pantalla");
coloresClickeados = document.querySelectorAll(".color");
botonComenzarPartida = document.getElementById('empezar');

// PROCESO
// 1. Funciones
function func() {  
  return 0.5 - Math.random();
};

function restaurarElementosRonda() {
    SECUENCIA_COLORES = [];
    clicksRonda = [];
    rondaTerminada = false;
}



function generarSecuenciaColores() {
    rondasCompletas++;
    COLORES = COLORES.sort(func);
    for (i = 0; i < COLORES_POR_RONDA[rondasCompletas - 1]; i++) {
        SECUENCIA_COLORES.push(COLORES[i]);
    }
};

function mostrarColoresPantalla() {
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
                console.log(`RONDA ${rondasCompletas} HA COMENZADO`);
                pantallas.forEach((pantallaColor) => {
                    pantallaColor.style.backgroundColor = "gray";
                });
            }, 1000);
        }
    }, 1000);
};

function detectarClicksColores(colorTocado) {
    if (clicksRonda.length == SECUENCIA_COLORES.length - 1) {
        clicksRonda.push(colorTocado);
        rondaTerminada = true;

        correcto = (arr1, arr2) => { return JSON.stringify(arr1) === JSON.stringify(arr2); };

        if (correcto(clicksRonda, SECUENCIA_COLORES)) {
            console.log("RONDA COMPLETADA");
            setTimeout(() => {
                restaurarElementosRonda();
                generarRonda();
            }, 1000)
            return;
        }
        
        if (!correcto(clicksRonda, SECUENCIA_COLORES)) {
            console.log("HAS FALLADO");
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

function generarRonda() {
    generarSecuenciaColores();
    mostrarColoresPantalla();
};

// 2. Detectores de acciones
botonComenzarPartida.addEventListener("click", function() {
    if (!hayPartidaComenzada) {
        hayPartidaComenzada = true;
        generarRonda();
    } else {
        console.log("SI HAY PARTIDA COMENZADA");
    }
});

coloresClickeados.forEach((cc) => {
    cc.addEventListener("click", function() {
        if (!hayPartidaComenzada) {
            console.log("NO HAY PARTIDA COMENZADA");
            return;
        } 

        colorClickeado = window.getComputedStyle(cc).backgroundColor;

        if (rondaComenzada) {
            detectarClicksColores(colorClickeado);
        } else {
            console.log("LA RONDA NO HA COMENZADO TODAVIA");
        }
    });
});
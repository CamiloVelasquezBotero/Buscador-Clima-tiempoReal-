const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima);
})


function buscarClima(e) {
    e.preventDefault();

    // Validar
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if(ciudad === '' || pais === '') {
        mostrarError('Todos los campos son obligatorios');
        
        return;
    }

    // Consultar en la API
    consultarAPI(ciudad, pais);
}

function consultarAPI(ciudad, pais) {
    const appID = '96b345f65201aa65a1c689e3910ae997';

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appID}`;

    Spinner(); // Colocamos un spinner de carga

    fetch(url)
        .then( respuesta => respuesta.json()) // Retornamos la respuesta en .json
        .then( datos => {
            limpiarHTML(); // Limpiamos el html, asi haya un error

            if(datos.cod === "404"){
                mostrarError('Ciudad no encontrada');
                return;
            }

            mostrarClima(datos);
        });
}

function mostrarClima(datos) {
    const { name, main: { temp, temp_max, temp_min}} = datos; // Hacemos un Destructuring dentro de otro destructuring

    const centigrados = kelvinACentigrados(temp); // Formula de grados kelvin a grados celcius
    const max = kelvinACentigrados(temp_max);
    const min = kelvinACentigrados(temp_min);

    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent = `Clima en ${name}`;
    nombreCiudad.classList.add('font-bold', 'text-2xl');

    const actual = document.createElement('p'); // Se crea el parrafo donde ira la temperatura actual
    actual.innerHTML = `${centigrados.toFixed(1)} &#8451;`;
    actual.classList.add('font-bold', 'text-6xl');

    const tempMaxima = document.createElement('p');
    tempMaxima.innerHTML = `Max: ${max.toFixed(1)} &#8451;`;
    tempMaxima.classList.add('text-xl');

    const tempMinima = document.createElement('p');
    tempMinima.innerHTML = `Min: ${min.toFixed(1)} &#8451;`;
    tempMinima.classList.add('text-xl');

    const resultadoDiv = document.createElement('div'); // Creamos el div para ponerle la temperatura actual
    resultadoDiv.classList.add('text-center', 'text-white'); // Le damos las clases de TailWind
    resultadoDiv.appendChild(nombreCiudad); // El bombre de la ciudad
    resultadoDiv.appendChild(actual); // Le agregamos la temperatura actual
    resultadoDiv.appendChild(tempMaxima);
    resultadoDiv.appendChild(tempMinima);

    resultado.appendChild(resultadoDiv);
}

const kelvinACentigrados = grados => grados - 273.15;

function mostrarError(mensaje) {
    const alerta = document.querySelector('.alerta');

    if(!alerta){ // Si no hay ninguna "Alerta" entonces la agregamos, para que no se repita
        console.log(mensaje);
    
        const alerta = document.createElement('div');
    
        alerta.classList.add('alerta','bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center');
    
        alerta.innerHTML = `
            <strong class=" font-bold">Error!</strong>
            <span class="block">${mensaje}</span>
        `;
    
        container.appendChild(alerta);

        setTimeout( () => { // Esta alerta se eliminara despues de 5 segundos
            alerta.remove();
        }, 5000);
    } 
}

function limpiarHTML() {
    while(resultado.firstChild) { // Eliminamos el primer hijo de resultado desde que tenga uno
        resultado.removeChild(resultado.firstChild);
    }
}

function Spinner() { // Spinner sacado de ( SpinKit spinners web)
    limpiarHTML(); // Limpiamos primero el html previo que haya

    const divSpinner = document.createElement('div');
    divSpinner.classList.add('spinner');
    divSpinner.innerHTML = `
        <div class="dot1"></div>
        <div class="dot2"></div>
    `;

    resultado.appendChild(divSpinner);
}
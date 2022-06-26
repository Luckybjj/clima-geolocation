require('dotenv').config()  // confirguración de las variables de entorno.
const { leerInput, inquirerMenu, pausa, listarLugares } = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');

// console.log(process.env);

const main = async () => {
    const busquedas = new Busquedas();
    let opt;

    do {
        opt = await inquirerMenu();
        // console.log({opt});
        switch (opt) {
            case 1:
                // mostrar mensaje 
                const termino = await leerInput('Ciudad: ');
                // Buscar lugares
                const lugares = await busquedas.ciudad(termino);
                // Seleccionar lugar 
                const id = await listarLugares(lugares);
                if (id === '0') continue;

                const lugarSelc = lugares.find(l => l.id === id);
                //  console.log(lugarSelc);

                // Guardar en DB
                busquedas.agregarHistorial(lugarSelc.nombre);


                // Clima
                const clima = await busquedas.climaLugar(lugarSelc.lat, lugarSelc.lng)
                // console.log(clima)
                console.clear();
                console.log('\nInformación de la ciudad\n'.brightGreen.italic);
                console.log('Ciudad', lugarSelc.nombre.green);
                console.log('Lat:', lugarSelc.lat);
                console.log('Lng:', lugarSelc.lng);
                console.log('Temperatura:', clima.temp);
                console.log('Mínima:', clima.min);
                console.log('Máxima:', clima.max);
                console.log('Como esta el clima:', clima.desc.green)
                break;

            case 2:
                // busquedas.historial.forEach( (lugar, i) => {
                busquedas.historialCapitalizado.forEach((lugar, i) => {
                    const idx = `${i + 1}.`.green;
                    console.log(`${idx} ${lugar}`);
                })
                break;

            default:
                break;
        }

        if (opt !== 0) await pausa();

    } while (opt !== 0);

    // crearemos una instancia fuera del ciclo do while

}

main();
